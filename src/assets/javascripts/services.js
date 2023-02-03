import utils from "./utils.js"

window.browser = window.browser || window.chrome

let config, options

function init() {
	return new Promise(async resolve => {
		options = await utils.getOptions()
		config = await utils.getConfig()
		resolve()
	})
}

init()
browser.storage.onChanged.addListener(init)

function all(service, frontend, options, config) {
	let instances = []
	if (!frontend) {
		for (const frontend in config.services[service].frontends) {
			if (options[frontend]) {
				instances.push(...options[frontend])
			}
		}
	} else if (options[frontend]) {
		instances = options[frontend]
	}
	return instances
}

function regexArray(service, url, config, frontend) {
	let targetList = config.services[service].targets
	if (frontend && config.services[service].frontends[frontend].excludeTargets) {
		targetList = targetList.filter(val =>
			!config.services[service].frontends[frontend].excludeTargets.includes(targetList.indexOf(val))
		)
	}
	for (const targetString in targetList) {
		const target = new RegExp(targetList[targetString])
		if (target.test(url.href)) return true
	}
	return false
}

function redirect(url, type, initiator, forceRedirection) {
	if (type != "main_frame" && type != "sub_frame" && type != "image") return
	let randomInstance
	let frontend
	for (const service in config.services) {
		if (!forceRedirection && !options[service].enabled) continue
		if (config.services[service].embeddable && type != options[service].redirectType && options[service].redirectType != "both") continue
		if (!config.services[service].embeddable && type != "main_frame") continue

		frontend = options[service].frontend ?? Object.keys(config.services[service].frontends)[0]

		if (!regexArray(service, url, config, frontend)) continue

		if (
			initiator
			&&
			options[frontend].includes(initiator.origin)
		) return "BYPASSTAB"

		let instanceList = options[frontend]
		if (instanceList === undefined) break
		if (instanceList.length === 0) return

		randomInstance = utils.getRandomInstance(instanceList)

		break
	}

	// Here is a (temperory) space for defining constants required in 2 or more switch cases.
	const mapCentreRegex = /@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/
	const dataLatLngRegex = /!3d(-?[0-9]{1,}.[0-9]{1,})!4d(-?[0-9]{1,}.[0-9]{1,})/
	const placeRegex = /\/place\/(.*)\//
	function convertMapCentre() {
		let [lat, lon, zoom] = [null, null, null]
		if (url.pathname.match(mapCentreRegex)) {
			// Set map centre if present
			;[lat, lon, zoom] = url.pathname.match(mapCentreRegex)
		} else if (url.searchParams.has("center")) {
			;[lat, lon] = url.searchParams.get("center").split(",")
			zoom = url.searchParams.get("zoom") ?? "17"
		}
		return [zoom, lon, lat]
	}
	switch (frontend) {
		// This is where all instance-specific code must be ran to convert the service url to one that can be understood by the frontend.
		case "beatbump":
			return `${randomInstance}${url.pathname}${url.search}`
				.replace("/watch?v=", "/listen?id=")
				.replace("/channel/", "/artist/")
				.replace("/playlist?list=", "/playlist/VL")
				.replace(/\/search\?q=.*/, searchQuery => searchQuery.replace("?q=", "/") + "?filter=all")
		case "hyperpipe":
			return `${randomInstance}${url.pathname}${url.search}`.replace(/\/search\?q=.*/, searchQuery => searchQuery.replace("?q=", "/"))
		case "lbryDesktop":
			return url.href.replace(/^https?:\/{2}odysee\.com\//, "lbry://").replace(/:(?=[a-zA-Z0-9])/g, "#")
		case "searx":
		case "searxng":
			return `${randomInstance}/${url.search}`
		case "whoogle":
			return `${randomInstance}/search${url.search}`
		case "librex":
			return `${randomInstance}/search.php${url.search}`
		case "send":
			return randomInstance
		case "nitter":
			let search = new URLSearchParams(url.search)

			search.delete("ref_src")
			search.delete("ref_url")

			search = search.toString()
			if (search !== "") search = `?${search}`

			if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video") {
				try {
					const [, id, format, extra] = search.match(/(.*)\?format=(.*)&(.*)/)
					const query = encodeURIComponent(`${id}.${format}?${extra}`)
					return `${randomInstance}/pic${url.pathname}${query}`
				} catch {
					return `${randomInstance}/pic${url.pathname}${search}`
				}
			}

			if (url.pathname.split("/").includes("tweets")) return `${randomInstance}${url.pathname.replace("/tweets", "")}${search}`
			if (url.host == "t.co") return `${randomInstance}/t.co${url.pathname}`
			return `${randomInstance}${url.pathname}${search}#m`
		case "yattee":
			return url.href.replace(/^https?:\/{2}/, "yattee://")
		case "freetube":
			return `freetube://https://youtu.be${url.pathname}${url.search}`.replace(/watch\?v=/, "")
		case "simplyTranslate":
			return `${randomInstance}/${url.search}`
		case "libreTranslate":
			return `${randomInstance}/${url.search}`
				.replace(/(?<=\/?)sl/, "source")
				.replace(/(?<=&)tl/, "target")
				.replace(/(?<=&)text/, "q")
		case "osm": {
			if (initiator && initiator.host === "earth.google.com") return
			const travelModes = {
				driving: "fossgis_osrm_car",
				walking: "fossgis_osrm_foot",
				bicycling: "fossgis_osrm_bike",
				transit: "fossgis_osrm_car", // not implemented on OSM, default to car.
			}

			function addressToLatLng(address) {
				const xmlhttp = new XMLHttpRequest()
				xmlhttp.timeout = 5000
				http.ontimeout = () => {
					return
				}
				http.onerror = () => {
					return
				}
				xmlhttp.send()
				http.onreadystatechange = () => {
					if (xmlhttp.status === 200) {
						const json = JSON.parse(xmlhttp.responseText)[0]
						if (json) {
							return [`${json.lat},${json.lon}`, `${json.boundingbox[2]},${json.boundingbox[1]},${json.boundingbox[3]},${json.boundingbox[0]}`]
						}
					}
					console.info("Error: Status is " + xmlhttp.status)
				}
				xmlhttp.open("GET", `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`, false)
			}

			let mapCentre = "#"
			let prefs = {}

			const mapCentreData = convertMapCentre()
			if (mapCentreData[0] && mapCentreData[1] && mapCentreData[2]) mapCentre = `#map=${mapCentreData[0]}/${mapCentreData[1]}/${mapCentreData[2]}`
			if (url.searchParams.get("layer")) prefs.layers = osmLayers[url.searchParams.get("layer")]

			if (url.pathname.includes("/embed")) {
				// Handle Google Maps Embed API
				// https://www.google.com/maps/embed/v1/place?key=AIzaSyD4iE2xVSpkLLOXoyqT-RuPwURN3ddScAI&q=Eiffel+Tower,Paris+France
				//console.log("embed life")

				let query = ""
				if (url.searchParams.has("q")) query = url.searchParams.get("q")
				else if (url.searchParams.has("query")) query = url.searchParams.has("query")
				else if (url.searchParams.has("pb"))
					try {
						query = url.searchParams.get("pb").split(/!2s(.*?)!/)[1]
					} catch (error) {
						console.error(error)
					} // Unable to find map marker in URL.

				let [coords, boundingbox] = addressToLatLng(query)
				prefs.bbox = boundingbox
				prefs.marker = coords
				prefs.layer = "mapnik"
				let prefsEncoded = new URLSearchParams(prefs).toString()
				return `${randomInstance}/export/embed.html?${prefsEncoded}`
			} else if (url.pathname.includes("/dir")) {
				// Handle Google Maps Directions
				// https://www.google.com/maps/dir/?api=1&origin=Space+Needle+Seattle+WA&destination=Pike+Place+Market+Seattle+WA&travelmode=bicycling

				let travMod = url.searchParams.get("travelmode")
				if (url.searchParams.has("travelmode")) prefs.engine = travelModes[travMod]

				let orgVal = url.searchParams.get("origin")
				let destVal = url.searchParams.get("destination")

				let org = addressToLatLng(orgVal)
				let dest = addressToLatLng(destVal)
				prefs.route = `${org};${dest}`

				let prefsEncoded = new URLSearchParams(prefs).toString()
				return `${randomInstance}/directions?${prefsEncoded}${mapCentre}`
			} else if (url.pathname.includes("data=") && url.pathname.match(dataLatLngRegex)) {
				// Get marker from data attribute
				// https://www.google.com/maps/place/41%C2%B001'58.2%22N+40%C2%B029'18.2%22E/@41.032833,40.4862063,17z/data=!3m1!4b1!4m6!3m5!1s0x0:0xf64286eaf72fc49d!7e2!8m2!3d41.0328329!4d40.4883948
				//console.log("data life")

				let [, mlat, mlon] = url.pathname.match(dataLatLngRegex)

				return `${randomInstance}/search?query=${mlat}%2C${mlon}`
			} else if (url.searchParams.has("ll")) {
				// Get marker from ll param
				// https://maps.google.com/?ll=38.882147,-76.99017
				//console.log("ll life")

				const [mlat, mlon] = url.searchParams.get("ll").split(",")

				return `${randomInstance}/search?query=${mlat}%2C${mlon}`
			} else if (url.searchParams.has("viewpoint")) {
				// Get marker from viewpoint param.
				// https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.857832,2.295226&heading=-45&pitch=38&fov=80
				//console.log("viewpoint life")

				const [mlat, mlon] = url.searchParams.get("viewpoint").split(",")

				return `${randomInstance}/search?query=${mlat}%2C${mlon}`
			} else {
				// Use query as search if present.
				//console.log("normal life")

				let query
				if (url.searchParams.has("q")) query = url.searchParams.get("q")
				else if (url.searchParams.has("query")) query = url.searchParams.get("query")
				else if (url.pathname.match(placeRegex)) query = url.pathname.match(placeRegex)[1]

				let prefsEncoded = new URLSearchParams(prefs).toString()
				if (query) return `${randomInstance}/search?query="${query}${mapCentre}&${prefsEncoded}`
			}

			let prefsEncoded = new URLSearchParams(prefs).toString()
			// console.log("mapCentre", mapCentre)
			// console.log("prefs", prefs)
			// console.log("prefsEncoded", prefsEncoded)
			return `${randomInstance}/${mapCentre}&${prefsEncoded}`
		}
		case "facil": {
			if (initiator && initiator.host === "earth.google.com") return
			const travelModes = {
				driving: "car",
				walking: "pedestrian",
				bicycling: "bicycle",
				transit: "car", // not implemented on Facil, default to car.
			}
			const mapCentreData = convertMapCentre()
			let mapCentre = "#"
			if (mapCentreData[0] && mapCentreData[1] && mapCentreData[2]) mapCentre = `#${mapCentreData[0]}/${mapCentreData[1]}/${mapCentreData[2]}`

			if (url.pathname.includes("/embed")) {
				// Handle Google Maps Embed API
				// https://www.google.com/maps/embed/v1/place?key=AIzaSyD4iE2xVSpkLLOXoyqT-RuPwURN3ddScAI&q=Eiffel+Tower,Paris+France
				//console.log("embed life")

				let query = ""
				if (url.searchParams.has("q")) query = url.searchParams.get("q")
				else if (url.searchParams.has("query")) query = url.searchParams.has("query")
				else if (url.searchParams.has("pb"))
					try {
						query = url.searchParams.get("pb").split(/!2s(.*?)!/)[1]
					} catch (error) {
						console.error(error)
					} // Unable to find map marker in URL.

				return `${randomInstance}/#q=${query}`
			} else if (url.pathname.includes("/dir")) {
				// Handle Google Maps Directions
				// https://www.google.com/maps/dir/?api=1&origin=Space+Needle+Seattle+WA&destination=Pike+Place+Market+Seattle+WA&travelmode=bicycling

				let travMod = url.searchParams.get("travelmode")

				let orgVal = url.searchParams.get("origin")
				let destVal = url.searchParams.get("destination")

				return `${randomInstance}/#q=${orgVal}%20to%20${destVal}%20by%20${travelModes[travMod]}`
			} else if (url.pathname.includes("data=") && url.pathname.match(dataLatLngRegex)) {
				// Get marker from data attribute
				// https://www.google.com/maps/place/41%C2%B001'58.2%22N+40%C2%B029'18.2%22E/@41.032833,40.4862063,17z/data=!3m1!4b1!4m6!3m5!1s0x0:0xf64286eaf72fc49d!7e2!8m2!3d41.0328329!4d40.4883948
				//console.log("data life")

				let [, mlat, mlon] = url.pathname.match(dataLatLngRegex)

				return `${randomInstance}/#q=${mlat}%2C${mlon}`
			} else if (url.searchParams.has("ll")) {
				// Get marker from ll param
				// https://maps.google.com/?ll=38.882147,-76.99017
				//console.log("ll life")

				const [mlat, mlon] = url.searchParams.get("ll").split(",")

				return `${randomInstance}/#q=${mlat}%2C${mlon}`
			} else if (url.searchParams.has("viewpoint")) {
				// Get marker from viewpoint param.
				// https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.857832,2.295226&heading=-45&pitch=38&fov=80
				//console.log("viewpoint life")

				const [mlat, mlon] = url.searchParams.get("viewpoint").split(",")

				return `${randomInstance}/#q=${mlat}%2C${mlon}`
			} else {
				// Use query as search if present.
				//console.log("normal life")

				let query
				if (url.searchParams.has("q")) query = url.searchParams.get("q")
				else if (url.searchParams.has("query")) query = url.searchParams.get("query")
				else if (url.pathname.match(placeRegex)) query = url.pathname.match(placeRegex)[1]

				if (query) return `${randomInstance}/${mapCentre}/Mpnk/${query}`
			}
		}
		case "lingva":
			let params_arr = url.search.split("&")
			params_arr[0] = params_arr[0].substring(1)
			let params = {}
			for (let i = 0; i < params_arr.length; i++) {
				let pair = params_arr[i].split("=")
				params[pair[0]] = pair[1]
			}
			if (params.sl && params.tl && params.text) {
				return `${randomInstance}/${params.sl}/${params.tl}/${params.text}`
			}
			return randomInstance
		case "breezeWiki":
			let wiki, urlpath = ""
			if (url.hostname.match(/^[a-zA-Z0-9-]+\.(?:fandom|wikia)\.com/)) {
				wiki = url.hostname.match(/^[a-zA-Z0-9-]+(?=\.(?:fandom|wikia)\.com)/)
				if (wiki == "www" || !wiki) wiki = ""
				else wiki = `/${wiki}`;
				urlpath = url.pathname
			} else {
				wiki = url.pathname.match(/(?<=wiki\/w:c:)[a-zA-Z0-9-]+(?=:)/)
				if (!wiki) wiki = ""
				else {
					wiki = "/" + wiki + "/wiki/"
					urlpath = url.pathname.match(/(?<=wiki\/w:c:[a-zA-Z0-9-]+:).+/)
				}
			}
			if (url.href.search(/Special:Search\?query/) > -1) return `${randomInstance}${wiki}${urlpath}${url.search}`.replace(/Special:Search\?query/, "search?q").replace(/\/wiki/, "")
			else return `${randomInstance}${wiki}${urlpath}${url.search}`
		case "rimgo":
			if (url.href.search(/^https?:\/{2}(?:[im]\.)?stack\./) > -1) return `${randomInstance}/stack${url.pathname}${url.search}`
			else return `${randomInstance}${url.pathname}${url.search}`
		case "libreddit":
			const subdomain = url.hostname.match(/^(?:(?:external-)?preview|i)(?=\.redd\.it)/)
			if (!subdomain) return `${randomInstance}${url.pathname}${url.search}`
			switch (subdomain[0]) {
				case "preview":
					return `${randomInstance}/preview/pre${url.pathname}${url.search}`
				case "external-preview":
					return `${randomInstance}/preview/external-pre${url.pathname}${url.search}`
				case "i":
					return `${randomInstance}/img${url.pathname}`
			}
		case "teddit":
			if (/^(?:(?:external-)?preview|i)\.redd\.it/.test(url.hostname)) {
				if (url.search == "") return `${randomInstance}${url.pathname}?teddit_proxy=${url.hostname}`
				else return `${randomInstance}${url.pathname}${url.search}&teddit_proxy=${url.hostname}`
			}
			return `${randomInstance}${url.pathname}${url.search}`
		default:
			return `${randomInstance}${url.pathname}${url.search}`
		case "neuters": {
			const p = url.pathname
			if (p.startsWith('/article/') || p.startsWith('/pf/') || p.startsWith('/arc/') || p.startsWith('/resizer/')) {
				return null;
			}
			return `${randomInstance}${p}`;
		}
		case "dumb": {
			if (url.pathname.endsWith('-lyrics')) return `${randomInstance}${url.pathname}`
		}
		case "ruralDictionary": {
			if (!url.pathname.endsWith('/define.php') && !url.pathname.endsWith('/random.php') && !url.pathname.endsWith('/')) return
			return `${randomInstance}${url.pathname}${url.search}`
		}

	}
}

function computeService(url, returnFrontend) {
	return new Promise(async resolve => {
		const config = await utils.getConfig()
		const options = await utils.getOptions()
		for (const service in config.services) {
			if (regexArray(service, url, config)) {
				resolve(service)
				return
			} else {
				for (const frontend in config.services[service].frontends) {
					if (all(service, frontend, options, config).includes(utils.protocolHost(url))) {
						if (returnFrontend)
							resolve([service, frontend, utils.protocolHost(url)])
						else
							resolve(service)
						return
					}
				}
			}
		}
		resolve()
	})
}

function _switchInstance(url) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(url)
		for (const service in config.services) {
			let frontend = options[service].frontend ?? Object.keys(config.services[service].frontends)[0]
			let instancesList = [...options[frontend]]
			if (!instancesList.includes(protocolHost)) continue

			instancesList.splice(instancesList.indexOf(protocolHost), 1)
			if (instancesList.length === 0) {
				resolve()
				return
			}

			const randomInstance = utils.getRandomInstance(instancesList)
			const newUrl = `${randomInstance}${url.pathname}${url.search}`
			resolve(newUrl)
			return
		}
		resolve()
	})
}

function reverse(url) {
	return new Promise(async resolve => {
		await init()
		url = new URL(url)
		let protocolHost = utils.protocolHost(url)
		for (const service in config.services) {
			let frontend = options[service].frontend ?? Object.keys(config.services[service].frontends)[0]
			if (!options[frontend].includes(protocolHost)) continue

			switch (service) {
				case "youtube":
				case "imdb":
				case "imgur":
				case "tiktok":
				case "twitter":
				case "reddit":
				case "imdb":
				case "quora":
				case "medium":
					resolve(config.services[service].url + url.pathname + url.search)
					return
				case "fandom":
					let regex = url.pathname.match(/^\/([a-zA-Z0-9-]+)\/wiki\/([a-zA-Z0-9-]+)/)
					if (regex) {
						resolve(`https://${regex[1]}.fandom.com/wiki/${regex[2]}`)
						return
					}
					resolve()
					return
				default:
					resolve()
					return
			}
		}
		resolve()
		return
	})
}

function initDefaults() {
	return new Promise(resolve => {
		browser.storage.local.clear(async () => {
			let config = await utils.getConfig()
			let options = {}
			for (const service in config.services) {
				options[service] = {}
				for (const defaultOption in config.services[service].options) {
					options[service][defaultOption] = config.services[service].options[defaultOption]
				}
				for (const frontend in config.services[service].frontends) {
					if (config.services[service].frontends[frontend].instanceList) {
						options[frontend] = []
					}
				}
			}
			options['exceptions'] = {
				url: [],
				regex: [],
			}
			options['theme'] = "detect"
			options['popupServices'] = ["youtube", "twitter", "tiktok", "imgur", "reddit", "quora", "translate", "maps"]

			options['invidious'] = ['https://inv.vern.cc']
			options['piped'] = ['https://pipedapi-libre.kavin.rocks']
			options['pipedMaterial'] = ['https://piped-material.xn--17b.net']
			options['cloudtube'] = ['https://tube.cadence.moe']
			options['proxiTok'] = ['https://proxitok.pabloferreiro.es']
			options['send'] = ['https://send.vis.ee']
			options['nitter'] = ['https://nitter.net']
			options['libreddit'] = ['https://libreddit.spike.codes']
			options['teddit'] = ['https://teddit.net']
			options['scribe'] = ['https://scribe.rip']
			options['quetre'] = ['https://quetre.iket.me']
			options['libremdb'] = ['https://libremdb.iket.me']
			options['simplyTranslate'] = ['https://simplytranslate.org']
			options['lingva'] = ['https://lingva.ml']
			options['searxng'] = ['https://sx.vern.cc']
			options['rimgo'] = ['https://rimgo.vern.cc']
			options['librarian'] = ['https://lbry.vern.cc']
			options['beatbump'] = ['https://beatbump.ml']
			options['hyperpipe'] = ['https://hyperpipe.surge.sh']
			options['facil'] = [' https://facilmap.org ']
			options['osm'] = ['https://www.openstreetmap.org']
			options['breezeWiki'] = ['https://breezewiki.com']
			options['neuters'] = ['https://neuters.de']
			options['dumb'] = ['https://dm.vern.cc']
			options['ruralDictionary'] = ['https://rd.vern.cc']

			browser.storage.local.set({ options },
				() => resolve()
			)
		})
	})
}

function upgradeOptions() {
	return new Promise(async resolve => {
		const oldOptions = await utils.getOptions()
		const config = await utils.getConfig()

		let options = {}

		options.exceptions = oldOptions.exceptions
		options.theme = oldOptions.theme
		options.popupServices = oldOptions.popupServices

		for (const service in config.services) {
			if (service in oldOptions) {
				options[service] = oldOptions[service]
				delete options[service].embedFrontend
			}
			else {
				options[service] = {}
				for (const defaultOption in config.services[service].options) {
					options[service][defaultOption] = config.services[service].options[defaultOption]
				}
				for (const frontend in config.services[service].frontends) {
					if (config.services[service].frontends[frontend].instanceList) {
						options[frontend] = []
					}
				}
			}

			for (const frontend in config.services[service].frontends) {
				if (config.services[service].frontends[frontend].instanceList) {
					if (frontend in oldOptions) {
						options[frontend] = [
							...oldOptions[frontend].clearnet.enabled,
							...oldOptions[frontend].clearnet.custom
						]
					}
					else {
						options[frontend] = []
					}
				}
			}
		}

		browser.storage.local.clear(() => {
			browser.storage.local.set({ options }, () => {
				resolve()
			})
		})
	})
}

function processUpdate() {
	return new Promise(async resolve => {
		let config = await utils.getConfig()
		let options = await utils.getOptions()
		for (const service in config.services) {
			if (!options[service]) options[service] = {}
			for (const defaultOption in config.services[service].options) {
				if (options[service][defaultOption] === undefined) {
					options[service][defaultOption] = config.services[service].options[defaultOption]
				}
			}

			for (const frontend in config.services[service].frontends) {
				if (options[frontend] === undefined && config.services[service].frontends[frontend].instanceList) {
					options[frontend] = []
				}
				else if (frontend in options && frontend in !config.services[service].frontends) {
					delete options[frontend]
				}
			}
		}
		browser.storage.local.set({ options }, () => {
			resolve()
		})
	})
}

// For websites that have a strict policy that would not normally allow these frontends to be embedded within the website.
function modifyContentSecurityPolicy(details) {
	let isChanged = false
	if (details.type == "main_frame") {
		for (const header in details.responseHeaders) {
			if (details.responseHeaders[header].name == "content-security-policy") {
				let instancesList = []
				for (const service in config.services) {
					if (config.services[service].embeddable) {
						for (const frontend in config.services[service].frontends) {
							if (config.services[service].frontends[frontend].embeddable) {
								for (const network in config.networks) {
									instancesList.push(...options[frontend])
								}
							}
						}
					}
				}
				let securityPolicyList = details.responseHeaders[header].value.split(";")
				for (const i in securityPolicyList) securityPolicyList[i] = securityPolicyList[i].trim()
				let newSecurity = ""
				for (const item of securityPolicyList) {
					if (item.trim() == "") continue
					let regex = item.match(/([a-z-]{0,}) (.*)/)
					if (regex == null) continue
					let [, key, vals] = regex
					if (key == "frame-src") vals = vals + " " + instancesList.join(" ")
					newSecurity += key + " " + vals + "; "
				}

				details.responseHeaders[header].value = newSecurity
				isChanged = true
			}
		}
		if (isChanged) return { responseHeaders: details.responseHeaders }
	}
}

function copyRaw(test, copyRawElement) {
	return new Promise(resolve => {
		browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
			let currTab = tabs[0]
			if (currTab) {
				let url
				try {
					url = new URL(currTab.url)
				} catch {
					resolve()
					return
				}

				const newUrl = await reverse(url)

				if (newUrl) {
					resolve(newUrl)
					if (test) return
					navigator.clipboard.writeText(newUrl)
					if (copyRawElement) {
						const textElement = copyRawElement.getElementsByTagName("h4")[0]
						const oldHtml = textElement.innerHTML
						textElement.innerHTML = browser.i18n.getMessage("copied")
						setTimeout(() => (textElement.innerHTML = oldHtml), 1000)
					}
				}
			}
			resolve()
		})
	})
}

function switchInstance() {
	return new Promise(resolve => {
		browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
			let currTab = tabs[0]
			if (currTab) {
				let url
				try {
					url = new URL(currTab.url)
				} catch {
					resolve()
					return
				}
				const newUrl = await _switchInstance(url)
				resolve(newUrl)
			}
		})
	})
}

export default {
	redirect,
	computeService,
	reverse,
	initDefaults,
	upgradeOptions,
	processUpdate,
	modifyContentSecurityPolicy,
	copyRaw,
	switchInstance
}

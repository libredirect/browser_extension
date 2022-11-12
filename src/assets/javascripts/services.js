window.browser = window.browser || window.chrome

import utils from "./utils.js"

let config, options, redirects, targets

function init() {
	return new Promise(async resolve => {
		browser.storage.local.get(["options", "redirects", "targets"], r => {
			options = r.options
			redirects = r.redirects
			targets = r.targets
			fetch("/config/config.json")
				.then(response => response.text())
				.then(configData => {
					config = JSON.parse(configData)
					resolve()
				})
		})
	})
}

init()
browser.storage.onChanged.addListener(init)

function fetchFrontendInstanceList(service, frontend, redirects, options, config) {
	let tmp = []
	if (config.services[service].frontends[frontend].instanceList) {
		for (const network in config.networks) {
			tmp.push(...redirects[network], ...options[frontend][network].custom)
		}
	} else if (config.services[service].frontends[frontend].singleInstance) tmp = config.services[service].frontends[frontend].singleInstance
	return tmp
}

function all(service, frontend, options, config, redirects) {
	let instances = []
	if (!frontend) {
		for (const frontend in config.services[service].frontends) {
			instances.push(...fetchFrontendInstanceList(service, frontend, redirects[frontend], options, config))
		}
	} else {
		instances.push(...fetchFrontendInstanceList(service, frontend, redirects[frontend], options, config))
	}
	return instances
}

function regexArray(service, url, config) {
	if (config.services[service].targets == "datajson") {
		if (targets[service].startsWith(utils.protocolHost(url))) return true
	} else {
		const targetList = config.services[service].targets
		for (const targetString in targetList) {
			const target = new RegExp(targetList[targetString])
			if (target.test(url.href)) return true
		}
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

		// let targets = new RegExp(config.services[service].targets.join("|"), "i")
		if (!regexArray(service, url, config)) continue
		// if (initiator) {
		// 	console.log(initiator.host)
		// 	if (targets.test(initiator.host)) continue
		// 	//if (all(service, null, options, config, redirects).includes(initiator.origin) && reverse(initiator) == url) return "BYPASSTAB"
		// }


		if (Object.keys(config.services[service].frontends).length > 1) {
			if (
				type == "sub_frame" && config.services[service].embeddable
				&&
				!config.services[service].frontends[options[service].frontend].embeddable
			) frontend = options[service].embedFrontend
			else frontend = options[service].frontend
		} else frontend = Object.keys(config.services[service].frontends)[0]


		if (config.services[service].frontends[frontend].instanceList) {
			let instanceList = [...options[frontend][options.network].enabled, ...options[frontend][options.network].custom]
			if (instanceList.length === 0 && options.networkFallback) instanceList = [...options[frontend].clearnet.enabled, ...options[frontend].clearnet.custom]
			if (instanceList.length === 0) return
			randomInstance = utils.getRandomInstance(instanceList)
		} else if (config.services[service].frontends[frontend].singleInstance) randomInstance = config.services[service].frontends[frontend].singleInstance
		break
	}
	if (!frontend) return

	// Here is a (temperory) space for defining constants required in 2 or more switch cases.
	// When possible, try have the two switch cases share all their code as done with searx and searxng.
	// Do not do that when they do not share 100% of their code.

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
		case "bibliogram":
			const reservedPaths = ["u", "p", "privacy"]
			if (url.pathname === "/" || reservedPaths.includes(url.pathname.split("/")[1])) return `${randomInstance}${url.pathname}${url.search}`
			if (url.pathname.startsWith("/reel") || url.pathname.startsWith("/tv")) return `${randomInstance}/p${url.pathname.replace(/\/reel|\/tv/i, "")}${url.search}`
			else return `${randomInstance}/u${url.pathname}${url.search}` // Likely a user profile, redirect to '/u/...'
		case "lbryDesktop":
			return url.href.replace(/^https?:\/{2}odysee\.com\//, "lbry://").replace(/:(?=[a-zA-Z0-9])/g, "#")
		case "neuters":
			if (url.pathname.startsWith("/article/") || url.pathname.startsWith("/pf/") || url.pathname.startsWith("/arc/") || url.pathname.startsWith("/resizer/")) return null
			else if (url.pathname.endsWith("/")) return `${randomInstance}${url.pathname}`
			else return `${randomInstance}${url.pathname}/`
		case "searx":
		case "searxng":
			return `${randomInstance}/?q=${encodeURIComponent(url.searchParams.get("q"))}`
		case "whoogle":
			return `${randomInstance}/search?q=${encodeURIComponent(url.searchParams.get("q"))}`
		case "librex":
			return `${randomInstance}/search.php?q=${encodeURIComponent(url.searchParams.get("q"))}`
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
			return `${randomInstance}${url.pathname}${search}`
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
							console.log("json", json)
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
			console.log("mapCentre", mapCentre)
			console.log("prefs", prefs)
			console.log("prefsEncoded", prefsEncoded)
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
		case "wikiless":
			let GETArguments = []
			if (url.search.length > 0) {
				let search = url.search.substring(1) //get rid of '?'
				let argstrings = search.split("&")
				for (let i = 0; i < argstrings.length; i++) {
					let args = argstrings[i].split("=")
					GETArguments.push([args[0], args[1]])
				}
			}

			let link = `${randomInstance}${url.pathname}`
			let urlSplit = url.host.split(".")
			if (urlSplit[0] != "wikipedia" && urlSplit[0] != "www") {
				if (urlSplit[0] == "m") GETArguments.push(["mobileaction", "toggle_view_mobile"])
				else GETArguments.push(["lang", urlSplit[0]])
				if (urlSplit[1] == "m") GETArguments.push(["mobileaction", "toggle_view_mobile"])
				// wikiless doesn't have mobile view support yet
			}
			for (let i = 0; i < GETArguments.length; i++) link += (i == 0 ? "?" : "&") + GETArguments[i][0] + "=" + GETArguments[i][1]
			return link

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
			let wiki,
				urlpath = ""
			if (url.hostname.match(/^[a-zA-Z0-9-]+\.fandom\.com/)) {
				wiki = url.hostname.match(/^[a-zA-Z0-9-]+(?=\.fandom\.com)/)
				if (wiki == "www" || !wiki) wiki = ""
				else wiki = "/" + wiki
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
	}
}

function computeService(url, returnFrontend) {
	return new Promise(resolve => {
		fetch("/config/config.json")
			.then(response => response.text())
			.then(configData => {
				const config = JSON.parse(configData)
				browser.storage.local.get(["redirects", "options"], r => {
					const redirects = r.redirects
					const options = r.options
					for (const service in config.services) {
						if (regexArray(service, url, config)) {
							resolve(service)
							return
						} else {
							for (const frontend in config.services[service].frontends) {
								if (all(service, frontend, options, config, redirects).includes(utils.protocolHost(url))) {
									if (returnFrontend) resolve([service, frontend, utils.protocolHost(url)])
									else resolve(service)
									return
								}
							}
						}
					}
					resolve()
				})
			})
	})
}

function switchInstance(url) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(url)
		for (const service in config.services) {
			if (!all(service, null, options, config, redirects).includes(protocolHost)) continue

			let instancesList
			if (Object.keys(config.services[service].frontends).length == 1) {
				const frontend = Object.keys(config.services[service].frontends)[0]
				instancesList = [...options[frontend][options.network].enabled, ...options[frontend][options.network].custom]
				if (instancesList.length === 0 && options.networkFallback) instancesList = [...options[frontend].clearnet.enabled, ...options[frontend].clearnet.custom]
			} else {
				const frontend = options[service].frontend
				instancesList = [...options[frontend][options.network].enabled, ...options[frontend][options.network].custom]
				if (instancesList.length === 0 && options.networkFallback) instancesList = [...options[frontend].clearnet.enabled, ...options[frontend].clearnet.custom]
			}

			let oldInstance
			const i = instancesList.indexOf(protocolHost)
			if (i > -1) {
				oldInstance = instancesList[i]
				instancesList.splice(i, 1)
			}
			if (instancesList.length === 0) {
				resolve()
				return
			}
			const randomInstance = utils.getRandomInstance(instancesList)
			const oldUrl = `${oldInstance}${url.pathname}${url.search}`
			// This is to make instance switching work when the instance depends on the pathname, eg https://darmarit.org/searx
			// Doesn't work because of .includes array method, not a top priotiry atm
			resolve(oldUrl.replace(oldInstance, randomInstance))
			return
		}
		resolve()
	})
}

function reverse(url, urlString) {
	return new Promise(async resolve => {
		await init()
		let protocolHost
		if (!urlString) protocolHost = utils.protocolHost(url)
		else protocolHost = url.match(/https?:\/{2}(?:[^\s\/]+\.)+[a-zA-Z0-9]+/)[0]
		for (const service in config.services) {
			if (!all(service, null, options, config, redirects).includes(protocolHost)) continue

			switch (service) {
				case "instagram":
				case "youtube":
				case "imdb":
				case "imgur":
				case "tiktok":
				case "twitter":
				case "reddit":
				case "imdb":
				case "reuters":
				case "quora":
				case "medium":
				case "wikipedia":
					if (!urlString) resolve(config.services[service].url + url.pathname + url.search)
					else resolve(url.replace(/https?:\/{2}(?:[^\s\/]+\.)+[a-zA-Z0-9]+/, config.services[service].url))
					return
				default:
					resolve()
					return
			}
		}
		resolve()
	})
}

function unifyPreferences(url, tabId) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(url)
		for (const service in config.services) {
			for (const frontend in config.services[service].frontends) {
				if (all(service, frontend, options, config, redirects).includes(protocolHost)) {
					let instancesList = [...options[frontend][options.network].enabled, ...options[frontend][options.network].custom]
					if (options.networkFallback && options.network != "clearnet") instancesList.push(...options[frontend].clearnet.enabled, ...options[frontend].clearnet.custom)

					const frontendObject = config.services[service].frontends[frontend]
					if ("cookies" in frontendObject.preferences) {
						for (const cookie of frontendObject.preferences.cookies) {
							await utils.copyCookie(url, instancesList, cookie)
						}
					}
					if ("localstorage" in frontendObject.preferences) {
						browser.storage.local.set({ tmp: [frontend, frontendObject.preferences.localstorage] })
						browser.tabs.executeScript(tabId, {
							file: "/assets/javascripts/get-localstorage.js",
							runAt: "document_start",
						})
						for (const instance of instancesList)
							browser.tabs.create({ url: instance }, tab =>
								browser.tabs.executeScript(tab.id, {
									file: "/assets/javascripts/set-localstorage.js",
									runAt: "document_start",
								})
							)
					}
					/*
					if ("indexeddb" in frontendObject.preferences) {
					}
					if ("token" in frontendObject.preferences) {
					}
					*/
					resolve(true)
					return
				}
			}
		}
	})
}

function setRedirects(passedRedirects) {
	return new Promise(resolve => {
		fetch("/config/config.json")
			.then(response => response.text())
			.then(configData => {
				browser.storage.local.get(/* [ */ "options" /* , "blacklists"] */, async r => {
					let redirects = passedRedirects
					let options = r.options
					const config = JSON.parse(configData)
					let targets = {}
					for (const service in config.services) {
						if (config.services[service].targets == "datajson") {
							targets[service] = redirects[service]
							delete redirects[service]
						}
						for (const frontend in config.services[service].frontends) {
							if (config.services[service].frontends[frontend].instanceList) {
								for (const network in config.networks) {
									for (const instance of options[frontend][network].enabled) {
										let i = redirects[frontend][network].indexOf(instance)
										if (i < 0) options[frontend][network].enabled.splice(i, 1)
									}
								}
							}
						}
						/*
						for (const frontend in config.services[service].frontends) {
							if (config.services[service].frontends[frontend].instanceList) {
								for (const network in config.networks) {
									options[frontend][network].enabled = redirects[frontend][network]
								}
								for (const blacklist in r.blacklists) {
									for (const instance of blacklist) {
										let i = options[frontend].clearnet.enabled.indexOf(instance)
										if (i > -1) options[frontend].clearnet.enabled.splice(i, 1)
									}
								}
							}
						}
						*/
						// The above will be implemented with https://github.com/libredirect/libredirect/issues/334
					}
					for (const frontend in redirects) {
						let exists = false
						for (const service in config.services) if (config.services[service].frontends[frontend]) exists = true
						if (!exists) delete redirects[frontend]
						else for (const network in redirects[frontend]) if (!config.networks[network]) delete redirects[frontend][network]
					}
					browser.storage.local.set({ redirects, targets, options }, () => resolve())
				})
			})
	})
}

function initDefaults() {
	return new Promise(resolve => {
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(data => {
				fetch("/config/config.json")
					.then(response => response.text())
					.then(configData => {
						browser.storage.local.get(["options", "blacklists"], r => {
							let redirects = JSON.parse(data)
							let options = r.options
							let targets = {}
							let config = JSON.parse(configData)
							const localstorage = {}
							const latency = {}
							for (const service in config.services) {
								options[service] = {}
								if (config.services[service].targets == "datajson") {
									targets[service] = redirects[service]
									delete redirects[service]
								}
								for (const defaultOption in config.services[service].options) options[service][defaultOption] = config.services[service].options[defaultOption]
								for (const frontend in config.services[service].frontends) {
									if (config.services[service].frontends[frontend].instanceList) {
										options[frontend] = {}
										for (const network in config.networks) {
											options[frontend][network] = {}
											options[frontend][network].enabled = JSON.parse(data)[frontend][network]
											options[frontend][network].custom = []
										}
										for (const blacklist in r.blacklists) {
											for (const instance of r.blacklists[blacklist]) {
												let i = options[frontend].clearnet.enabled.indexOf(instance)
												if (i > -1) options[frontend].clearnet.enabled.splice(i, 1)
											}
										}
									}
								}
							}
							browser.storage.local.set({ redirects, options, targets, latency, localstorage })
							resolve()
						})
					})
			})
	})
}

function upgradeOptions() {
	return new Promise(resolve => {
		fetch("/config/config.json")
			.then(response => response.text())
			.then(configData => {
				browser.storage.local.get(null, r => {
					let options = r.options
					let latency = {}
					const config = JSON.parse(configData)
					options.exceptions = r.exceptions
					if (r.theme != "DEFAULT") options.theme = r.theme
					options.popupServices = r.popupFrontends
					let tmp = options.popupServices.indexOf("tikTok")
					if (tmp > -1) {
						options.popupServices.splice(tmp, 1)
						options.popupServices.push("tiktok")
					}
					tmp = options.popupServices.indexOf("sendTarget")
					if (tmp > -1) {
						options.popupServices.splice(tmp, 1)
						options.popupServices.push("sendFiles")
					}
					options.autoRedirect = r.autoRedirect
					switch (r.onlyEmbeddedVideo) {
						case "onlyNotEmbedded":
							options.youtube.redirectType = "main_frame"
						case "onlyEmbedded":
							options.youtube.redirectType = "sub_frame"
						case "both":
							options.youtube.redirectType = "both"
					}
					for (const service in config.services) {
						let oldService
						switch (service) {
							case "tiktok":
								oldService = "tikTok"
								break
							case "sendFiles":
								oldService = "sendTarget"
								break
							default:
								oldService = service
						}
						options[service].enabled = !r["disable" + utils.camelCase(oldService)]
						if (r[oldService + "Frontend"]) {
							if (r[oldService + "Frontend"] == "yatte") options[service].frontend = "yattee"
							else options[service].frontend = r[oldService + "Frontend"]
						}
						if (r[oldService + "RedirectType"]) options[service].redirectType = r[oldService + "RedirectType"]
						if (r[oldService + "EmbedFrontend"] && (service != "youtube" || r[oldService + "EmbedFrontend"] == "invidious" || r[oldService + "EmbedFrontend"] == "piped"))
							options[service].embedFrontend = r[oldService + "EmbedFrontend"]
						for (const frontend in config.services[service].frontends) {
							if (r[frontend + "Latency"]) latency[frontend] = r[frontend + "Latency"]
							for (const network in config.networks) {
								let protocol
								if (network == "clearnet") protocol = "normal"
								else protocol = network
								if (r[frontend + utils.camelCase(protocol) + "RedirectsChecks"]) {
									options[frontend][network].enabled = r[frontend + utils.camelCase(protocol) + "RedirectsChecks"]
									options[frontend][network].custom = r[frontend + utils.camelCase(protocol) + "CustomRedirects"]
									for (const instance of options[frontend][network].enabled) {
										let i = r.redirects[frontend][network].indexOf(instance)
										if (i < 0) options[frontend][network].enabled.splice(i, 1)
									}
								}
							}
						}
					}
					browser.storage.local.set({ options, latency }, () => resolve())
				})
			})
	})
}

function processUpdate() {
	return new Promise(resolve => {
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(data => {
				fetch("/config/config.json")
					.then(response => response.text())
					.then(configData => {
						browser.storage.local.get(["options", "blacklists", "targets"], r => {
							let redirects = JSON.parse(data)
							let options = r.options
							let targets = r.targets
							let config = JSON.parse(configData)
							for (const service in config.services) {
								if (!options[service]) options[service] = {}
								if (config.services[service].targets == "datajson") {
									targets[service] = redirects[service]
									delete redirects[service]
								}
								for (const defaultOption in config.services[service].options) {
									if (options[service][defaultOption] === undefined) {
										options[service][defaultOption] = config.services[service].options[defaultOption]
									}
								}
								for (const frontend in config.services[service].frontends) {
									if (config.services[service].frontends[frontend].instanceList) {
										if (!options[frontend]) options[frontend] = {}
										for (const network in config.networks) {
											if (!options[frontend][network]) {
												options[frontend][network] = {}
												options[frontend][network].enabled = JSON.parse(data)[frontend][network]
												options[frontend][network].custom = []
												if (network == "clearnet") {
													for (const blacklist in r.blacklists) {
														for (const instance of r.blacklists[blacklist]) {
															let i = options[frontend].clearnet.enabled.indexOf(instance)
															if (i > -1) options[frontend].clearnet.enabled.splice(i, 1)
														}
													}
												}
											} else {
												for (const instance of options[frontend][network].enabled) {
													let i = redirects[frontend][network].indexOf(instance)
													if (i < 0) options[frontend][network].enabled.splice(i, 1)
												}
											}
										}
									}
								}
							}
							browser.storage.local.set({ redirects, options, targets })
							resolve()
						})
					})
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
									instancesList.push(...options[frontend][network].enabled, ...options[frontend][network].custom)
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

export default {
	redirect,
	computeService,
	switchInstance,
	reverse,
	unifyPreferences,
	setRedirects,
	initDefaults,
	upgradeOptions,
	processUpdate,
	modifyContentSecurityPolicy,
}

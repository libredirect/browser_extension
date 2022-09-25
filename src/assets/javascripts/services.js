window.browser = window.browser || window.chrome

import utils from "./utils.js"

let config = {},
	redirects = {},
	options = {}

async function getConfig() {
	return new Promise(resolve => {
		fetch("/config/config.json")
			.then(response => response.text())
			.then(data => {
				const tmp = JSON.parse(data)
				config = tmp.config
				resolve()
			})
	})
}

function init() {
	return new Promise(resolve => {
		browser.storage.local.get(["network", "networkFallback", "redirects"], r => {
			options.network = r.network
			options.networkFallback = r.networkFallback
			redirects = r.redirects
		})
		for (const service in config.services) {
			options[service] = {}
			browser.storage.local.get([`${service}Enabled`, `${service}RedirectType`, `${service}Frontend`], r => {
				options[service].enabled = r[service + "Enabled"]
				options[service].frontend = r[service + "Frontend"]
				options[service].redirectType = r[service + "RedirectType"]
			})
			for (const frontend in config.services[service].frontends) {
				options[frontend] = {}
				for (const network in config.networks) {
					options[frontend][network] = {}
					options[frontend][network] = {}
					browser.storage.local.get([`${frontend}${utils.camelCase(network)}RedirectsChecks`, `${frontend}${utils.camelCase(network)}CustomRedirects`], r => {
						options[frontend][network].checks = r[frontend + utils.camelCase(network) + "RedirectsChecks"]
						options[frontend][network].custom = r[frontend + utils.camelCase(network) + "CustomRedirects"]
					})
				}
			}
		}
		resolve()
	})
}

function all(service) {
	let tmp = []
	for (const frontend in config.services[service].frontends) {
		if (config.services[service].frontends[frontend].instanceList) {
			for (const network in config.networks) {
				tmp.push(...redirects[frontend][network])
			}
		} else if (config.services[service].frontends[frontend].singleInstance != undefined) tmp.push(config.services[service].frontends[frontend].singleInstance)
	}
	return tmp
}

function regexArray(service, url) {
	let targets
	if (config.services[service].targets == "datajson") {
		browser.storage.local.get(`${service}Targets`, r => {
			targets = r[service + "Targets"]
		})
	} else {
		targets = config.services[service].targets
	}
	for (const targetString in targets) {
		const target = new RegExp(targets[targetString])
		if (target.test(url.href)) return true
	}
	return false
}

getConfig()
init()
browser.storage.onChanged.addListener(init)

function redirect(url, type, initiator) {
	let randomInstance
	let frontend
	let network = options.network
	for (const service in config.services) {
		if (!options[service].enabled) continue
		if (config.services[service].embeddable && type != options[service].redirectType && options[service].redirectType != "both") continue
		if (!config.services[service].embeddable && type != "main_frame") continue
		let targets = new RegExp(config.services[service].targets.join("|"), "i")

		if (initiator && (all(service).includes(initiator.origin) || targets.test(initiator.host))) continue
		if (!regexArray(service, url)) continue

		if (Object.keys(config.services[service].frontends).length > 1) {
			frontend = options[service].frontend
		} else {
			frontend = Object.keys(config.services[service].frontends)[0]
		}

		if (config.services[service].frontends[frontend].instanceList) {
			let instanceList = [...options[frontend][network].checks, ...options[frontend][network].custom]
			if (instanceList.length === 0 && options.networkFallback) instanceList = [...options[frontend].clearnet.checks, ...options[frontend].clearnet.custom]
			if (instanceList.length === 0) return
			randomInstance = utils.getRandomInstance(instanceList)
		} else if (config.services[service].frontends[frontend].singleInstance) randomInstance = config.services[service].frontends[frontend].singleInstance
		break
	}
	if (frontend == null) return

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
			return `${randomInstance}/search${encodeURIComponent(url.searchParams.get("q"))}`
		case "librex":
			return `${randomInstance}/search.php?q=${encodeURIComponent(url.searchParams.get("q"))}`
		case "send":
			return randomInstance
		case "nitter":
			if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video") {
				const [, id, format, extra] = url.search.match(/(.*)\?format=(.*)&(.*)/)
				const query = encodeURIComponent(`${id}.${format}?${extra}`)
				return `${randomInstance}/pic${url.pathname}${query}`
			} else if (url.pathname.split("/").includes("tweets")) return `${randomInstance}${url.pathname.replace("/tweets", "")}${url.search}`
			else if (url.host == "t.co") return `${randomInstance}/t.co${url.pathname}`
			else return `${randomInstance}${url.pathname}${url.search}`
		case "yatte":
			return url.href.replace(/^https?:\/{2}/, "yattee://")
		case "freetube":
			return `freetube://https://youtube.com${url.pathname}${url.search}`
		case "simplyTranslate":
			return `${randomInstance}/${url.search}`
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
				xmlhttp.open("GET", `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`, false)
				xmlhttp.send()
				if (xmlhttp.status === 200) {
					const json = JSON.parse(xmlhttp.responseText)[0]
					if (json) {
						console.log("json", json)
						return [`${json.lat},${json.lon}`, `${json.boundingbox[2]},${json.boundingbox[1]},${json.boundingbox[3]},${json.boundingbox[0]}`]
					}
				}
				console.info("Error: Status is " + xmlhttp.status)
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
		default:
			return `${randomInstance}${url.pathname}${url.search}`
	}
}

function initDefaults() {
	return new Promise(async resolve => {
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(async data => {
				let dataJson = JSON.parse(data)
				let tmpRedirects = JSON.parse(data)
				browser.storage.local.get(["cloudflareBlackList", "authenticateBlackList", "offlineBlackList"], async r => {
					for (const service in config.services) {
						if (config.services[service].targets == "datajson") {
							browser.storage.local.set({ [service + "Targets"]: [...dataJson[service]] })
							delete dataJson[service]
						}
						for (const defaultOption in config.services[service].options) {
							browser.storage.local.set({ [service + utils.camelCase(defaultOption)]: config.services[service].options[defaultOption] })
						}
						for (const frontend in config.services[service].frontends) {
							if (config.services[service].frontends[frontend].instanceList) {
								let clearnetChecks = tmpRedirects[frontend].clearnet
								for (const instance of [...r.cloudflareBlackList, ...r.authenticateBlackList, ...r.offlineBlackList]) {
									let i = clearnetChecks.indexOf(instance)
									if (i > -1) clearnetChecks.splice(i, 1)
								}
								for (const network in config.networks) {
									switch (network) {
										case "clearnet":
											browser.storage.local.set({
												[frontend + "ClearnetRedirectsChecks"]: [...clearnetChecks],
												[frontend + "ClearnetCustomRedirects"]: [],
											})
											break
										default:
											browser.storage.local.set({
												[frontend + utils.camelCase(network) + "RedirectsChecks"]: [...tmpRedirects[frontend][network]],
												[frontend + utils.camelCase(network) + "CustomRedirects"]: [],
											})
									}
								}
							}
						}
					}
					browser.storage.local.set({
						redirects: dataJson,
					})
					resolve()
				})
			})
	})
}

function computeService(url) {
	for (const service in config.services) {
		if (regexArray(service, url)) {
			return service
		} else if (all(service).includes(utils.protocolHost(url))) {
			return service
		}
	}
	return null
}

function switchInstance(url) {
	return new Promise(async resolve => {
		await getConfig()
		await init()
		for (const service in config.services) {
			if (!options[service].enabled) continue
			const protocolHost = utils.protocolHost(url)
			if (!all(service).includes(protocolHost)) continue

			let instancesList = [...options[options[service].frontend][options.network].checks, ...options[options[service].frontend][options.network].custom]
			if (instancesList.length === 0 && options.networkFallback) instancesList = [...options[options[service].frontend].clearnet.checks, ...options[options[service].frontend].clearnet.custom]

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
			resolve(oldUrl.replace(oldUrl, randomInstance))
		}
	})
}

export default {
	redirect,
	initDefaults,
	computeService,
	switchInstance,
}

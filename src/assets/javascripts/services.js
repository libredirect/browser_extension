import utils from "./utils.js"

const isChrome = browser.runtime.getBrowserInfo === undefined
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
	if (frontend && 'excludeTargets' in config.services[service].frontends[frontend]) {
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

async function redirectAsync(url, type, initiator, forceRedirection) {
	await init()
	return redirect(url, type, initiator, forceRedirection)
}

function redirect(url, type, initiator, forceRedirection) {
	if (type != "main_frame" && type != "sub_frame" && type != "image") return
	let randomInstance
	let frontend
	for (const service in config.services) {
		if (!forceRedirection && !options[service].enabled) continue

		frontend = options[service].frontend

		if (!regexArray(service, url, config, frontend)) {
			frontend = null
			continue
		}

		if (
			(config.services[service].embeddable && type != options[service].redirectType && options[service].redirectType != "both")
			||
			(!config.services[service].embeddable && type != "main_frame")
		) {
			if (options[service].unsupportedUrls == 'block') return 'CANCEL'
			return
		}

		let instanceList = options[frontend]
		if (instanceList === undefined) break
		if (instanceList.length === 0) return null

		if (
			initiator
			&&
			instanceList.includes(initiator.origin)
		) return "BYPASSTAB"

		randomInstance = utils.getRandomInstance(instanceList)
		if (config.services[service].frontends[frontend].localhost && options[service].instance == "localhost") {
			randomInstance = `http://${frontend}.localhost:8080`
		}
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

	if (!frontend) return

	switch (frontend) {
		case "beatbump": {
			return `${randomInstance}${url.pathname}${url.search}`
				.replace("/watch?v=", "/listen?id=")
				.replace("/channel/", "/artist/")
				.replace("/playlist?list=", "/playlist/VL")
				.replace(/\/search\?q=.*/, searchQuery => searchQuery.replace("?q=", "/") + "?filter=all")
		}
		case "hyperpipe": {
			return `${randomInstance}${url.pathname}${url.search}`.replace(/\/search\?q=.*/, searchQuery => searchQuery.replace("?q=", "/"))
		}
		case "searx":
		case "searxng":
			return `${randomInstance}/${url.search}`
		case "whoogle": {
			return `${randomInstance}/search${url.search}`
		}
		case "librex": {
			return `${randomInstance}/search.php${url.search}`
		}
		case "send": {
			return randomInstance
		}
		case "nitter": {
			let search = new URLSearchParams(url.search)

			search.delete("ref_src")
			search.delete("ref_url")
			search.delete("s") // type of device that shared the link
			search.delete("t") // some sort of tracking ID

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
		}
		case "yattee": {
			return url.href.replace(/^https?:\/{2}/, "yattee://")
		}
		case "freetube": {
			return `freetube://https://youtu.be${url.pathname}${url.search}`.replace(/watch\?v=/, "")
		}
		case "poketube": {
			if (url.pathname.startsWith('/channel')) {
				const reg = /\/channel\/(.*)\/?$/.exec(url.pathname)
				if (reg) {
					const id = reg[1]
					return `${randomInstance}/channel?id=${id}${url.search}`
				}
			}
			if (/\/@[a-z]+\//.exec(url.pathname)) return randomInstance
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "libMedium":
		case "scribe": {
			const regex = url.hostname.match(/^(link|cdn-images-\d+|.*)\.medium\.com/)
			if (regex && regex.length > 1) {
				const subdomain = regex[1]
				if (subdomain != "link" || !subdomain.startsWith("cdn-images")) {
					return `${randomInstance}/@${subdomain}${url.pathname}${url.search}`
				}
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "simplyTranslate": {
			return `${randomInstance}/${url.search}`
		}
		case "libreTranslate": {
			let search = url.search
				.replace("sl", "source")
				.replace("tl", "target")
				.replace("text", "q")
			return `${randomInstance}/${search}`
		}
		case "lingva": {
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
		}
		case "osm": {
			if (initiator && initiator.host === "earth.google.com") return randomInstance
			const travelModes = {
				driving: "fossgis_osrm_car",
				walking: "fossgis_osrm_foot",
				bicycling: "fossgis_osrm_bike",
				transit: "fossgis_osrm_car", // not implemented on OSM, default to car.
			}

			function addressToLatLng(address) {
				const xmlhttp = new XMLHttpRequest()
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
				let [, mlat, mlon] = url.pathname.match(dataLatLngRegex)

				return `${randomInstance}/search?query=${mlat}%2C${mlon}`
			} else if (url.searchParams.has("ll")) {
				// Get marker from ll param
				// https://maps.google.com/?ll=38.882147,-76.99017
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
			if (initiator && initiator.host === "earth.google.com") return randomInstance
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
				let [, mlat, mlon] = url.pathname.match(dataLatLngRegex)
				return `${randomInstance}/#q=${mlat}%2C${mlon}`
			} else if (url.searchParams.has("ll")) {
				// Get marker from ll param
				// https://maps.google.com/?ll=38.882147,-76.99017
				const [mlat, mlon] = url.searchParams.get("ll").split(",")
				return `${randomInstance}/#q=${mlat}%2C${mlon}`
			} else if (url.searchParams.has("viewpoint")) {
				// Get marker from viewpoint param
				// https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.857832,2.295226&heading=-45&pitch=38&fov=80
				const [mlat, mlon] = url.searchParams.get("viewpoint").split(",")

				return `${randomInstance}/#q=${mlat}%2C${mlon}`
			} else {
				// Use query as search if present.
				let query
				if (url.searchParams.has("q")) query = url.searchParams.get("q")
				else if (url.searchParams.has("query")) query = url.searchParams.get("query")
				else if (url.pathname.match(placeRegex)) query = url.pathname.match(placeRegex)[1]
				if (query) return `${randomInstance}/${mapCentre}/Mpnk/${query}`
			}
		}
		case "breezeWiki": {
			let wiki, urlpath = ""
			if (url.hostname.match(/^[a-zA-Z0-9-]+\.(?:fandom|wikia)\.com/)) {
				wiki = url.hostname.match(/^[a-zA-Z0-9-]+(?=\.(?:fandom|wikia)\.com)/)
				if (wiki == "www" || !wiki) wiki = ""
				else wiki = `/${wiki}`
				urlpath = url.pathname
			} else {
				wiki = url.pathname.match(/(?<=wiki\/w:c:)[a-zA-Z0-9-]+(?=:)/)
				if (!wiki) wiki = ""
				else {
					wiki = "/" + wiki + "/wiki/"
					urlpath = url.pathname.match(/(?<=wiki\/w:c:[a-zA-Z0-9-]+:).+/)
				}
			}
			if (url.href.search(/Special:Search\?query/) > -1) {
				return `${randomInstance}${wiki}${urlpath}${url.search}`.replace(/Special:Search\?query/, "search?q").replace(/\/wiki/, "")
			}
			return `${randomInstance}${wiki}${urlpath}${url.search}`
		}
		case "rimgo": {
			if (url.href.search(/^https?:\/{2}(?:[im]\.)?stack\./) > -1) {
				return `${randomInstance}/stack${url.pathname}${url.search}`
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "libreddit": {
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
			return randomInstance
		}
		case "teddit": {
			if (/^(?:(?:external-)?preview|i)\.redd\.it/.test(url.hostname)) {
				if (url.search == "") return `${randomInstance}${url.pathname}?teddit_proxy=${url.hostname}`
				else return `${randomInstance}${url.pathname}${url.search}&teddit_proxy=${url.hostname}`
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "redditWaybackMachine": {
			let lookupUrl = url.href;
			if (['www.reddit.com', 'reddit.com'].includes(url.hostname)) {
				lookupUrl = `https://old.reddit.com${url.pathname}`
			}
			return `https://web.archive.org/web/20230611000000/${lookupUrl}`
		}
		case "neuters": {
			const p = url.pathname
			if (p.startsWith('/article/') || p.startsWith('/pf/') || p.startsWith('/arc/') || p.startsWith('/resizer/')) {
				return randomInstance
			}
			return `${randomInstance}${p}`
		}
		case "dumb": {
			if (url.pathname.endsWith('-lyrics')) {
				return `${randomInstance}${url.pathname}`
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "intellectual": {
			if (url.pathname.endsWith('-lyrics')) {
				return `${randomInstance}/lyrics?path=${encodeURIComponent(url.pathname)}`
			}
			if (url.pathname.startsWith('/artists/')) {
				return `${randomInstance}/artist?path=${url.pathname}`
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "ruralDictionary": {
			if (!url.pathname.includes('/define.php') && !url.pathname.includes('/random.php') && url.pathname != '/') return randomInstance
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "anonymousOverflow": {
			if (!url.pathname.startsWith('/questions') && url.pathname != '/') return randomInstance
			if (url.hostname == "stackoverflow.com") {
				const threadID = /\/(\d+)\/?$/.exec(url.pathname)
				if (threadID) return `${randomInstance}/questions/${threadID[1]}${url.search}`
				return `${randomInstance}${url.pathname}${url.search}`
			}
			const regex = url.href.match(/https?:\/{2}(?:([a-zA-Z0-9-]+)\.)?stackexchange\.com\//)
			if (regex && regex.length > 1) {
				const subdomain = regex[1]
				return `${randomInstance}/exchange/${subdomain}${url.pathname}${url.search}`
			}
		}
		case "biblioReads": {
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "wikiless": {
			let hostSplit = url.host.split(".")
			// wikiless doesn't have mobile view support yet
			if (hostSplit[0] != "wikipedia" && hostSplit[0] != "www") {
				if (hostSplit[0] == "m") url.searchParams.append("mobileaction", "toggle_view_mobile")
				else url.searchParams.append("lang", hostSplit[0])
				if (hostSplit[1] == "m") url.searchParams.append("mobileaction", "toggle_view_mobile")
			}
			return `${randomInstance}${url.pathname}${url.search}${url.hash}`
		}
		case "proxiTok": {
			if (url.pathname.startsWith('/email')) return randomInstance
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "waybackClassic": {
			const regex = /^\/\web\/(?:[0-9]+)?\*\/(.*)/.exec(url.pathname)
			if (regex) {
				const link = regex[1]
				return `${randomInstance}/cgi-bin/history.cgi?utf8=✓&q=${encodeURIComponent(link)}`
			}
			const regex2 = /(^\/\web\/([0-9]+)\/.*)/.exec(url.pathname)
			if (regex2) {
				let link = regex2[1]
				link = link.replace(regex2[2], regex2[2] + 'if_')
				return `https://web.archive.org${link}`
			}
			return
		}
		case "gothub": {
			const regex = /^\/(.*)\/(.*)\/(?:blob|tree)\/(.*)\/(.*)/.exec(url.pathname)
			if (regex) {
				const user = regex[1]
				const repo = regex[2]
				const branch = regex[3]
				const path = regex[4]
				return `${randomInstance}/file/${user}/${repo}/${branch}/${path}`
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "mikuInvidious": {
			console.log("Hello?")
			if (url.hostname == "bilibili.com" || url.hostname == "www.bilibili.com" || url.hostname == 'b23.tv') {
				console.log('wewe')
				return `${randomInstance}${url.pathname}${url.search}`
			}
			if (url.hostname == "space.bilibili.com") {
				return `${randomInstance}/space${url.pathname}${url.search}`
			}
		}
		case "tent": {
			if (url.hostname == 'bandcamp.com' && url.pathname == '/search') {
				const query = url.searchParams.get('q')
				return `${randomInstance}/search.php?query=${encodeURIComponent(query)}`
			}
			if (url.hostname.endsWith('bandcamp.com')) {
				const regex = /^(.*)\.bandcamp\.com/.exec(url.hostname)
				const artist = regex[1]
				if (url.pathname == '/') {
					return `${randomInstance}/artist.php?name=${artist}`
				} else {
					const regex = /^\/(.*)\/(.*)/.exec(url.pathname)
					if (regex) {
						const type = regex[1]
						const name = regex[2]
						return `${randomInstance}/release.php?artist=${artist}&type=${type}&name=${name}`
					}
				}
			}
			if (url.hostname == 'f4.bcbits.com') {
				const regex = /\/img\/(.*)/.exec(url.pathname)
				const image = regex[1]
				return `${randomInstance}/image.php?file=${image}`
			}
			if (url.hostname == 't4.bcbits.com') {
				const regex = /\/stream\/(.*)\/(.*)\/(.*)/.exec(url.pathname)
				if (regex) {
					const directory = regex[1]
					const format = regex[2]
					const file = regex[3]
					const token = url.searchParams.get('token')
					return `${randomInstance}/audio.php/?directory=${directory}&format=${format}&file=${file}&token=${encodeURIComponent(token)}`
				}
			}
		}
		case "binternet": {
			if (url.hostname == "i.pinimg.com") return `${randomInstance}/image_proxy.php?url=${url.href}`
			return randomInstance
		}
		case "laboratory": {
			let path = url.pathname
			if (path == "/") path = ""
			return `${randomInstance}/${url.hostname}${path}${url.search}`
		}
		default: {
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "quetre": {
			const regex = /([a-z]+)\.quora\.com/.exec(url.hostname)
			console.log(regex)
			if (regex) {
				const lang = regex[1]
				url.searchParams.append("lang", lang)
				return `${randomInstance}${url.pathname}${url.search}`
			}
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

function switchInstance(url) {
	return new Promise(async resolve => {
		let options = await utils.getOptions()
		let config = await utils.getConfig()

		const protocolHost = utils.protocolHost(url)
		for (const service in config.services) {
			let frontend = options[service].frontend
			let instancesList = options[frontend]
			if (instancesList === undefined) continue
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

async function reverse(url) {
	let options = await utils.getOptions()
	let config = await utils.getConfig()
	let protocolHost = utils.protocolHost(url)
	for (const service in config.services) {
		let frontend = options[service].frontend
		if (options[frontend] == undefined) continue
		if (!options[frontend].includes(protocolHost)) continue
		switch (service) {
			case "youtube":
			case "imdb":
			case "imgur":
			case "tiktok":
			case "twitter":
			case "reddit":
			case "imdb":
			case "snopes":
			case "urbanDictionary":
			case "quora":
			case "medium":
				return `${config.services[service].url}${url.pathname}${url.search}`
			case "fandom":
				let regex = url.pathname.match(/^\/([a-zA-Z0-9-]+)\/wiki\/(.*)/)
				if (regex) return `https://${regex[1]}.fandom.com/wiki/${regex[2]}`
				return
			case "wikipedia": {
				const lang = url.searchParams.get("lang")
				if (lang != null) {
					url.searchParams.delete("lang")
					return `https://${lang}.wikipedia.org${url.pathname}${url.search}${url.hash}`
				}
				return `https://wikipedia.org${url.pathname}${url.search}${url.hash}`
			}
			case "stackOverflow": {
				if (url.pathname.startsWith("/questions/")) {
					return `https://stackoverflow.com${url.pathname}${url.search}`
				}
				if (url.pathname.startsWith("/exchange/")) {
					const regex = /\/exchange\/(.*?)(\/.*)/.exec(url.pathname)
					if (regex) return `https://${regex[1]}.stackexchange.com${regex[2]}`
				}
				return
			}
			default:
				return
		}
	}
	return
}

const defaultInstances = {
	'invidious': ['https://inv.vern.cc'],
	'piped': ['https://pipedapi-libre.kavin.rocks'],
	'pipedMaterial': ['https://piped-material.xn--17b.net'],
	'cloudtube': ['https://tube.cadence.moe'],
	'poketube': ['https://poketube.fun'],
	'proxiTok': ['https://proxitok.pabloferreiro.es'],
	'send': ['https://send.vis.ee'],
	'nitter': ['https://nitter.net'],
	'libreddit': ['https://libreddit.spike.codes'],
	'teddit': ['https://teddit.net'],
	'scribe': ['https://scribe.rip'],
	'libMedium': ['https://md.vern.cc'],
	'quetre': ['https://quetre.iket.me'],
	'libremdb': ['https://libremdb.iket.me'],
	'simplyTranslate': ['https://simplytranslate.org'],
	'lingva': ['https://lingva.ml'],
	'searxng': ['https://search.bus-hit.me'],
	'rimgo': ['https://rimgo.vern.cc'],
	'beatbump': ['https://beatbump.ml'],
	'hyperpipe': ['https://hyperpipe.surge.sh'],
	'facil': [' https://facilmap.org '],
	'osm': ['https://www.openstreetmap.org'],
	'breezeWiki': ['https://breezewiki.com'],
	'neuters': ['https://neuters.de'],
	'dumb': ['https://dm.vern.cc'],
	"intellectual": ['https://intellectual.insprill.net'],
	'ruralDictionary': ['https://rd.vern.cc'],
	'anonymousOverflow': ['https://code.whatever.social'],
	'biblioReads': ['https://biblioreads.ml'],
	'wikiless': ['https://wikiless.org'],
	'suds': ['https://sd.vern.cc'],
	'waybackClassic': ['https://wayback-classic.net'],
	'gothub': ['https://gh.odyssey346.dev'],
	'mikuInvidious': ['https://mikuinv.resrv.org'],
	"tent": ['https://tent.sny.sh'],
	"wolfreeAlpha": ['https://gqq.gitlab.io', 'https://uqq.gitlab.io'],
	"laboratory": ['https://lab.vern.cc'],
	"libreSpeed": ['https://librespeed.org'],
	'jitsi': ['https://meet.jit.si', 'https://8x8.vc'],
	'binternet': ['https://binternet.ahwx.org']
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
			options['fetchInstances'] = 'github'

			options = { ...options, ...defaultInstances }

			browser.storage.local.set({ options },
				() => resolve()
			)
		})
	})
}

function upgradeOptions() {
	return new Promise(async resolve => {
		let options = await utils.getOptions()

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

			if (!(options[service].frontend in config.services[service].frontends)) {
				options[service] = config.services[service].options
				delete options[options[service].frontend]
			}

			for (const defaultOption in config.services[service].options) {
				if (options[service][defaultOption] === undefined) {
					options[service][defaultOption] = config.services[service].options[defaultOption]
				}
			}

			for (const frontend in config.services[service].frontends) {
				if (options[frontend] === undefined && config.services[service].frontends[frontend].instanceList) {
					options[frontend] = defaultInstances[frontend]
				}
				else if (frontend in options && !(frontend in config.services[service].frontends)) {
					delete options[frontend]
				}
			}
		}
		browser.storage.local.set({ options }, () => {
			resolve()
		})
	})
}

async function copyRaw(url, test) {
	const newUrl = await reverse(url)
	if (newUrl) {
		if (!test) {
			if (!isChrome) {
				navigator.clipboard.writeText(newUrl)
			} else {
				var copyFrom = document.createElement("textarea");
				copyFrom.textContent = newUrl;
				document.body.appendChild(copyFrom);
				copyFrom.select()
				document.execCommand('copy')
				copyFrom.blur();
				document.body.removeChild(copyFrom);
			}
		}
		return newUrl
	}
}

function isException(url) {
	let exceptions = options.exceptions
	if (exceptions && url) {
		if (exceptions.url) {
			for (let item of exceptions.url) {
				item = new URL(item)
				item = item.href
				item = item.replace(/^http:\/\//, 'https://')
				if (item == url.href) return true
			}
		}
		if (exceptions.regex) for (const item of exceptions.regex) if (new RegExp(item).test(url.href)) return true
	}
	return false
}

export default {
	redirect,
	redirectAsync,
	computeService,
	reverse,
	initDefaults,
	upgradeOptions,
	processUpdate,
	copyRaw,
	switchInstance,
	isException
}

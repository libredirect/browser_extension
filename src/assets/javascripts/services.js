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

/**
 * @param {string} service
 * @param {URL} url
 * @param {{}} config
 * @param {string} frontend
 */
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

/**
 * @param {URL} url
 * @param {string} type
 * @param {URL} initiator
 * @param {boolean} forceRedirection
 */
async function redirectAsync(url, type, initiator, forceRedirection) {
	await init()
	return redirect(url, type, initiator, forceRedirection)
}

/**
 * @param url
 * @param frontend
 * @param randomInstance
 * @returns {undefined|string}
 */
function rewrite(url, frontend, randomInstance) {
	if (!frontend || !randomInstance) return
	switch (frontend) {
		case "hyperpipe": {
			return `${randomInstance}${url.pathname}${url.search}`.replace(/\/search\?q=.*/, searchQuery => searchQuery.replace("?q=", "/"))
		}
		case "searx":
		case "searxng": {
			return `${randomInstance}/${url.search}`
		}
		case "whoogle": {
			return `${randomInstance}/search${url.search}`
		}
		case "4get": {
			const s = url.searchParams.get("q")
			if (s !== null) {
				return `${randomInstance}/web?s=${encodeURIComponent(s)}`
			}
			return randomInstance
		}
		case "librey": {
			return `${randomInstance}/search.php${url.search}`
		}
		case "send": {
			return randomInstance
		}
		case "yattee": {
			return url.href.replace(/^https?:\/{2}/, "yattee://")
		}
		case "freetube": {
			return 'freetube://' + url.href
		}
		case "freetubePwa": {
			return 'freetube://' + url.href
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
		case "mozhi": {
			return `${randomInstance}`
		}
		case "libreTranslate": {
			let search = url.search
				.replace("sl", "source")
				.replace("tl", "target")
				.replace("text", "q")
			return `${randomInstance}/${search}`
		}
		case "osm": {
			const placeRegex = /\/place\/(.*?)\//
			function convertMapCentre(url) {
				let [lat, lon, zoom] = [null, null, null]
				const reg = url.pathname.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/)
				if (reg) {
					[, lon, lat, zoom] = reg
				} else if (url.searchParams.has("center")) {
					// Set map centre if present
					[lat, lon] = url.searchParams.get("center").split(",")
					zoom = url.searchParams.get("zoom") ?? "17"
				}
				return { zoom, lon, lat }
			}
			function addressToLatLng(address) {
				const http = new XMLHttpRequest()
				http.open("GET", `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`, false)
				http.send()
				if (http.status == 200) {
					const json = JSON.parse(http.responseText)[0]
					if (json) {
						return {
							coordinate: `${json.lat},${json.lon}`,
							boundingbox: `${json.boundingbox[2]},${json.boundingbox[1]},${json.boundingbox[3]},${json.boundingbox[0]}`
						}
					}
					return {}
				}
			}
			function getQuery(url) {
				let query = ""
				if (url.searchParams.has("q")) query = url.searchParams.get("q")
				else if (url.searchParams.has("query")) query = url.searchParams.has("query")
				return query
			}
			function prefsEncoded(prefs) {
				return new URLSearchParams(prefs).toString()
			}

			if (initiator && initiator.host === "earth.google.com") return randomInstance

			let mapCentre = "#"
			let prefs = { layers: "mapnik" }

			const mapCentreData = convertMapCentre(url)
			if (mapCentreData.zoom && mapCentreData.lon && mapCentreData.lat) mapCentre = `#map=${mapCentreData.zoom}/${mapCentreData.lon}/${mapCentreData.lat}`

			if (url.pathname.includes("/embed")) { // https://www.google.com/maps/embed/v1/place?key=AIzaSyD4iE2xVSpkLLOXoyqT-RuPwURN3ddScAI&q=Eiffel+Tower,Paris+France
				const query = getQuery(url)
				let { coordinate, boundingbox } = addressToLatLng(query)
				prefs.bbox = boundingbox
				prefs.marker = coordinate
				return `${randomInstance}/export/embed.html?${prefsEncoded(prefs)}`
			} else if (url.pathname.includes("/dir")) {
				if (url.searchParams.has("travelmode")) {
					const travelModes = {
						driving: "fossgis_osrm_car",
						walking: "fossgis_osrm_foot",
						bicycling: "fossgis_osrm_bike",
						transit: "fossgis_osrm_car", // not implemented on OSM, default to car.
					}
					prefs.engine = travelModes[url.searchParams.get("travelmode")]
				}
				const regex1 = /\/dir\/([^@/]+)\/([^@/]+)\/@-?\d[0-9.]*,-?\d[0-9.]*,\d{1,2}[.z]/.exec(url.pathname)
				const regex2 = /\/dir\/([^@/]+)\//.exec(url.pathname)
				if (regex1) { // https://www.google.com/maps/dir/92+Rue+Moncey,+69003+Lyon,+France/M%C3%A9dip%C3%B4le+Lyon-Villeurbanne/@45.760254,4.8486298,13z?travelmode=bicycling
					const origin = addressToLatLng(decodeURIComponent(regex1[1])).coordinate ?? ''
					const destination = addressToLatLng(decodeURIComponent(regex1[2])).coordinate ?? ''
					prefs.route = `${origin};${destination}`
				} else if (regex2) { // https://www.google.com/maps/dir/92+Rue+Moncey,+69003+Lyon,+France/@45.760254,4.8486298,13z?travelmode=bicycling
					const origin = addressToLatLng(decodeURIComponent(regex2[1])).coordinate ?? ''
					prefs.route = `${origin};`
				} else { // https://www.google.com/maps/dir/?api=1&origin=Space+Needle+Seattle+WA&destination=Pike+Place+Market+Seattle+WA&travelmode=bicycling
					const origin = addressToLatLng(url.searchParams.get("origin")).coordinate ?? ''
					const destination = addressToLatLng(url.searchParams.get("destination")).coordinate ?? ''
					prefs.route = `${origin};${destination}`
				}
				return `${randomInstance}/directions?${prefsEncoded(prefs)}${mapCentre}`
			} else if (url.pathname.match(placeRegex)) { // https://www.google.com/maps/place/H%C3%B4tel+de+Londres+Eiffel/@40.9845265,28.7081268,14z
				const query = url.pathname.match(placeRegex)[1]
				return `${randomInstance}/search?query=${query}${mapCentre}`
			} else if (url.searchParams.has("ll")) { // https://maps.google.com/?ll=38.882147,-76.99017
				const [mlat, mlon] = url.searchParams.get("ll").split(",")
				return `${randomInstance}/search?query=${mlat}%2C${mlon}`
			} else if (url.searchParams.has("viewpoint")) { // https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.857832,2.295226&heading=-45&pitch=38&fov=80
				const [mlat, mlon] = url.searchParams.get("viewpoint").split(",")
				return `${randomInstance}/search?query=${mlat}%2C${mlon}`
			} else {
				const query = getQuery(url)
				if (query) return `${randomInstance}/search?query="${query}${mapCentre}&${prefsEncoded(prefs)}`
			}
			return `${randomInstance}/${mapCentre}&${prefsEncoded(prefs)}`
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
		case "redlib":
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
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "ruralDictionary": {
			if (!url.pathname.includes('/define.php') && !url.pathname.includes('/random.php') && url.pathname != '/') return randomInstance
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "anonymousOverflow": {
			if (url.hostname == "stackoverflow.com") {
				const threadID = /^\/a\/(\d+)\/?/.exec(url.pathname)
				if (threadID) return `${randomInstance}/questions/${threadID[1]}${url.search}`
				return `${randomInstance}${url.pathname}${url.search}`
			}
			if (url.pathname == "/" || url.pathname == "") {
				// https://stackexchange.com or https://superuser.com
				return `${randomInstance}${url.pathname}${url.search}`
			}
			const regex = url.href.match(/https?:\/{2}(?:([a-zA-Z0-9-]+)\.)?stackexchange\.com\//)
			if (regex && regex.length > 1) {
				const subdomain = regex[1]
				return `${randomInstance}/exchange/${subdomain}${url.pathname}${url.search}`
			}
			const notExchangeRegex = url.hostname.match(/(?:[a-zA-Z]+\.)?(?:askubuntu\.com|mathoverflow\.net|serverfault\.com|stackapps\.com|superuser\.com|stackoverflow\.com)/)
			if (notExchangeRegex) {
				return `${randomInstance}/exchange/${notExchangeRegex[0]}${url.pathname}${url.search}`
			}
			// "Default case"
			return `${randomInstance}${url.pathname}${url.search}`
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
			if (url.hostname == "gist.github.com") return `${randomInstance}/gist${url.pathname}${url.search}`
			if (url.hostname == "raw.githubusercontent.com") return `${randomInstance}/raw${url.pathname}${url.search}`
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "mikuInvidious": {
			if (url.hostname == "bilibili.com" || url.hostname == "www.bilibili.com" || url.hostname == 'b23.tv') {
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
				if (url.pathname == '/' || url.pathname == '/music') {
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
		}
		case "laboratory": {
			let path = url.pathname
			if (path == "/") path = ""
			return `${randomInstance}/${url.hostname}${path}${url.search}`
		}
		case "quetre": {
			const regex = /([a-z]+)\.quora\.com/.exec(url.hostname)
			if (regex) {
				const lang = regex[1]
				url.searchParams.append("lang", lang)
				return `${randomInstance}${url.pathname}${url.search}`
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "pixivFe": {
			const regex = /\/[a-z]{1,3}\/(.*)/.exec(url.pathname)
			if (regex) {
				const path = regex[1]
				return `${randomInstance}/${path}${url.search}`
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "invidious": {
			if (url.hostname == "youtu.be" || url.hostname.endsWith("youtube.com") && url.pathname.startsWith("/live")) {
				const watch = url.pathname.substring(url.pathname.lastIndexOf('/') + 1)
				return `${randomInstance}/watch?v=${watch}`
			}
			if (url.hostname.endsWith("youtube.com") && url.pathname.startsWith("/redirect?")) {
				return url.href
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "invidiousMusic": {
			if (url.hostname == "youtu.be" || url.hostname.endsWith("youtube.com") && url.pathname.startsWith("/live")) {
				const watch = url.pathname.substring(url.pathname.lastIndexOf('/') + 1)
				return `${randomInstance}/watch?v=${watch}`
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "libremdb": {
			if (url.pathname.startsWith("/Name")) {
				for (const [key, value] of url.searchParams.entries()) {
					return `${randomInstance}/title/${encodeURIComponent(key)}`
				}
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "tuboYoutube": {
			if (url.pathname.startsWith("/channel")) {
				return `${randomInstance}/channel?url=${encodeURIComponent(url.href)}`
			}
			if (url.pathname.startsWith("/watch")) {
				return `${randomInstance}/stream?url=${encodeURIComponent(url.href)}`
			}
			return `${randomInstance}`
		}
		case "tuboSoundcloud": {
			if (url.pathname == '/') return `${randomInstance}?kiosk?serviceId=1`
			if (url.pathname.match(/^\/[^\/]+(\/$|$)/)) {
				return `${randomInstance}/channel?url=${encodeURIComponent(url.href)}`
			}
			if (url.pathname.match(/^\/[^\/]+\/[^\/]+/)) {
				return `${randomInstance}/stream?url=${encodeURIComponent(url.href)}`
			}
			return `${randomInstance}`
		}
		case "twineo":
		case "safetwitch": {
			if (url.hostname.startsWith("clips.")) {
				return `${randomInstance}/clip${url.pathname}${url.search}`
			}
			return `${randomInstance}${url.pathname}${url.search}`
		}
		case "tekstoLibre": {
			return `${randomInstance}/?${url.pathname.slice(1)}`;
		}
		case "skyview": {
			if (url.pathname == '/') return randomInstance
			return `${randomInstance}?url=${encodeURIComponent(url.href)}`
		}
		case "priviblur": {
			if (url.hostname == "www.tumblr.com")
				return `${randomInstance}${url.pathname}${url.search}`

			if (url.hostname.startsWith("assets"))
				return `${randomInstance}/tblr/assets${url.pathname}${url.search}`

			if (url.hostname.startsWith("static"))
				return `${randomInstance}/tblr/static${url.pathname}${url.search}`

			const reg = /^([0-9]+)\.media\.tumblr\.com/.exec(url.hostname) // *.media.tumblr.com
			if (reg)
				return `${randomInstance}/tblr/media/${reg[1]}${url.pathname}${url.search}`

			const blogregex = /^(?:www\.)?([a-z\d-]+)\.tumblr\.com/.exec(url.hostname) // <blog>.tumblr.com
			if (blogregex) {
				const blog_name = blogregex[1];
				// Under the <blog>.tumblr.com domain posts are under a /post path
				if (url.pathname.startsWith("/post")) {
					return `${randomInstance}/${blog_name}${url.pathname.slice(5)}${url.search}`
				} else {
					return `${randomInstance}/${blog_name}${url.pathname}${url.search}`;
				}
			}
			return `${randomInstance}${url.pathname}${url.search}`;
		}
		default: {
			return `${randomInstance}${url.pathname}${url.search}`
		}
	}
}

/**
 * @param {URL} url
 * @param {string} type
 * @param {URL} initiator
 * @param {boolean} forceRedirection
 * @returns {string | undefined}
 */
function redirect(url, type, initiator, forceRedirection, incognito) {
	if (type != "main_frame" && type != "sub_frame" && type != "image") return
	let randomInstance
	let frontend
	if (!forceRedirection && options.redirectOnlyInIncognito == true && !incognito) return
	for (const service in config.services) {
		if (!forceRedirection && !options[service].enabled) continue

		frontend = options[service].frontend

		if (config.services[service].frontends[frontend].desktopApp && type != "main_frame" && options[service].redirectType != "main_frame")
			frontend = options[service].embedFrontend

		if (!regexArray(service, url, config, frontend)) {
			frontend = null
			continue
		}

		if (
			config.services[service].embeddable
			&&
			type != options[service].redirectType && options[service].redirectType != "both"
		) {
			if (options[service].unsupportedUrls == 'block') return 'CANCEL'
			return
		}

		let instanceList = options[frontend]
		if (instanceList === undefined) break
		if (instanceList.length === 0) return null

		if (initiator && instanceList.includes(initiator.origin)) {
			if (type != "main_frame") return null
			else return "BYPASSTAB"
		}

		randomInstance = utils.getRandomInstance(instanceList)
		if (config.services[service].frontends[frontend].localhost && options[service].instance == "localhost") {
			randomInstance = `http://${frontend}.localhost:8080`
		}
		break
	}
	if (!frontend) return

	return rewrite(url, frontend, randomInstance)
}

/**
 * @param {URL} url
 * @param {*} returnFrontend
 */
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

/**
 * @param {URL} url
 * @param {string} customService
 */
function switchInstance(url, customService) {
	return new Promise(async resolve => {
		let options = await utils.getOptions()
		let config = await utils.getConfig()

		const protocolHost = utils.protocolHost(url)
		if (customService) {
			const instancesList = options[options[customService].frontend]
			if (instancesList !== undefined) {
				const newInstance = utils.getNextInstance(url.origin, instancesList)
				if (newInstance) {
					resolve(`${newInstance}${url.pathname}${url.search}`)
					return
				}
			}
		} else {
			for (const service in config.services) {
				let instancesList = options[options[service].frontend]
				if (instancesList === undefined) continue
				if (!instancesList.includes(protocolHost)) continue

				instancesList.splice(instancesList.indexOf(protocolHost), 1)
				if (instancesList.length === 0) {
					resolve()
					return
				}
				const newInstance = utils.getNextInstance(url.origin, instancesList)
				if (newInstance) {
					resolve(`${newInstance}${url.pathname}${url.search}`)
					return
				}
			}
		}
		resolve()
	})
}

/**
 * @param {URL} url
 */
async function reverse(url) {
	let options = await utils.getOptions()
	let config = await utils.getConfig()
	let protocolHost = utils.protocolHost(url)
	for (const service in config.services) {
		let frontend = options[service].frontend
		if (options[frontend] == undefined) continue
		if (!options[frontend].includes(protocolHost) && protocolHost != `http://${frontend}.localhost:8080`) continue
		switch (service) {
			case "youtube":
			case "imdb":
			case "imgur":
			case "tiktok":
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
			case "tekstowo": {
				return `${config.services[service].url}/${url.search.slice(1)}`
			}
			default:
				return
		}
	}
	return
}

const defaultInstances = {
	'invidious': ['https://inv.vern.cc'],
	'viewtube': ['https://viewtube.io'],
	'piped': ['https://pipedapi-libre.kavin.rocks'],
	'pipedMaterial': ['https://piped-material.xn--17b.net'],
	'cloudtube': ['https://tube.cadence.moe'],
	'poketube': ['https://poketube.fun'],
	'proxiTok': ['https://proxitok.pabloferreiro.es'],
	'redlib': ['https://safereddit.com'],
	'libreddit': ['https://libreddit.spike.codes'],
	'teddit': ['https://teddit.net'],
	'scribe': ['https://scribe.rip'],
	'libMedium': ['https://md.vern.cc'],
	'quetre': ['https://quetre.iket.me'],
	'libremdb': ['https://libremdb.iket.me'],
	'simplyTranslate': ['https://simplytranslate.org'],
	'mozhi': ['https://mozhi.aryak.me'],
	'searxng': ['https://search.bus-hit.me'],
	'4get': ['https://4get.ca'],
	'rimgo': ['https://rimgo.vern.cc'],
	'hyperpipe': ['https://hyperpipe.surge.sh'],
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
	'unfunny': ['https://uf.vern.cc'],
	'soprano': ['https://sp.vern.cc'],
	'meme': ['https://mm.vern.cc'],
	'waybackClassic': ['https://wayback-classic.net'],
	'gothub': ['https://gh.odyssey346.dev'],
	'mikuInvidious': ['https://mikuinv.resrv.org'],
	"tent": ['https://tent.sny.sh'],
	"wolfreeAlpha": ['https://gqq.gitlab.io', 'https://uqq.gitlab.io'],
	"laboratory": ['https://lab.vern.cc'],
	'binternet': ['https://binternet.ahwx.org'],
	'pixivFe': ['https://pixivfe.exozy.me'],
	'indestructables': ['https://indestructables.private.coffee'],
	'destructables': ['https://ds.vern.cc'],
	'safetwitch': ['https://safetwitch.drgns.space'],
	'twineo': ['https://twineo.exozy.me'],
	'proxigram': ['https://proxigram.privacyfrontends.repl.co'],
	'tuboYoutube': ['https://tubo.migalmoreno.com'],
	'tuboSoundcloud': ['https://tubo.migalmoreno.com'],
	'tekstoLibre': ['https://davilarek.github.io/TekstoLibre'],
	'skyview': ['https://skyview.social'],
	'priviblur': ['https://pb.bloat.cat'],
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
			options.exceptions = {
				url: [],
				regex: [],
			}
			options.theme = "detect"
			options.popupServices = ["youtube", "tiktok", "imgur", "reddit", "quora", "translate", "maps"]
			options.fetchInstances = 'github'
			options.redirectOnlyInIncognito = false

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
		let frontends = []
		const config = await utils.getConfig()
		let options = await utils.getOptions()
		for (const service in config.services) {
			if (!options[service]) options[service] = {}

			if (!(options[service].frontend in config.services[service].frontends)) {
				options[service] = config.services[service].options // Reset settings for service
				delete options[options[service].frontend] // Remove deprecated frontend
			}

			for (const defaultOption in config.services[service].options) {
				if (!(defaultOption in options[service])) {
					options[service][defaultOption] = config.services[service].options[defaultOption]
				}
			}

			for (const frontend in config.services[service].frontends) {
				frontends.push(frontend)
				if (!(frontend in options) && config.services[service].frontends[frontend].instanceList) {
					options[frontend] = defaultInstances[frontend] || []
				}
			}

			for (const frontend of options.popupServices) {
				if (!Object.keys(config.services).includes(frontend)) {
					const i = options.popupServices.indexOf(frontend);
					if (i > -1) options.popupServices.splice(i, 1);
				}
			}
		}
		const general = ['theme', 'popupServices', 'fetchInstances', 'redirectOnlyInIncognito']
		const combined = [
			...Object.keys(config.services),
			...frontends,
			...general,
			'exceptions',
			'popupServices',
			'version',
		]
		for (const key in options) {
			if (combined.indexOf(key) < 0) {
				delete options[key] // Remove any unknown settings in options
			}
		}
		browser.storage.local.set({ options }, () => {
			resolve()
		})
	})
}

/**
 * @param {URL} url
 * @param {boolean} test
 */
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

/**
 * @param {URL} url
 */
function isException(url) {
	if (!options.exceptions) return false
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

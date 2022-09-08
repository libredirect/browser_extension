window.browser = window.browser || window.chrome

import utils from "./utils.js"

let config

function getConfig() {
	return new Promise(async resolve => {
		fetch("/config/config.json")
			.then(response => response.text())
			.then(data => {
				config = JSON.parse(data)
			})
		resolve()
	})
}

let redirects = {}
let disabled, curNetwork, networkFallback, redirectType

function init() {
	return new Promise(async resolve => {
		browser.storage.local.get(["network", "networkFallback"], r => {
			curNetwork = r.network
			networkFallback = r.networkFallback
		})
		//cur = current
		getConfig()
		for (service in config.services) {
			redirects = {}
			browser.storage.local.get([`disable${camelCase(service)}`, `${service}Redirects`, `${service}RedirectType,`, `${service}Frontend`], r => {
				disabled = r["disable" + camelCase(service)]
				redirects = r[service + "Redirects"]
				frontend = r[service + "Frontend"]
			})
			for (frontend in config[service].frontends) {
				redirects[frontend] = {}
				for (network in config.networks) {
					browser.storage.local.get([`${frontend}${camelCase(network)}RedirectsChecks`, `${frontend}${camelCase(network)}CustomRedirects`], r => {
						redirects[frontend][network] = [...r[frontend + camelCase(network) + "RedirectsChecks"], ...r[frontend + camelCase(network) + "CustomRedirects"]]
					})
				}
			}
		}
		resolve()
	})
}

init()
browser.storage.onChanged.addListener(init)

function redirect(url, type, initiator) {
	let randomInstance, frontend
	if (url.pathname == "/") return
	for (service in config.services) {
		if (disabled && !disableOverride) continue
		if (initiator && (all().includes(initiator.origin) || targets.includes(initiator.host))) continue
		//if (!targets.some(rx => rx.test(url.href))) continue
		if (!target.test(url)) continue
		if (type != redirectType && type != "both") continue
		browser.storage.local.get(`${service}Frontend`, (frontend = r[service + "Frontend"]))
		let instanceList = redirects[frontend][curNetwork]
		if (instanceList.length === 0 && networkFallback) instanceList = redirects[frontend].clearnet
		if (instanceList.length === 0 && redirects.indexOf(frontend) != -1) return
		randomInstance = utils.getRandomInstance(instanceList)
	}
	switch (frontend) {
		// This is where all instance-specific code must be ran to convert the service url to one that can be understood by the frontend.
		case "beatbump":
			return `${randomInstance}${url.pathname}${url.search}`
				.replace("/watch?v=", "/listen?id=")
				.replace("/channel/", "/artist/")
				.replace("/playlist?list=", "/playlist/VL")
				.replace(/\/search\?q=.*/, searchQuery => searchQuery.replace("?q=", "/") + "?filter=song")
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
			return `${randomInstance}/search.php${encodeURIComponent(url.searchParams.get("q"))}`
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
		default:
			return `${randomInstance}${url.pathname}${url.search}`
	} // TODO: Wikiless, All youtube frontends by changing regex, lingva
}

function initDefaults() {
	return new Promise(resolve => {
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(data => {
				let dataJson = JSON.parse(data)
				redirects = dataJson
				browser.storage.local.get(["cloudflareBlackList", "authenticateBlackList", "offlineBlackList"], async r => {
					for (service in config.services) {
						for (defaultOption in service.defaults) {
							browser.storage.local.set({
								[defaultOption]: defaultOption.value,
							})
						}
						for (frontend in service.frontends) {
							for (const instance of [...r.cloudflareBlackList, ...r.authenticateBlackList, ...r.offlineBlackList]) {
								let i = redirects[frontend]["clearnet"].indexOf(instance)
								if (i > -1) redirects[frontend]["clearnet"].splice(i, 1)
							}
							for (network in config.networks) {
								browser.storage.local.set({
									[frontend + camelCase(network) + "RedirectsChecks"]: [...redirects[frontend][network]],
									[frontend + camelCase(network) + "CustomRedirects"]: [],
								})
							}
						}
					}
					;() => resolve()
				})
			})
	})
}

export default {
	redirect,
	initDefaults,
}

window.browser = window.browser || window.chrome

import utils from "./utils.js"

const targets = [/^https?:\/{2}search\.libredirect\.invalid/]
// Ill optimise all of assets/javascripts at a later date. For now, I'll just add librex and optimse options javascript
const frontends = new Array("searx", "searxng", "whoogle", "librex")
const protocols = new Array("normal", "tor", "i2p", "loki")

const redirects = {}

for (let i = 0; i < frontends.length; i++) {
	redirects[frontends[i]] = {}
	for (let x = 0; x < protocols.length; x++) {
		redirects[frontends[i]][protocols[x]] = []
	}
}

function setRedirects(val) {
	browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], r => {
		redirects = val
		searxNormalRedirectsChecks = [...redirects.searx.normal]
		searxngNormalRedirectsChecks = [...redirects.searxng.normal]
		whoogleNormalRedirectsChecks = [...redirects.whoogle.normal]
		librexNormalRedirectsChecks = [...redirects.librex.normal]
		for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
			const a = searxNormalRedirectsChecks.indexOf(instance)
			if (a > -1) searxNormalRedirectsChecks.splice(a, 1)

			const b = searxngNormalRedirectsChecks.indexOf(instance)
			if (b > -1) searxngNormalRedirectsChecks.splice(b, 1)

			const c = whoogleNormalRedirectsChecks.indexOf(instance)
			if (c > -1) whoogleNormalRedirectsChecks.splice(c, 1)

			const d = librexNormalRedirectsChecks.indexOf(instance)
			if (d > -1) librexNormalRedirectsChecks.splice(d, 1)
		}
		browser.storage.local.set({
			searchRedirects: redirects,
			searxNormalRedirectsChecks,
			searxTorRedirectsChecks: [...redirects.searx.tor],
			searxI2pRedirectsChecks: [...redirects.searx.i2p],
			searxLokiRedirectsChecks: [...redirects.searx.loki],
			searxngNormalRedirectsChecks,
			searxngTorRedirectsChecks: [...redirects.searxng.tor],
			searxngI2pRedirectsChecks: [...redirects.searxng.i2p],
			searxngLokiRedirectsChecks: [...redirects.searxng.loki],
			whoogleNormalRedirectsChecks,
			whoogleTorRedirectsChecks: [...redirects.whoogle.tor],
			whoogleI2pRedirectsChecks: [...redirects.whoogle.i2p],
			whoogleLokiRedirectsChecks: [...redirects.whoogle.loki],
			librexNormalRedirectsChecks,
			librexTorRedirectsChecks: [...redirects.librex.tor],
			librexI2pRedirectsChecks: [...redirects.librex.i2p],
			librexLokiRedirectsChecks: [...redirects.librex.loki],
		})
	})
}

let disableSearch,
	searchFrontend,
	searchRedirects,
	protocol,
	protocolFallback,
	whoogleNormalRedirectsChecks,
	whoogleNormalCustomRedirects,
	whoogleTorRedirectsChecks,
	whoogleTorCustomRedirects,
	whoogleI2pRedirectsChecks,
	whoogleI2pCustomRedirects,
	whoogleLokiCustomRedirects,
	searxNormalRedirectsChecks,
	searxNormalCustomRedirects,
	searxTorRedirectsChecks,
	searxTorCustomRedirects,
	searxI2pRedirectsChecks,
	searxI2pCustomRedirects,
	searxLokiCustomRedirects,
	searxngNormalRedirectsChecks,
	searxngNormalCustomRedirects,
	searxngTorRedirectsChecks,
	searxngTorCustomRedirects,
	searxngI2pRedirectsChecks,
	searxngI2pCustomRedirects,
	searxngLokiCustomRedirects,
	librexNormalRedirectsChecks,
	librexNormalCustomRedirects,
	librexTorRedirectsChecks,
	librexTorCustomRedirects,
	librexI2pRedirectsChecks,
	librexI2pCustomRedirects,
	librexLokiCustomRedirects

function init() {
	return new Promise(async resolve => {
		browser.storage.local.get(
			[
				"disableSearch",
				"searchFrontend",
				"searchRedirects",
				"protocol",
				"protocolFallback",
				"whoogleNormalRedirectsChecks",
				"whoogleNormalCustomRedirects",
				"whoogleTorRedirectsChecks",
				"whoogleTorCustomRedirects",
				"whoogleI2pRedirectsChecks",
				"whoogleI2pCustomRedirects",
				"whoogleLokiCustomRedirects",
				"searxNormalRedirectsChecks",
				"searxNormalCustomRedirects",
				"searxTorRedirectsChecks",
				"searxTorCustomRedirects",
				"searxI2pRedirectsChecks",
				"searxI2pCustomRedirects",
				"searxLokiCustomRedirects",
				"searxngNormalRedirectsChecks",
				"searxngNormalCustomRedirects",
				"searxngTorRedirectsChecks",
				"searxngTorCustomRedirects",
				"searxngI2pRedirectsChecks",
				"searxngI2pCustomRedirects",
				"searxngLokiCustomRedirects",
				"librexNormalRedirectsChecks",
				"librexNormalCustomRedirects",
				"librexTorRedirectsChecks",
				"librexTorCustomRedirects",
				"librexI2pRedirectsChecks",
				"librexI2pCustomRedirects",
				"librexLokiCustomRedirects",
			],
			r => {
				disableSearch = r.disableSearch
				searchFrontend = r.searchFrontend
				searchRedirects = r.searchRedirects
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				whoogleNormalRedirectsChecks = r.whoogleNormalRedirectsChecks
				whoogleNormalCustomRedirects = r.whoogleNormalCustomRedirects
				whoogleTorRedirectsChecks = r.whoogleTorRedirectsChecks
				whoogleTorCustomRedirects = r.whoogleTorCustomRedirects
				whoogleI2pRedirectsChecks = r.whoogleI2pRedirectsChecks
				whoogleI2pCustomRedirects = r.whoogleI2pCustomRedirects
				whoogleLokiCustomRedirects = r.whoogleLokiCustomRedirects
				searxNormalRedirectsChecks = r.searxNormalRedirectsChecks
				searxNormalCustomRedirects = r.searxNormalCustomRedirects
				searxTorRedirectsChecks = r.searxTorRedirectsChecks
				searxTorCustomRedirects = r.searxTorCustomRedirects
				searxI2pRedirectsChecks = r.searxI2pRedirectsChecks
				searxI2pCustomRedirects = r.searxI2pCustomRedirects
				searxLokiCustomRedirects = r.searxLokiCustomRedirects
				searxngNormalRedirectsChecks = r.searxngNormalRedirectsChecks
				searxngNormalCustomRedirects = r.searxngNormalCustomRedirects
				searxngTorRedirectsChecks = r.searxngTorRedirectsChecks
				searxngTorCustomRedirects = r.searxngTorCustomRedirects
				searxngI2pRedirectsChecks = r.searxngI2pRedirectsChecks
				searxngI2pCustomRedirects = r.searxngI2pCustomRedirects
				searxngLokiCustomRedirects = r.searxngLokiCustomRedirects
				librexNormalRedirectsChecks = r.librexNormalRedirectsChecks
				librexNormalCustomRedirects = r.librexNormalCustomRedirects
				librexTorRedirectsChecks = r.librexTorRedirectsChecks
				librexTorCustomRedirects = r.librexTorCustomRedirects
				librexI2pRedirectsChecks = r.librexI2pRedirectsChecks
				librexI2pCustomRedirects = r.librexI2pCustomRedirects
				librexLokiCustomRedirects = r.librexLokiCustomRedirects
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function initSearxCookies(test, from) {
	return new Promise(async resolve => {
		await init()
		let protocolHost = utils.protocolHost(from)
		if (
			![
				...searxNormalRedirectsChecks,
				...searxNormalCustomRedirects,
				...searxTorRedirectsChecks,
				...searxTorCustomRedirects,
				...searxI2pRedirectsChecks,
				...searxI2pCustomRedirects,
				...searxLokiCustomRedirects,
			].includes(protocolHost)
		) {
			resolve()
			return
		}

		if (!test) {
			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...searxLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...searxI2pCustomRedirects, ...searxI2pRedirectsChecks]
			else if (protocol == "tor") checkedInstances = [...searxTorRedirectsChecks, ...searxTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects]
			}
			await utils.copyCookie("searx", from, checkedInstances, "advanced_search")
			await utils.copyCookie("searx", from, checkedInstances, "autocomplete")
			await utils.copyCookie("searx", from, checkedInstances, "categories")
			await utils.copyCookie("searx", from, checkedInstances, "disabled_engines")
			await utils.copyCookie("searx", from, checkedInstances, "disabled_plugins")
			await utils.copyCookie("searx", from, checkedInstances, "doi_resolver")
			await utils.copyCookie("searx", from, checkedInstances, "enabled_engines")
			await utils.copyCookie("searx", from, checkedInstances, "enabled_plugins")
			await utils.copyCookie("searx", from, checkedInstances, "image_proxy")
			await utils.copyCookie("searx", from, checkedInstances, "language")
			await utils.copyCookie("searx", from, checkedInstances, "locale")
			await utils.copyCookie("searx", from, checkedInstances, "method")
			await utils.copyCookie("searx", from, checkedInstances, "oscar-style")
			await utils.copyCookie("searx", from, checkedInstances, "results_on_new_tab")
			await utils.copyCookie("searx", from, checkedInstances, "safesearch")
			await utils.copyCookie("searx", from, checkedInstances, "theme")
			await utils.copyCookie("searx", from, checkedInstances, "tokens")
		}
		resolve(true)
	})
}

function initSearxngCookies(test, from) {
	return new Promise(async resolve => {
		await init()
		let protocolHost = utils.protocolHost(from)
		if (
			![
				...searxngNormalRedirectsChecks,
				...searxngNormalCustomRedirects,
				...searxngTorRedirectsChecks,
				...searxngTorCustomRedirects,
				...searxngI2pRedirectsChecks,
				...searxngI2pCustomRedirects,
				...searxngLokiCustomRedirects,
			].includes(protocolHost)
		) {
			resolve()
			return
		}

		if (!test) {
			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...searxngLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...searxngI2pCustomRedirects, ...searxngI2pRedirectsChecks]
			else if (protocol == "tor") checkedInstances = [...searxngTorRedirectsChecks, ...searxngTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...searxngNormalRedirectsChecks, ...searxngNormalCustomRedirects]
			}
			await utils.copyCookie("searxng", from, checkedInstances, "autocomplete")
			await utils.copyCookie("searxng", from, checkedInstances, "categories")
			await utils.copyCookie("searxng", from, checkedInstances, "disabled_engines")
			await utils.copyCookie("searxng", from, checkedInstances, "disabled_plugins")
			await utils.copyCookie("searxng", from, checkedInstances, "doi_resolver")
			await utils.copyCookie("searxng", from, checkedInstances, "enabled_plugins")
			await utils.copyCookie("searxng", from, checkedInstances, "enabled_engines")
			await utils.copyCookie("searxng", from, checkedInstances, "image_proxy")
			await utils.copyCookie("searxng", from, checkedInstances, "infinite_scroll")
			await utils.copyCookie("searxng", from, checkedInstances, "language")
			await utils.copyCookie("searxng", from, checkedInstances, "locale")
			await utils.copyCookie("searxng", from, checkedInstances, "maintab")
			await utils.copyCookie("searxng", from, checkedInstances, "method")
			await utils.copyCookie("searxng", from, checkedInstances, "query_in_title")
			await utils.copyCookie("searxng", from, checkedInstances, "results_on_new_tab")
			await utils.copyCookie("searxng", from, checkedInstances, "safesearch")
			await utils.copyCookie("searxng", from, checkedInstances, "simple_style")
			await utils.copyCookie("searxng", from, checkedInstances, "theme")
			await utils.copyCookie("searxng", from, checkedInstances, "tokens")
		}
		resolve(true)
	})
}

function initLibrexCookies(test, from) {
	return new Promise(async resolve => {
		await init()
		let protocolHost = utils.protocolHost(from)
		if (
			![
				...librexNormalRedirectsChecks,
				...librexNormalCustomRedirects,
				...librexTorRedirectsChecks,
				...librexTorCustomRedirects,
				...librexI2pRedirectsChecks,
				...librexI2pCustomRedirects,
				...librexLokiCustomRedirects,
			].includes(protocolHost)
		) {
			resolve()
			return
		}

		if (!test) {
			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...librexLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...librexI2pCustomRedirects, ...librexI2pRedirectsChecks]
			else if (protocol == "tor") checkedInstances = [...librexTorRedirectsChecks, ...librexTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...librexNormalRedirectsChecks, ...librexNormalCustomRedirects]
			}
			await utils.copyCookie("librex", from, checkedInstances, "bibliogram")
			await utils.copyCookie("librex", from, checkedInstances, "disable_special")
			await utils.copyCookie("librex", from, checkedInstances, "invidious")
			await utils.copyCookie("librex", from, checkedInstances, "libreddit")
			await utils.copyCookie("librex", from, checkedInstances, "nitter")
			await utils.copyCookie("librex", from, checkedInstances, "proxitok")
			await utils.copyCookie("librex", from, checkedInstances, "theme")
			await utils.copyCookie("librex", from, checkedInstances, "wikiless")
		}
		resolve(true)
	})
}

function redirect(url, disableOverride) {
	if (disableSearch && !disableOverride) return
	if (!targets.some(rx => rx.test(url.href))) return
	if (url.searchParams.has("tbm")) return
	if (url.hostname.includes("google") && !url.searchParams.has("q") && url.pathname != "/") return
	let randomInstance
	let path
	if (searchFrontend == "searx") {
		let instancesList = []
		if (protocol == "loki") instancesList = [...searxLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...searxI2pCustomRedirects, ...searxI2pRedirectsChecks]
		else if (protocol == "tor") instancesList = [...searxTorRedirectsChecks, ...searxTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects]
		}
		if (instancesList.length === 0) {
			return
		}

		randomInstance = utils.getRandomInstance(instancesList)
		path = "/"
	} else if (searchFrontend == "searxng") {
		let instancesList = []
		if (protocol == "loki") instancesList = [...searxngLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...searxngI2pCustomRedirects, ...searxngI2pRedirectsChecks]
		else if (protocol == "tor") instancesList = [...searxngTorRedirectsChecks, ...searxngTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...searxngNormalRedirectsChecks, ...searxngNormalCustomRedirects]
		}
		if (instancesList.length === 0) {
			return
		}

		randomInstance = utils.getRandomInstance(instancesList)
		path = "/"
	} else if (searchFrontend == "whoogle") {
		let instancesList = []
		if (protocol == "loki") instancesList = [...whoogleLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...whoogleI2pCustomRedirects, ...whoogleI2pRedirectsChecks]
		else if (protocol == "tor") instancesList = [...whoogleTorRedirectsChecks, ...whoogleTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...whoogleNormalRedirectsChecks, ...whoogleNormalCustomRedirects]
		}
		if (instancesList.length === 0) {
			return
		}

		randomInstance = utils.getRandomInstance(instancesList)
		path = "/search"
	} else if (searchFrontend == "librex") {
		let instancesList = []
		if (protocol == "loki") instancesList = [...librexLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...librexI2pCustomRedirects, ...librexI2pRedirectsChecks]
		else if (protocol == "tor") instancesList = [...librexTorRedirectsChecks, ...librexTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...librexNormalRedirectsChecks, ...librexNormalCustomRedirects]
		}
		if (instancesList.length === 0) {
			return
		}

		randomInstance = utils.getRandomInstance(instancesList)
		path = "/search.php"
	}

	if (((url.hostname.includes("google") || url.hostname.includes("bing")) && !url.searchParams.has("q")) || (url.hostname.includes("yandex") && !url.searchParams.has("text"))) path = "/"

	let searchQuery = ""
	if ((url.hostname.includes("google") || url.hostname.includes("bing") || url.hostname.includes("search.libredirect.invalid")) && url.searchParams.has("q"))
		searchQuery = `?q=${encodeURIComponent(url.searchParams.get("q"))}`
	if (url.hostname.includes("yandex") && url.searchParams.has("text")) searchQuery = `?q=${url.searchParams.get("text")}`

	return `${randomInstance}${path}${searchQuery}`
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableSearch && !disableOverride) {
			resolve()
			return
		}
		let protocolHost = utils.protocolHost(url)
		if (
			![
				...searchRedirects.searx.normal,
				...searchRedirects.searx.tor,
				...searchRedirects.searx.i2p,

				...searchRedirects.searxng.normal,
				...searchRedirects.searxng.tor,
				...searchRedirects.searxng.i2p,

				...searchRedirects.whoogle.normal,
				...searchRedirects.whoogle.tor,
				...searchRedirects.whoogle.i2p,

				...searchRedirects.librex.normal,
				...searchRedirects.librex.tor,
				...searchRedirects.librex.i2p,

				...searxNormalCustomRedirects,
				...searxTorCustomRedirects,
				...searxI2pCustomRedirects,
				...searxLokiCustomRedirects,

				...searxngNormalCustomRedirects,
				...searxngTorCustomRedirects,
				...searxngI2pCustomRedirects,
				...searxngLokiCustomRedirects,

				...whoogleNormalCustomRedirects,
				...whoogleTorCustomRedirects,
				...whoogleI2pCustomRedirects,
				...whoogleLokiCustomRedirects,

				...librexNormalCustomRedirects,
				...librexTorCustomRedirects,
				...librexI2pCustomRedirects,
				...librexLokiCustomRedirects,
			].includes(protocolHost)
		) {
			resolve()
			return
		}

		let instancesList = []

		if (protocol == "loki") {
			if (searchFrontend == "searx") instancesList = [...searxLokiCustomRedirects]
			else if (searchFrontend == "searxng") instancesList = [...searxngLokiCustomRedirects]
			else if (searchFrontend == "whoogle") instancesList = [...whoogleLokiCustomRedirects]
			else if (searchFrontend == "librex") instancesList = [...librexLokiCustomRedirects]
		} else if (protocol == "tor") {
			if (searchFrontend == "searx") instancesList = [...searxTorRedirectsChecks, ...searxTorCustomRedirects]
			else if (searchFrontend == "searxng") instancesList = [...searxngTorRedirectsChecks, ...searxngTorCustomRedirects]
			else if (searchFrontend == "whoogle") instancesList = [...whoogleTorRedirectsChecks, ...whoogleTorCustomRedirects]
			else if (searchFrontend == "librex") instancesList = [...librexTorRedirectsChecks, ...librexTorCustomRedirects]
		} else if (protocol == "i2p") {
			if (searchFrontend == "searx") instancesList = [...searxI2pRedirectsChecks, ...searxI2pCustomRedirects]
			else if (searchFrontend == "searxng") instancesList = [...searxngI2pRedirectsChecks, ...searxngI2pCustomRedirects]
			else if (searchFrontend == "whoogle") instancesList = [...whoogleI2pRedirectsChecks, ...whoogleI2pCustomRedirects]
			else if (searchFrontend == "librex") instancesList = [...librexI2pRedirectsChecks, ...librexI2pCustomRedirects]
		}
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			if (searchFrontend == "searx") instancesList = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects]
			else if (searchFrontend == "searxng") instancesList = [...searxngNormalRedirectsChecks, ...searxngNormalCustomRedirects]
			else if (searchFrontend == "whoogle") instancesList = [...whoogleNormalRedirectsChecks, ...whoogleNormalCustomRedirects]
			else if (searchFrontend == "librex") instancesList = [...librexNormalRedirectsChecks, ...librexNormalCustomRedirects]
		}
		const i = instancesList.indexOf(protocolHost)
		if (i > -1) instancesList.splice(i, 1)
		if (instancesList.length === 0) {
			resolve()
			return
		}

		const randomInstance = utils.getRandomInstance(instancesList)
		resolve(`${randomInstance}${url.pathname}${url.search}`)
	})
}

function initDefaults() {
	return new Promise(async resolve => {
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(async data => {
				let dataJson = JSON.parse(data)
				for (let i = 0; i < frontends.length; i++) {
					redirects[frontends[i]] = dataJson[frontends[i]]
				}

				browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], async r => {
					searxNormalRedirectsChecks = [...redirects.searx.normal]
					searxngNormalRedirectsChecks = [...redirects.searxng.normal]
					whoogleNormalRedirectsChecks = [...redirects.whoogle.normal]
					librexNormalRedirectsChecks = [...redirects.librex.normal]
					for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
						const a = searxNormalRedirectsChecks.indexOf(instance)
						if (a > -1) searxNormalRedirectsChecks.splice(a, 1)

						const b = searxngNormalRedirectsChecks.indexOf(instance)
						if (b > -1) searxngNormalRedirectsChecks.splice(b, 1)

						const c = whoogleNormalRedirectsChecks.indexOf(instance)
						if (c > -1) whoogleNormalRedirectsChecks.splice(c, 1)

						const d = librexNormalRedirectsChecks.indexOf(instance)
						if (d > -1) librexNormalRedirectsChecks.splice(d, 1)
					}
					browser.storage.local.set(
						{
							disableSearch: false,
							searchFrontend: "searxng",
							searchRedirects: redirects,
							searxngCustomSettings: false,

							whoogleNormalRedirectsChecks,
							whoogleNormalCustomRedirects: [],

							whoogleTorRedirectsChecks: [...redirects.whoogle.tor],
							whoogleTorCustomRedirects: [],

							whoogleI2pRedirectsChecks: [...redirects.whoogle.i2p],
							whoogleI2pCustomRedirects: [],

							whoogleLokiRedirectsChecks: [...redirects.whoogle.loki],
							whoogleLokiCustomRedirects: [],

							searxNormalRedirectsChecks,
							searxNormalCustomRedirects: [],

							searxTorRedirectsChecks: [...redirects.searx.tor],
							searxTorCustomRedirects: [],

							searxI2pRedirectsChecks: [...redirects.searx.i2p],
							searxI2pCustomRedirects: [],

							searxLokiRedirectsChecks: [...redirects.searx.loki],
							searxLokiCustomRedirects: [],

							searxngNormalRedirectsChecks,
							searxngNormalCustomRedirects: [],

							searxngTorRedirectsChecks: [...redirects.searxng.tor],
							searxngTorCustomRedirects: [],

							searxngI2pRedirectsChecks: [...redirects.searxng.i2p],
							searxngI2pCustomRedirects: [],

							searxngLokiRedirectsChecks: [...redirects.searxng.loki],
							searxngLokiCustomRedirects: [],

							librexNormalRedirectsChecks,
							librexNormalCustomRedirects: [],

							librexTorRedirectsChecks: [...redirects.librex.tor],
							librexTorCustomRedirects: [],

							librexI2pRedirectsChecks: [...redirects.librex.i2p],
							librexI2pCustomRedirects: [],

							librexLokiRedirectsChecks: [...redirects.librex.loki],
							librexLokiCustomRedirects: [],
						},
						() => resolve()
					)
				})
			})
	})
}

export default {
	setRedirects,
	initSearxCookies,
	initSearxngCookies,
	initLibrexCookies,
	redirect,
	initDefaults,
	switchInstance,
}

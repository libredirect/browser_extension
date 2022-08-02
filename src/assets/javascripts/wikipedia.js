window.browser = window.browser || window.chrome

import utils from "./utils.js"

const targets = /^https?:\/{2}([a-z]+\.)*wikipedia\.org/

const frontends = new Array("wikiless")
const protocols = new Array("normal", "tor", "i2p", "loki")

let redirects = {}

for (let i = 0; i < frontends.length; i++) {
	redirects[frontends[i]] = {}
	for (let x = 0; x < protocols.length; x++) {
		redirects[frontends[i]][protocols[x]] = []
	}
}

function setRedirects(val) {
	browser.storage.local.get("cloudflareBlackList", r => {
		redirects.wikiless = val
		wikilessNormalRedirectsChecks = [...redirects.wikiless.normal]
		for (const instance of r.cloudflareBlackList) {
			const a = wikilessNormalRedirectsChecks.indexOf(instance)
			if (a > -1) wikilessNormalRedirectsChecks.splice(a, 1)
		}
		browser.storage.local.set({
			wikipediaRedirects: redirects,
			wikilessNormalRedirectsChecks,
		})
	})
}

let disableWikipedia,
	wikipediaRedirects,
	protocol,
	protocolFallback,
	wikilessNormalRedirectsChecks,
	wikilessTorRedirectsChecks,
	wikilessI2pRedirectsChecks,
	wikilessNormalCustomRedirects,
	wikilessTorCustomRedirects,
	wikilessI2pCustomRedirects,
	wikilessLokiCustomRedirects

function init() {
	return new Promise(async resolve => {
		browser.storage.local.get(
			[
				"disableWikipedia",
				"wikipediaRedirects",
				"protocol",
				"protocolFallback",
				"wikilessNormalRedirectsChecks",
				"wikilessTorRedirectsChecks",
				"wikilessI2pRedirectsChecks",
				"wikilessNormalCustomRedirects",
				"wikilessTorCustomRedirects",
				"wikilessI2pCustomRedirects",
				"wikilessLokiCustomRedirects",
			],
			r => {
				disableWikipedia = r.disableWikipedia
				wikipediaRedirects = r.wikipediaRedirects
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				wikilessNormalRedirectsChecks = r.wikilessNormalRedirectsChecks
				wikilessTorRedirectsChecks = r.wikilessTorRedirectsChecks
				wikilessI2pRedirectsChecks = r.wikilessI2pRedirectsChecks
				wikilessNormalCustomRedirects = r.wikilessNormalCustomRedirects
				wikilessTorCustomRedirects = r.wikilessTorCustomRedirects
				wikilessI2pCustomRedirects = r.wikilessI2pCustomRedirects
				wikilessLokiCustomRedirects = r.wikilessLokiCustomRedirects
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function initWikilessCookies(test, from) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(from)
		const all = [
			...wikilessNormalRedirectsChecks,
			...wikilessNormalCustomRedirects,
			...wikilessTorRedirectsChecks,
			...wikilessTorCustomRedirects,
			...wikilessI2pRedirectsChecks,
			...wikilessI2pCustomRedirects,
			...wikilessLokiCustomRedirects,
		]
		if (!all.includes(protocolHost)) {
			resolve()
			return
		}

		if (!test) {
			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...wikilessLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...wikilessI2pCustomRedirects, ...wikilessI2pRedirectsChecks]
			else if (protocol == "tor") checkedInstances = [...wikilessTorRedirectsChecks, ...wikilessTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...wikilessNormalRedirectsChecks, ...wikilessNormalCustomRedirects]
			}
			await utils.copyCookie("wikiless", from, checkedInstances, "theme")
			await utils.copyCookie("wikiless", from, checkedInstances, "default_lang")
		}
		resolve(true)
	})
}

function redirect(url, disableOverride) {
	if (disableWikipedia && !disableOverride) return
	if (!targets.test(url.href)) return

	let GETArguments = []
	if (url.search.length > 0) {
		let search = url.search.substring(1) //get rid of '?'
		let argstrings = search.split("&")
		for (let i = 0; i < argstrings.length; i++) {
			let args = argstrings[i].split("=")
			GETArguments.push([args[0], args[1]])
		}
	}
	let instancesList = []
	if (protocol == "loki") instancesList = [...wikilessLokiCustomRedirects]
	else if (protocol == "i2p") instancesList = [...wikilessI2pCustomRedirects, ...wikilessI2pRedirectsChecks]
	else if (protocol == "tor") instancesList = [...wikilessTorRedirectsChecks, ...wikilessTorCustomRedirects]
	if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
		instancesList = [...wikilessNormalRedirectsChecks, ...wikilessNormalCustomRedirects]
	}
	if (instancesList.length === 0) return
	const randomInstance = utils.getRandomInstance(instancesList)

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
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableWikipedia && !disableOverride) {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		const wikipediaList = [
			...wikipediaRedirects.wikiless.normal,
			...wikipediaRedirects.wikiless.tor,
			...wikipediaRedirects.wikiless.i2p,

			...wikilessNormalCustomRedirects,
			...wikilessTorCustomRedirects,
			...wikilessI2pCustomRedirects,
			...wikilessLokiCustomRedirects,
		]
		if (!wikipediaList.includes(protocolHost)) {
			resolve()
			return
		}

		let instancesList = []
		if (protocol == "loki") instancesList = [...wikilessLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...wikilessI2pCustomRedirects, ...wikilessI2pRedirectsChecks]
		else if (protocol == "tor") instancesList = [...wikilessTorRedirectsChecks, ...wikilessTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...wikilessNormalRedirectsChecks, ...wikilessNormalCustomRedirects]
		}

		let index = instancesList.indexOf(protocolHost)
		if (index > -1) instancesList.splice(index, 1)
		if (instancesList.length === 0) {
			resolve()
			return
		}

		const randomInstance = utils.getRandomInstance(instancesList)
		resolve(`${randomInstance}${url.pathname}${url.search}`)
	})
}

function initDefaults() {
	return new Promise(resolve => {
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(async data => {
				let dataJson = JSON.parse(data)
				for (let i = 0; i < frontends.length; i++) {
					redirects[frontends[i]] = dataJson[frontends[i]]
				}
				browser.storage.local.get("cloudflareBlackList", async r => {
					wikilessNormalRedirectsChecks = [...redirects.wikiless.normal]
					for (const instance of r.cloudflareBlackList) {
						let i = wikilessNormalRedirectsChecks.indexOf(instance)
						if (i > -1) wikilessNormalRedirectsChecks.splice(i, 1)
					}
					browser.storage.local.set(
						{
							disableWikipedia: true,
							wikipediaRedirects: redirects,

							wikilessNormalRedirectsChecks: wikilessNormalRedirectsChecks,
							wikilessNormalCustomRedirects: [],

							wikilessTorRedirectsChecks: [...redirects.wikiless.tor],
							wikilessTorCustomRedirects: [],

							wikilessI2pRedirectsChecks: [...redirects.wikiless.i2p],
							wikilessI2pCustomRedirects: [],

							wikilessLokiRedirectsChecks: [...redirects.wikiless.loki],
							wikilessLokiCustomRedirects: [],
						},
						() => resolve()
					)
				})
			})
	})
}

export default {
	setRedirects,
	initWikilessCookies,
	redirect,
	initDefaults,
	switchInstance,
}

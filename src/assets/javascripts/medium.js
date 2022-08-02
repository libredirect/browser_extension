window.browser = window.browser || window.chrome
import utils from "./utils.js"

const targets = [
	// /(?:.*\.)*(?<!(link\.|cdn\-images\-\d+\.))medium\.com(\/.*)?$/,
	/^medium\.com/,
	/.*\.medium\.com/,
	// // Other domains of medium blogs, source(s): https://findingtom.com/best-medium-blogs-to-follow/#1-forge

	/^towardsdatascience\.com/,
	/^uxdesign\.cc/,
	/^uxplanet\.org/,
	/^betterprogramming\.pub/,
	/^aninjusticemag\.com/,
	/^betterhumans\.pub/,
	/^psiloveyou\.xyz/,
	/^entrepreneurshandbook\.co/,
	/^blog\.coinbase\.com/,

	/^ levelup\.gitconnected\.com /,
	/^javascript\.plainenglish\.io /,
	/^blog\.bitsrc\.io /,
	/^ itnext\.io /,
	/^codeburst\.io /,
	/^infosecwriteups\.com /,
	/^ blog\.devgenius.io /,
	/^ writingcooperative\.com /,
]

const frontends = new Array("scribe")
const protocols = new Array("normal", "tor", "i2p", "loki")

let redirects = {}

for (let i = 0; i < frontends.length; i++) {
	redirects[frontends[i]] = {}
	for (let x = 0; x < protocols.length; x++) {
		redirects[frontends[i]][protocols[x]] = []
	}
}

function setRedirects(val) {
	browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], r => {
		redirects.scribe = val
		scribeNormalRedirectsChecks = [...redirects.scribe.normal]
		for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
			const a = scribeNormalRedirectsChecks.indexOf(instance)
			if (a > -1) scribeNormalRedirectsChecks.splice(a, 1)
		}
		browser.storage.local.set({
			mediumRedirects: redirects,
			scribeNormalRedirectsChecks,
			scribeTorRedirectsChecks: [...redirects.scribe.tor],
			scribeI2pRedirectsChecks: [...redirects.scribe.i2p],
			scribeLokiRedirectsChecks: [...redirects.scribe.loki],
		})
	})
}

let disableMedium,
	mediumRedirects,
	scribeNormalRedirectsChecks,
	scribeNormalCustomRedirects,
	scribeTorRedirectsChecks,
	scribeTorCustomRedirects,
	scribeI2pCustomRedirects,
	scribeLokiCustomRedirects,
	protocol,
	protocolFallback

function init() {
	return new Promise(resolve => {
		browser.storage.local.get(
			[
				"disableMedium",
				"mediumRedirects",
				"scribeNormalRedirectsChecks",
				"scribeNormalCustomRedirects",
				"scribeTorRedirectsChecks",
				"scribeTorCustomRedirects",
				"scribeI2pCustomRedirects",
				"scribeLokiCustomRedirects",
				"protocol",
				"protocolFallback",
			],
			r => {
				disableMedium = r.disableMedium
				mediumRedirects = r.mediumRedirects
				scribeNormalRedirectsChecks = r.scribeNormalRedirectsChecks
				scribeNormalCustomRedirects = r.scribeNormalCustomRedirects
				scribeTorRedirectsChecks = r.scribeTorRedirectsChecks
				scribeTorCustomRedirects = r.scribeTorCustomRedirects
				scribeI2pCustomRedirects = r.scribeI2pCustomRedirects
				scribeLokiCustomRedirects = r.scribeLokiCustomRedirects
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function redirect(url, type, initiator, disableOverride) {
	if (disableMedium && !disableOverride) return
	if (url.pathname == "/" && !disableOverride) return
	if (type != "main_frame" && "sub_frame" && "xmlhttprequest" && "other") return
	if (
		initiator &&
		[...mediumRedirects.scribe.normal, ...mediumRedirects.scribe.tor, ...scribeNormalCustomRedirects, ...scribeTorCustomRedirects, ...scribeI2pCustomRedirects, ...scribeLokiCustomRedirects].includes(
			initiator.origin
		)
	)
		return

	if (!targets.some(rx => rx.test(url.host))) return
	if (/^\/(@[a-zA-Z.]{0,}(\/|)$)/.test(url.pathname)) return

	let instancesList = []
	if (protocol == "loki") instancesList = [...scribeLokiCustomRedirects]
	else if (protocol == "i2p") instancesList = [...scribeI2pCustomRedirects]
	else if (protocol == "tor") instancesList = [...scribeTorRedirectsChecks, ...scribeTorCustomRedirects]
	if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
		instancesList = [...scribeNormalRedirectsChecks, ...scribeNormalCustomRedirects]
	}
	if (instancesList.length === 0) {
		return
	}

	const randomInstance = utils.getRandomInstance(instancesList)
	return `${randomInstance}${url.pathname}${url.search}`
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableMedium && !disableOverride) {
			resolve()
			return
		}
		let protocolHost = utils.protocolHost(url)
		const all = [
			...mediumRedirects.scribe.tor,
			...mediumRedirects.scribe.normal,

			...scribeNormalCustomRedirects,
			...scribeTorCustomRedirects,
			...scribeI2pCustomRedirects,
			...scribeLokiCustomRedirects,
		]
		if (!all.includes(protocolHost)) {
			resolve()
			return
		}

		let instancesList = []
		if (protocol == "loki") instancesList = [...scribeLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...scribeI2pCustomRedirects]
		else if (protocol == "tor") instancesList = [...scribeTorRedirectsChecks, ...scribeTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...scribeNormalRedirectsChecks, ...scribeNormalCustomRedirects]
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
	return new Promise(resolve => {
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(data => {
				let dataJson = JSON.parse(data)
				for (let i = 0; i < frontends.length; i++) {
					redirects[frontends[i]] = dataJson[frontends[i]]
				}
				browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], async r => {
					scribeNormalRedirectsChecks = [...redirects.scribe.normal]
					for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
						const a = scribeNormalRedirectsChecks.indexOf(instance)
						if (a > -1) scribeNormalRedirectsChecks.splice(a, 1)
					}
					browser.storage.local.set(
						{
							disableMedium: false,
							mediumRedirects: redirects,

							scribeNormalRedirectsChecks,
							scribeNormalCustomRedirects: [],

							scribeTorRedirectsChecks: [...redirects.scribe.tor],
							scribeTorCustomRedirects: [],

							scribeI2pRedirectsChecks: [...redirects.scribe.i2p],
							scribeI2pCustomRedirects: [],

							scribeLokiRedirectsChecks: [...redirects.scribe.loki],
							scribeLokiCustomRedirects: [],
						},
						() => resolve()
					)
				})
			})
	})
}

export default {
	setRedirects,
	redirect,
	switchInstance,
	initDefaults,
}

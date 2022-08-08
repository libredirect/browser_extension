window.browser = window.browser || window.chrome
import utils from "./utils.js"

const targets = ["instagram.com", "www.instagram.com"]

const frontends = new Array("bibliogram")
const protocols = new Array("normal", "tor", "i2p", "loki")

let redirects = {}

for (let i = 0; i < frontends.length; i++) {
	redirects[frontends[i]] = {}
	for (let x = 0; x < protocols.length; x++) {
		redirects[frontends[i]][protocols[x]] = []
	}
}

function setRedirects(val) {
	return new Promise(resolve =>
		browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], async r => {
			redirects.bibliogram = val
			bibliogramNormalRedirectsChecks = [...redirects.bibliogram.normal]
			for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
				const a = bibliogramNormalRedirectsChecks.indexOf(instance)
				if (a > -1) bibliogramNormalRedirectsChecks.splice(a, 1)
			}
			browser.storage.local.set(
				{
					instagramRedirects: redirects,
					bibliogramNormalRedirectsChecks,
					bibliogramTorRedirectsChecks: [...redirects.bibliogram.tor],
					bibliogramI2pRedirectsChecks: [...redirects.bibliogram.i2p],
					bibliogramLokiRedirectsChecks: [...redirects.bibliogram.loki],
				},
				() => resolve()
			)
		})
	)
}

let disableInstagram,
	protocol,
	protocolFallback,
	instagramRedirects,
	bibliogramNormalRedirectsChecks,
	bibliogramTorRedirectsChecks,
	bibliogramNormalCustomRedirects,
	bibliogramTorCustomRedirects,
	bibliogramI2pCustomRedirects,
	bibliogramLokiCustomRedirects

function init() {
	return new Promise(async resolve => {
		browser.storage.local.get(
			[
				"disableInstagram",
				"protocol",
				"protocolFallback",
				"instagramRedirects",
				"bibliogramNormalRedirectsChecks",
				"bibliogramTorRedirectsChecks",
				"bibliogramNormalCustomRedirects",
				"bibliogramTorCustomRedirects",
				"bibliogramI2pCustomRedirects",
				"bibliogramLokiCustomRedirects",
			],
			r => {
				disableInstagram = r.disableInstagram
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				instagramRedirects = r.instagramRedirects
				bibliogramNormalRedirectsChecks = r.bibliogramNormalRedirectsChecks
				bibliogramTorRedirectsChecks = r.bibliogramTorRedirectsChecks
				bibliogramNormalCustomRedirects = r.bibliogramNormalCustomRedirects
				bibliogramTorCustomRedirects = r.bibliogramTorCustomRedirects
				bibliogramI2pCustomRedirects = r.bibliogramI2pCustomRedirects
				bibliogramLokiCustomRedirects = r.bibliogramLokiCustomRedirects
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function initBibliogramPreferences(test, from) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(from)
		if (
			![
				...bibliogramNormalRedirectsChecks,
				...bibliogramTorRedirectsChecks,
				...bibliogramNormalCustomRedirects,
				...bibliogramTorCustomRedirects,
				...bibliogramI2pCustomRedirects,
				...bibliogramLokiCustomRedirects,
			].includes(protocolHost)
		) {
			resolve()
			return
		}

		if (!test) {
			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...bibliogramLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...bibliogramI2pCustomRedirects]
			else if (protocol == "tor") checkedInstances = [...bibliogramTorRedirectsChecks, ...bibliogramTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...bibliogramNormalRedirectsChecks, ...bibliogramNormalCustomRedirects]
			}
			await utils.getPreferencesFromToken("bibliogram", from, checkedInstances, "settings", "settings.json")
		}
		resolve(true)
	})
}

function all() {
	return [
		...bibliogramNormalRedirectsChecks,
		...bibliogramTorRedirectsChecks,
		...bibliogramNormalCustomRedirects,
		...bibliogramTorCustomRedirects,
		...bibliogramI2pCustomRedirects,
		...bibliogramLokiCustomRedirects,
	]
}

function redirect(url, type, initiator, disableOverride) {
	if (disableInstagram && !disableOverride) return
	if (!targets.includes(url.host)) return
	if (initiator && all().includes(initiator.origin)) return "BYPASSTAB"
	if (!["main_frame", "sub_frame", "xmlhttprequest", "other", "image", "media"].includes(type)) return

	const bypassPaths = [/about/, /explore/, /support/, /press/, /api/, /privacy/, /safety/, /admin/, /\/(accounts\/|embeds?.js)/]
	if (bypassPaths.some(rx => rx.test(url.pathname))) return

	let instancesList = []
	if (protocol == "loki") instancesList = [...bibliogramLokiCustomRedirects]
	else if (protocol == "i2p") instancesList = [...bibliogramI2pCustomRedirects]
	else if (protocol == "tor") instancesList = [...bibliogramTorRedirectsChecks, ...bibliogramTorCustomRedirects]
	if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
		instancesList = [...bibliogramNormalRedirectsChecks, ...bibliogramNormalCustomRedirects]
	}
	if (instancesList.length === 0) {
		return
	}
	let randomInstance = utils.getRandomInstance(instancesList)

	const reservedPaths = ["u", "p", "privacy"]
	if (url.pathname === "/" || reservedPaths.includes(url.pathname.split("/")[1])) return `${randomInstance}${url.pathname}${url.search}`
	if (url.pathname.startsWith("/reel") || url.pathname.startsWith("/tv")) return `${randomInstance}/p${url.pathname.replace(/\/reel|\/tv/i, "")}${url.search}`
	else return `${randomInstance}/u${url.pathname}${url.search}` // Likely a user profile, redirect to '/u/...'
}

function reverse(url) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}

		if (url.pathname.startsWith("/p")) resolve(`https://instagram.com${url.pathname.replace("/p", "")}${url.search}`)
		if (url.pathname.startsWith("/u")) resolve(`https://instagram.com${url.pathname.replace("/u", "")}${url.search}`)
		resolve(`https://instagram.com${url.pathname}${url.search}`)
	})
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableInstagram && !disableOverride) {
			resolve()
			return
		}
		let protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}

		let instancesList = []
		if (protocol == "loki") instancesList = [...bibliogramLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...bibliogramI2pCustomRedirects]
		else if (protocol == "tor") instancesList = [...bibliogramTorRedirectsChecks, ...bibliogramTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...bibliogramNormalRedirectsChecks, ...bibliogramNormalCustomRedirects]
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
					bibliogramNormalRedirectsChecks = [...redirects.bibliogram.normal]
					for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
						const a = bibliogramNormalRedirectsChecks.indexOf(instance)
						if (a > -1) bibliogramNormalRedirectsChecks.splice(a, 1)
					}
					browser.storage.local.set({
						disableInstagram: false,
						instagramRedirects: redirects,

						bibliogramNormalRedirectsChecks,
						bibliogramNormalCustomRedirects: [],

						bibliogramTorRedirectsChecks: [...redirects.bibliogram.tor],
						bibliogramTorCustomRedirects: [],

						bibliogramI2pRedirectsChecks: [...redirects.bibliogram.i2p],
						bibliogramI2pCustomRedirects: [],

						bibliogramLokiRedirectsChecks: [...redirects.bibliogram.loki],
						bibliogramLokiCustomRedirects: [],
					})
					resolve()
				})
			})
	})
}

export default {
	setRedirects,
	initBibliogramPreferences,
	reverse,
	redirect,
	initDefaults,
	switchInstance,
}

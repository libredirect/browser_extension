window.browser = window.browser || window.chrome

import utils from "./utils.js"

const frontends = new Array("simpleertube")
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
		redirects.simpleertube = val
		simpleertubeNormalRedirectsChecks = [...redirects.simpleertube.normal]
		for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
			const a = simpleertubeNormalRedirectsChecks.indexOf(instance)
			if (a > -1) simpleertubeNormalRedirectsChecks.splice(a, 1)
		}
		browser.storage.local.set({
			peertubeRedirects: redirects,
			simpleertubeNormalRedirectsChecks,
		})
	})
}

let disablePeertubeTargets,
	peertubeRedirects,
	simpleertubeNormalRedirectsChecks,
	simpleertubeNormalCustomRedirects,
	simpleertubeTorRedirectsChecks,
	simpleertubeTorCustomRedirects,
	simpleertubeI2pRedirectsChecks,
	simpleertubeI2pCustomRedirects,
	simpleertubeLokiRedirectsChecks,
	simpleertubeLokiCustomRedirects,
	peerTubeTargets,
	protocol,
	protocolFallback

function init() {
	return new Promise(resolve => {
		browser.storage.local.get(
			[
				"disablePeertubeTargets",
				"peertubeRedirects",
				"simpleertubeNormalRedirectsChecks",
				"simpleertubeNormalCustomRedirects",
				"simpleertubeTorRedirectsChecks",
				"simpleertubeTorCustomRedirects",
				"simpleertubeI2pRedirectsChecks",
				"simpleertubeI2pCustomRedirects",
				"simpleertubeLokiRedirectsChecks",
				"simpleertubeLokiCustomRedirects",
				"peerTubeTargets",
				"protocol",
				"protocolFallback",
			],
			r => {
				disablePeertubeTargets = r.disablePeertubeTargets
				peertubeRedirects = r.peertubeRedirects
				simpleertubeNormalRedirectsChecks = r.simpleertubeNormalRedirectsChecks
				simpleertubeNormalCustomRedirects = r.simpleertubeNormalCustomRedirects
				simpleertubeTorRedirectsChecks = r.simpleertubeTorRedirectsChecks
				simpleertubeTorCustomRedirects = r.simpleertubeTorCustomRedirects
				simpleertubeI2pRedirectsChecks = r.simpleertubeI2pRedirectsChecks
				simpleertubeI2pCustomRedirects = r.simpleertubeI2pCustomRedirects
				simpleertubeLokiRedirectsChecks = r.simpleertubeLokiRedirectsChecks
				simpleertubeLokiCustomRedirects = r.simpleertubeLokiCustomRedirects
				peerTubeTargets = r.peerTubeTargets
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function all() {
	return [
		...simpleertubeNormalRedirectsChecks,
		...simpleertubeTorRedirectsChecks,
		...simpleertubeI2pRedirectsChecks,
		...simpleertubeLokiRedirectsChecks,
		...simpleertubeNormalCustomRedirects,
		...simpleertubeTorCustomRedirects,
		...simpleertubeI2pCustomRedirects,
		...simpleertubeLokiCustomRedirects,
	]
}

function redirect(url, type, initiator, disableOverride) {
	if (disablePeertubeTargets && !disableOverride) return
	if (initiator && (all().includes(initiator.origin) || peerTubeTargets.includes(initiator.host))) return
	let protocolHost = utils.protocolHost(url)
	if (!peerTubeTargets.includes(protocolHost)) return
	if (type != "main_frame") return

	let instancesList = []
	if (protocol == "loki") instancesList = [...simpleertubeLokiRedirectsChecks, ...simpleertubeLokiCustomRedirects]
	else if (protocol == "i2p") instancesList = [...simpleertubeI2pRedirectsChecks, ...simpleertubeI2pCustomRedirects]
	else if (protocol == "tor") instancesList = [...simpleertubeTorRedirectsChecks, ...simpleertubeTorCustomRedirects]
	if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
		instancesList = [...simpleertubeNormalRedirectsChecks, ...simpleertubeNormalCustomRedirects]
	}
	if (instancesList.length === 0) {
		return
	}

	const randomInstance = utils.getRandomInstance(instancesList)
	if (url.host == "search.joinpeertube.org" || url.host == "sepiasearch.org") return randomInstance
	return `${randomInstance}/${url.host}${url.pathname}${url.search}`
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disablePeertubeTargets && !disableOverride) {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}

		let instancesList = []
		if (protocol == "loki") instancesList = [...simpleertubeLokiRedirectsChecks, ...simpleertubeLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...simpleertubeI2pRedirectsChecks, ...simpleertubeI2pCustomRedirects]
		else if (protocol == "tor") instancesList = [...simpleertubeTorRedirectsChecks, ...simpleertubeTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...simpleertubeNormalRedirectsChecks, ...simpleertubeNormalCustomRedirects]
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
		simpleertubeNormalRedirectsChecks = [...redirects.simpleertube.normal]
		for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
			const a = simpleertubeNormalRedirectsChecks.indexOf(instance)
			if (a > -1) simpleertubeNormalRedirectsChecks.splice(a, 1)
		}
					browser.storage.local.set(
						{
							peerTubeTargets: ["https://search.joinpeertube.org", ...dataJson.peertube],
							disablePeertubeTargets: true,
							peertubeRedirects: redirects,

							simpleertubeNormalRedirectsChecks,
							simpleertubeNormalCustomRedirects: [],

							simpleertubeTorRedirectsChecks: [...redirects.simpleertube.tor],
							simpleertubeTorCustomRedirects: [],

							simpleertubeI2pRedirectsChecks: [...redirects.simpleertube.i2p],
							simpleertubeI2pCustomRedirects: [],

							simpleertubeLokiRedirectsChecks: [...redirects.simpleertube.loki],
							simpleertubeLokiCustomRedirects: [],
						},
						() => resolve()
					)
				})
			})
	})
}

export default {
	setRedirects,
	switchInstance,
	redirect,
	initDefaults,
}

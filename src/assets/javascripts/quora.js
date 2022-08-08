window.browser = window.browser || window.chrome

import utils from "./utils.js"

const targets = [/^https?:\/{2}(www\.|)quora\.com.*/]

let redirects = {}

const frontends = new Array("quetre")
const protocols = new Array("normal", "tor", "i2p", "loki")

for (let i = 0; i < frontends.length; i++) {
	redirects[frontends[i]] = {}
	for (let x = 0; x < protocols.length; x++) {
		redirects[frontends[i]][protocols[x]] = []
	}
}

function setRedirects(val) {
	return new Promise(resolve =>
		browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], r => {
			redirects.quetre = val
			quetreNormalRedirectsChecks = [...redirects.quetre.normal]
			for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
				const a = quetreNormalRedirectsChecks.indexOf(instance)
				if (a > -1) quetreNormalRedirectsChecks.splice(a, 1)
			}
			browser.storage.local.set(
				{
					quoraRedirects: redirects,
					quetreNormalRedirectsChecks,
					quetreTorRedirectsChecks: [...redirects.quetre.tor],
					quetreI2pRedirectsChecks: [...redirects.quetre.i2p],
					quetreLokiRedirectsChecks: [...redirects.quetre.loki],
				},
				() => resolve()
			)
		})
	)
}

let disableQuora,
	protocol,
	protocolFallback,
	quoraRedirects,
	quetreNormalRedirectsChecks,
	quetreNormalCustomRedirects,
	quetreTorRedirectsChecks,
	quetreTorCustomRedirects,
	quetreI2pCustomRedirects,
	quetreLokiCustomRedirects

function init() {
	return new Promise(async resolve => {
		browser.storage.local.get(
			[
				"disableQuora",
				"protocol",
				"protocolFallback",
				"quoraRedirects",
				"quetreNormalRedirectsChecks",
				"quetreNormalCustomRedirects",
				"quetreTorRedirectsChecks",
				"quetreTorCustomRedirects",
				"quetreI2pCustomRedirects",
				"quetreLokiCustomRedirects",
			],
			r => {
				disableQuora = r.disableQuora
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				quoraRedirects = r.quoraRedirects
				quetreNormalRedirectsChecks = r.quetreNormalRedirectsChecks
				quetreNormalCustomRedirects = r.quetreNormalCustomRedirects
				quetreTorRedirectsChecks = r.quetreTorRedirectsChecks
				quetreTorCustomRedirects = r.quetreTorCustomRedirects
				quetreI2pCustomRedirects = r.quetreI2pCustomRedirects
				quetreLokiCustomRedirects = r.quetreLokiCustomRedirects
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function redirect(url, type, initiator, disableOverride) {
	if (disableQuora && !disableOverride) return
	if (url.pathname == "/" && !disableOverride) return
	if (type != "main_frame") return
	const all = [...quoraRedirects.quetre.normal, ...quetreNormalCustomRedirects]
	if (initiator && (all.includes(initiator.origin) || targets.includes(initiator.host))) return
	if (!targets.some(rx => rx.test(url.href))) return

	let instancesList = []
	if (protocol == "loki") instancesList = [...quetreLokiCustomRedirects]
	else if (protocol == "i2p") instancesList = [...quetreI2pCustomRedirects]
	else if (protocol == "tor") instancesList = [...quetreTorRedirectsChecks, ...quetreTorCustomRedirects]
	if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
		instancesList = [...quetreNormalRedirectsChecks, ...quetreNormalCustomRedirects]
	}
	if (instancesList.length === 0) return

	const randomInstance = utils.getRandomInstance(instancesList)
	return `${randomInstance}${url.pathname}`
}

function reverse(url) {
	return new Promise(async resolve => {
		await init()
		let protocolHost = utils.protocolHost(url)
		const all = [...quoraRedirects.quetre.normal, ...quoraRedirects.quetre.tor, ...quetreNormalCustomRedirects, ...quetreTorCustomRedirects, ...quetreI2pCustomRedirects, ...quetreLokiCustomRedirects]
		if (!all.includes(protocolHost)) {
			resolve()
			return
		}

		resolve(`https://quora.com${url.pathname}${url.search}`)
	})
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableQuora && !disableOverride) {
			resolve()
			return
		}
		let protocolHost = utils.protocolHost(url)
		const all = [...quoraRedirects.quetre.tor, ...quoraRedirects.quetre.normal, ...quetreNormalCustomRedirects, ...quetreTorCustomRedirects, ...quetreI2pCustomRedirects, ...quetreLokiCustomRedirects]
		if (!all.includes(protocolHost)) {
			resolve()
			return
		}

		let instancesList = []
		if (protocol == "loki") instancesList = [...quetreLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...quetreI2pCustomRedirects]
		else if (protocol == "tor") instancesList = [...quetreTorRedirectsChecks, ...quetreTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...quetreNormalRedirectsChecks, ...quetreNormalCustomRedirects]
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
					quetreNormalRedirectsChecks = [...redirects.quetre.normal]
					for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
						const a = quetreNormalRedirectsChecks.indexOf(instance)
						if (a > -1) quetreNormalRedirectsChecks.splice(a, 1)
					}
					browser.storage.local.set(
						{
							disableQuora: false,

							quoraRedirects: redirects,

							quetreNormalRedirectsChecks,
							quetreNormalCustomRedirects: [],

							quetreTorRedirectsChecks: [...redirects.quetre.tor],
							quetreTorCustomRedirects: [],

							quetreI2pRedirectsChecks: [...redirects.quetre.i2p],
							quetreI2pCustomRedirects: [],

							quetreLokiRedirectsChecks: [...redirects.quetre.loki],
							quetreLokiCustomRedirects: [],
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
	reverse,
	switchInstance,

	initDefaults,
}

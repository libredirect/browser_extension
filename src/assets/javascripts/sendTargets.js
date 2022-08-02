window.browser = window.browser || window.chrome

import utils from "./utils.js"

const targets = [/^https?:\/{2}send\.libredirect\.invalid\/$/, /^ https ?: \/\/send\.firefox\.com\/$/, /^https?:\/{2}sendfiles\.online\/$/]

const frontends = new Array("send")
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
		redirects.send = val
		sendNormalRedirectsChecks = [...redirects.send.normal]
		for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
			const a = sendNormalRedirectsChecks.indexOf(instance)
			if (a > -1) sendNormalRedirectsChecks.splice(a, 1)
		}
		browser.storage.local.set({
			sendTargetsRedirects: redirects,
			sendNormalRedirectsChecks,
			sendTorRedirectsChecks: [...redirects.send.tor],
			sendI2pRedirectsChecks: [...redirects.send.i2p],
			sendLokiRedirectsChecks: [...redirects.send.loki],
		})
	})
}

let disableSendTarget,
	sendTargetsRedirects,
	sendNormalRedirectsChecks,
	sendNormalCustomRedirects,
	sendTorRedirectsChecks,
	sendTorCustomRedirects,
	sendI2pCustomRedirects,
	sendLokiCustomRedirects,
	protocol,
	protocolFallback

function init() {
	return new Promise(resolve => {
		browser.storage.local.get(
			[
				"disableSendTarget",
				"sendTargetsRedirects",
				"protocol",
				"protocolFallback",
				"sendNormalRedirectsChecks",
				"sendNormalCustomRedirects",
				"sendTorRedirectsChecks",
				"sendTorCustomRedirects",
				"sendI2pCustomRedirects",
				"sendLokiCustomRedirects",
			],
			r => {
				disableSendTarget = r.disableSendTarget
				sendTargetsRedirects = r.sendTargetsRedirects
				sendNormalRedirectsChecks = r.sendNormalRedirectsChecks
				sendNormalCustomRedirects = r.sendNormalCustomRedirects
				sendTorRedirectsChecks = r.sendTorRedirectsChecks
				sendTorCustomRedirects = r.sendTorCustomRedirects
				sendI2pCustomRedirects = r.sendI2pCustomRedirects
				sendLokiCustomRedirects = r.sendLokiCustomRedirects
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
		...sendTargetsRedirects.send.normal,
		...sendTargetsRedirects.send.tor,
		...sendNormalCustomRedirects,
		...sendTorRedirectsChecks,
		...sendTorCustomRedirects,
		...sendI2pCustomRedirects,
		...sendLokiCustomRedirects,
	]
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableSendTarget && !disableOverride) {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}
		if (url.pathname != "/") {
			resolve()
			return
		}

		let instancesList = []
		if (protocol == "loki") instancesList = [...sendLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...sendI2pCustomRedirects]
		else if (protocol == "tor") instancesList = [...sendTorRedirectsChecks, ...sendTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...sendNormalRedirectsChecks, ...sendNormalCustomRedirects]
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

function redirect(url, type, initiator, disableOverride) {
	if (disableSendTarget && !disableOverride) return
	if (type != "main_frame") return
	if (initiator && (all().includes(initiator.origin) || targets.includes(initiator.host))) return
	if (!targets.some(rx => rx.test(url.href))) return

	let instancesList = []
	if (protocol == "loki") instancesList = [...sendLokiCustomRedirects]
	else if (protocol == "i2p") instancesList = [...sendI2pCustomRedirects]
	else if (protocol == "tor") instancesList = [...sendTorRedirectsChecks, ...sendTorCustomRedirects]
	if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
		instancesList = [...sendNormalRedirectsChecks, ...sendNormalCustomRedirects]
	}
	if (instancesList.length === 0) return

	const randomInstance = utils.getRandomInstance(instancesList)
	return randomInstance
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
				browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], async r => {
					sendNormalRedirectsChecks = [...redirects.send.normal]
					for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
						const a = sendNormalRedirectsChecks.indexOf(instance)
						if (a > -1) sendNormalRedirectsChecks.splice(a, 1)
					}
					browser.storage.local.set(
						{
							disableSendTarget: false,
							sendTargetsRedirects: redirects,

							sendNormalRedirectsChecks,
							sendNormalCustomRedirects: [],

							sendTorRedirectsChecks: [...redirects.send.tor],
							sendTorCustomRedirects: [],

							sendI2pRedirectsChecks: [...redirects.send.i2p],
							sendI2pCustomRedirects: [],

							sendLokiRedirectsChecks: [...redirects.send.loki],
							sendLokiCustomRedirects: [],
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

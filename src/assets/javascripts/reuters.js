window.browser = window.browser || window.chrome

import utils from "./utils.js"

const targets = [/^https?:\/{2}(www\.|)reuters\.com.*/]

const frontends = new Array("neuters")
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
		redirects.neuters = val
		neutersNormalRedirectsChecks = [...redirects.neuters.normal]
		for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
			const a = neutersNormalRedirectsChecks.indexOf(instance)
			if (a > -1) neutersNormalRedirectsChecks.splice(a, 1)
		}
		browser.storage.local.set({
			neutersRedirects: redirects,
			neutersNormalRedirectsChecks,
			neutersTorRedirectsChecks: [...redirects.neuters.tor],
			neutersI2pRedirectsChecks: [...redirects.neuters.i2p],
			neutersLokiRedirectsChecks: [...redirects.neuters.loki]
		})
	})
}

let disableReuters,
	protocol,
	protocolFallback,
	reutersRedirects,
	neutersNormalRedirectsChecks,
	neutersNormalCustomRedirects,
	neutersTorRedirectsChecks,
	neutersTorCustomRedirects,
	neutersI2pCustomRedirects,
	neutersLokiCustomRedirects

function init() {
	return new Promise(async resolve => {
		browser.storage.local.get(
			[
				"disableReuters",
				"protocol",
				"protocolFallback",
				"reutersRedirects",
				"neutersNormalRedirectsChecks",
				"neutersNormalCustomRedirects",
				"neutersTorRedirectsChecks",
				"neutersTorCustomRedirects",
				"neutersI2pCustomRedirects",
				"neutersLokiCustomRedirects",
			],
			r => {
				disableReuters = r.disableReuters
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				reutersRedirects = r.reutersRedirects
				neutersNormalRedirectsChecks = r.neutersNormalRedirectsChecks
				neutersNormalCustomRedirects = r.neutersNormalCustomRedirects
				neutersTorRedirectsChecks = r.neutersTorRedirectsChecks
				neutersTorCustomRedirects = r.neutersTorCustomRedirects
				neutersI2pCustomRedirects = r.neutersI2pCustomRedirects
				neutersLokiCustomRedirects = r.neutersLokiCustomRedirects
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function redirect(url, type, initiator, disableOverride) {
	if (disableReuters && !disableOverride) return
	if (type != "main_frame") return
	const all = [...reutersRedirects.neuters.normal, ...neutersNormalCustomRedirects]
	if (initiator && (all.includes(initiator.origin) || targets.includes(initiator.host))) return
	if (!targets.some(rx => rx.test(url.href))) return

	let instancesList = []
	if (protocol == "loki") instancesList = [...neutersLokiCustomRedirects]
	else if (protocol == "i2p") instancesList = [...neutersI2pCustomRedirects]
	else if (protocol == "tor") instancesList = [...neutersTorRedirectsChecks, ...neutersTorCustomRedirects]
	if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
		instancesList = [...neutersNormalRedirectsChecks, ...neutersNormalCustomRedirects]
	}
	if (instancesList.length === 0) return

	const randomInstance = utils.getRandomInstance(instancesList)
	// stolen from https://addons.mozilla.org/en-US/firefox/addon/reuters-redirect/
	if (url.pathname.startsWith("/article/") || url.pathname.startsWith("/pf/") || url.pathname.startsWith("/arc/") || url.pathname.startsWith("/resizer/")) return null
	else if (url.pathname.endsWith("/")) return `${randomInstance}${url.pathname}`
	else return `${randomInstance}${url.pathname}/`
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
		neutersNormalRedirectsChecks = [...redirects.neuters.normal]
		for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
			const a = neutersNormalRedirectsChecks.indexOf(instance)
			if (a > -1) neutersNormalRedirectsChecks.splice(a, 1)
		}
				browser.storage.local.set(
					{
						disableReuters: true,

						reutersRedirects: redirects,

						neutersNormalRedirectsChecks,
						neutersNormalCustomRedirects: [],

						neutersTorRedirectsChecks: [...redirects.neuters.tor],
						neutersTorCustomRedirects: [],

						neutersI2pRedirectsChecks: [...redirects.neuters.i2p],
						neutersI2pCustomRedirects: [],

						neutersLokiRedirectsChecks: [...redirects.neuters.loki],
						neutersLokiCustomRedirects: [],
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
	initDefaults,
}

window.browser = window.browser || window.chrome

import utils from "./utils.js"

let targets = ["odysee.com"]

const frontends = new Array("librarian")
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
		redirects.librarian = val
		librarianNormalRedirectsChecks = [...redirects.librarian.normal]
		for (const instance of r.cloudflareBlackList) {
			const a = librarianNormalRedirectsChecks.indexOf(instance)
			if (a > -1) librarianNormalRedirectsChecks.splice(a, 1)
		}
		browser.storage.local.set({
			lbryTargetsRedirects: redirects,
			librarianNormalRedirectsChecks,
		})
	})
}

let disableLbryTargets,
	lbryFrontend,
	protocol,
	protocolFallback,
	lbryTargetsRedirects,
	librarianNormalRedirectsChecks,
	librarianNormalCustomRedirects,
	librarianTorRedirectsChecks,
	librarianTorCustomRedirects,
	librarianI2pRedirectsChecks,
	librarianI2pCustomRedirects,
	librarianLokiCustomRedirects

function init() {
	return new Promise(resolve => {
		browser.storage.local.get(
			[
				"disableLbryTargets",
				"lbryFrontend",
				"protocol",
				"protocolFallback",
				"lbryTargetsRedirects",
				"librarianNormalRedirectsChecks",
				"librarianNormalCustomRedirects",
				"librarianTorRedirectsChecks",
				"librarianTorCustomRedirects",
				"librarianI2pRedirectsChecks",
				"librarianI2pCustomRedirects",
				"librarianLokiCustomRedirects",
			],
			r => {
				disableLbryTargets = r.disableLbryTargets
				lbryFrontend = r.lbryFrontend
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				lbryTargetsRedirects = r.lbryTargetsRedirects
				librarianNormalRedirectsChecks = r.librarianNormalRedirectsChecks
				librarianNormalCustomRedirects = r.librarianNormalCustomRedirects
				librarianTorRedirectsChecks = r.librarianTorRedirectsChecks
				librarianTorCustomRedirects = r.librarianTorCustomRedirects
				librarianI2pRedirectsChecks = r.librarianI2pRedirectsChecks
				librarianI2pCustomRedirects = r.librarianI2pCustomRedirects
				librarianLokiCustomRedirects = r.librarianLokiCustomRedirects
				resolve()
			}
		)
	})
}
init()
browser.storage.onChanged.addListener(init)

function all() {
	return [...redirects.librarian.normal, ...redirects.librarian.tor, ...librarianNormalCustomRedirects, ...librarianTorCustomRedirects, ...librarianI2pCustomRedirects, ...librarianLokiCustomRedirects]
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableLbryTargets && !disableOverride) {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}

		let instancesList = []
		if (protocol == "loki") instancesList = [...librarianLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...librarianI2pCustomRedirects]
		else if (protocol == "tor") instancesList = [...librarianTorRedirectsChecks, ...librarianTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...librarianNormalRedirectsChecks, ...librarianNormalCustomRedirects]
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
	if (disableLbryTargets && !disableOverride) return
	if (initiator && (all().includes(initiator.origin) || targets.includes(initiator.host))) return
	if (!targets.includes(url.host)) return
	if (type != ("main_frame" || "sub_frame")) return
	//https://odysee.com/$/embed/the-anti-smartphone-revolution/22b482e450c4ca13c464eee8f51b3a52bbb942ae?r=7pAWcQybShS63wz486r8wVv9FpsDJ47A
	// to
	//https://{instance}/embed/@Coldfusion:f/the-anti-smartphone-revolution:2

	let instancesList = []
	switch (lbryFrontend) {
		case "librarian":
			switch (protocol) {
				case "loki":
					instancesList = [...librarianLokiCustomRedirects]
					break
				case "i2p":
					instancesList = [...librarianI2pRedirectsChecks, ...librarianI2pCustomRedirects]
					break
				case "tor":
					instancesList = [...librarianTorRedirectsChecks, ...librarianTorCustomRedirects]
			}
			if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
				instancesList = [...librarianNormalRedirectsChecks, ...librarianNormalCustomRedirects]
			}
			break
		case "lbryDesktop":
			if (type == "main_frame") {
				return url.href.replace(/^https?:\/{2}odysee\.com\//, "lbry://").replace(/:(?=[a-zA-Z0-9])/g, "#")
			}
			if (instancesList.length === 0) return
	}
	const randomInstance = utils.getRandomInstance(instancesList)
	return `${randomInstance}${url.pathname}${url.search}`
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
				browser.storage.local.set(
					{
						disableLbryTargets: true,
						lbryFrontend: "librarian",
						lbryTargetsRedirects: redirects,

						librarianNormalRedirectsChecks: [...redirects.librarian.normal],
						librarianNormalCustomRedirects: [],

						librarianTorRedirectsChecks: [...redirects.librarian.tor],
						librarianTorCustomRedirects: [],

						librarianI2pRedirectsChecks: [...redirects.librarian.i2p],
						librarianI2pCustomRedirects: [],

						librarianLokiRedirectsChecks: [...redirects.librarian.loki],
						librarianLokiCustomRedirects: [],
					},
					() => resolve()
				)
			})
	})
}

export default {
	setRedirects,
	switchInstance,
	redirect,
	initDefaults,
}

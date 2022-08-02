window.browser = window.browser || window.chrome

import utils from "../utils.js"

const targets = [/^https?:\/{2}translate\.google(\.[a-z]{2,3}){1,2}\//]

const frontends = new Array("simplyTranslate", "lingva")
const protocols = new Array("normal", "tor", "i2p", "loki")

let redirects = {}

for (let i = 0; i < frontends.length; i++) {
	redirects[frontends[i]] = {}
	for (let x = 0; x < protocols.length; x++) {
		redirects[frontends[i]][protocols[x]] = []
	}
}

let translateDisable,
	translateFrontend,
	protocol,
	protocolFallback,
	translateRedirects,
	simplyTranslateNormalRedirectsChecks,
	simplyTranslateNormalCustomRedirects,
	simplyTranslateTorRedirectsChecks,
	simplyTranslateTorCustomRedirects,
	simplyTranslateI2pRedirectsChecks,
	simplyTranslateI2pCustomRedirects,
	simplyTranslateLokiRedirectsChecks,
	simplyTranslateLokiCustomRedirects,
	lingvaNormalRedirectsChecks,
	lingvaNormalCustomRedirects,
	lingvaTorRedirectsChecks,
	lingvaTorCustomRedirects,
	lingvaI2pCustomRedirects,
	lingvaLokiCustomRedirects

function init() {
	return new Promise(resolve => {
		browser.storage.local.get(
			[
				"translateDisable",
				"translateFrontend",
				"protocol",
				"protocolFallback",
				"translateRedirects",
				"simplyTranslateNormalRedirectsChecks",
				"simplyTranslateNormalCustomRedirects",
				"simplyTranslateTorRedirectsChecks",
				"simplyTranslateTorCustomRedirects",
				"simplyTranslateI2pRedirectsChecks",
				"simplyTranslateI2pCustomRedirects",
				"simplyTranslateLokiRedirectsChecks",
				"simplyTranslateLokiCustomRedirects",

				"lingvaNormalRedirectsChecks",
				"lingvaNormalCustomRedirects",
				"lingvaTorRedirectsChecks",
				"lingvaTorCustomRedirects",
				"lingvaI2pCustomRedirects",
				"lingvaLokiCustomRedirects",
			],
			r => {
				translateDisable = r.translateDisable
				translateFrontend = r.translateFrontend
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				translateRedirects = r.translateRedirects
				simplyTranslateNormalRedirectsChecks = r.simplyTranslateNormalRedirectsChecks
				simplyTranslateNormalCustomRedirects = r.simplyTranslateNormalCustomRedirects
				simplyTranslateTorRedirectsChecks = r.simplyTranslateTorRedirectsChecks
				simplyTranslateTorCustomRedirects = r.simplyTranslateTorCustomRedirects
				simplyTranslateI2pRedirectsChecks = r.simplyTranslateI2pRedirectsChecks
				simplyTranslateI2pCustomRedirects = r.simplyTranslateI2pCustomRedirects
				simplyTranslateLokiRedirectsChecks = r.simplyTranslateLokiRedirectsChecks
				simplyTranslateLokiCustomRedirects = r.simplyTranslateLokiCustomRedirects
				lingvaNormalRedirectsChecks = r.lingvaNormalRedirectsChecks
				lingvaNormalCustomRedirects = r.lingvaNormalCustomRedirects
				lingvaTorRedirectsChecks = r.lingvaTorRedirectsChecks
				lingvaTorCustomRedirects = r.lingvaTorCustomRedirects
				lingvaI2pCustomRedirects = r.lingvaI2pCustomRedirects
				lingvaLokiCustomRedirects = r.lingvaLokiCustomRedirects
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function setRedirects(val) {
	browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], r => {
		redirects = val
		simplyTranslateNormalRedirectsChecks = [...redirects.simplyTranslate.normal]
		lingvaNormalRedirectsChecks = [...redirects.lingva.normal]
		for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
			const a = simplyTranslateNormalCustomRedirects.indexOf(instance)
			if (a > -1) simplyTranslateNormalCustomRedirects.splice(a, 1)

			const i = lingvaNormalRedirectsChecks.indexOf(instance)
			if (i > -1) lingvaNormalRedirectsChecks.splice(i, 1)
		}
		browser.storage.local.set({
			translateRedirects: redirects,
			simplyTranslateNormalRedirectsChecks,
			lingvaNormalRedirectsChecks,
		})
	})
}

function copyPasteLingvaLocalStorage(test, url, tabId) {
	return new Promise(async resolve => {
		await init()
		if (translateDisable || translateFrontend != "lingva") {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (
			![...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects, ...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects, ...lingvaI2pCustomRedirects, ...lingvaLokiCustomRedirects].includes(
				protocolHost
			)
		) {
			resolve()
			return
		}

		if (!test) {
			browser.tabs.executeScript(tabId, {
				file: "/assets/javascripts/translate/get_lingva_preferences.js",
				runAt: "document_start",
			})

			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...lingvaLokiCustomRedirects]
			//...lingvaLokiRedirectsChecks,
			else if (protocol == "i2p") checkedInstances = [...lingvaI2pCustomRedirects]
			//...lingvaI2pRedirectsChecks,
			else if (protocol == "tor") checkedInstances = [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects]
			}
			const i = checkedInstances.indexOf(protocolHost)
			if (i !== -1) checkedInstances.splice(i, 1)
			if (checkedInstances.length === 0) {
				resolve()
				return
			}
			for (const to of checkedInstances)
				browser.tabs.create({ url: to }, tab =>
					browser.tabs.executeScript(tab.id, {
						file: "/assets/javascripts/translate/set_lingva_preferences.js",
						runAt: "document_start",
					})
				)
		}
		resolve(true)
	})
}

function copyPasteSimplyTranslateCookies(test, from) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(from)
		if (
			![
				...simplyTranslateNormalRedirectsChecks,
				...simplyTranslateNormalCustomRedirects,
				...simplyTranslateTorRedirectsChecks,
				...simplyTranslateTorCustomRedirects,
				...simplyTranslateI2pRedirectsChecks,
				...simplyTranslateI2pCustomRedirects,
				...simplyTranslateLokiRedirectsChecks,
				...simplyTranslateLokiCustomRedirects,
			].includes(protocolHost)
		) {
			resolve()
			return
		}
		if (!test) {
			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...simplyTranslateLokiRedirectsChecks, ...simplyTranslateLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...simplyTranslateI2pCustomRedirects, ...simplyTranslateI2pRedirectsChecks]
			else if (protocol == "tor") checkedInstances = [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects]
			}
			await utils.copyCookie("simplyTranslate", from, checkedInstances, "from_lang")
			await utils.copyCookie("simplyTranslate", from, checkedInstances, "to_lang")
			await utils.copyCookie("simplyTranslate", from, checkedInstances, "tts_enabled")
			await utils.copyCookie("simplyTranslate", from, checkedInstances, "use_text_fields")
		}
		resolve(true)
	})
}

function redirect(url, disableOverride) {
	if (translateDisable && !disableOverride) return
	if (!targets.some(rx => rx.test(url.href))) return

	if (translateFrontend == "simplyTranslate") {
		let instancesList = []
		if (protocol == "loki") instancesList = [...simplyTranslateLokiRedirectsChecks, ...simplyTranslateLokiCustomRedirects]
		else if (protocol == "i2p") instancesList = [...simplyTranslateI2pRedirectsChecks, ...simplyTranslateI2pCustomRedirects]
		else if (protocol == "tor") instancesList = [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects]
		}
		if (instancesList.length === 0) return

		const randomInstance = utils.getRandomInstance(instancesList)
		return `${randomInstance}/${url.search}`
	} else if (translateFrontend == "lingva") {
		let params_arr = url.search.split("&")
		params_arr[0] = params_arr[0].substring(1)
		let params = {}
		for (let i = 0; i < params_arr.length; i++) {
			let pair = params_arr[i].split("=")
			params[pair[0]] = pair[1]
		}
		let instancesList = []
		if (protocol == "loki") instancesList = [...lingvaLokiCustomRedirects]
		//...lingvaLokiRedirectsChecks,
		else if (protocol == "i2p") instancesList = [...lingvaI2pCustomRedirects] //...lingvaI2pRedirectsChecks,
		if (protocol == "tor") instancesList = [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects]
		}
		if (instancesList.length === 0) return

		const randomInstance = utils.getRandomInstance(instancesList)
		if (params.sl && params.tl && params.text) {
			return `${randomInstance}/${params.sl}/${params.tl}/${params.text}`
		}
		return randomInstance
	}
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (translateDisable && !disableOverride) {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (
			![
				...translateRedirects.simplyTranslate.normal,
				...translateRedirects.simplyTranslate.tor,
				...translateRedirects.simplyTranslate.i2p,
				...translateRedirects.simplyTranslate.loki,

				...simplyTranslateNormalCustomRedirects,
				...simplyTranslateTorCustomRedirects,
				...simplyTranslateI2pCustomRedirects,
				...simplyTranslateLokiCustomRedirects,

				...translateRedirects.lingva.normal,
				...translateRedirects.lingva.tor,

				...lingvaNormalCustomRedirects,
				...lingvaTorCustomRedirects,
				...lingvaI2pCustomRedirects,
				...lingvaLokiCustomRedirects,
			].includes(protocolHost)
		) {
			resolve()
			return
		}

		let instancesList = []

		if (protocol == "loki") {
			if (translateFrontend == "simplyTranslate") instancesList = [...simplyTranslateLokiRedirectsChecks, ...simplyTranslateLokiCustomRedirects]
			else if (translateFrontend == "lingva") instancesList = [...lingvaLokiCustomRedirects] //...lingvaLokiRedirectsChecks,
		} else if (protocol == "i2p") {
			if (translateFrontend == "simplyTranslate") instancesList = [...simplyTranslateI2pRedirectsChecks, ...simplyTranslateI2pCustomRedirects]
			else if (translateFrontend == "lingva") instancesList = [...lingvaI2pCustomRedirects] //...lingvaI2pRedirectsChecks,
		} else if (protocol == "tor") {
			if (translateFrontend == "simplyTranslate") instancesList = [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects]
			else if (translateFrontend == "lingva") instancesList = [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects]
		}
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			if (translateFrontend == "simplyTranslate") instancesList = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects]
			else if (translateFrontend == "lingva") instancesList = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects]
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
			.then(data => {
				let dataJson = JSON.parse(data)
				for (let i = 0; i < frontends.length; i++) {
					redirects[frontends[i]] = dataJson[frontends[i]]
				}
	browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], async r => {
		simplyTranslateNormalCustomRedirects = [...redirects.simplyTranslate.normal]
		lingvaNormalRedirectsChecks = [...redirects.lingva.normal]
		console.log(r.offlineBlackList)
		for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
			const a = simplyTranslateNormalCustomRedirects.indexOf(instance)
			if (a > -1) simplyTranslateNormalCustomRedirects.splice(a, 1)

			const b = lingvaNormalRedirectsChecks.indexOf(instance)
			if (b > -1) lingvaNormalRedirectsChecks.splice(b, 1)
		}
					browser.storage.local.set(
						{
							translateDisable: false,
							translateFrontend: "simplyTranslate",
							translateRedirects: redirects,

							simplyTranslateNormalRedirectsChecks,
							simplyTranslateNormalCustomRedirects: [],

							simplyTranslateTorRedirectsChecks: [...redirects.simplyTranslate.tor],
							simplyTranslateTorCustomRedirects: [],

							simplyTranslateI2pRedirectsChecks: [...redirects.simplyTranslate.i2p],
							simplyTranslateI2pCustomRedirects: [],

							simplyTranslateLokiRedirectsChecks: [...redirects.simplyTranslate.loki],
							simplyTranslateLokiCustomRedirects: [],

							lingvaNormalRedirectsChecks,
							lingvaNormalCustomRedirects: [],

							lingvaTorRedirectsChecks: [...redirects.lingva.tor],
							lingvaTorCustomRedirects: [],

							lingvaI2pRedirectsChecks: [...redirects.lingva.i2p],
							lingvaI2pCustomRedirects: [],

							lingvaLokiRedirectsChecks: [...redirects.lingva.loki],
							lingvaLokiCustomRedirects: [],
						},
						() => resolve()
					)
				})
			})
	})
}

export default {
	copyPasteSimplyTranslateCookies,
	copyPasteLingvaLocalStorage,
	setRedirects,
	redirect,
	initDefaults,
	switchInstance,
}

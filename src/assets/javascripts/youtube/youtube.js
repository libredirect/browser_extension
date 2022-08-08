"use strict"

window.browser = window.browser || window.chrome

import utils from "../utils.js"

const targets = [
	/^https?:\/{2}(www\.|music\.|m\.|)youtube\.com(\/.*|$)/,

	/^https?:\/{2}img\.youtube\.com\/vi\/.*\/..*/, // https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
	/^https?:\/{2}(i|s)\.ytimg\.com\/vi\/.*\/..*/,

	/^https?:\/{2}(www\.|music\.|)youtube\.com\/watch\?v\=..*/,

	/^https?:\/{2}youtu\.be\/..*/,

	/^https?:\/{2}(www\.|)(youtube|youtube-nocookie)\.com\/embed\/..*/,
]

const frontends = new Array("invidious", "piped", "pipedMaterial", "cloudtube")
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
		browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], r => {
			redirects = val
			invidiousNormalRedirectsChecks = [...redirects.invidious.normal]
			pipedNormalRedirectsChecks = [...redirects.piped.normal]
			pipedMaterialNormalRedirectsChecks = [...redirects.pipedMaterial.normal]
			cloudtubeNormalRedirectsChecks = [...redirects.cloudtube.normal]
			for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
				const a = invidiousNormalRedirectsChecks.indexOf(instance)
				if (a > -1) invidiousNormalRedirectsChecks.splice(a, 1)

				const b = pipedNormalRedirectsChecks.indexOf(instance)
				if (b > -1) pipedNormalRedirectsChecks.splice(b, 1)

				const c = pipedMaterialNormalRedirectsChecks.indexOf(instance)
				if (c > -1) pipedMaterialNormalRedirectsChecks.splice(c, 1)

				const d = cloudtubeNormalRedirectsChecks.indexOf(instance)
				if (c > -1) cloudtubeNormalRedirectsChecks.splice(d, 1)
			}
			browser.storage.local.set(
				{
					youtubeRedirects: redirects,
					invidiousNormalRedirectsChecks,
					invidiousTorRedirectsChecks: [...redirects.invidious.tor],
					invidiousI2pRedirectsChecks: [...redirects.invidious.i2p],
					invidiousLokiRedirectsChecks: [...redirects.invidious.loki],
					pipedNormalRedirectsChecks,
					pipedTorRedirectsChecks: [...redirects.piped.tor],
					pipedI2pRedirectsChecks: [...redirects.piped.i2p],
					pipedLokiRedirectsChecks: [...redirects.piped.loki],
					pipedMaterialNormalRedirectsChecks,
					pipedMaterialTorRedirectsChecks: [...redirects.pipedMaterial.tor],
					pipedMaterialI2pRedirectsChecks: [...redirects.pipedMaterial.i2p],
					pipedMaterialLokiRedirectsChecks: [...redirects.pipedMaterial.loki],
					cloudtubeNormalRedirectsChecks,
					cloudtubeTorRedirectsChecks: [...redirects.cloudtube.tor],
					cloudtubeI2pRedirectsChecks: [...redirects.cloudtube.i2p],
					cloudtubeLokiRedirectsChecks: [...redirects.cloudtube.loki],
				},
				() => resolve()
			)
		})
	)
}

let disableYoutube,
	onlyEmbeddedVideo,
	youtubeFrontend,
	protocol,
	protocolFallback,
	youtubeEmbedFrontend,
	youtubeRedirects,
	invidiousNormalRedirectsChecks,
	invidiousNormalCustomRedirects,
	invidiousTorRedirectsChecks,
	invidiousTorCustomRedirects,
	invidiousI2pRedirectsChecks,
	invidiousI2pCustomRedirects,
	invidiousLokiRedirectsChecks,
	invidiousLokiCustomRedirects,
	pipedNormalRedirectsChecks,
	pipedNormalCustomRedirects,
	pipedTorRedirectsChecks,
	pipedTorCustomRedirects,
	pipedI2pRedirectsChecks,
	pipedI2pCustomRedirects,
	pipedLokiRedirectsChecks,
	pipedLokiCustomRedirects,
	pipedMaterialNormalRedirectsChecks,
	pipedMaterialNormalCustomRedirects,
	pipedMaterialTorRedirectsChecks,
	pipedMaterialTorCustomRedirects,
	pipedMaterialI2pRedirectsChecks,
	pipedMaterialI2pCustomRedirects,
	pipedMaterialLokiRedirectsChecks,
	pipedMaterialLokiCustomRedirects,
	cloudtubeNormalRedirectsChecks,
	cloudtubeNormalCustomRedirects,
	cloudtubeTorRedirectsChecks,
	cloudtubeTorCustomRedirects,
	cloudtubeI2pRedirectsChecks,
	cloudtubeI2pCustomRedirects,
	cloudtubeLokiRedirectsChecks,
	cloudtubeLokiCustomRedirects

function init() {
	return new Promise(resolve => {
		browser.storage.local.get(
			[
				"disableYoutube",
				"onlyEmbeddedVideo",
				"youtubeFrontend",
				"protocol",
				"protocolFallback",
				"youtubeEmbedFrontend",
				"youtubeRedirects",
				"invidiousNormalRedirectsChecks",
				"invidiousNormalCustomRedirects",
				"invidiousTorRedirectsChecks",
				"invidiousTorCustomRedirects",
				"invidiousI2pRedirectsChecks",
				"invidiousI2pCustomRedirects",
				"invidiousLokiRedirectsChecks",
				"invidiousLokiCustomRedirects",
				"pipedNormalRedirectsChecks",
				"pipedNormalCustomRedirects",
				"pipedTorRedirectsChecks",
				"pipedTorCustomRedirects",
				"pipedI2pRedirectsChecks",
				"pipedI2pCustomRedirects",
				"pipedLokiRedirectsChecks",
				"pipedLokiCustomRedirects",
				"pipedMaterialNormalRedirectsChecks",
				"pipedMaterialNormalCustomRedirects",
				"pipedMaterialTorRedirectsChecks",
				"pipedMaterialTorCustomRedirects",
				"pipedMaterialI2pRedirectsChecks",
				"pipedMaterialI2pCustomRedirects",
				"pipedMaterialLokiRedirectsChecks",
				"pipedMaterialLokiCustomRedirects",
				"cloudtubeNormalRedirectsChecks",
				"cloudtubeNormalCustomRedirects",
				"cloudtubeTorRedirectsChecks",
				"cloudtubeTorCustomRedirects",
				"cloudtubeI2pRedirectsChecks",
				"cloudtubeI2pCustomRedirects",
				"cloudtubeLokiRedirectsChecks",
				"cloudtubeLokiCustomRedirects",
			],
			r => {
				disableYoutube = r.disableYoutube
				onlyEmbeddedVideo = r.onlyEmbeddedVideo
				youtubeFrontend = r.youtubeFrontend
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				youtubeEmbedFrontend = r.youtubeEmbedFrontend
				youtubeRedirects = r.youtubeRedirects
				invidiousNormalRedirectsChecks = r.invidiousNormalRedirectsChecks
				invidiousNormalCustomRedirects = r.invidiousNormalCustomRedirects
				invidiousTorRedirectsChecks = r.invidiousTorRedirectsChecks
				invidiousTorCustomRedirects = r.invidiousTorCustomRedirects
				invidiousI2pRedirectsChecks = r.invidiousI2pRedirectsChecks
				invidiousI2pCustomRedirects = r.invidiousI2pCustomRedirects
				invidiousLokiRedirectsChecks = r.invidiousLokiRedirectsChecks
				invidiousLokiCustomRedirects = r.invidiousLokiCustomRedirects
				pipedNormalRedirectsChecks = r.pipedNormalRedirectsChecks
				pipedNormalCustomRedirects = r.pipedNormalCustomRedirects
				pipedTorRedirectsChecks = r.pipedTorRedirectsChecks
				pipedTorCustomRedirects = r.pipedTorCustomRedirects
				pipedI2pRedirectsChecks = r.pipedI2pRedirectsChecks
				pipedI2pCustomRedirects = r.pipedI2pCustomRedirects
				pipedLokiRedirectsChecks = r.pipedLokiRedirectsChecks
				pipedLokiCustomRedirects = r.pipedLokiCustomRedirects
				pipedMaterialNormalRedirectsChecks = r.pipedMaterialNormalRedirectsChecks
				pipedMaterialNormalCustomRedirects = r.pipedMaterialNormalCustomRedirects
				pipedMaterialTorRedirectsChecks = r.pipedMaterialTorRedirectsChecks
				pipedMaterialTorCustomRedirects = r.pipedMaterialTorCustomRedirects
				pipedMaterialI2pRedirectsChecks = r.pipedMaterialI2pRedirectsChecks
				pipedMaterialI2pCustomRedirects = r.pipedMaterialI2pCustomRedirects
				pipedMaterialLokiRedirectsChecks = r.pipedMaterialLokiRedirectsChecks
				pipedMaterialLokiCustomRedirects = r.pipedMaterialLokiCustomRedirects
				cloudtubeNormalRedirectsChecks = r.cloudtubeNormalRedirectsChecks
				cloudtubeNormalCustomRedirects = r.cloudtubeNormalCustomRedirects
				cloudtubeTorRedirectsChecks = r.cloudtubeTorRedirectsChecks
				cloudtubeTorCustomRedirects = r.cloudtubeTorCustomRedirects
				cloudtubeI2pRedirectsChecks = r.cloudtubeI2pRedirectsChecks
				cloudtubeI2pCustomRedirects = r.cloudtubeI2pCustomRedirects
				cloudtubeLokiRedirectsChecks = r.cloudtubeLokiRedirectsChecks
				cloudtubeLokiCustomRedirects = r.cloudtubeLokiCustomRedirects
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function all() {
	return [
		...youtubeRedirects.invidious.normal,
		...youtubeRedirects.invidious.tor,
		...youtubeRedirects.invidious.i2p,
		...youtubeRedirects.invidious.loki,

		...youtubeRedirects.piped.normal,
		...youtubeRedirects.piped.tor,
		...youtubeRedirects.piped.i2p,
		...youtubeRedirects.piped.loki,

		...youtubeRedirects.pipedMaterial.normal,
		...youtubeRedirects.pipedMaterial.tor,
		...youtubeRedirects.pipedMaterial.i2p,
		...youtubeRedirects.pipedMaterial.loki,

		...youtubeRedirects.cloudtube.normal,
		...youtubeRedirects.cloudtube.tor,
		...youtubeRedirects.cloudtube.i2p,
		...youtubeRedirects.cloudtube.loki,

		...invidiousNormalCustomRedirects,
		...invidiousTorCustomRedirects,
		...invidiousI2pCustomRedirects,
		...invidiousLokiCustomRedirects,

		...pipedNormalCustomRedirects,
		...pipedTorCustomRedirects,
		...pipedI2pCustomRedirects,
		...pipedLokiCustomRedirects,

		...pipedMaterialNormalCustomRedirects,
		...pipedMaterialTorCustomRedirects,
		...pipedMaterialI2pCustomRedirects,
		...pipedMaterialLokiCustomRedirects,

		...cloudtubeNormalCustomRedirects,
		...cloudtubeTorCustomRedirects,
		...cloudtubeI2pCustomRedirects,
		...cloudtubeLokiCustomRedirects,
	]
}

function calculateFrontend(type) {
	switch (type) {
		case "main_frame":
			return youtubeFrontend
		case "sub_frame":
			return youtubeEmbedFrontend
	}
}

function getInstanceList(type) {
	let instancesList = []
	switch (calculateFrontend(type)) {
		case "invidious":
			switch (protocol) {
				case "loki":
					instancesList = [...invidiousLokiRedirectsChecks, ...invidiousLokiCustomRedirects]
					break
				case "i2p":
					instancesList = [...invidiousI2pRedirectsChecks, ...invidiousI2pCustomRedirects]
					break
				case "tor":
					instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects]
			}
			if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
				instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects]
			}
			break
		case "piped":
			switch (protocol) {
				case "loki":
					instancesList = [...pipedLokiRedirectsChecks, ...pipedLokiCustomRedirects]
					break
				case "i2p":
					instancesList = [...pipedI2pRedirectsChecks, ...pipedI2pCustomRedirects]
					break
				case "tor":
					instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects]
			}
			if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
				instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects]
			}
			break
		case "pipedMaterial":
			switch (protocol) {
				case "loki":
					instancesList = [...pipedMaterialLokiRedirectsChecks, ...pipedMaterialLokiCustomRedirects]
					break
				case "i2p":
					instancesList = [...pipedMaterialI2pRedirectsChecks, ...pipedMaterialI2pCustomRedirects]
					break
				case "tor":
					instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects]
			}
			if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
				instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects]
			}
		case "cloudtube":
			switch (protocol) {
				case "loki":
					instancesList = [...cloudtubeLokiRedirectsChecks, ...cloudtubeLokiCustomRedirects]
					break
				case "i2p":
					instancesList = [...cloudtubeI2pRedirectsChecks, ...cloudtubeI2pCustomRedirects]
					break
				case "tor":
					instancesList = [...cloudtubeTorRedirectsChecks, ...cloudtubeTorCustomRedirects]
			}
			if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
				instancesList = [...cloudtubeNormalRedirectsChecks, ...cloudtubeNormalCustomRedirects]
			}
	}
	return instancesList
}

function redirect(url, type, initiator, disableOverride) {
	if (disableYoutube && !disableOverride) return
	if (!targets.some(rx => rx.test(url.href))) return
	if (initiator && all().includes(initiator.origin)) return "BYPASSTAB"

	if (type != ("main_frame" || "sub_frame")) return
	if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/)) return // Don't redirect YouTube Player API.
	if (onlyEmbeddedVideo == "onlyEmbedded" && type == "main_frame") return
	if (onlyEmbeddedVideo == "onlyNotEmbedded" && type == "sub_frame") return

	if (type == "main_frame") {
		switch (youtubeFrontend) {
			case "yatte":
				return url.href.replace(/^https?:\/{2}/, "yattee://")
			case "freetube":
				return `freetube://https://youtube.com${url.pathname}${url.search}`
		}
	}

	const instanceList = getInstanceList(type)
	try {
		if (instanceList.length >= 1) {
			const randomInstance = utils.getRandomInstance(instanceList)
			return `${randomInstance}${url.pathname}${url.search}`
		}
	} catch {
		return
	}
}

function reverse(url) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}
		resolve(`https://youtube.com${url.pathname}${url.search}`)
	})
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableYoutube && !disableOverride) {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}

		let instancesList = []
		switch (protocol) {
			case "loki":
				switch (youtubeFrontend) {
					case "invidious":
						instancesList = [...invidiousLokiRedirectsChecks, ...invidiousLokiCustomRedirects]
						break
					case "piped":
						instancesList = [...pipedLokiRedirectsChecks, ...pipedLokiCustomRedirects]
						break
					case "pipedMaterial":
						instancesList = [...pipedMaterialLokiRedirectsChecks, ...pipedMaterialLokiCustomRedirects]
						break
					case "cloudtube":
						instancesList = [...cloudtubeLokiRedirectsChecks, ...cloudtubeLokiCustomRedirects]
				}
				break
			case "i2p":
				switch (youtubeFrontend) {
					case "invidious":
						instancesList = [...invidiousI2pRedirectsChecks, ...invidiousI2pCustomRedirects]
						break
					case "piped":
						instancesList = [...pipedI2pRedirectsChecks, ...pipedI2pCustomRedirects]
						break
					case "pipedMaterial":
						instancesList = [...pipedMaterialI2pRedirectsChecks, ...pipedMaterialI2pCustomRedirects]
						break
					case "cloudtube":
						instancesList = [...cloudtubeI2pRedirectsChecks, ...cloudtubeI2pCustomRedirects]
				}
				break
			case "tor":
				switch (youtubeFrontend) {
					case "invidious":
						instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects]
						break
					case "piped":
						instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects]
						break
					case "pipedMaterial":
						instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects]
						break
					case "cloudtube":
						instancesList = [...cloudtubeTorRedirectsChecks, ...cloudtubeTorCustomRedirects]
				}
		}
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			switch (youtubeFrontend) {
				case "invidious":
					instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects]
					break
				case "piped":
					instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects]
					break
				case "pipedMaterial":
					instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects]
					break
				case "cloudtube":
					instancesList = [...cloudtubeNormalRedirectsChecks, ...cloudtubeNormalCustomRedirects]
			}
		}

		const i = instancesList.indexOf(protocolHost)
		if (i > -1) instancesList.splice(i, 1)
		if (instancesList.length == 0) {
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
					invidiousNormalRedirectsChecks = [...redirects.invidious.normal]
					pipedNormalRedirectsChecks = [...redirects.piped.normal]
					pipedMaterialNormalRedirectsChecks = [...redirects.pipedMaterial.normal]
					cloudtubeNormalRedirectsChecks = [...redirects.cloudtube.normal]
					for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
						const a = invidiousNormalRedirectsChecks.indexOf(instance)
						if (a > -1) invidiousNormalRedirectsChecks.splice(a, 1)

						const b = pipedNormalRedirectsChecks.indexOf(instance)
						if (b > -1) pipedNormalRedirectsChecks.splice(b, 1)

						const c = pipedMaterialNormalRedirectsChecks.indexOf(instance)
						if (c > -1) pipedMaterialNormalRedirectsChecks.splice(c, 1)

						const d = cloudtubeNormalRedirectsChecks.indexOf(instance)
						if (c > -1) cloudtubeNormalRedirectsChecks.splice(d, 1)
					}
					browser.storage.local.set(
						{
							disableYoutube: false,
							enableYoutubeCustomSettings: false,
							onlyEmbeddedVideo: "both",
							youtubeRedirects: redirects,
							youtubeFrontend: "invidious",

							invidiousNormalRedirectsChecks,
							invidiousNormalCustomRedirects: [],

							invidiousTorRedirectsChecks: [...redirects.invidious.tor],
							invidiousTorCustomRedirects: [],

							invidiousI2pRedirectsChecks: [...redirects.invidious.i2p],
							invidiousI2pCustomRedirects: [],

							invidiousLokiRedirectsChecks: [...redirects.invidious.loki],
							invidiousLokiCustomRedirects: [],

							pipedNormalRedirectsChecks,
							pipedNormalCustomRedirects: [],

							pipedTorRedirectsChecks: [...redirects.piped.tor],
							pipedTorCustomRedirects: [],

							pipedI2pRedirectsChecks: [...redirects.piped.i2p],
							pipedI2pCustomRedirects: [],

							pipedLokiRedirectsChecks: [...redirects.piped.loki],
							pipedLokiCustomRedirects: [],

							pipedMaterialNormalRedirectsChecks: pipedMaterialNormalRedirectsChecks,
							pipedMaterialNormalCustomRedirects: [],

							pipedMaterialTorRedirectsChecks: [...redirects.pipedMaterial.tor],
							pipedMaterialTorCustomRedirects: [],

							pipedMaterialI2pRedirectsChecks: [...redirects.pipedMaterial.i2p],
							pipedMaterialI2pCustomRedirects: [],

							pipedMaterialLokiRedirectsChecks: [...redirects.pipedMaterial.loki],
							pipedMaterialLokiCustomRedirects: [],

							cloudtubeNormalRedirectsChecks: cloudtubeNormalRedirectsChecks,
							cloudtubeNormalCustomRedirects: [],

							cloudtubeTorRedirectsChecks: [...redirects.cloudtube.tor],
							cloudtubeTorCustomRedirects: [],

							cloudtubeI2pRedirectsChecks: [...redirects.cloudtube.i2p],
							cloudtubeI2pCustomRedirects: [],

							cloudtubeLokiRedirectsChecks: [...redirects.cloudtube.loki],
							cloudtubeLokiCustomRedirects: [],

							youtubeEmbedFrontend: "invidious",
						},
						() => resolve()
					)
				})
			})
	})
}

function copyPasteInvidiousCookies(test, from) {
	return new Promise(async resolve => {
		await init()
		if (disableYoutube || youtubeFrontend != "invidious") {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(from)
		if (
			![
				...invidiousNormalRedirectsChecks,
				...invidiousTorRedirectsChecks,
				...invidiousNormalCustomRedirects,
				...invidiousTorCustomRedirects,
				...invidiousI2pCustomRedirects,
				...invidiousLokiCustomRedirects,
			].includes(protocolHost)
		) {
			resolve()
			return
		}
		if (!test) {
			let checkedInstances = []

			if (protocol == "loki") checkedInstances = [...invidiousLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...invidiousI2pCustomRedirects]
			else if (protocol == "tor") checkedInstances = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects]
			}
			const i = checkedInstances.indexOf(protocolHost)
			if (i !== -1) checkedInstances.splice(i, 1)
			await utils.copyCookie("invidious", from, checkedInstances, "PREFS")
		}
		resolve(true)
	})
}

function copyPastePipedLocalStorage(test, url, tabId) {
	return new Promise(async resolve => {
		await init()
		if (disableYoutube || youtubeFrontend != "piped") {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (
			![...pipedNormalCustomRedirects, ...pipedNormalRedirectsChecks, ...pipedTorRedirectsChecks, ...pipedTorCustomRedirects, ...pipedI2pCustomRedirects, ...pipedLokiCustomRedirects].includes(
				protocolHost
			)
		) {
			resolve()
			return
		}

		if (!test) {
			browser.tabs.executeScript(tabId, {
				file: "/assets/javascripts/youtube/get_piped_preferences.js",
				runAt: "document_start",
			})

			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...pipedLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...pipedI2pCustomRedirects]
			else if (protocol == "tor") checkedInstances = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...pipedNormalCustomRedirects, ...pipedNormalRedirectsChecks]
			}
			const i = checkedInstances.indexOf(protocolHost)
			if (i !== -1) checkedInstances.splice(i, 1)
			for (const to of checkedInstances) {
				browser.tabs.create({ url: to }, tab =>
					browser.tabs.executeScript(tab.id, {
						file: "/assets/javascripts/youtube/set_piped_preferences.js",
						runAt: "document_start",
					})
				)
			}
		}
		resolve(true)
	})
}

function copyPastePipedMaterialLocalStorage(test, url, tabId) {
	return new Promise(async resolve => {
		await init()
		if (disableYoutube || youtubeFrontend != "pipedMaterial") {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (
			![
				...pipedMaterialNormalRedirectsChecks,
				...pipedMaterialNormalCustomRedirects,
				//...pipedMaterialTorRedirectsChecks,
				...pipedMaterialTorCustomRedirects,
				...pipedMaterialI2pCustomRedirects,
				...pipedMaterialLokiCustomRedirects,
			].includes(protocolHost)
		) {
			resolve()
			return
		}

		if (!test) {
			browser.tabs.executeScript(tabId, {
				file: "/assets/javascripts/youtube/get_pipedMaterial_preferences.js",
				runAt: "document_start",
			})

			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...pipedMaterialLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...pipedMaterialI2pCustomRedirects]
			else if (protocol == "tor") checkedInstances = [...pipedMaterialTorCustomRedirects] //...pipedMaterialTorRedirectsChecks,
			if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects]
			}
			const i = checkedInstances.indexOf(protocolHost)
			if (i !== -1) checkedInstances.splice(i, 1)
			for (const to of checkedInstances)
				browser.tabs.create({ url: to }, tab =>
					browser.tabs.executeScript(tab.id, {
						file: "/assets/javascripts/youtube/set_pipedMaterial_preferences.js",
						runAt: "document_start",
					})
				)
		}
		resolve(true)
	})
}

function removeXFrameOptions(e) {
	let isChanged = false

	if (e.type == "main_frame") {
		for (const i in e.responseHeaders) {
			if (e.responseHeaders[i].name == "content-security-policy") {
				let instancesList = []
				switch (protocol) {
					case "loki":
						switch (youtubeFrontend) {
							case "invidious":
								instancesList = [...invidiousLokiRedirectsChecks, ...invidiousLokiCustomRedirects]
								break
							case "piped":
								instancesList = [...pipedLokiRedirectsChecks, ...pipedLokiCustomRedirects]
								break
							case "pipedMaterial":
								instancesList = [...pipedMaterialLokiRedirectsChecks, ...pipedMaterialLokiCustomRedirects]
								break
							case "cloudtube":
								instancesList = [...cloudtubeLokiRedirectsChecks, ...cloudtubeLokiCustomRedirects]
						}
						break
					case "i2p":
						switch (youtubeFrontend) {
							case "invidious":
								instancesList = [...invidiousI2pRedirectsChecks, ...invidiousI2pCustomRedirects]
								break
							case "piped":
								instancesList = [...pipedI2pRedirectsChecks, ...pipedI2pCustomRedirects]
								break
							case "pipedMaterial":
								instancesList = [...pipedMaterialI2pRedirectsChecks, ...pipedMaterialI2pCustomRedirects]
								break
							case "cloudtube":
								instancesList = [...cloudtubeI2pRedirectsChecks, ...cloudtubeI2pCustomRedirects]
						}
						break
					case "tor":
						switch (youtubeFrontend) {
							case "invidious":
								instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects]
								break
							case "piped":
								instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects]
								break
							case "pipedMaterial":
								instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects]
								break
							case "cloudtube":
								instancesList = [...cloudtubeTorRedirectsChecks, ...cloudtubeTorCustomRedirects]
						}
				}
				if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
					switch (youtubeFrontend) {
						case "invidious":
							instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects]
							break
						case "piped":
							instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects]
							break
						case "pipedMaterial":
							instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects]
							break
						case "cloudtube":
							instancesList = [...cloudtubeNormalRedirectsChecks, ...cloudtubeNormalCustomRedirects]
					}
				}
				let securityPolicyList = e.responseHeaders[i].value.split(";")
				for (const i in securityPolicyList) securityPolicyList[i] = securityPolicyList[i].trim()

				let newSecurity = ""
				for (const item of securityPolicyList) {
					if (item.trim() == "") continue
					let regex = item.match(/([a-z-]{0,}) (.*)/)
					if (regex == null) continue
					let [, key, vals] = regex
					if (key == "frame-src") vals = vals + " " + instancesList.join(" ")
					newSecurity += key + " " + vals + "; "
				}

				e.responseHeaders[i].value = newSecurity
				isChanged = true
			}
		}
	} else if (e.type == "sub_frame") {
		const url = new URL(e.url)
		const protocolHost = utils.protocolHost(url)
		if (all().includes(protocolHost)) {
			for (const i in e.responseHeaders) {
				if (e.responseHeaders[i].name == "x-frame-options") {
					e.responseHeaders.splice(i, 1)
					isChanged = true
				} else if (e.responseHeaders[i].name == "content-security-policy") {
					e.responseHeaders.splice(i, 1)
					isChanged = true
				}
			}
		}
	}
	if (isChanged) return { responseHeaders: e.responseHeaders }
}

export default {
	setRedirects,
	copyPastePipedLocalStorage,
	copyPastePipedMaterialLocalStorage,
	copyPasteInvidiousCookies,
	redirect,
	reverse,
	switchInstance,
	initDefaults,
	removeXFrameOptions,
}

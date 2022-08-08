"use strict"

import utils from "./utils.js"

window.browser = window.browser || window.chrome

const targets = [/^https?:\/{2}music\.youtube\.com(\/.*|$)/]

const frontends = new Array("beatbump", "hyperpipe")
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
			beatbumpNormalRedirectsChecks = [...redirects.beatbump.normal]
			hyperpipeNormalRedirectsChecks = [...redirects.hyperpipe.normal]
			for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
				const a = beatbumpNormalRedirectsChecks.indexOf(instance)
				if (a > -1) beatbumpNormalRedirectsChecks.splice(a, 1)

				const b = hyperpipeNormalRedirectsChecks.indexOf(instance)
				if (b > -1) hyperpipeNormalRedirectsChecks.splice(b, 1)
			}
			browser.storage.local.set(
				{
					youtubeMusicRedirects: redirects,
					beatbumpNormalRedirectsChecks,
					beatbumpTorRedirectsChecks: [...redirects.beatbump.tor],
					beatbumpI2pRedirectsChecks: [...redirects.beatbump.i2p],
					beatbumpLokiRedirectsChecks: [...redirects.beatbump.loki],
					hyperpipeNormalRedirectsChecks,
					hyperpipeTorRedirectsChecks: [...redirects.hyperpipe.tor],
					hyperpipeI2pRedirectsChecks: [...redirects.hyperpipe.i2p],
					hyperpipeLokiRedirectsChecks: [...redirects.hyperpipe.loki],
				},
				() => resolve()
			)
		})
	)
}

let disableYoutubeMusic,
	youtubeMusicFrontend,
	youtubeMusicRedirects,
	protocol,
	protocolFallback,
	beatbumpNormalRedirectsChecks,
	beatbumpNormalCustomRedirects,
	beatbumpTorRedirectsChecks,
	beatbumpTorCustomRedirects,
	beatbumpI2pRedirectsChecks,
	beatbumpI2pCustomRedirects,
	beatbumpLokiRedirectsChecks,
	beatbumpLokiCustomRedirects,
	hyperpipeNormalRedirectsChecks,
	hyperpipeNormalCustomRedirects,
	hyperpipeTorRedirectsChecks,
	hyperpipeTorCustomRedirects,
	hyperpipeI2pRedirectsChecks,
	hyperpipeI2pCustomRedirects,
	hyperpipeLokiRedirectsChecks,
	hyperpipeLokiCustomRedirects

function init() {
	return new Promise(async resolve => {
		browser.storage.local.get(
			[
				"disableYoutubeMusic",
				"youtubeMusicFrontend",
				"youtubeMusicRedirects",
				"protocol",
				"protocolFallback",
				"beatbumpNormalRedirectsChecks",
				"beatbumpNormalCustomRedirects",
				"beatbumpTorRedirectsChecks",
				"beatbumpTorCustomRedirects",
				"beatbumpI2pRedirectsChecks",
				"beatbumpI2pCustomRedirects",
				"beatbumpLokiRedirectsChecks",
				"beatbumpLokiCustomRedirects",
				"hyperpipeNormalRedirectsChecks",
				"hyperpipeNormalCustomRedirects",
				"hyperpipeTorRedirectsChecks",
				"hyperpipeTorCustomRedirects",
				"hyperpipeI2pRedirectsChecks",
				"hyperpipeI2pCustomRedirects",
				"hyperpipeLokiRedirectsChecks",
				"hyperpipeLokiCustomRedirects",
			],
			r => {
				disableYoutubeMusic = r.disableYoutubeMusic
				youtubeMusicFrontend = r.youtubeMusicFrontend
				youtubeMusicRedirects = r.youtubeMusicRedirects
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				beatbumpNormalRedirectsChecks = r.beatbumpNormalRedirectsChecks
				beatbumpNormalCustomRedirects = r.beatbumpNormalCustomRedirects
				beatbumpTorRedirectsChecks = r.beatbumpTorRedirectsChecks
				beatbumpTorCustomRedirects = r.beatbumpTorCustomRedirects
				beatbumpI2pRedirectsChecks = r.beatbumpI2pRedirectsChecks
				beatbumpI2pCustomRedirects = r.beatbumpI2pCustomRedirects
				beatbumpLokiRedirectsChecks = r.beatbumpLokiRedirectsChecks
				beatbumpLokiCustomRedirects = r.beatbumpLokiCustomRedirects
				hyperpipeNormalRedirectsChecks = r.hyperpipeNormalRedirectsChecks
				hyperpipeNormalCustomRedirects = r.hyperpipeNormalCustomRedirects
				hyperpipeTorRedirectsChecks = r.hyperpipeTorRedirectsChecks
				hyperpipeTorCustomRedirects = r.hyperpipeTorCustomRedirects
				hyperpipeI2pRedirectsChecks = r.hyperpipeI2pRedirectsChecks
				hyperpipeI2pCustomRedirects = r.hyperpipeI2pCustomRedirects
				hyperpipeLokiRedirectsChecks = r.hyperpipeLokiRedirectsChecks
				hyperpipeLokiCustomRedirects = r.hyperpipeLokiCustomRedirects
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function all() {
	return [
		...beatbumpNormalRedirectsChecks,
		...beatbumpNormalCustomRedirects,
		...beatbumpTorRedirectsChecks,
		...beatbumpTorCustomRedirects,
		...beatbumpI2pRedirectsChecks,
		...beatbumpI2pCustomRedirects,
		...beatbumpLokiRedirectsChecks,
		...beatbumpLokiCustomRedirects,
		...hyperpipeNormalRedirectsChecks,
		...hyperpipeNormalCustomRedirects,
		...hyperpipeTorRedirectsChecks,
		...hyperpipeTorCustomRedirects,
		...hyperpipeI2pRedirectsChecks,
		...hyperpipeI2pCustomRedirects,
		...hyperpipeLokiRedirectsChecks,
		...hyperpipeLokiCustomRedirects,
	]
}

function getInstanceList() {
	let tmpList = []
	switch (youtubeMusicFrontend) {
		case "beatbump":
			switch (protocol) {
				case "loki":
					tmpList = [...beatbumpLokiRedirectsChecks, ...beatbumpLokiCustomRedirects]
					break
				case "i2p":
					tmpList = [...beatbumpI2pRedirectsChecks, ...beatbumpI2pCustomRedirects]
					break
				case "tor":
					tmpList = [...beatbumpTorRedirectsChecks, ...beatbumpTorCustomRedirects]
			}
			if ((tmpList.length === 0 && protocolFallback) || protocol == "normal") {
				tmpList = [...beatbumpNormalRedirectsChecks, ...beatbumpNormalCustomRedirects]
			}
			break
		case "hyperpipe":
			switch (protocol) {
				case "loki":
					tmpList = [...hyperpipeLokiRedirectsChecks, ...hyperpipeLokiCustomRedirects]
					break
				case "i2p":
					tmpList = [...hyperpipeI2pRedirectsChecks, ...hyperpipeI2pCustomRedirects]
					break
				case "tor":
					tmpList = [...hyperpipeTorRedirectsChecks, ...hyperpipeTorCustomRedirects]
			}
			if ((tmpList.length === 0 && protocolFallback) || protocol == "normal") {
				tmpList = [...hyperpipeNormalRedirectsChecks, ...hyperpipeNormalCustomRedirects]
			}
	}
	return tmpList
}

function getUrl(randomInstance, url) {
	switch (youtubeMusicFrontend) {
		case "beatbump":
			return `${randomInstance}${url.pathname}${url.search}`
				.replace("/watch?v=", "/listen?id=")
				.replace("/channel/", "/artist/")
				.replace("/playlist?list=", "/playlist/VL")
				.replace(/\/search\?q=.*/, searchQuery => searchQuery.replace("?q=", "/") + "?filter=song")
		case "hyperpipe":
			return `${randomInstance}${url.pathname}${url.search}`.replace(/\/search\?q=.*/, searchQuery => searchQuery.replace("?q=", "/"))
	}
}

/* 
Video
https://music.youtube.com/watch?v=_PkGiKBW-DA&list=RDAMVM_PkGiKBW-DA
https://beatbump.ml/listen?id=_PkGiKBW-DA&list=RDAMVM_PkGiKBW-DA

Playlist
https://music.youtube.com/playlist?list=PLqxd0OMLeWy64zlwhjouj92ISc38FbOns
https://music.youtube.com/playlist?list=PLqxd0OMLeWy7lrJSzt9LnOJjbC1IaruPM
https://music.youtube.com/playlist?list=PLQod4DlD72ZMJmOrSNbmEmK_iZ1oXPzKd
https://beatbump.ml/playlist/VLPLqxd0OMLeWy64zlwhjouj92ISc38FbOns

Channel
https://music.youtube.com/channel/UCfgmMDI7T5tOQqjnOBRe_wg
https://beatbump.ml/artist/UCfgmMDI7T5tOQqjnOBRe_wg

Albums
https://music.youtube.com/playlist?list=OLAK5uy_n-9HVh3cryV2gREZM9Sc0JwEKYjjfi0dU
https://music.youtube.com/playlist?list=OLAK5uy_lcr5O1zS8f6WIFI_yxqVp2RK9Dyy2bbw0
https://beatbump.ml/release?id=MPREb_3DURc4yEUtD
https://beatbump.ml/release?id=MPREb_evaZrV1WNdS

https://music.youtube.com/playlist?list=OLAK5uy_n6OHVllUZUCnlIY1m-gUaH8uqkN3Y-Ca8
https://music.youtube.com/playlist?list=OLAK5uy_nBOTxAc3_RGB82-Z54jdARGxGaCYlpngY
https://beatbump.ml/release?id=MPREb_QygdC0wEoLe

https://music.youtube.com/watch?v=R6gSMSYKhKU&list=OLAK5uy_n-9HVh3cryV2gREZM9Sc0JwEKYjjfi0dU

Search
https://music.youtube.com/search?q=test
https://beatbump.ml/search/test?filter=EgWKAQIIAWoKEAMQBBAKEAkQBQ%3D%3D

*/
function redirect(url, type, initiator, disableOverride) {
	if (disableYoutubeMusic && !disableOverride) return
	if (!targets.some(rx => rx.test(url.href))) return

	let instancesList = getInstanceList()

	if (instancesList.length === 0) return
	const randomInstance = utils.getRandomInstance(instancesList)
	return getUrl(randomInstance, url)
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableYoutubeMusic && !disableOverride) {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}

		let instancesList = getInstanceList()

		const i = instancesList.indexOf(protocolHost)
		if (i > -1) instancesList.splice(i, 1)
		if (instancesList.length === 0) {
			resolve()
			return
		}

		const randomInstance = utils.getRandomInstance(instancesList)
		return getUrl(randomInstance, url)
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
				browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], async r => {
					beatbumpNormalRedirectsChecks = [...redirects.beatbump.normal]
					hyperpipeNormalRedirectsChecks = [...redirects.hyperpipe.normal]
					for (const instance of [...r.cloudflareBlackList, ...r.offlineBlackList]) {
						const a = beatbumpNormalRedirectsChecks.indexOf(instance)
						if (a > -1) beatbumpNormalRedirectsChecks.splice(a, 1)

						const b = hyperpipeNormalRedirectsChecks.indexOf(instance)
						if (b > -1) hyperpipeNormalRedirectsChecks.splice(b, 1)
					}
					browser.storage.local.set(
						{
							disableYoutubeMusic: false,
							youtubeMusicFrontend: "hyperpipe",
							youtubeMusicRedirects: redirects,

							beatbumpNormalRedirectsChecks,
							beatbumpNormalCustomRedirects: [],

							beatbumpTorRedirectsChecks: [...redirects.beatbump.tor],
							beatbumpTorCustomRedirects: [],

							beatbumpI2pRedirectsChecks: [...redirects.beatbump.i2p],
							beatbumpI2pCustomRedirects: [],

							beatbumpLokiRedirectsChecks: [...redirects.beatbump.loki],
							beatbumpLokiCustomRedirects: [],

							hyperpipeNormalRedirectsChecks,
							hyperpipeNormalCustomRedirects: [],

							hyperpipeTorRedirectsChecks: [...redirects.hyperpipe.tor],
							hyperpipeTorCustomRedirects: [],

							hyperpipeI2pRedirectsChecks: [...redirects.hyperpipe.i2p],
							hyperpipeI2pCustomRedirects: [],

							hyperpipeLokiRedirectsChecks: [...redirects.hyperpipe.loki],
							hyperpipeLokiCustomRedirects: [],
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

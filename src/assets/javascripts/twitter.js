window.browser = window.browser || window.chrome

import utils from "./utils.js"

const targets = [/^https?:\/{2}(www\.|mobile\.|)twitter\.com/, /^https?:\/{2}(pbs\.|video\.|)twimg\.com/, /^https?:\/{2}platform\.twitter\.com\/embed/, /^https?:\/{2}t\.co/]

const frontends = new Array("nitter")
const protocols = new Array("normal", "tor", "i2p", "loki")

let redirects = {}

for (let i = 0; i < frontends.length; i++) {
	redirects[frontends[i]] = {}
	for (let x = 0; x < protocols.length; x++) {
		redirects[frontends[i]][protocols[x]] = []
	}
}

function setRedirects(val) {
	browser.storage.local.get(["cloudflareBlackList", "authenticateBlackList"], r => {
		redirects.nitter = val
		nitterNormalRedirectsChecks = [...redirects.nitter.normal]
		for (const instance of [...r.cloudflareBlackList, ...r.authenticateBlackList]) {
			let i = nitterNormalRedirectsChecks.indexOf(instance)
			if (i > -1) nitterNormalRedirectsChecks.splice(i, 1)
		}
		browser.storage.local.set({
			twitterRedirects: redirects,
			nitterNormalRedirectsChecks,
			nitterTorRedirectsChecks: [...redirects.nitter.tor],
		})
	})
}

let disableTwitter,
	protocol,
	protocolFallback,
	twitterRedirects,
	twitterRedirectType,
	nitterNormalRedirectsChecks,
	nitterNormalCustomRedirects,
	nitterTorRedirectsChecks,
	nitterTorCustomRedirects,
	nitterI2pCustomRedirects,
	nitterLokiCustomRedirects

function init() {
	return new Promise(async resolve => {
		browser.storage.local.get(
			[
				"disableTwitter",
				"protocol",
				"protocolFallback",
				"twitterRedirects",
				"twitterRedirectType",
				"nitterNormalRedirectsChecks",
				"nitterNormalCustomRedirects",
				"nitterTorRedirectsChecks",
				"nitterTorCustomRedirects",
				"nitterI2pCustomRedirects",
				"nitterLokiCustomRedirects",
			],
			r => {
				disableTwitter = r.disableTwitter
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				twitterRedirects = r.twitterRedirects
				twitterRedirectType = r.twitterRedirectType
				nitterNormalRedirectsChecks = r.nitterNormalRedirectsChecks
				nitterNormalCustomRedirects = r.nitterNormalCustomRedirects
				nitterTorRedirectsChecks = r.nitterTorRedirectsChecks
				nitterTorCustomRedirects = r.nitterTorCustomRedirects
				nitterI2pCustomRedirects = r.nitterI2pCustomRedirects
				nitterLokiCustomRedirects = r.nitterLokiCustomRedirects
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function all() {
	return [...nitterNormalRedirectsChecks, ...nitterTorRedirectsChecks, ...nitterNormalCustomRedirects, ...nitterTorCustomRedirects, ...nitterI2pCustomRedirects, ...nitterLokiCustomRedirects]
}

function redirect(url, type, initiator, disableOverride) {
	if (disableTwitter && !disableOverride) return
	if (!targets.some(rx => rx.test(url.href))) return
	if (url.pathname.split("/").includes("home")) return
	if (initiator && all().includes(initiator.origin)) return "BYPASSTAB"
	if (twitterRedirectType == "sub_frame" && type == "main_frame") return
	if (twitterRedirectType == "main_frame" && type != "main_frame") return

	let instancesList = []
	if (protocol == "loki") instancesList = [...nitterI2pCustomRedirects]
	else if (protocol == "i2p") instancesList = [...nitterLokiCustomRedirects]
	else if (protocol == "tor") instancesList = [...nitterTorRedirectsChecks, ...nitterTorCustomRedirects]
	if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
		instancesList = [...nitterNormalRedirectsChecks, ...nitterNormalCustomRedirects]
	}
	if (instancesList.length === 0) return

	const randomInstance = utils.getRandomInstance(instancesList)
	// https://pbs.twimg.com/profile_images/648888480974508032/66_cUYfj_400x400.jpg
	if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video") {
		const [, id, format, extra] = url.search.match(/(.*)\?format=(.*)&(.*)/)
		const query = encodeURIComponent(`${id}.${format}?${extra}`)
		return `${randomInstance}/pic${url.pathname}${query}`
	} else if (url.pathname.split("/").includes("tweets")) return `${randomInstance}${url.pathname.replace("/tweets", "")}${url.search}`
	else if (url.host == "t.co") return `${randomInstance}/t.co${url.pathname}`
	else return `${randomInstance}${url.pathname}${url.search}`
}

function reverse(url) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}
		resolve(`https://twitter.com${url.pathname}${url.search}`)
	})
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableTwitter && !disableOverride) {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}
		let instancesList = []
		if (protocol == "loki") instancesList = [...nitterI2pCustomRedirects]
		else if (protocol == "i2p") instancesList = [...nitterLokiCustomRedirects]
		else if (protocol == "tor") instancesList = [...nitterTorRedirectsChecks, ...nitterTorCustomRedirects]
		if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
			instancesList = [...nitterNormalRedirectsChecks, ...nitterNormalCustomRedirects]
		}

		let index = instancesList.indexOf(protocolHost)
		if (index > -1) instancesList.splice(index, 1)
		if (instancesList.length === 0) {
			resolve()
			return
		}

		const randomInstance = utils.getRandomInstance(instancesList)
		resolve(`${randomInstance}${url.pathname}${url.search}`)
	})
}

function removeXFrameOptions(e) {
	if (e.type != "sub_frame") return
	let url = new URL(e.url)
	let protocolHost = utils.protocolHost(url)
	if (!all().includes(protocolHost)) return
	let isChanged = false
	for (const i in e.responseHeaders) {
		if (e.responseHeaders[i].name == "x-frame-options") {
			e.responseHeaders.splice(i, 1)
			isChanged = true
		} else if (e.responseHeaders[i].name == "content-security-policy") {
			e.responseHeaders.splice(i, 1)
			isChanged = true
		}
	}
	if (isChanged) return { responseHeaders: e.responseHeaders }
}

function initNitterCookies(test, from) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(from)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}
		if (!test) {
			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...nitterI2pCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...nitterLokiCustomRedirects]
			else if (protocol == "tor") checkedInstances = [...nitterTorRedirectsChecks, ...nitterTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...nitterNormalRedirectsChecks, ...nitterNormalCustomRedirects]
			}
			await utils.copyCookie("nitter", from, checkedInstances, "theme")
			await utils.copyCookie("nitter", from, checkedInstances, "infiniteScroll")
			await utils.copyCookie("nitter", from, checkedInstances, "stickyProfile")
			await utils.copyCookie("nitter", from, checkedInstances, "bidiSupport")
			await utils.copyCookie("nitter", from, checkedInstances, "hideTweetStats")
			await utils.copyCookie("nitter", from, checkedInstances, "hideBanner")
			await utils.copyCookie("nitter", from, checkedInstances, "hidePins")
			await utils.copyCookie("nitter", from, checkedInstances, "hideReplies")
			await utils.copyCookie("nitter", from, checkedInstances, "squareAvatars")
			await utils.copyCookie("nitter", from, checkedInstances, "mp4Playback")
			await utils.copyCookie("nitter", from, checkedInstances, "hlsPlayback")
			await utils.copyCookie("nitter", from, checkedInstances, "proxyVideos")
			await utils.copyCookie("nitter", from, checkedInstances, "muteVideos")
			await utils.copyCookie("nitter", from, checkedInstances, "autoplayGifs")

			await utils.copyCookie("nitter", from, checkedInstances, "replaceInstagram")
			await utils.copyCookie("nitter", from, checkedInstances, "replaceReddit")
			await utils.copyCookie("nitter", from, checkedInstances, "replaceTwitter")
			await utils.copyCookie("nitter", from, checkedInstances, "replaceYouTube")
		}
		resolve(true)
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
				browser.storage.local.get(["cloudflareBlackList", "authenticateBlackList"], async r => {
					nitterNormalRedirectsChecks = [...redirects.nitter.normal]
					for (const instance of [...r.cloudflareBlackList, ...r.authenticateBlackList]) {
						let i = nitterNormalRedirectsChecks.indexOf(instance)
						if (i > -1) nitterNormalRedirectsChecks.splice(i, 1)
					}
					browser.storage.local.set(
						{
							disableTwitter: false,
							twitterRedirects: redirects,
							twitterRedirectType: "both",

							nitterNormalRedirectsChecks: nitterNormalRedirectsChecks,
							nitterNormalCustomRedirects: [],

							nitterTorRedirectsChecks: [...redirects.nitter.tor],
							nitterTorCustomRedirects: [],

							nitterI2pRedirectsChecks: [...redirects.nitter.i2p],
							nitterI2pCustomRedirects: [],

							nitterLokiRedirectsChecks: [...redirects.nitter.loki],
							nitterLokiCustomRedirects: [],
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
	reverse,
	removeXFrameOptions,
	initNitterCookies,
	initDefaults,
}

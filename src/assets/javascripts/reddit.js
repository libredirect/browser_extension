window.browser = window.browser || window.chrome

import utils from "./utils.js"

const targets = [/^https?:\/{2}(www\.|old\.|np\.|new\.|amp\.|)reddit\.com/, /^https?:\/{2}(i\.|preview\.)redd\.it/]
let redirects = {}

const frontends = new Array("libreddit", "teddit")
const protocols = new Array("normal", "tor", "i2p", "loki")

for (let i = 0; i < frontends.length; i++) {
	redirects[frontends[i]] = {}
	for (let x = 0; x < protocols.length; x++) {
		redirects[frontends[i]][protocols[x]] = []
	}
}

function setRedirects(val) {
	browser.storage.local.get("cloudflareBlackList", r => {
		redirects = val
		libredditNormalRedirectsChecks = [...redirects.libreddit.normal]
		tedditNormalRedirectsChecks = [...redirects.teddit.normal]
		for (const instance of r.cloudflareBlackList) {
			const a = libredditNormalRedirectsChecks.indexOf(instance)
			if (a > -1) libredditNormalRedirectsChecks.splice(a, 1)

			const b = tedditNormalRedirectsChecks.indexOf(instance)
			if (b > -1) tedditNormalRedirectsChecks.splice(b, 1)
		}
		browser.storage.local.set({
			redditRedirects: redirects,
			libredditNormalRedirectsChecks,
			tedditNormalRedirectsChecks,
		})
	})
}

let disableReddit,
	redditFrontend,
	redditRedirects,
	protocol,
	protocolFallback,
	libredditNormalRedirectsChecks,
	libredditNormalCustomRedirects,
	libredditTorRedirectsChecks,
	libredditTorCustomRedirects,
	libredditI2pCustomRedirects,
	libredditLokiCustomRedirects,
	tedditNormalRedirectsChecks,
	tedditNormalCustomRedirects,
	tedditTorRedirectsChecks,
	tedditTorCustomRedirects,
	tedditI2pCustomRedirects,
	tedditLokiCustomRedirects

function init() {
	return new Promise(resolve => {
		browser.storage.local.get(
			[
				"disableReddit",
				"redditFrontend",
				"redditRedirects",
				"protocol",
				"protocolFallback",
				"libredditNormalRedirectsChecks",
				"libredditNormalCustomRedirects",
				"libredditTorRedirectsChecks",
				"libredditTorCustomRedirects",
				"libredditI2pCustomRedirects",
				"libredditLokiCustomRedirects",
				"tedditNormalRedirectsChecks",
				"tedditNormalCustomRedirects",
				"tedditTorRedirectsChecks",
				"tedditTorCustomRedirects",
				"tedditI2pCustomRedirects",
				"tedditLokiCustomRedirects",
			],
			r => {
				disableReddit = r.disableReddit
				redditFrontend = r.redditFrontend
				redditRedirects = r.redditRedirects
				protocol = r.protocol
				protocolFallback = r.protocolFallback
				libredditNormalRedirectsChecks = r.libredditNormalRedirectsChecks
				libredditNormalCustomRedirects = r.libredditNormalCustomRedirects
				libredditTorRedirectsChecks = r.libredditTorRedirectsChecks
				libredditTorCustomRedirects = r.libredditTorCustomRedirects
				libredditI2pCustomRedirects = r.libredditI2pCustomRedirects
				libredditLokiCustomRedirects = r.libredditLokiCustomRedirects
				tedditNormalRedirectsChecks = r.tedditNormalRedirectsChecks
				tedditNormalCustomRedirects = r.tedditNormalCustomRedirects
				tedditTorRedirectsChecks = r.tedditTorRedirectsChecks
				tedditTorCustomRedirects = r.tedditTorCustomRedirects
				tedditI2pCustomRedirects = r.tedditI2pCustomRedirects
				tedditLokiCustomRedirects = r.tedditLokiCustomRedirects
				resolve()
			}
		)
	})
}

init()
browser.storage.onChanged.addListener(init)

function initLibredditCookies(test, from) {
	return new Promise(async resolve => {
		await init()
		const protocolHost = utils.protocolHost(from)
		if (
			![
				...libredditNormalRedirectsChecks,
				...libredditTorRedirectsChecks,
				...libredditNormalCustomRedirects,
				...libredditTorCustomRedirects,
				...libredditI2pCustomRedirects,
				...libredditLokiCustomRedirects,
			].includes(protocolHost)
		) {
			resolve()
			return
		}

		if (!test) {
			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...libredditLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...libredditI2pCustomRedirects]
			else if (protocol == "tor") checkedInstances = [...libredditTorRedirectsChecks, ...libredditTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects]
			}
			await utils.copyCookie("libreddit", from, checkedInstances, "theme")
			await utils.copyCookie("libreddit", from, checkedInstances, "front_page")
			await utils.copyCookie("libreddit", from, checkedInstances, "layout")
			await utils.copyCookie("libreddit", from, checkedInstances, "wide")
			await utils.copyCookie("libreddit", from, checkedInstances, "post_sort")
			await utils.copyCookie("libreddit", from, checkedInstances, "comment_sort")
			await utils.copyCookie("libreddit", from, checkedInstances, "show_nsfw")
			await utils.copyCookie("libreddit", from, checkedInstances, "autoplay_videos")
			await utils.copyCookie("libreddit", from, checkedInstances, "use_hls")
			await utils.copyCookie("libreddit", from, checkedInstances, "hide_hls_notification")
			await utils.copyCookie("libreddit", from, checkedInstances, "subscriptions")
			await utils.copyCookie("libreddit", from, checkedInstances, "filters")
		}
		resolve(true)
	})
}

function initTedditCookies(test, from) {
	return new Promise(async resolve => {
		await init()
		let protocolHost = utils.protocolHost(from)
		if (
			![...tedditNormalRedirectsChecks, ...tedditTorRedirectsChecks, ...tedditNormalCustomRedirects, ...tedditTorCustomRedirects, ...tedditI2pCustomRedirects, ...tedditI2pCustomRedirects].includes(
				protocolHost
			)
		)
			resolve()

		if (!test) {
			let checkedInstances = []
			if (protocol == "loki") checkedInstances = [...tedditLokiCustomRedirects]
			else if (protocol == "i2p") checkedInstances = [...tedditI2pCustomRedirects]
			else if (protocol == "tor") checkedInstances = [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects]
			if ((checkedInstances.length === 0 && protocolFallback) || protocol == "normal") {
				checkedInstances = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects]
			}
			await utils.copyCookie("teddit", from, checkedInstances, "collapse_child_comments")
			await utils.copyCookie("teddit", from, checkedInstances, "domain_instagram")
			await utils.copyCookie("teddit", from, checkedInstances, "domain_twitter")
			await utils.copyCookie("teddit", from, checkedInstances, "domain_youtube")
			await utils.copyCookie("teddit", from, checkedInstances, "flairs")
			await utils.copyCookie("teddit", from, checkedInstances, "highlight_controversial")
			await utils.copyCookie("teddit", from, checkedInstances, "nsfw_enabled")
			await utils.copyCookie("teddit", from, checkedInstances, "post_media_max_height")
			await utils.copyCookie("teddit", from, checkedInstances, "show_upvoted_percentage")
			await utils.copyCookie("teddit", from, checkedInstances, "show_upvotes")
			await utils.copyCookie("teddit", from, checkedInstances, "theme")
			await utils.copyCookie("teddit", from, checkedInstances, "videos_muted")
		}
		resolve(true)
	})
}

function all() {
	return [
		...redditRedirects.libreddit.normal,
		...redditRedirects.libreddit.tor,
		...redditRedirects.teddit.normal,
		...redditRedirects.teddit.tor,
		...libredditNormalCustomRedirects,
		...libredditTorCustomRedirects,
		...libredditI2pCustomRedirects,
		...libredditLokiCustomRedirects,
		...tedditNormalCustomRedirects,
		...tedditTorCustomRedirects,
		...tedditI2pCustomRedirects,
		...tedditLokiCustomRedirects,
	]
}

// https://libreddit.exonip.de/vid/1mq8d0ma3yk81/720.mp4
// https://libreddit.exonip.de/img/4v3t1vgvrzk81.png

// https://teddit.net/vids/1mq8d0ma3yk81.mp4
// https://teddit.net/pics/w:null_4v3t1vgvrzk81.png

// redd.it/t5379n
// https://v.redd.it/z08avb339n801/DASH_1_2_M
// https://i.redd.it/bfkhs659tzk81.jpg
function redirect(url, type, initiator, disableOverride) {
	if (disableReddit && !disableOverride) return
	if (!targets.some(rx => rx.test(url.href))) return
	if (initiator && all().includes(initiator.origin)) return "BYPASSTAB"
	if (!["main_frame", "xmlhttprequest", "other", "image", "media"].includes(type)) return
	const bypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/
	if (url.pathname.match(bypassPaths)) return

	let libredditInstancesList = []
	let tedditInstancesList = []

	if (protocol == "loki") {
		libredditInstancesList = [...libredditLokiCustomRedirects]
		tedditInstancesList = [...tedditLokiCustomRedirects]
	} else if (protocol == "i2p") {
		libredditInstancesList = [...libredditI2pCustomRedirects]
		tedditInstancesList = [...tedditI2pCustomRedirects]
	} else if (protocol == "tor") {
		libredditInstancesList = [...libredditTorRedirectsChecks, ...libredditTorCustomRedirects]
		tedditInstancesList = [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects]
	}
	if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
		libredditInstancesList = [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects]
		tedditInstancesList = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects]
	}

	if (url.host === "i.redd.it") {
		if (redditFrontend == "teddit") {
			if (tedditInstancesList.length === 0) return
			let tedditRandomInstance = utils.getRandomInstance(tedditInstancesList)
			return `${tedditRandomInstance}/pics/w:null_${url.pathname.substring(1)}${url.search}`
		}
		if (redditFrontend == "libreddit") {
			if (libredditInstancesList.length === 0) return
			let libredditRandomInstance = utils.getRandomInstance(libredditInstancesList)
			return `${libredditRandomInstance}/img${url.pathname}${url.search}`
		}
	} else if (url.host === "redd.it") {
		if (redditFrontend == "libreddit" && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) {
			if (libredditInstancesList.length === 0) return
			let libredditRandomInstance = utils.getRandomInstance(libredditInstancesList)
			// https://redd.it/foo => https://libredd.it/comments/foo
			return `${libredditRandomInstance}/comments${url.pathname}${url.search}`
		}
		if (redditFrontend == "teddit" && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) {
			if (tedditInstancesList.length === 0) return
			let tedditRandomInstance = utils.getRandomInstance(tedditInstancesList)
			// https://redd.it/foo => https://teddit.net/comments/foo
			return `${tedditRandomInstance}/comments${url.pathname}${url.search}`
		}
	} else if (url.host === "preview.redd.it") {
		if (redditFrontend == "teddit") return
		if (redditFrontend == "libreddit") {
			if (libredditInstancesList.length === 0) return
			const libredditRandomInstance = utils.getRandomInstance(libredditInstancesList)
			return `${libredditRandomInstance}/preview/pre${url.pathname}${url.search}`
		}
	}

	let randomInstance
	if (redditFrontend == "libreddit") {
		if (libredditInstancesList.length === 0) return
		randomInstance = utils.getRandomInstance(libredditInstancesList)
	}
	if (redditFrontend == "teddit") {
		if (tedditInstancesList.length === 0) return
		randomInstance = utils.getRandomInstance(tedditInstancesList)
	}
	return `${randomInstance}${url.pathname}${url.search}`
}

function switchInstance(url, disableOverride) {
	return new Promise(async resolve => {
		await init()
		if (disableReddit && !disableOverride) {
			resolve()
			return
		}
		const protocolHost = utils.protocolHost(url)
		if (!all().includes(protocolHost)) {
			resolve()
			return
		}
		let instancesList = []
		if (redditFrontend == "libreddit") {
			if (protocol == "loki") instancesList = [...libredditLokiCustomRedirects]
			else if (protocol == "i2p") instancesList = [...libredditI2pCustomRedirects]
			else if (protocol == "tor") instancesList = [...libredditTorRedirectsChecks, ...libredditTorCustomRedirects]
			if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
				instancesList = [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects]
			}
			if ([...redditRedirects.teddit.normal, ...redditRedirects.teddit.tor].includes(protocolHost)) url.pathname = url.pathname.replace("/pics/w:null_", "/img/")
		} else if (redditFrontend == "teddit") {
			if (protocol == "loki") instancesList = [...tedditLokiCustomRedirects]
			else if (protocol == "i2p") instancesList = [...tedditI2pCustomRedirects]
			else if (protocol == "tor") instancesList = [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects]
			if ((instancesList.length === 0 && protocolFallback) || protocol == "normal") {
				instancesList = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects]
			}
			if ([...redditRedirects.libreddit.normal, ...redditRedirects.libreddit.tor].includes(protocolHost)) url.pathname = url.pathname.replace("/img/", "/pics/w:null_")
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
			.then(async data => {
				let dataJson = JSON.parse(data)
				for (let i = 0; i < frontends.length; i++) {
					redirects[frontends[i]] = dataJson[frontends[i]]
				}
				browser.storage.local.get("cloudflareBlackList", async r => {
					libredditNormalRedirectsChecks = [...redirects.libreddit.normal]
					tedditNormalRedirectsChecks = [...redirects.teddit.normal]
					for (const instance of r.cloudflareBlackList) {
						let i

						i = libredditNormalRedirectsChecks.indexOf(instance)
						if (i > -1) libredditNormalRedirectsChecks.splice(i, 1)

						i = tedditNormalRedirectsChecks.indexOf(instance)
						if (i > -1) tedditNormalRedirectsChecks.splice(i, 1)
					}
					browser.storage.local.set(
						{
							disableReddit: false,
							redditFrontend: "libreddit",
							redditRedirects: redirects,

							libredditNormalRedirectsChecks: libredditNormalRedirectsChecks,
							libredditNormalCustomRedirects: [],

							libredditTorRedirectsChecks: [...redirects.libreddit.tor],
							libredditTorCustomRedirects: [],

							libredditI2pRedirectsChecks: [...redirects.libreddit.i2p],
							libredditI2pCustomRedirects: [],

							libredditLokiRedirectsChecks: [...redirects.libreddit.loki],
							libredditLokiCustomRedirects: [],

							tedditNormalRedirectsChecks: tedditNormalRedirectsChecks,
							tedditNormalCustomRedirects: [],

							tedditTorRedirectsChecks: [...redirects.teddit.tor],
							tedditTorCustomRedirects: [],

							tedditI2pRedirectsChecks: [...redirects.teddit.i2p],
							tedditI2pCustomRedirects: [],

							tedditLokiRedirectsChecks: [...redirects.teddit.loki],
							tedditLokiCustomRedirects: [],
						},
						() => resolve()
					)
				})
			})
	})
}

export default {
	setRedirects,
	initLibredditCookies,
	initTedditCookies,

	redirect,
	initDefaults,
	switchInstance,
}

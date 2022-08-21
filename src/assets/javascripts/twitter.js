"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "twitter",
	frontends: ["nitter"],
	unify: {
		cookies: {
			nitter: [
				"theme",
				"infiniteScroll",
				"stickyProfile",
				"bidiSupport",
				"hideTweetStats",
				"hideBanner",
				"hidePins",
				"hideReplies",
				"squareAvatars",
				"mp4Playback",
				"hlsPlayback",
				"proxyVideos",
				"muteVideos",
				"autoplayGifs",
				"replaceInstagram",
				"replaceReddit",
				"replaceTwitter",
				"replaceYouTube",
			],
		},
	},
	redirect: (url, type) => {
		const targets = [/^https?:\/{2}(www\.|mobile\.|)twitter\.com/, /^https?:\/{2}(pbs\.|video\.|)twimg\.com/, /^https?:\/{2}platform\.twitter\.com\/embed/, /^https?:\/{2}t\.co/]
		if (!targets.some(rx => rx.test(url.href))) return
		if (url.pathname.split("/").includes("home")) return "SKIP"
		if (twitterRedirectType == "main_frame" && type != "main_frame") return "SKIP"

		let search = new URLSearchParams(url.search)

		search.delete("ref_src")
		search.delete("ref_url")

		search = search.toString()
		if (search !== "") search = `?${search}`

		const protocolHost = utils.protocolHost(url)

		// https://pbs.twimg.com/profile_images/648888480974508032/66_cUYfj_400x400.jpg
		if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video") {
			const [, id, format, extra] = search.match(/(.*)\?format=(.*)&(.*)/)
			const query = encodeURIComponent(`${id}.${format}?${extra}`)
			return `${protocolHost}/pic${search}${query}`
		}
		if (url.pathname.split("/").includes("tweets")) {
			return `${protocolHost}${url.pathname.replace("/tweets", "")}${search}`
		}
		if (url.host == "t.co") {
			return `${protocolHost}/t.co${url.pathname}`
		}
		return `${protocolHost}${url.pathname}${search}`
	},
	reverse: url => {
		return `https://twitter.com${url.pathname}${url.search}`
	},
})

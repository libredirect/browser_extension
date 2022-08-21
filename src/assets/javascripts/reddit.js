"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "reddit",
	frontends: ["libreddit", "teddit"],
	unify: {
		cookies: {
			libreddit: ["theme", "front_page", "layout", "wide", "post_sort", "comment_sort", "show_nsfw", "autoplay_videos", "use_hls", "hide_hls_notification", "subscriptions", "filters"],

			teddit: [
				"collapse_child_comments",
				"domain_instagram",
				"domain_twitter",
				"domain_youtube",
				"flairs",
				"highlight_controversial",
				"nsfw_enabled",
				"post_media_max_height",
				"show_upvoted_percentage",
				"show_upvotes",
				"theme",
				"videos_muted",
			],
		},
	},
	redirect: (url, type, frontend) => {
		const targets = [/^https?:\/{2}(www\.|old\.|np\.|new\.|amp\.|)reddit\.com/, /^https?:\/{2}(i\.|preview\.)redd\.it/]
		if (!targets.some(rx => rx.test(url.href))) return

		const bypassTypes = ["main_frame", "xmlhttprequest", "other", "image", "media"]
		if (!bypassTypes.includes(type)) return "SKIP"

		const bypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/
		if (url.pathname.match(bypassPaths)) return "SKIP"

		const protocolHost = utils.protocolHost(url)

		if (url.host === "i.redd.it") {
			if (frontend == "libreddit") return `${protocolHost}/img${url.pathname}${url.search}`
			if (frontend == "teddit") return `${protocolHost}/pics/w:null_${url.pathname.substring(1)}${url.search}`
		}

		if (url.host === "redd.it") {
			return `${protocolHost}/comments${url.pathname}${url.search}`
		}

		if (url.host === "preview.redd.it") {
			if (frontend == "libreddit") return `${protocolHost}/preview/pre${url.pathname}${url.search}`
			if (frontend == "teddit") return "SKIP"
		}

		return `${url.href}`
	},
})

// https://libreddit.exonip.de/vid/1mq8d0ma3yk81/720.mp4
// https://libreddit.exonip.de/img/4v3t1vgvrzk81.png

// https://teddit.net/vids/1mq8d0ma3yk81.mp4
// https://teddit.net/pics/w:null_4v3t1vgvrzk81.png

// redd.it/t5379n
// https://v.redd.it/z08avb339n801/DASH_1_2_M
// https://i.redd.it/bfkhs659tzk81.jpg

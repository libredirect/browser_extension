"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "youtube",
	frontends: ["invidious", "piped", "pipedMaterial", "cloudtube"],
	unify: {
		cookies: {
			invidious: ["PREFS"],
		},
		localStorage: {
			piped: [
				"bufferGoal",
				"comments",
				"disableLBRY",
				"enabledCodecs",
				"hl",
				"homepage",
				"instance",
				"listen",
				"minimizeDescription",
				"playerAutoPlay",
				"proxyLBRY",
				"quality",
				"region",
				"selectedSkip",
				"sponsorblock",
				"theme",
				"volume",
				"watchHistory",
			],
			pipedMaterial: ["PREFERENCES"],
		},
	},
	redirect: (url, type) => {
		const targets = [
			/^https?:\/{2}(www\.|music\.|m\.|)youtube\.com(\/.*|$)/,

			/^https?:\/{2}img\.youtube\.com\/vi\/.*\/..*/, // https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
			/^https?:\/{2}(i|s)\.ytimg\.com\/vi\/.*\/..*/,

			/^https?:\/{2}(www\.|music\.|)youtube\.com\/watch\?v\=..*/,

			/^https?:\/{2}youtu\.be\/..*/,

			/^https?:\/{2}(www\.|)(youtube|youtube-nocookie)\.com\/embed\/..*/,
		]
		if (!targets.some(rx => rx.test(url.href))) return
		if (type != ("main_frame" || "sub_frame")) return "SKIP"
		if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/)) return "SKIP" // Don't redirect YouTube Player API.
		if (onlyEmbeddedVideo == "onlyNotEmbedded" && type == "sub_frame") return "SKIP"

		// return url.href.replace(/^https?:\/{2}/, "yattee://")
		// return `freetube://${url.href}`

		const protocolHost = utils.protocolHost(url)
		return `${protocolHost}${url.pathname}${url.search}`
	},
	reverse: url => {
		return `https://youtube.com${url.pathname}${url.search}`
	},
})

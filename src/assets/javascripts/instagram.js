"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "instagram",
	frontends: ["bibliogram"],
	redirect: (url, type) => {
		const targets = /^https?:\/{2}(www\.)?instagram\.com/
		if (!targets.test(url.href)) return

		if (!["main_frame", "sub_frame", "xmlhttprequest", "other", "image", "media"].includes(type)) return "SKIP"

		const bypassPaths = [/about/, /explore/, /support/, /press/, /api/, /privacy/, /safety/, /admin/, /\/(accounts\/|embeds?.js)/]
		if (bypassPaths.some(rx => rx.test(url.pathname))) return "SKIP"

		const protocolHost = utils.protocolHost(url)

		const reservedPaths = ["u", "p", "privacy"]
		if (url.pathname === "/" || reservedPaths.includes(url.pathname.split("/")[1])) return `${protocolHost}${url.pathname}${url.search}`
		if (url.pathname.startsWith("/reel") || url.pathname.startsWith("/tv")) return `${protocolHost}/p${url.pathname.replace(/\/reel|\/tv/i, "")}${url.search}`
		return `${protocolHost}/u${url.pathname}${url.search}` // Likely a user profile, redirect to '/u/...'
	},
	reverse: url => {
		if (url.pathname.startsWith("/p")) return `https://instagram.com${url.pathname.replace("/p", "")}${url.search}`
		if (url.pathname.startsWith("/u")) return `https://instagram.com${url.pathname.replace("/u", "")}${url.search}`
		return `https://instagram.com${url.pathname}${url.search}`
	},
})

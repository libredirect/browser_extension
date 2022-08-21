"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "imgur",
	frontends: ["rimgo"],
	redirect: (url, type) => {
		const targets = /^https?:\/{2}([im]\.)?imgur\.(com|io)(\/|$)/
		if (!targets.test(url.href)) return

		if (!["main_frame", "sub_frame", "xmlhttprequest", "other", "image", "media"].includes(type)) return "SKIP"
		if (url.pathname == "/") return "SKIP"
		if (url.pathname.includes("delete/")) return "SKIP"

		const protocolHost = utils.protocolHost(url)
		return `${protocolHost}${url.pathname}${url.search}`
	},
	reverse: url => {
		return `https://imgur.com${url.pathname}${url.search}`
	},
})

// https://imgur.com/gallery/s4WXQmn
// https://imgur.com/a/H8M4rcp
// https://imgur.com/gallery/gYiQLWy
// https://imgur.com/gallery/cTRwaJU
// https://i.imgur.com/CFSQArP.jpeg

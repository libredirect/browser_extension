"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "tiktok",
	frontends: ["proxiTok"],
	redirect: (url, type) => {
		const targets = [/^https?:\/{2}(www\.|)tiktok\.com.*/]
		if (!targets.some(rx => rx.test(url.href))) return
		if (type != "main_frame") return "SKIP"
		const protocolHost = utils.protocolHost(url)
		return `${protocolHost}${url.pathname}`
	},
	reverse: url => {
		return `https://tiktok.com${url.pathname}${url.search}`
	},
})

// https://www.tiktok.com/@keysikaspol/video/7061265241887345946
// https://www.tiktok.com/@keysikaspol

"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "quora",
	frontends: ["quetre"],
	redirect: (url, type) => {
		const targets = [/^https?:\/{2}(www\.|)quora\.com.*/]
		if (!targets.some(rx => rx.test(url.href))) return
		if (url.pathname == "/") return "SKIP"
		if (type != "main_frame") return "SKIP"
		const protocolHost = utils.protocolHost(url)
		return `${protocolHost}${url.pathname}`
	},
	reverse: url => {
		return `https://quora.com${url.pathname}${url.search}`
	},
})

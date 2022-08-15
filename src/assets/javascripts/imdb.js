"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "imdb",
	frontends: {
		libremdb: {
			cookies: [],
		},
	},
	frontend: "libremdb",
	redirect: (url, type) => {
		const targets = [/^https?:\/{2}(?:www\.|)imdb\.com.*/]
		if (!targets.some(rx => rx.test(url.href))) return

		if (url.pathname == "/") return "SKIP"
		if (type != "main_frame") return "SKIP"

		const protocolHost = utils.protocolHost(url)
		return `${protocolHost}${url.pathname}`
	},
	reverse: url => {
		return `https://imdb.com${url.pathname}${url.search}`
	},
})

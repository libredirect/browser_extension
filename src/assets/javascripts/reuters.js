"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "reuters",
	frontends: ["neuters"],
	redirect: (url, type) => {
		const targets = [/^https?:\/{2}(www\.|)reuters\.com.*/]
		if (!targets.some(rx => rx.test(url.href))) return

		if (type != "main_frame") return "SKIP"

		const protocolHost = utils.protocolHost(url)
		// stolen from https://addons.mozilla.org/en-US/firefox/addon/reuters-redirect/
		if (url.pathname.startsWith("/article/") || url.pathname.startsWith("/pf/") || url.pathname.startsWith("/arc/") || url.pathname.startsWith("/resizer/")) return null
		else if (url.pathname.endsWith("/")) return `${protocolHost}${url.pathname}`
		else return `${protocolHost}${url.pathname}/`
	},
})

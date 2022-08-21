"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "peertube",
	frontends: ["simpleertube"],
	redirect: (url, type) => {
		if (type != "main_frame") return "SKIP"

		const protocolHost = utils.protocolHost(url)
		if (url.host == "search.joinpeertube.org" || url.host == "sepiasearch.org") return protocolHost
		return `${protocolHost}/${url.host}${url.pathname}${url.search}`
	},
})

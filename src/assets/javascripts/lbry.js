"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "lbry",
	frontends: {
		librarian: {
			cookies: [],
		},
		lbryDesktop: {
			cookies: [],
		},
	},
	frontend: "librarian",
	redirect: (url, type, frontend, redirectType) => {
		const targets = [/^https?:\/{2}odysee\.com/]
		if (!targets.some(rx => rx.test(url.href))) return

		if (type == "sub_frame" && redirectType == "main_frame") return "SKIP"

		const protocolHost = utils.protocolHost(url)
		switch (type) {
			case "main_frame":
				switch (frontend) {
					case "librarian":
						return `${protocolHost}${url.pathname}${url.search}`
					case "lbryDesktop":
						return url.href.replace(/^https?:\/{2}odysee\.com\//, "lbry://").replace(/:(?=[a-zA-Z0-9])/g, "#")
				}
			case "sub_frame":
				return `${protocolHost}${url.pathname}${url.search}`.replace(/\/(?=[a-f0-9]{40})/, ":")
		}
	}
})

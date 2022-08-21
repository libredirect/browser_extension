"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "translate",
	frontends: ["simplyTranslate", "lingva"],
	unify: {
		cookies: {
			invidious: ["from_lang", "to_lang", "tts_enabled", "use_text_fields"],
		},
		localStorage: {
			lingva: ["chakra-ui-color-mode", "isauto", "source", "target"],
		},
	},
	redirect: (url, type, frontend) => {
		const targets = [/^https?:\/{2}translate\.google(\.[a-z]{2,3}){1,2}\//]
		if (!targets.some(rx => rx.test(url.href))) return
		const protocolHost = utils.protocolHost(url)

		if (frontend == "simplyTranslate") {
			return `${protocolHost}/${url.search}`
		}
		if (frontend == "lingva") {
			let params_arr = url.search.split("&")
			params_arr[0] = params_arr[0].substring(1)
			let params = {}
			for (let i = 0; i < params_arr.length; i++) {
				let pair = params_arr[i].split("=")
				params[pair[0]] = pair[1]
			}
			if (params.sl && params.tl && params.text) {
				return `${protocolHost}/${params.sl}/${params.tl}/${params.text}`
			}
			return protocolHost
		}
	},
})

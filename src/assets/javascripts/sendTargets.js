"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "sendTargets",
	frontends: ["send"],
	redirect: (url, type) => {
		const targets = [/^https?:\/{2}send\.libredirect\.invalid\/$/, /^ https ?: \/\/send\.firefox\.com\/$/, /^https?:\/{2}sendfiles\.online\/$/]
		if (!targets.some(rx => rx.test(url.href))) return
		if (type != "main_frame") return "SKIP"

		const protocolHost = utils.protocolHost(url)
		return protocolHost
	},
})

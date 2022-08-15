"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "wikipedia",
	frontends: {
		wikiless: {
			wikiless: ["theme", "default_lang"],
		},
	},
	frontend: "wikiless",
	redirect: url => {
		const targets = /^https?:\/{2}([a-z]+\.)*wikipedia\.org/
		if (!targets.test(url.href)) return

		let GETArguments = []
		if (url.search.length > 0) {
			let search = url.search.substring(1) //get rid of '?'
			let argstrings = search.split("&")
			for (let i = 0; i < argstrings.length; i++) {
				let args = argstrings[i].split("=")
				GETArguments.push([args[0], args[1]])
			}
		}

		const protocolHost = utils.protocolHost(url)
		let link = `${protocolHost}${url.pathname}`
		let urlSplit = url.host.split(".")
		if (urlSplit[0] != "wikipedia" && urlSplit[0] != "www") {
			if (urlSplit[0] == "m") GETArguments.push(["mobileaction", "toggle_view_mobile"])
			else GETArguments.push(["lang", urlSplit[0]])
			if (urlSplit[1] == "m") GETArguments.push(["mobileaction", "toggle_view_mobile"])
			// wikiless doesn't have mobile view support yet
		}
		for (let i = 0; i < GETArguments.length; i++) {
			link += (i == 0 ? "?" : "&") + GETArguments[i][0] + "=" + GETArguments[i][1]
		}
		return link
	},
})

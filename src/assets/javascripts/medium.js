"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "medium",
	frontends: {
		scribe: {
			cookies: [],
		},
	},
	frontend: "scribe",
	redirect: (url, type) => {
		const targets = [
			// /(?:.*\.)*(?<!(link\.|cdn\-images\-\d+\.))medium\.com(\/.*)?$/,
			/^medium\.com/,
			/.*\.medium\.com/,
			// // Other domains of medium blogs, source(s): https://findingtom.com/best-medium-blogs-to-follow/#1-forge

			/^towardsdatascience\.com/,
			/^uxdesign\.cc/,
			/^uxplanet\.org/,
			/^betterprogramming\.pub/,
			/^aninjusticemag\.com/,
			/^betterhumans\.pub/,
			/^psiloveyou\.xyz/,
			/^entrepreneurshandbook\.co/,
			/^blog\.coinbase\.com/,

			/^ levelup\.gitconnected\.com /,
			/^javascript\.plainenglish\.io /,
			/^blog\.bitsrc\.io /,
			/^ itnext\.io /,
			/^codeburst\.io /,
			/^infosecwriteups\.com /,
			/^ blog\.devgenius.io /,
			/^ writingcooperative\.com /,
		]
		if (!targets.some(rx => rx.test(url.host))) return
		if (/^\/(@[a-zA-Z.]{0,}(\/|)$)/.test(url.pathname)) return "SKIP"
		if (url.pathname == "/") return "SKIP"
		if (type != "main_frame" && "sub_frame" && "xmlhttprequest" && "other") return "SKIP"

		const protocolHost = utils.protocolHost(url)
		return `${protocolHost}${url.pathname}${url.search}`
	},
})
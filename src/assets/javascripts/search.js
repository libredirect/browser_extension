"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "search",
	frontend: ["searxng", "searx", "whoogle", "librex"],
	unify: {
		cookies: {
			searx: [
				"advanced_search",
				"autocomplete",
				"categories",
				"disabled_engines",
				"disabled_plugins",
				"doi_resolver",
				"enabled_engines",
				"enabled_plugins",
				"image_proxy",
				"language",
				"locale",
				"method",
				"oscar-style",
				"results_on_new_tab",
				"safesearch",
				"theme",
				"tokens",
			],
			searxng: [
				"autocomplete",
				"categories",
				"disabled_engines",
				"disabled_plugins",
				"doi_resolver",
				"enabled_plugins",
				"enabled_engines",
				"image_proxy",
				"infinite_scroll",
				"language",
				"locale",
				"maintab",
				"method",
				"query_in_title",
				"results_on_new_tab",
				"safesearch",
				"simple_style",
				"theme",
				"tokens",
			],
			librex: ["bibliogram", "disable_special", "invidious", "libreddit", "nitter", "proxitok", "theme", "wikiless"],
		},
	},
	redirect: url => {
		const targets = [/^https?:\/{2}search\.libredirect\.invalid/]
		if (!targets.some(rx => rx.test(url.href))) return

		let path
		if (searchFrontend == "searx") path = "/"
		else if (searchFrontend == "searxng") path = "/"
		else if (searchFrontend == "whoogle") path = "/search"
		else if (searchFrontend == "librex") path = "/search.php"

		const protocolHost = utils.protocolHost(url)
		const searchQuery = `?q=${encodeURIComponent(url.searchParams.get("q"))}`
		return `${protocolHost}${path}${searchQuery}`
	},
})

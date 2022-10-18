"use strict"
window.browser = window.browser || window.chrome

let exceptions

function isException(url) {
	for (const item of exceptions.url) if (item == `${url.protocol}//${url.host}`) return true
	for (const item of exceptions.regex) if (new RegExp(item).test(url.href)) return true
	return false
}

function init() {
	return new Promise(resolve => {
		browser.storage.local.get("options", r => {
			if (r.options) exceptions = r.options.exceptions
			resolve()
		})
	})
}

init()
browser.storage.onChanged.addListener(init)

async function initDefaults() {
	return new Promise(resolve =>
		browser.storage.local.set(
			{
				options: {
					exceptions: {
						url: [],
						regex: [],
					},
					theme: "detect",
					popupServices: ["youtube", "twitter", "instagram", "tiktok", "imgur", "reddit", "quora", "translate", "maps"],
					autoRedirect: false,
					network: "clearnet",
					networkFallback: true,
					latencyThreshold: 1000,
				},
			},
			() => resolve()
		)
	)
}

export default {
	isException,
	initDefaults,
}

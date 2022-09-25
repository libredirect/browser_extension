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
		browser.storage.local.get("exceptions", r => {
			exceptions = r.exceptions
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
				exceptions: {
					url: [],
					regex: [],
				},
				theme: "DEFAULT",
				popupServices: ["youtube", "twitter", "instagram", "tiktok", "imgur", "reddit", "quora", "translate", "maps"],
				autoRedirect: false,
				firstPartyIsolate: false,
				network: "clearnet",
				networkFallback: true,
				latencyThreshold: 1000,
			},
			() => resolve()
		)
	)
}

export default {
	isException,
	initDefaults,
}

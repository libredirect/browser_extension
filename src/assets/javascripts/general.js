"use strict"

import utils from "./utils.js"

window.browser = window.browser || window.chrome

let exceptions

function isException(url) {
	if (exceptions && url) {
		if (exceptions.url) for (const item of exceptions.url) if (item == url.href) return true
		if (exceptions.regex) for (const item of exceptions.regex) if (new RegExp(item).test(url.href)) return true
	}
	return false
}

function init() {
	return new Promise(async resolve => {
		const options = await utils.getOptions()
		if (options) exceptions = options.exceptions
		resolve()
	})
}

init()
browser.storage.onChanged.addListener(init)

export default {
	isException,
}

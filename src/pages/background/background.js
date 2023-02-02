"use strict"

import generalHelper from "../../assets/javascripts/general.js"
import utils from "../../assets/javascripts/utils.js"
import servicesHelper from "../../assets/javascripts/services.js"

window.browser = window.browser || window.chrome

browser.runtime.onInstalled.addListener(async details => {
	if (details.previousVersion != browser.runtime.getManifest().version) {
		// ^Used to prevent this running when debugging with auto-reload
		if (details.reason == "install") {
			if (!(await utils.getOptions())) {
				await servicesHelper.initDefaults()
			}
		}
		else if (details.reason == "update") {
			if (details.previousVersion == '2.3.4') {
				await servicesHelper.upgradeOptions()
			}
			// await servicesHelper.processUpdate()
		}
		browser.runtime.openOptionsPage()
	}
})

let tabIdRedirects = {}

// true == Always redirect, false == Never redirect, null/undefined == follow options for services
browser.webRequest.onBeforeRequest.addListener(
	details => {
		const url = new URL(details.url)
		if (new RegExp(/^chrome-extension:\/{2}.*\/instances\/.*.json$/).test(url.href) && details.type == "xmlhttprequest") return
		let initiator
		try {
			if (details.originUrl) initiator = new URL(details.originUrl)
			else if (details.initiator) initiator = new URL(details.initiator)
		} catch {
			return null
		}
		if (tabIdRedirects[details.tabId] == false) return null
		let newUrl = servicesHelper.redirect(url, details.type, initiator, tabIdRedirects[details.tabId], details.tabId)

		if (details.frameAncestors && details.frameAncestors.length > 0 && generalHelper.isException(new URL(details.frameAncestors[0].url))) newUrl = null

		if (generalHelper.isException(url)) {
			if (details.type == "main_frame")
				newUrl = "BYPASSTAB"
			else
				return null
		}

		if (newUrl) {
			if (newUrl === "CANCEL") {
				console.log(`Canceled ${url}`)
				return { cancel: true }
			}
			if (newUrl === "BYPASSTAB") {
				console.log(`Bypassed ${details.tabId} ${url}`)
				if (tabIdRedirects[details.tabId] != false) tabIdRedirects[details.tabId] = false
				return null
			}
			console.info("Redirecting", url.href, "=>", newUrl)
			return { redirectUrl: newUrl }
		}
		return null
	},
	{ urls: ["<all_urls>"] },
	["blocking"]
)

browser.tabs.onRemoved.addListener(tabId => {
	if (tabIdRedirects[tabId] != undefined) {
		delete tabIdRedirects[tabId]
		console.log("Removed tab " + tabId + " from tabIdRedirects")
	}
})

browser.commands.onCommand.addListener(async command => {
	if (command == "switchInstance") {
		const newUrl = await servicesHelper.switchInstance()
		if (newUrl) browser.tabs.update({ url: newUrl })
	}
	else if (command == "copyRaw") servicesHelper.copyRaw()
})

browser.contextMenus.create({
	id: "settings",
	title: browser.i18n.getMessage("settings"),
	contexts: ["browser_action"],
})

browser.contextMenus.create({
	id: "switchInstance",
	title: browser.i18n.getMessage("switchInstance"),
	contexts: ["browser_action"],
})

browser.contextMenus.create({
	id: "copyRaw",
	title: browser.i18n.getMessage("copyRaw"),
	contexts: ["browser_action"],
})

browser.contextMenus.create({
	id: "redirectToOriginal",
	title: browser.i18n.getMessage("redirectToOriginal"),
	contexts: ["browser_action"],
})

browser.contextMenus.create({
	id: "redirectLink",
	title: browser.i18n.getMessage("redirectLink"),
	contexts: ["link"],
})

browser.contextMenus.onClicked.addListener((info, tab) => {
	return new Promise(async resolve => {
		if (info.menuItemId == 'switchInstance') {
			const newUrl = await servicesHelper.switchInstance()
			if (newUrl) browser.tabs.update({ url: newUrl })
		}
		else if (info.menuItemId == 'settings') {
			browser.runtime.openOptionsPage()
		}
		else if (info.menuItemId == 'copyRaw') {
			servicesHelper.copyRaw()
		}
		else if (info.menuItemId == 'redirectToOriginal') {
			const newUrl = await servicesHelper.reverse(tab.url)
			if (newUrl) {
				tabIdRedirects[tab.id] = false
				browser.tabs.update(tab.id, { url: newUrl })
			}
		}
		else if (info.menuItemId == 'redirectLink') {
			const url = new URL(info.linkUrl)
			const newUrl = servicesHelper.redirect(url, "main_frame", null, true)
			if (newUrl) browser.tabs.create({ url: newUrl })
		}
		resolve()
		return
	})
})

browser.webRequest.onHeadersReceived.addListener(
	e => {
		let response = servicesHelper.modifyContentSecurityPolicy(e)
		if (!response) response = servicesHelper.modifyContentSecurityPolicy(e)
		return response
	},
	{ urls: ["<all_urls>"] },
	["blocking", "responseHeaders"]
)

"use strict"

import generalHelper from "../../assets/javascripts/general.js"
import utils from "../../assets/javascripts/utils.js"
import servicesHelper from "../../assets/javascripts/services.js"

window.browser = window.browser || window.chrome

browser.runtime.onInstalled.addListener(async details => {
	if (details.previousVersion != browser.runtime.getManifest().version) {
		// ^Used to prevent this running when debugging with auto-reload
		browser.runtime.openOptionsPage()
		switch (details.reason) {
			case "install":
				browser.storage.local.get("options", async r => {
					if (!r.options) {
						await generalHelper.initDefaults()
						await servicesHelper.initDefaults()
					}
				})
				break
			case "update":
				switch (details.previousVersion) {
					case "2.3.4":
						browser.storage.local.get("options", async r => {
							if (!r.options) {
								await servicesHelper.backupOptions()
								await generalHelper.initDefaults()
								await servicesHelper.initDefaults()
								await servicesHelper.upgradeOptions()
							}
						})
						break
					default:
						await servicesHelper.processUpdate()
				}
		}
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

		if (generalHelper.isException(url)) newUrl = "BYPASSTAB"

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

browser.commands.onCommand.addListener(command => {
	if (command === "switchInstance") utils.switchInstance()
	else if (command == "copyRaw") utils.copyRaw()
})

browser.contextMenus.create({
	id: "settings",
	title: browser.i18n.getMessage("Settings"),
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
	id: "redirectLink",
	title: browser.i18n.getMessage("redirectLink"),
	contexts: ["link"],
})

function handleToggleTab(tab) {
	return new Promise(async resolve => {
		switch (tabIdRedirects[tab.id]) {
			case false:
				const newUrl = await servicesHelper.reverse(tab.url, true)
				if (newUrl) browser.tabs.update(tab.id, { url: newUrl })
				resolve()
				return
			case true:
				browser.tabs.reload(tab.id)
				resolve()
				return
		}
	})
}

browser.contextMenus.onClicked.addListener((info, tab) => {
	return new Promise(async resolve => {
		switch (info.menuItemId) {
			case "switchInstance":
				utils.switchInstance()
				resolve()
				return
			case "settings":
				browser.runtime.openOptionsPage()
				resolve()
				return
			case "copyRaw":
				utils.copyRaw()
				resolve()
				return
			case "toggleTab":
				if (tabIdRedirects[tab.id] != undefined) {
					tabIdRedirects[tab.id] = !tabIdRedirects[tab.id]
					await handleToggleTab(tab)
					resolve()
					return
				} else {
					const url = new URL(tab.url)
					const service = await servicesHelper.computeService(url)
					if (service) {
						browser.storage.local.get("options", async r => {
							if (r.options[service].enabled) tabIdRedirects[tab.id] = false
							else tabIdRedirects[tab.id] = true
							await handleToggleTab(tab)
							resolve()
							return
						})
					} else {
						tabIdRedirects[tab.id] = false
						await handleToggleTab(tab)
						resolve()
						return
					}
				}
			case "redirectLink":
				const tmpUrl = new URL(info.linkUrl)
				const newUrl = servicesHelper.redirect(tmpUrl, "main_frame", null, true)
				if (newUrl) browser.tabs.create({ url: newUrl })
				resolve()
				return
		}
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

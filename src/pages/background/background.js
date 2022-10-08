"use strict"

import generalHelper from "../../assets/javascripts/general.js"
import utils from "../../assets/javascripts/utils.js"
import servicesHelper from "../../assets/javascripts/services.js"

window.browser = window.browser || window.chrome

function initDefaults() {
	browser.storage.local.clear(() => {
		fetch("/instances/blacklist.json")
			.then(response => response.text())
			.then(async data => {
				browser.storage.local.set({ blacklists: JSON.parse(data) }, async () => {
					await generalHelper.initDefaults()
					await servicesHelper.initDefaults()
				})
			})
	})
}

browser.runtime.onInstalled.addListener(details => {
	if (details.previousVersion != browser.runtime.getManifest().version) {
	switch (details.reason) {
		case "install":
			initDefaults()
			break
		case "update":
			fetch("/instances/blacklist.json")
				.then(response => response.text())
				.then(async data => {
					browser.storage.local.set({ blacklists: JSON.parse(data) }, async () => {
						switch (details.previousVersion) {
							case "2.2.0":
							case "2.2.1":
								await generalHelper.initDefaults()
								await servicesHelper.initDefaults()
								await servicesHelper.upgradeOptions()
								break
							default:
								await servicesHelper.processUpdate()
						}
					})
				})
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
		let newUrl = servicesHelper.redirect(url, details.type, initiator, tabIdRedirects[details.tabId])

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

async function redirectOfflineInstance(url, tabId) {
	let newUrl = await servicesHelper.switchInstance(url, true)

	if (newUrl) {
		if (counter >= 5) {
			browser.tabs.update(tabId, {
				url: `/pages/errors/instance_offline.html?url=${encodeURIComponent(newUrl)}`,
			})
			counter = 0
		} else {
			browser.tabs.update(tabId, { url: newUrl })
			counter++
		}
	}
}
let counter = 0

function isAutoRedirect() {
	return new Promise(resolve => browser.storage.local.get("options", r => resolve(r.options.autoRedirect == true)))
}

browser.webRequest.onResponseStarted.addListener(
	async details => {
		if (!(await isAutoRedirect())) return null
		if (details.type == "main_frame" && details.statusCode >= 500) redirectOfflineInstance(new URL(details.url), details.tabId)
	},
	{ urls: ["<all_urls>"] }
)

browser.webRequest.onErrorOccurred.addListener(
	async details => {
		if (!(await isAutoRedirect())) return
		if (details.type == "main_frame") redirectOfflineInstance(new URL(details.url), details.tabId)
	},
	{ urls: ["<all_urls>"] }
)

browser.commands.onCommand.addListener(command => {
	if (command === "switchInstance") utils.switchInstance()
	else if (command == "copyRaw") utils.copyRaw()
	else if (command == "unify") utils.unify()
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
	id: "unify",
	title: browser.i18n.getMessage("unifySettings"),
	contexts: ["browser_action"],
})

browser.contextMenus.create({
	id: "toggleTab",
	title: browser.i18n.getMessage("toggleTab"),
	contexts: ["page", "tab"],
})

function handleToggleTab(tab) {
	return new Promise(async resolve => {
	console.log(tabIdRedirects[tab.id])
		switch (tabIdRedirects[tab.id]) {
			case false:
				console.log("kj")
				const newUrl = await servicesHelper.reverse(tab.url, true)
				if (newUrl) browser.tabs.update(tab.id, { url: newUrl })
				resolve()
				return
			case true:
				console.log("lsad")
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
			case "unify":
				utils.unify()
				resolve()
				return
			case "toggleTab":
				if (tabIdRedirects[tab.id] != undefined) {
					tabIdRedirects[tab.id] = !tabIdRedirects[tab.id]
					await handleToggleTab(tab)
					resolve()
					return
				} else {
					console.log("n")
					const url = new URL(tab.url)
					const service = await servicesHelper.computeService(url)
					console.log(service)
					if (service) {
						console.log("h")
						browser.storage.local.get("options", async r => {
							console.log(r.options[service])
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
		}
	})
})

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.function === "unify") utils.unify(false).then(r => sendResponse({ response: r }))
	return true
})

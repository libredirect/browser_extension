window.browser = window.browser || window.chrome

import utils from "./utils.js"

let config

function getConfig() {
	return new Promise(async resolve => {
		fetch("/config/config.json")
			.then(response => response.text())
			.then(data => {
				config = JSON.parse(data)
			})
		resolve()
	})
}

let redirects = {}
let disabled, curNetwork, networkFallback, redirectType

function init() {
	return new Promise(async resolve => {
		browser.storage.local.get(["network", "networkFallback"], r => {
			curNetwork = r.network
			networkFallback = r.networkFallback
		})
		//cur = current
		getConfig()
		for (service in config.services) {
			redirects = {}
			browser.storage.local.get([`disable${camelCase(service)}`, `${service}Redirects`, `${service}RedirectType,`, `${service}Frontend`], r => {
				disabled = r["disable" + camelCase(service)]
				redirects = r[service + "Redirects"]
				frontend = r[service + "Frontend"]
			})
			for (frontend in config[service].frontends) {
				redirects[frontend] = {}
				for (network in config.networks) {
					browser.storage.local.get([`${frontend}${camelCase(network)}RedirectsChecks`, `${frontend}${camelCase(network)}CustomRedirects`], r => {
						redirects[frontend][network] = [...r[frontend + camelCase(network) + "RedirectsChecks"], ...r[frontend + camelCase(network) + "CustomRedirects"]]
					})
				}
			}
		}
		resolve()
	})
}

init()
browser.storage.onChanged.addListener(init)

function redirect(url, type, initiator) {
	if (url.pathname == "/") return
	for (curService in config.services) {
		if (disabled && !disableOverride) continue
		if (initiator && (all().includes(initiator.origin) || targets.includes(initiator.host))) continue
		//if (!targets.some(rx => rx.test(url.href))) continue
		if (!target.test(url)) continue
		if (type != redirectType && type != "both") continue
		let instanceList = redirects[frontend][curNetwork]
		if (instanceList.length === 0 && networkFallback) instanceList = redirects[frontend].clearnet
		if (instanceList.length === 0) return
		const randomInstance = utils.getRandomInstance(instanceList)
		return `${randomInstance}${url.pathname}${url.search}`
	}
}

function initDefaults() {
	return new Promise(resolve => {
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(data => {
				let dataJson = JSON.parse(data)
				redirects = dataJson
				browser.storage.local.get(["cloudflareBlackList", "authenticateBlackList", "offlineBlackList"], async r => {
					for (service in config.services) {
						for (frontend in service.frontends) {
							for (const instance of [...r.cloudflareBlackList, ...r.authenticateBlackList, ...r.offlineBlackList]) {
								let i = redirects[frontend]["clearnet"].indexOf(instance)
								if (i > -1) redirects[frontend]["clearnet"].splice(i, 1)
							}
							browser.storage.local.set({
								["disable" + camelCase(service)]: false,
								[service + "Redirects"]: redirects,
								[service + "RedirectType"]: "both",
							})
							for (frontend in service.frontends) {
								for (protocol in config.protocols) {
									browser.storage.local.set({
										[frontend + camelCase(protocol) + "RedirectsChecks"]: [...redirects[frontend][protocol]],
										[frontend + camelCase(protocol) + "CustomRedirects"]: [],
									})
								}
							}
							;() => resolve()
						}
					}
				})
			})
	})
}

export default {
	redirect,
}

async function initDefaults() {
	return new Promise(async resolve => {
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(async data => {
				fetch("/config/config.json")
					.then(response => response.text())
					.then(async config => {
						browser.storage.local.get(["options", "blacklists"], async r => {
							let redirects = JSON.parse(data)
							let options = r.options
							let targets = {}
							const localstorage = {}
							const latency = {}
							for (const service in config.services) {
								options[service] = {}
								if (config.services[service].targets == "datajson") {
									targets[service] = redirects[service]
								}
								for (const defaultOption in config.services[service].options) {
									options[service][defaultOption] = config.services[service].options[defaultOption]
								}
								for (const frontend in config.services[service].frontends) {
									if (config.services[service].frontends[frontend].instanceList) {
										options[frontend] = {}
										for (const network in config.networks) {
											options[frontend][network] = {}
											options[frontend][network].enabled = JSON.parse(data)[frontend][network]
											options[frontend][network].custom = []
										}
										for (const blacklist in r.blacklists) {
											for (const instance of r.blacklists[blacklist]) {
												let i = options[frontend].clearnet.enabled.indexOf(instance)
												if (i > -1) options[frontend].clearnet.enabled.splice(i, 1)
											}
										}
									}
								}
							}
							browser.storage.local.set({ redirects, options, targets, latency, localstorage })
							resolve()
						})
					})
			})
	})
}

async function upgradeOptions() {
	return new Promise(async resolve => {
		fetch("/config/config.json")
			.then(response => response.text())
			.then(async config => {
				initDefaults().then(
					browser.storage.local.get(["options", "exceptions", "theme", "popupFrontends"], r => {
						let options = r.options
						let latency = {}
						options.exceptions = r.exceptions
						if (r.theme != "DEFAULT") options.theme = r.theme
						for (const service in config.services) {
							browser.storage.local.get([`disable${utils.camelCase(service)}`, `${service}RedirectType`, `${service}Frontend`, `${service}Latency`, `${service}EmbedFrontend`], r => {
								if (r) {
									options[service].enabled = r["disable" + utils.camelCase(service)]
									if (r[service + "Frontend"]) options[service].frontend = r[service + "Frontend"]
									if (r[service + "RedirectType"]) options[service].redirectType = r[service + "RedirectType"]
									if (r[service + "EmbedFrontend"] && (service != "youtube" || r[service + "EmbedFrontend"] == ("invidious" || "piped"))) options[service].EmbedFrontend = r[service + "EmbedFrontend"]
									if (r[service + "Latency"]) latency[frontend] = r[service + "Latency"]
								}
							})
							for (const frontend in config.services[service].frontends) {
								for (const network in config.networks) {
									let protocol
									if (network == "clearnet") protocol == "normal"
									else protocol == network
									browser.storage.local.get([`${frontend}${utils.camelCase(network)}RedirectsChecks`, `${frontend}${utils.camelCase(protocol)}CustomRedirects`], r => {
										if (r) {
											options[frontend][network].checks = r[frontend + utils.camelCase(protocol) + "RedirectsChecks"]
											options[frontend][network].custom = r[frontend + utils.camelCase(protocol) + "CustomRedirects"]
										}
									})
								}
							}
						}
						browser.storage.local.set({ options, latency })
						resolve()
					})
				)
			})
	})
}

export default {
	initDefaults,
	upgradeOptions,
}

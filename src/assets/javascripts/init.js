async function getConfig() {
	return new Promise(resolve => {
		fetch("/config/config.json")
			.then(response => response.text())
			.then(data => {
				config = JSON.parse(data)
				resolve()
			})
	})
}

let config
await getConfig()

async function initDefaults() {
	return new Promise(async resolve => {
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(async data => {
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
}

export default {
	initDefaults,
}

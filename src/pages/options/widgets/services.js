import utils from "../../../assets/javascripts/utils.js"

let config,
	options,
	divs = {}

function getConfig() {
	return new Promise(resolve => {
		fetch("/config/config.json")
			.then(response => response.text())
			.then(data => {
				config = JSON.parse(data)
				resolve()
			})
	})
}

function getOptions() {
	return new Promise(resolve => {
		browser.storage.local.get("options", r => {
			options = r.options
			resolve()
		})
	})
}

await getConfig()
await getOptions()

function changeFrontendsSettings(service) {
	for (const frontend in config.services[service].frontends) {
		if (config.services[service].frontends[frontend].instanceList) {
			const frontendDiv = document.getElementById(frontend)
			if (frontend == divs[service].frontend.value) {
				frontendDiv.style.display = "block"
			} else {
				frontendDiv.style.display = "none"
			}
		}
	}

	if (config.services[service].embeddable) {
		if (!config.services[service].frontends[divs[service].frontend.value].instanceList) {
			divs[service].embedFrontend.disabled = false
			for (const frontend in config.services[service].frontends) {
				if (config.services[service].frontends[frontend].embeddable) {
					const frontendDiv = document.getElementById(frontend)
					if (frontend == divs[service].embedFrontend.value) {
						frontendDiv.style.display = "block"
					} else {
						frontendDiv.style.display = "none"
					}
				}
			}
		} else if (Object.keys(config.services[service].frontends).length > 1) divs[service].embedFrontend.disabled = true
	}
}

function changeNetworkSettings() {
	for (const service in config.services) {
		for (const frontend in config.services[service].frontends) {
			if (config.services[service].frontends[frontend].instanceList) {
				const frontendDiv = document.getElementById(frontend)
				for (const network in config.networks) {
					const networkDiv = frontendDiv.getElementsByClassName(network)[0]
					if (network == options.network) {
						networkDiv.style.display = "block"
					} else {
						networkDiv.style.display = "none"
					}
				}
			}
		}
	}
}

changeNetworkSettings()
for (const service in config.services) {
	divs[service] = {}
	divs[service][service] = document.getElementById(`${service}_page`)
	for (const option in config.services[service].options) {
		divs[service][option] = document.getElementById(`${service}-${option}`)

		if (typeof config.services[service].options[option] == "boolean") divs[service][option].checked = options[service][option]
		else divs[service][option].value = options[service][option]

		divs[service][option].addEventListener("change", () => {
			if (typeof config.services[service].options[option] == "boolean") options[service][option] = divs[service][option].checked
			else options[service][option] = divs[service][option].value
			browser.local.storage.set({ options })
			changeFrontendsSettings(service)
		})
	}

	if (Object.keys(config.services[service].frontends).length > 1) {
		changeFrontendsSettings(service)
	}

	for (const frontend in config.services[service].frontends) {
		if (config.services[service].frontends[frontend].instanceList) {
			for (const network in config.networks) {
				utils.processDefaultCustomInstances(service, frontend, network, document)
			}
			utils.latency(service, frontend, document, location)
		}
	}
}

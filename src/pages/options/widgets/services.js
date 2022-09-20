import utils from "../../../assets/javascripts/utils.js"

let config,
	selectedNetwork,
	divs = {}

function getConfig() {
	return new Promise(resolve => {
		fetch("/config/config.json")
			.then(response => response.text())
			.then(data => {
				const tmp = JSON.parse(data)
				config = tmp.config
				resolve()
			})
	})
}

await getConfig()

browser.storage.local.get("network", r => {
	selectedNetwork = r.network
})

function changeFrontendsSettings(service) {
	for (const frontend in config.services[service].frontends) {
		if (config.services[service].frontends[frontend].instanceList && config.services[service].frontends.length > 1) {
			const frontendDiv = document.getElementById(frontend)
			if (divs[service].frontend == null) {
				console.log(frontend)
			}
			if (frontend == divs[service].frontend.value) {
				frontendDiv.style.display = "block"
			} else {
				frontendDiv.style.display = "none"
			}
		}
	}
}

function changeNetworkSettings(selectedNetwork) {
	for (const frontend in config.frontends) {
		if (config.services[service].frontends[frontend].instanceList) {
			const frontendDiv = document.getElementById(frontend)
			for (const network in config.networks) {
				const networkDiv = frontendDiv.getElementsByClassName(network)[0]
				if (network == selectedNetwork) {
					networkDiv.style.display = "block"
				} else {
					networkDiv.style.display = "none"
				}
			}
		}
	}
}

changeNetworkSettings(selectedNetwork)
for (const service in config.services) {
	divs[service] = {}
	divs[service][service] = document.getElementById(`${service}_page`)
	for (const option in config.services[service].options) {
		divs[service][option] = document.getElementById(`${service}-${option}`)

		browser.storage.local.get([`${service + utils.camelCase(option)}`], r => {
			if (typeof config.services[service].options[option] == "boollean") divs[service][option].checked = r[service + utils.camelCase(option)]
			else divs[service][option].value = !r[service + utils.camelCase(option)]
		})

		divs[service][option].addEventListener("change", () => {
			if (typeof config.services[service].options[option] == "boollean") browser.storage.local.set({ [service + utils.camelCase(option)]: divs[service][option].checked })
			else browser.storage.local.set({ [service + utils.camelCase(option)]: divs[service][option].value })
			changeFrontendsSettings()
		})
	}

	changeFrontendsSettings(service)

	for (const frontend in config.services[service].frontends) {
		if (config.services[service].frontends[frontend].instanceList) {
			for (const network in config.networks) {
				utils.processDefaultCustomInstances(service, frontend, network, document)
			}
			utils.latency(service, frontend, document, location)
		}
	}
}

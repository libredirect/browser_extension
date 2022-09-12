import utils from "../../../assets/javascripts/utils.js"

// const frontends = new Array("librarian")
// const protocols = new Array("clearnet", "tor", "i2p", "loki")

let config,
	network,
	divs = {}

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

getConfig()

browser.storage.local.get("network", r => {
	network = r.network
})

function changeFrontendsSettings(service) {
	for (const frontend in config.services[service].frontends) {
		const frontendDiv = document.getElementById(frontend)
		if (frontend == divs[service].frontend.value) {
			frontendDiv.style.display = "block"
		} else {
			frontendDiv.style.display = "none"
		}
	}
}

function changeNetworkSettings(selectedNetwork) {
	for (const frontend in config.frontends) {
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

for (service in config.services) {
	divs[service][service] = document.getElementById(`${service}_page`)
	for (const option in config.services[service].options) {
		divs[service][option] = document.getElementById(`${service}-${option}`)

		browser.storage.local.get([`${service + utils.camelCase(option)}`], r => {
			if (typeof config.services[service].options[option] == "boollean") divs[service][option].checked = !r[service + utils.camelCase(option)]
			else divs[service][option].value = !r[service + utils.camelCase(option)]
		})

		divs[service][option].addEventListener("change", () => {
			if (typeof config.services[service].options[option] == "boollean") {
				browser.storage.local.set({ [service + utils.camelCase(option)]: !divs[service][option].checked })
			} else {
				browser.storage.local.set({ [service + utils.camelCase(option)]: divs[service][option].value })
			}
			changeFrontendsSettings()
		})
	}

	changeFrontendsSettings(service)
	changeNetworkSettings(network)

	for (const frontend in config.services[service].frontends) {
		for (const network in config.networks) {
			utils.processDefaultCustomInstances(service, frontend, network, document)
		}
		utils.latency(service, frontend, document, location)
	}
}

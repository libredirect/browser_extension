"use strict"
window.browser = window.browser || window.chrome

import utils from "../../../assets/javascripts/utils.js"
import generalHelper from "../../../assets/javascripts/general.js"
import servicesHelper from "../../../assets/javascripts/services.js"

let updateInstancesElement = document.getElementById("update-instances")
updateInstancesElement.addEventListener("click", async () => {
	let oldHtml = updateInstancesElement.innerHTML
	updateInstancesElement.innerHTML = "..."
	if (await utils.updateInstances()) {
		updateInstancesElement.innerHTML = oldHtml
		location.reload()
	} else updateInstancesElement.innerHTML = "Failed Miserabely"
})

let config

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

function setOption(option, type, event) {
	browser.storage.local.get("options", r => {
		let options = r.options
		browser.storage.local.set({ options })
	})

	browser.storage.local.get("options", r => {
		let options = r.options
		if (type == "select") {
			options[option] = event.target.options[event.target.options.selectedIndex].value
		} else if (type == "checkbox") {
			options[option] = event.target.checked
		} else if (type == "range") {
			options[option] = event.target.value
		}

		browser.storage.local.set({ options })
	})
}

let exportSettingsElement = document.getElementById("export-settings")

function exportSettings() {
	browser.storage.local.get("options", result => {
		result.options.version = browser.runtime.getManifest().version
		let resultString = JSON.stringify(result.options, null, "  ")
		exportSettingsElement.href = "data:application/json;base64," + btoa(resultString)
		exportSettingsElement.download = "libredirect-settings.json"
	})
}
exportSettings()

document.getElementById("general_page").addEventListener("click", exportSettings)

let importSettingsElement = document.getElementById("import-settings")
let importSettingsElementText = document.getElementById("import_settings_text")
importSettingsElement.addEventListener("change", () => {
	importSettingsElementText.innerHTML = "..."
	let file = importSettingsElement.files[0]
	const reader = new FileReader()
	reader.readAsText(file)
	reader.onload = async () => {
		const data = JSON.parse(reader.result)
		if ("theme" in data && "disableImgur" in data && "imgurRedirects" in data) {
			browser.storage.local.clear(() =>
				browser.storage.local.set({ ...data }, () => {
					fetch("/instances/blacklist.json")
						.then(response => response.text())
						.then(async data => {
							browser.storage.local.set({ blacklists: JSON.parse(data) }, async () => {
								await generalHelper.initDefaults()
								await servicesHelper.initDefaults()
								await servicesHelper.upgradeOptions()
								location.reload()
							})
						})
				})
			)
		} else if ("version" in data) {
			browser.storage.local.clear(() => browser.storage.local.set({ options: data }, () => location.reload()))
		} else {
			console.log("incompatible settings")
			importError()
		}
	}
	reader.onerror = error => {
		console.log("error", error)
		importError()
	}
})
function importError() {
	const oldHTML = importSettingsElementText.innerHTML
	importSettingsElementText.innerHTML = '<span style="color:red;">Error!</span>'
	setTimeout(() => (importSettingsElementText.innerHTML = oldHTML), 1000)
}

const resetSettings = document.getElementById("reset-settings")
resetSettings.addEventListener("click", async () => {
	resetSettings.innerHTML = "..."
	browser.storage.local.clear(() => {
		fetch("/instances/blacklist.json")
			.then(response => response.text())
			.then(async data => {
				browser.storage.local.set({ blacklists: JSON.parse(data) }, async () => {
					await generalHelper.initDefaults()
					await servicesHelper.initDefaults()
					location.reload()
				})
			})
	})
})

let autoRedirectElement = document.getElementById("auto-redirect")
autoRedirectElement.addEventListener("change", event => {
	setOption("autoRedirect", "checkbox", event)
})

let themeElement = document.getElementById("theme")
themeElement.addEventListener("change", event => {
	setOption("theme", "select", event)
	location.reload()
})

let networkElement = document.getElementById("network")
networkElement.addEventListener("change", event => {
	setOption("network", "select", event)
	location.reload()
})

let networkFallbackCheckbox = document.getElementById("network-fallback-checkbox")
networkFallbackCheckbox.addEventListener("change", event => {
	setOption("networkFallback", "checkbox", event)
})

let latencyOutput = document.getElementById("latency-output")
let latencyInput = document.getElementById("latency-input")
latencyInput.addEventListener("change", event => {
	setOption("latencyThreshold", "range", event)
})
latencyInput.addEventListener("input", event => {
	latencyOutput.value = event.target.value
})

let nameCustomInstanceInput = document.getElementById("exceptions-custom-instance")
let instanceTypeElement = document.getElementById("exceptions-custom-instance-type")
let instanceType = "url"

await getConfig()

for (const service in config.services) {
	document.getElementById(service).addEventListener("change", event => {
		browser.storage.local.get("options", r => {
			let options = r.options
			if (event.target.checked && !options.popupServices.includes(service)) options.popupServices.push(service)
			else if (options.popupServices.includes(service)) {
				var index = options.popupServices.indexOf(service)
				if (index !== -1) options.popupServices.splice(index, 1)
			}
			browser.storage.local.set({ options })
		})
	})
}
// const firstPartyIsolate = document.getElementById('firstPartyIsolate');
// firstPartyIsolate.addEventListener("change", () => browser.storage.local.set({ firstPartyIsolate: firstPartyIsolate.checked }))

browser.storage.local.get("options", r => {
	autoRedirectElement.checked = r.options.autoRedirect
	themeElement.value = r.options.theme
	networkElement.value = r.options.network
	networkFallbackCheckbox.checked = r.options.networkFallback
	latencyOutput.value = r.options.latencyThreshold
	let options = r.options
	// firstPartyIsolate.checked = r.firstPartyIsolate;

	//let networkFallbackElement = document.getElementById("network-fallback")
	if (networkElement.value == "clearnet") {
		networkFallbackCheckbox.disabled = true
	} else {
		networkFallbackCheckbox.disabled = false
	}

	instanceTypeElement.addEventListener("change", event => {
		instanceType = event.target.options[instanceTypeElement.selectedIndex].value
		if (instanceType == "url") {
			nameCustomInstanceInput.setAttribute("type", "url")
			nameCustomInstanceInput.setAttribute("placeholder", "https://www.google.com")
		} else if (instanceType == "regex") {
			nameCustomInstanceInput.setAttribute("type", "text")
			nameCustomInstanceInput.setAttribute("placeholder", "https?://(www.|)youtube.com/")
		}
	})
	let exceptionsCustomInstances = r.options.exceptions
	function calcExceptionsCustomInstances() {
		document.getElementById("exceptions-custom-checklist").innerHTML = [...exceptionsCustomInstances.url, ...exceptionsCustomInstances.regex]
			.map(
				x => `<div>
                      ${x}
                      <button class="add" id="clear-${x}">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                        fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                      </button>
                    </div>
                    <hr>`
			)
			.join("\n")

		for (const x of [...exceptionsCustomInstances.url, ...exceptionsCustomInstances.regex]) {
			document.getElementById(`clear-${x}`).addEventListener("click", () => {
				console.log(x)
				let index
				index = exceptionsCustomInstances.url.indexOf(x)
				if (index > -1) exceptionsCustomInstances.url.splice(index, 1)
				else {
					index = exceptionsCustomInstances.regex.indexOf(x)
					if (index > -1) exceptionsCustomInstances.regex.splice(index, 1)
				}
				options.exceptions = exceptionsCustomInstances
				browser.storage.local.set({ options })
				calcExceptionsCustomInstances()
			})
		}
	}
	calcExceptionsCustomInstances()
	document.getElementById("custom-exceptions-instance-form").addEventListener("submit", event => {
		event.preventDefault()

		let val
		if (instanceType == "url") {
			if (nameCustomInstanceInput.validity.valid) {
				let url = new URL(nameCustomInstanceInput.value)
				val = `${url.network}//${url.host}`
				if (!exceptionsCustomInstances.url.includes(val)) exceptionsCustomInstances.url.push(val)
			}
		} else if (instanceType == "regex") {
			val = nameCustomInstanceInput.value
			if (val.trim() != "" && !exceptionsCustomInstances.regex.includes(val)) exceptionsCustomInstances.regex.push(val)
		}
		if (val) {
			options.exceptions = exceptionsCustomInstances
			browser.storage.local.set({ options })
			nameCustomInstanceInput.value = ""
		}
		calcExceptionsCustomInstances()
	})

	for (const service in config.services) document.getElementById(service).checked = options.popupServices.includes(service)
})

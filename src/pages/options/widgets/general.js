"use strict"
window.browser = window.browser || window.chrome

import utils from "../../../assets/javascripts/utils.js"
import servicesHelper from "../../../assets/javascripts/services.js"

async function setOption(option, type, event) {
	let options = await utils.getOptions()
	if (type == "select") {
		options[option] = event.target.options[event.target.options.selectedIndex].value
	} else if (type == "checkbox") {
		options[option] = event.target.checked
	} else if (type == "range") {
		options[option] = event.target.value
	}
	browser.storage.local.set({ options })
}

let exportSettingsElement = document.getElementById("export-settings")
async function exportSettings() {
	const options = await utils.getOptions()
	options.version = browser.runtime.getManifest().version
	let resultString = JSON.stringify(options, null, "  ")
	exportSettingsElement.href = "data:application/json;base64," + btoa(resultString)
	exportSettingsElement.download = `libredirect-settings-v${options.version}.json`
	return
}
exportSettings()

document.getElementById("general_page").onclick = exportSettings

let importSettingsElement = document.getElementById("import-settings")
let importSettingsElementText = document.getElementById("import_settings_text")
importSettingsElement.addEventListener("change", () => {
	importSettingsElementText.innerHTML = "..."
	let file = importSettingsElement.files[0]
	const reader = new FileReader()
	reader.readAsText(file)
	reader.onload = async () => {
		const data = JSON.parse(reader.result)
		if (
			"theme" in data
			&& data.version == browser.runtime.getManifest().version
		) {

			browser.storage.local.clear(async () => {
				browser.storage.local.set({ options: data }, () => {
					location.reload()
				})
			})
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
	await servicesHelper.initDefaults()
	location.reload()
})

let fetchInstancesElement = document.getElementById('fetch-instances')
fetchInstancesElement.addEventListener('change', event => {
	setOption('fetchInstances', 'select', event)
	location.reload()
})

let themeElement = document.getElementById("theme")
themeElement.addEventListener("change", event => {
	setOption("theme", "select", event)
	location.reload()
})

let nameCustomInstanceInput = document.getElementById("exceptions-custom-instance")
let instanceTypeElement = document.getElementById("exceptions-custom-instance-type")
let instanceType = "url"

let config = await utils.getConfig()

for (const service in config.services) {
	document.getElementById(service).addEventListener("change", async event => {
		let options = await utils.getOptions()
		if (event.target.checked && !options.popupServices.includes(service)) options.popupServices.push(service)
		else if (options.popupServices.includes(service)) {
			var index = options.popupServices.indexOf(service)
			if (index !== -1) options.popupServices.splice(index, 1)
		}
		browser.storage.local.set({ options })
	})
}

let options = await utils.getOptions()
themeElement.value = options.theme
fetchInstancesElement.value = options.fetchInstances
for (const service in config.services) document.getElementById(service).checked = options.popupServices.includes(service)

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

let exceptionsCustomInstances = options.exceptions
function calcExceptionsCustomInstances() {
	document.getElementById("exceptions-custom-checklist").innerHTML = [...exceptionsCustomInstances.url, ...exceptionsCustomInstances.regex]
		.map(
			x => `<div>
                      ${x}
                      <button class="add" id="clear-${x}">
                        <svg xmlns="https://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                        fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                      </button>
                    </div>
                    <hr>`
		)
		.join("\n")

	for (const x of [...exceptionsCustomInstances.url, ...exceptionsCustomInstances.regex]) {
		document.getElementById(`clear-${x}`).addEventListener("click", async () => {
			let index
			index = exceptionsCustomInstances.url.indexOf(x)
			if (index > -1) exceptionsCustomInstances.url.splice(index, 1)
			else {
				index = exceptionsCustomInstances.regex.indexOf(x)
				if (index > -1) exceptionsCustomInstances.regex.splice(index, 1)
			}
			options = await utils.getOptions()
			options.exceptions = exceptionsCustomInstances
			browser.storage.local.set({ options })
			calcExceptionsCustomInstances()
		})
	}
}
calcExceptionsCustomInstances()
document.getElementById("custom-exceptions-instance-form").addEventListener("submit", async event => {
	event.preventDefault()
	let val
	if (instanceType == "url" && nameCustomInstanceInput.validity.valid) {
		val = nameCustomInstanceInput.value
		if (!exceptionsCustomInstances.url.includes(val)) exceptionsCustomInstances.url.push(val)
	} else if (instanceType == "regex") {
		val = nameCustomInstanceInput.value
		if (val.trim() != "" && !exceptionsCustomInstances.regex.includes(val)) exceptionsCustomInstances.regex.push(val)
	}
	if (val) {
		options = await utils.getOptions()
		options.exceptions = exceptionsCustomInstances
		browser.storage.local.set({ options }, () =>
			nameCustomInstanceInput.value = ""
		)

	}
	calcExceptionsCustomInstances()
})

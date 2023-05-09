"use strict"
window.browser = window.browser || window.chrome

import servicesHelper from "../../assets/javascripts/services.js"
import utils from "../../assets/javascripts/utils.js"

document.getElementById("more-options").addEventListener("click", () => browser.runtime.openOptionsPage())

const allSites = document.getElementById("all_sites")
const currSite = document.getElementById("current_site")
const currentSiteDivider = document.getElementById("current_site_divider")

const config = await utils.getConfig()
const divs = {}

for (const service in config.services) {
	divs[service] = {}

	divs[service].all = allSites.getElementsByClassName(service)[0]
	divs[service].current = currSite.getElementsByClassName(service)[0]

	divs[service].all_toggle = allSites.getElementsByClassName(service + "-enabled")[0]
	divs[service].current_toggle = currSite.getElementsByClassName(service + "-enabled")[0]

	divs[service].all_toggle.addEventListener("change", async () => {
		const options = await utils.getOptions()
		options[service].enabled = divs[service].all_toggle.checked
		browser.storage.local.set({ options })
	})
	divs[service].current_toggle.addEventListener("change", async () => {
		const options = await utils.getOptions()
		options[service].enabled = divs[service].current_toggle.checked
		browser.storage.local.set({ options })
	})
}

browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
	let url;

	// Set visibility of control buttons
	if (tabs[0].url) {
		url = new URL(tabs[0].url)
		servicesHelper.switchInstance(url).then(r => {
			if (r) {
				document.getElementById("change_instance_div").style.display = ""
				document.getElementById("change_instance").addEventListener("click", async () =>
					browser.tabs.update({ url: await servicesHelper.switchInstance(url) })
				)
			}
		})
		servicesHelper.copyRaw(url, true).then(r => {
			if (r) {
				document.getElementById("copy_original_div").style.display = ""
				document.getElementById("copy_original").addEventListener("click", () =>
					servicesHelper.copyRaw(url)
				)
			}
		})
		servicesHelper.reverse(url).then(r => {
			if (r) {
				document.getElementById("redirect_to_original_div").style.display = ""
				document.getElementById("redirect_to_original").addEventListener("click", () =>
					browser.runtime.sendMessage("reverseTab")
				)
			}
		})
		servicesHelper.redirectAsync(url, "main_frame", null, true).then(r => {
			if (r) {
				document.getElementById("redirect_div").style.display = ""
				document.getElementById("redirect").addEventListener("click", () =>
					browser.runtime.sendMessage("redirectTab")
				)
			}
		})
	}

	const options = await utils.getOptions()

	// Set visibility of all service buttons
	for (const service of options.popupServices) {
		divs[service].all.classList.remove("hide")
		divs[service].all_toggle.checked = options[service].enabled
	}

	// Set visibility of current page service button
	if (url) {
		const service = await servicesHelper.computeService(url)
		if (service) {
			divs[service].all.classList.add("hide")
			divs[service].current.classList.remove("hide")
			divs[service].current_toggle.checked = options[service].enabled
			currentSiteDivider.style.display = ""
		}
	}
})

for (const a of document.getElementsByTagName("a")) {
	a.addEventListener("click", e => {
		if (!a.classList.contains("prevent")) {
			browser.tabs.create({ url: a.getAttribute("href") })
			e.preventDefault()
		}
	})
}

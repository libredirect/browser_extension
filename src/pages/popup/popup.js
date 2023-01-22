"use strict"
window.browser = window.browser || window.chrome

import servicesHelper from "../../assets/javascripts/services.js"
import utils from "../../assets/javascripts/utils.js"

let config,
	divs = {}

config = await utils.getConfig()

servicesHelper.switchInstance().then(r => {
	if (!r) document.getElementById("change_instance_div").style.display = "none"
	else document.getElementById("change_instance").addEventListener("click", async () => {
		browser.tabs.update({ url: await servicesHelper.switchInstance() })
	})
})

servicesHelper.copyRaw(true).then(r => {
	if (!r) document.getElementById("copy_raw_div").style.display = "none"
	else {
		const copy_raw = document.getElementById("copy_raw")
		copy_raw.addEventListener("click", () => servicesHelper.copyRaw(false, copy_raw))
	}
})
document.getElementById("more-options").addEventListener("click", () => browser.runtime.openOptionsPage())

const allSites = document.getElementsByClassName("all_sites")[0]
const currSite = document.getElementsByClassName("current_site")[0]

function setDivs() {
	return new Promise(resolve => {
		for (const service in config.services) {
			divs[service] = {}
			divs[service].toggle = {}
			divs[service].current = currSite.getElementsByClassName(service)[0]
			divs[service].all = allSites.getElementsByClassName(service)[0]
			divs[service].toggle.current = currSite.getElementsByClassName(service + "-enabled")[0]
			divs[service].toggle.all = allSites.getElementsByClassName(service + "-enabled")[0]
		}
		resolve()
	})
}

await setDivs()

const currentSiteIsFrontend = document.getElementById("current_site_divider")

browser.storage.local.get(["options"], r => {
	browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
		for (const service in config.services) {
			if (!r.options.popupServices.includes(service)) allSites.getElementsByClassName(service)[0].classList.add("hide")
			else allSites.getElementsByClassName(service)[0].classList.remove("hide")
			currSite.getElementsByClassName(service)[0].classList.add("hide")
		}

		for (const service in config.services) {
			divs[service].toggle.all.checked = r.options[service].enabled
			divs[service].toggle.current.checked = r.options[service].enabled
		}

		let url
		try {
			url = new URL(tabs[0].url)
		} catch {
			currentSiteIsFrontend.classList.add("hide")
			return
		}

		let service = await servicesHelper.computeService(url, true)
		let frontend
		let instance
		if (service) {
			if (typeof service != "string") {
				instance = service[2]
				frontend = service[1]
				service = service[0]
				let isCustom = false
				for (const network in config.networks) if (r.options[frontend].indexOf(instance) > -1) isCustom = true
			}
			divs[service].current.classList.remove("hide")
			divs[service].all.classList.add("hide")
		} else {
			currentSiteIsFrontend.classList.add("hide")
		}
	})
})

for (const service in config.services) {
	divs[service].toggle.all.addEventListener("change", () => {
		browser.storage.local.get("options", r => {
			let options = r.options
			options[service].enabled = divs[service].toggle.all.checked
			browser.storage.local.set({ options })
		})
	})
	divs[service].toggle.current.addEventListener("change", () => {
		browser.storage.local.get("options", r => {
			let options = r.options
			options[service].enabled = divs[service].toggle.current.checked
			browser.storage.local.set({ options })
		})
	})
}

for (const a of document.getElementsByTagName("a")) {
	a.addEventListener("click", e => {
		if (!a.classList.contains("prevent")) {
			browser.tabs.create({ url: a.getAttribute("href") })
			e.preventDefault()
		}
	})
}

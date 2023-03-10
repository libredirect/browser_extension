"use strict"
window.browser = window.browser || window.chrome

import servicesHelper from "../../assets/javascripts/services.js"
import utils from "../../assets/javascripts/utils.js"

browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
	if (tabs[0].url) {
		const url = new URL(tabs[0].url)
		servicesHelper.switchInstance(url).then(r => {
			if (!r) {
				document.getElementById("change_instance_div").style.display = "none"
			}
			else {
				document.getElementById("change_instance").addEventListener("click",
					async () => browser.tabs.update({ url: await servicesHelper.switchInstance(url) })
				)
			}
		})
		servicesHelper.copyRaw(url, true).then(r => {
			if (!r) {
				document.getElementById("copy_original_div").style.display = "none"
			}
			else {
				document.getElementById("copy_original").addEventListener("click", () => servicesHelper.copyRaw(url))
			}
		})
		servicesHelper.reverse(url).then(r => {
			if (!r) {
				document.getElementById("redirect_to_original_div").style.display = "none"
			} else {
				document.getElementById("redirect_to_original").addEventListener("click", () => {
					browser.runtime.sendMessage("reverseTab");
					calcButtons()
				})
			}
		})
		servicesHelper.redirectAsync(url, "main_frame", null, true).then(r => {
			if (!r) {
				document.getElementById("redirect_div").style.display = "none"
			} else {
				document.getElementById("redirect").addEventListener("click", () => {
					browser.runtime.sendMessage("redirectTab");
					calcButtons()
				})
			}
		})
	} else {
		document.getElementById("change_instance_div").style.display = "none"
		document.getElementById("copy_original_div").style.display = "none"
		document.getElementById("redirect_div").style.display = "none"
		document.getElementById("redirect_to_original_div").style.display = "none"
	}
})

document.getElementById("more-options").addEventListener("click", () => browser.runtime.openOptionsPage())

const allSites = document.getElementsByClassName("all_sites")[0]
const currSite = document.getElementsByClassName("current_site")[0]

const config = await utils.getConfig()

let divs = {}
for (const service in config.services) {
	divs[service] = {}
	divs[service].toggle = {}
	divs[service].current = currSite.getElementsByClassName(service)[0]
	divs[service].all = allSites.getElementsByClassName(service)[0]
	divs[service].toggle.current = currSite.getElementsByClassName(service + "-enabled")[0]
	divs[service].toggle.all = allSites.getElementsByClassName(service + "-enabled")[0]
}

const currentSiteIsFrontend = document.getElementById("current_site_divider")

browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
	let options = await utils.getOptions()
	for (const service in config.services) {
		if (!options.popupServices.includes(service))
			allSites.getElementsByClassName(service)[0].classList.add("hide")
		else
			allSites.getElementsByClassName(service)[0].classList.remove("hide")
		currSite.getElementsByClassName(service)[0].classList.add("hide")
	}

	for (const service in config.services) {
		divs[service].toggle.all.checked = options[service].enabled
		divs[service].toggle.current.checked = options[service].enabled
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
			for (const network in config.networks)
				if (options[frontend].indexOf(instance) > -1)
					isCustom = true
		}
		divs[service].current.classList.remove("hide")
		divs[service].all.classList.add("hide")
	} else {
		currentSiteIsFrontend.classList.add("hide")
	}
})

for (const service in config.services) {
	divs[service].toggle.all.addEventListener("change", async () => {
		let options = await utils.getOptions()
		options[service].enabled = divs[service].toggle.all.checked
		browser.storage.local.set({ options })
	})
	divs[service].toggle.current.addEventListener("change", async () => {
		let options = await utils.getOptions()
		options[service].enabled = divs[service].toggle.current.checked
		browser.storage.local.set({ options })
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
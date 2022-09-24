"use strict"
window.browser = window.browser || window.chrome

import utils from "../../assets/javascripts/utils.js"
import generalHelper from "../../assets/javascripts/general.js"
import serviceHelper from "../../assets/javascripts/services.js"

utils.switchInstance(true).then(r => {
	if (!r) document.getElementById("change_instance_div").style.display = "none"
	else document.getElementById("change_instance").addEventListener("click", () => utils.switchInstance(false))
})

utils.copyRaw(true).then(r => {
	if (!r) document.getElementById("copy_raw_div").style.display = "none"
	else {
		const copy_raw = document.getElementById("copy_raw")
		copy_raw.addEventListener("click", () => utils.copyRaw(false, copy_raw))
	}
})
document.getElementById("more-options").addEventListener("click", () => browser.runtime.openOptionsPage())

let config
let divs = {}

async function getConfig() {
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

function getEnabled() {
	return new Promise(async resolve => {
		for (const service in config.services) {
			browser.storage.local.get(`${service}Enabled`, r => {
				divs[service].toggle.all.checked = r[service + "Enabled"]
				divs[service].toggle.current.checked = r[service + "Enabled"]
			})
		}
		resolve()
	})
}

browser.storage.local.get("popupFrontends", r => {
	browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
		for (const frontend of generalHelper.allPopupFrontends) {
			if (!r.popupFrontends.includes(frontend)) allSites.getElementsByClassName(frontend)[0].classList.add("hide")
			else allSites.getElementsByClassName(frontend)[0].classList.remove("hide")
			currSite.getElementsByClassName(frontend)[0].classList.add("hide")
		}

		await getEnabled()

		let url
		try {
			url = new URL(tabs[0].url)
		} catch {
			currentSiteIsFrontend.classList.add("hide")
			document.getElementById("unify_div").style.display = "none"
			return
		}

		const currentService = serviceHelper.computeService(url)
		if (currentService != null) {
			divs[currentService].current.classList.remove("hide")
			divs[currentService].all.classList.add("hide")
			if (config.services[currentService].preferences != undefined) {
				const unify = document.getElementById("unify")
				const textElement = document.getElementById("unify").getElementsByTagName("h4")[0]
				unify.addEventListener("click", () => {
					const oldHtml = textElement.innerHTML
					textElement.innerHTML = "..."
					browser.runtime.sendMessage({ function: "unify" }, response => {
						if (response && response.response) textElement.innerHTML = oldHtml
					})
				})
			} else {
				document.getElementById("unify_div").style.display = "none"
			}
		} else {
			currentSiteIsFrontend.classList.add("hide")
			document.getElementById("unify_div").style.display = "none"
		}
	})
})

for (const service in config.services) {
	divs[service].toggle.all.addEventListener("change", () => {
		browser.storage.local.set({
			[service + "Enabled"]: divs[service].toggle.all.checked,
		})
	})
	divs[service].toggle.current.addEventListener("change", () => {
		browser.storage.local.set({
			[service + "Enabled"]: divs[service].toggle.current.checked,
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

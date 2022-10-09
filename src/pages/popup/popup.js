"use strict"
window.browser = window.browser || window.chrome

import utils from "../../assets/javascripts/utils.js"
import serviceHelper from "../../assets/javascripts/services.js"

let config,
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

await getConfig()

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

const allSites = document.getElementsByClassName("all_sites")[0]
const currSite = document.getElementsByClassName("current_site")[0]

function setDivs() {
	return new Promise(resolve => {
		divs.instance = document.getElementById("instance")
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

browser.storage.local.get(["options", "redirects"], r => {
	browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
		document.getElementById("instance-div").classList.add("hide")
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
			document.getElementById("unify_div").style.display = "none"
			return
		}

		let service = await serviceHelper.computeService(url, true)
		let frontend
		let instance
		if (service) {
			if (typeof service != "string") {
				instance = service[2]
				frontend = service[1]
				service = service[0]
				divs.instance.innerHTML = instance.replace(/https?:\/{2}/, "")
				let tmp
				let instanceNetwork
				for (const network in config.networks) {
					tmp = r.redirects[frontend][network].indexOf(instance)
					if (tmp > -1) {
						const instanceDiv = document.getElementById("instance-enabled")
						tmp = r.options[frontend][network].enabled.indexOf(instance)
						if (tmp > -1) instanceDiv.checked = true
						else instanceDiv.checked = false
						instanceNetwork = network
						instanceDiv.addEventListener("change", () => {
							browser.storage.local.get("options", r => {
								// Although options would be avaliable in this context, it is fetched again to make sure it is up to date
								let options = r.options
								if (instanceDiv.checked) options[frontend][instanceNetwork].enabled.push(instance)
								else options[frontend][instanceNetwork].enabled.splice(options[frontend][instanceNetwork].enabled.indexOf(instance), 1)
								browser.storage.local.set({ options })
							})
						})
						break
					}
				}
				document.getElementById("instance-div").classList.remove("hide")
			}
			divs[service].current.classList.remove("hide")
			divs[service].all.classList.add("hide")
			if (frontend && config.services[service].frontends[frontend].preferences && !config.services[service].frontends[frontend].preferences.token) {
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

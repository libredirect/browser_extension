window.browser = window.browser || window.chrome

import localise from "./localise.js"
import servicesHelper from "./services.js"

function getRandomInstance(instances) {
	return instances[~~(instances.length * Math.random())]
}

function camelCase(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

let cloudflareBlackList = []
let authenticateBlackList = []
async function initBlackList() {
	return new Promise(resolve => {
		fetch("/instances/blacklist.json")
			.then(response => response.text())
			.then(data => {
				cloudflareBlackList = JSON.parse(data).cloudflare
				authenticateBlackList = JSON.parse(data).authenticate
				resolve()
			})
	})
}

function updateInstances() {
	return new Promise(async resolve => {
		let http = new XMLHttpRequest()
		let fallback = new XMLHttpRequest()
		http.open("GET", "https://codeberg.org/LibRedirect/libredirect/raw/branch/master/src/instances/data.json", false)
		http.send(null)
		if (http.status != 200) {
			fallback.open("GET", "https://raw.githubusercontent.com/libredirect/libredirect/master/src/instances/data.json", false)
			fallback.send(null)
			if (fallback.status === 200) {
				http = fallback
			} else {
				resolve()
				return
			}
		}
		await initBlackList()
		const instances = JSON.parse(http.responseText)

		await servicesHelper.setRedirects(instances)

		console.info("Successfully updated Instances")
		resolve(true)
		return
	})
}

function protocolHost(url) {
	if (url.username && url.password) return `${url.protocol}//${url.username}:${url.password}@${url.host}`
	return `${url.protocol}//${url.host}`
}

async function processDefaultCustomInstances(service, frontend, network, document) {
	let frontendNetworkElement = document.getElementById(frontend).getElementsByClassName(network)[0]

	let frontendCustomInstances = []
	let frontendCheckListElement = frontendNetworkElement.getElementsByClassName("checklist")[0]

	await initBlackList()

	let frontendDefaultRedirects

	let redirects, options

	async function getFromStorage() {
		return new Promise(async resolve =>
			browser.storage.local.get(["options", "redirects",], r => {
				frontendDefaultRedirects = r.options[frontend][network].enabled
				frontendCustomInstances = r.options[frontend][network].custom
				options = r.options
				redirects = r.redirects
				resolve()
			})
		)
	}

	await getFromStorage()

	function calcFrontendCheckBoxes() {
		let isTrue = true
		for (const item of redirects[frontend][network]) {
			if (!frontendDefaultRedirects.includes(item)) {
				isTrue = false
				break
			}
		}
		for (const element of frontendCheckListElement.getElementsByTagName("input")) {
			element.checked = frontendDefaultRedirects.includes(element.className)
		}
		if (frontendDefaultRedirects.length == 0) isTrue = false
		frontendNetworkElement.getElementsByClassName("toggle-all")[0].checked = isTrue
	}
	frontendCheckListElement.innerHTML = [
		`<div>
        <x data-localise="__MSG_toggleAll__">Toggle All</x>
        <input type="checkbox" class="toggle-all"/>
      </div>`,
		...redirects[frontend][network]
			.sort((a, b) =>
				(cloudflareBlackList.includes(a) && !cloudflareBlackList.includes(b))
				||
				(authenticateBlackList.includes(a) && !authenticateBlackList.includes(b))
			)
			.map(x => {
				const cloudflare = cloudflareBlackList.includes(x) ? ' <span style="color:red;">cloudflare</span>' : ""
				const authenticate = authenticateBlackList.includes(x) ? ' <span style="color:orange;">authenticate</span>' : ""

				let warnings = [cloudflare, authenticate].join(" ")
				return `<div>
                    <x><a href="${x}" target="_blank">${x}</a>${warnings}</x>
                    <input type="checkbox" class="${x}"/>
                  </div>`
			}),
	].join("\n<hr>\n")

	localise.localisePage()

	calcFrontendCheckBoxes()
	frontendNetworkElement.getElementsByClassName("toggle-all")[0].addEventListener("change", async event => {
		browser.storage.local.get("options", r => {
			let options = r.options
			if (event.target.checked) frontendDefaultRedirects = [...redirects[frontend][network]]
			else frontendDefaultRedirects = []

			options[frontend][network].enabled = frontendDefaultRedirects
			browser.storage.local.set({ options })
			calcFrontendCheckBoxes()
		})
	})

	for (let element of frontendCheckListElement.getElementsByTagName("input")) {
		if (element.className != "toggle-all")
			frontendNetworkElement.getElementsByClassName(element.className)[0].addEventListener("change", async event => {
				browser.storage.local.get("options", r => {
					let options = r.options
					if (event.target.checked) frontendDefaultRedirects.push(element.className)
					else {
						let index = frontendDefaultRedirects.indexOf(element.className)
						if (index > -1) frontendDefaultRedirects.splice(index, 1)
					}

					options[frontend][network].enabled = frontendDefaultRedirects
					browser.storage.local.set({ options })
					calcFrontendCheckBoxes()
				})
			})
	}

	function calcFrontendCustomInstances() {
		frontendNetworkElement.getElementsByClassName("custom-checklist")[0].innerHTML = frontendCustomInstances
			.map(
				x => `<div>
                ${x}
                <button class="add clear-${x}">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>
              </div>
              <hr>`
			)
			.join("\n")

		for (const item of frontendCustomInstances) {
			frontendNetworkElement.getElementsByClassName(`clear-${item}`)[0].addEventListener("click", async () => {
				browser.storage.local.get("options", r => {
					let options = r.options
					let index = frontendCustomInstances.indexOf(item)
					if (index > -1) frontendCustomInstances.splice(index, 1)
					options[frontend][network].custom = frontendCustomInstances
					browser.storage.local.set({ options })
					calcFrontendCustomInstances()
				})
			})
		}
	}
	calcFrontendCustomInstances()
	frontendNetworkElement.getElementsByClassName("custom-instance-form")[0].addEventListener("submit", async event => {
		browser.storage.local.get("options", r => {
			let options = r.options
			event.preventDefault()
			let frontendCustomInstanceInput = frontendNetworkElement.getElementsByClassName("custom-instance")[0]
			let url = new URL(frontendCustomInstanceInput.value)
			let protocolHostVar = url.href
			if (frontendCustomInstanceInput.validity.valid && !redirects[frontend][network].includes(protocolHostVar)) {
				if (!frontendCustomInstances.includes(protocolHostVar)) {
					frontendCustomInstances.push(protocolHostVar)
					options[frontend][network].custom = frontendCustomInstances
					browser.storage.local.set({ options })
					frontendCustomInstanceInput.value = ""
				}
				calcFrontendCustomInstances()
			}
		})
	})
}

function copyRaw(test, copyRawElement) {
	return new Promise(resolve => {
		browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
			let currTab = tabs[0]
			if (currTab) {
				let url
				try {
					url = new URL(currTab.url)
				} catch {
					resolve()
					return
				}

				const newUrl = await servicesHelper.reverse(url)

				if (newUrl) {
					resolve(newUrl)
					if (test) return
					navigator.clipboard.writeText(newUrl)
					if (copyRawElement) {
						const textElement = copyRawElement.getElementsByTagName("h4")[0]
						const oldHtml = textElement.innerHTML
						textElement.innerHTML = browser.i18n.getMessage("copied")
						setTimeout(() => (textElement.innerHTML = oldHtml), 1000)
					}
				}
			}
			resolve()
		})
	})
}

function switchInstance(test) {
	return new Promise(resolve => {
		browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
			let currTab = tabs[0]
			if (currTab) {
				let url
				try {
					url = new URL(currTab.url)
				} catch {
					resolve()
					return
				}
				const newUrl = await servicesHelper.switchInstance(url)

				if (newUrl) {
					if (!test) browser.tabs.update({ url: newUrl })
					resolve(true)
				} else resolve()
			}
		})
	})
}

export default {
	getRandomInstance,
	updateInstances,
	protocolHost,
	processDefaultCustomInstances,
	switchInstance,
	copyRaw,
	camelCase,
}

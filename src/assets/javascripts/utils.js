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
let offlineBlackList = []
async function initBlackList() {
	return new Promise(resolve => {
		fetch("/instances/blacklist.json")
			.then(response => response.text())
			.then(data => {
				cloudflareBlackList = JSON.parse(data).cloudflare
				authenticateBlackList = JSON.parse(data).authenticate
				offlineBlackList = JSON.parse(data).offline
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

		servicesHelper.setRedirects(instances)

		console.info("Successfully updated Instances")
		resolve(true)
		return
	})
}

function protocolHost(url) {
	if (url.username && url.password) return `${url.protocol}//${url.username}:${url.password}@${url.host}`
	return `${url.protocol}//${url.host}`
}

async function processDefaultCustomInstances(service, name, network, document) {
	let instancesLatency
	let nameNetworkElement = document.getElementById(name).getElementsByClassName(network)[0]

	let nameCustomInstances = []
	let nameCheckListElement = nameNetworkElement.getElementsByClassName("checklist")[0]

	await initBlackList()

	let nameDefaultRedirects

	let redirects, options

	async function getFromStorage() {
		return new Promise(async resolve =>
			browser.storage.local.get(["options", "redirects", "latency"], r => {
				nameDefaultRedirects = r.options[name][network].enabled
				nameCustomInstances = r.options[name][network].custom
				options = r.options
				if (r.latency) instancesLatency = r.latency[name] ?? []
				else instancesLatency = []
				redirects = r.redirects
				resolve()
			})
		)
	}

	await getFromStorage()

	function calcNameCheckBoxes() {
		let isTrue = true
		for (const item of redirects[name][network]) {
			if (nameDefaultRedirects === undefined) console.log(name + network + " is undefined")
			if (!nameDefaultRedirects.includes(item)) {
				isTrue = false
				break
			}
		}
		for (const element of nameCheckListElement.getElementsByTagName("input")) {
			element.checked = nameDefaultRedirects.includes(element.className)
		}
		if (nameDefaultRedirects.length == 0) isTrue = false
		nameNetworkElement.getElementsByClassName("toggle-all")[0].checked = isTrue
	}
	nameCheckListElement.innerHTML = [
		`<div>
        <x data-localise="__MSG_toggleAll__">Toggle All</x>
        <input type="checkbox" class="toggle-all"/>
      </div>`,
		...redirects[name][network].map(x => {
			const cloudflare = cloudflareBlackList.includes(x) ? ' <span style="color:red;">cloudflare</span>' : ""
			const authenticate = authenticateBlackList.includes(x) ? ' <span style="color:orange;">authenticate</span>' : ""
			const offline = offlineBlackList.includes(x) ? ' <span style="color:grey;">offline</span>' : ""

			let ms = instancesLatency[x]
			let latencyColor = ms <= 1000 ? "green" : ms <= 2000 ? "orange" : "red"
			let latencyLimit
			if (ms == 5000) latencyLimit = "5000ms+"
			else if (ms > 5000) latencyLimit = `ERROR: ${ms - 5000}`
			else latencyLimit = ms + "ms"

			const latency = x in instancesLatency ? '<span style="color:' + latencyColor + ';">' + latencyLimit + "</span>" : ""

			let warnings = [cloudflare, authenticate, offline, latency].join(" ")
			return `<div>
                    <x><a href="${x}" target="_blank">${x}</a>${warnings}</x>
                    <input type="checkbox" class="${x}"/>
                  </div>`
		}),
	].join("\n<hr>\n")

	localise.localisePage()

	calcNameCheckBoxes()
	nameNetworkElement.getElementsByClassName("toggle-all")[0].addEventListener("change", async event => {
		if (event.service.checked) nameDefaultRedirects = [...redirects[name][network]]
		else nameDefaultRedirects = []

		options[service][network].enabled = nameDefaultRedirects
		browser.storage.local.set({ options })
		calcNameCheckBoxes()
	})

	for (let element of nameCheckListElement.getElementsByTagName("input")) {
		if (element.className != "toggle-all")
			nameNetworkElement.getElementsByClassName(element.className)[0].addEventListener("change", async event => {
				if (event.service.checked) nameDefaultRedirects.push(element.className)
				else {
					let index = nameDefaultRedirects.indexOf(element.className)
					if (index > -1) nameDefaultRedirects.splice(index, 1)
				}

				options[service][network].enabled = nameDefaultRedirects
				browser.storage.local.set({ options })
				calcNameCheckBoxes()
			})
	}

	function calcNameCustomInstances() {
		nameNetworkElement.getElementsByClassName("custom-checklist")[0].innerHTML = nameCustomInstances
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

		for (const item of nameCustomInstances) {
			nameNetworkElement.getElementsByClassName(`clear-${item}`)[0].addEventListener("click", async () => {
				let index = nameCustomInstances.indexOf(item)
				if (index > -1) nameCustomInstances.splice(index, 1)
				options[service][network].custom = nameCustomInstances
				browser.storage.local.set({ options })
				calcNameCustomInstances()
			})
		}
	}
	calcNameCustomInstances()
	nameNetworkElement.getElementsByClassName("custom-instance-form")[0].addEventListener("submit", async event => {
		event.preventDefault()
		let nameCustomInstanceInput = nameNetworkElement.getElementsByClassName("custom-instance")[0]
		let url = new URL(nameCustomInstanceInput.value)
		let protocolHostVar = protocolHost(url)
		if (nameCustomInstanceInput.validity.valid && !redirects[name][network].includes(protocolHostVar)) {
			if (!nameCustomInstances.includes(protocolHostVar)) {
				nameCustomInstances.push(protocolHostVar)
				options[service][network].custom = nameCustomInstances
				browser.storage.local.set({ options })
				nameCustomInstanceInput.value = ""
			}
			calcNameCustomInstances()
		}
	})
}

function ping(href) {
	return new Promise(async resolve => {
		let average = 0
		let time
		for (let i = 0; i < 3; i++) {
			time = await pingOnce(href)
			if (i == 0) continue
			if (time >= 5000) {
				resolve(time)
				return
			}
			average += time
		}
		average = parseInt(average / 3)
		resolve(average)
	})
}

function pingOnce(href) {
	return new Promise(async resolve => {
		let started
		let http = new XMLHttpRequest()
		http.timeout = 5000
		http.ontimeout = () => resolve(5000)
		http.onerror = () => resolve()
		http.onreadystatechange = () => {
			if (http.readyState == 2) {
				if (http.status == 200) {
					let ended = new Date().getTime()
					http.abort()
					resolve(ended - started)
				} else {
					resolve(5000 + http.status)
				}
			}
		}
		http.open("GET", `${href}?_=${new Date().getTime()}`, true)
		started = new Date().getTime()
		http.send(null)
	})
}

async function testLatency(element, instances, frontend) {
	return new Promise(async resolve => {
		let myList = {}
		let latencyThreshold
		let redirectsChecks = []
		browser.storage.local.get(["options"], r => {
			latencyThreshold = r.options.latencyThreshold
			redirectsChecks = r.options[frontend].clearnet.enabled
		})
		for (const href of instances)
			await ping(href).then(time => {
				if (time) {
					myList[href] = time
					let color
					if (time <= 1000) color = "green"
					else if (time <= 2000) color = "orange"
					else color = "red"

					if (time > latencyThreshold) {
						redirectsChecks.splice(redirectsChecks.indexOf(href), 1)
					}

					browser.storage.local.set({ [`${frontend}ClearnetRedirectsChecks`]: redirectsChecks })

					let text
					if (time == 5000) text = "5000ms+"
					else if (time > 5000) text = `ERROR: ${time - 5000}`
					else text = `${time}ms`
					element.innerHTML = `${href}:&nbsp;<span style="color:${color};">${text}</span>`
				}
			})
		resolve(myList)
	})
}

function copyCookie(frontend, targetUrl, urls, name) {
	return new Promise(resolve => {
		browser.storage.local.get("options", r => {
			let query
			if (!r.options.firstPartyIsolate)
				query = {
					url: protocolHost(targetUrl),
					name: name,
				}
			else
				query = {
					url: protocolHost(targetUrl),
					name: name,
					firstPartyDomain: null,
				}
			browser.cookies.getAll(query, async cookies => {
				for (const cookie of cookies)
					if (cookie.name == name) {
						for (const url of urls) {
							const setQuery = r.options.firstPartyIsolate
								? {
										url: url,
										name: name,
										value: cookie.value,
										secure: true,
										firstPartyDomain: new URL(url).hostname,
								  }
								: {
										url: url,
										name: name,
										value: cookie.value,
										secure: true,
										expirationDate: cookie.expirationDate,
								  }
							browser.cookies.set(setQuery)
						}
						break
					}
				resolve()
			})
		})
	})
}

function getPreferencesFromToken(frontend, targetUrl, urls, name, endpoint) {
	return new Promise(resolve => {
		const http = new XMLHttpRequest()
		const url = `${targetUrl}${endpoint}`
		http.open("GET", url, false)
		//http.setRequestHeader("Cookie", `${name}=${cookie.value}`)
		http.send(null)
		const preferences = JSON.parse(http.responseText)
		let formdata = new FormData()
		for (var key in preferences) formdata.append(key, preferences[key])
		for (const url of urls) {
			const http = new XMLHttpRequest()
			http.open("POST", `${url}/settings/stay`, false)
			http.send(null)
		}
		resolve()
		return
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

				let newUrl = await servicesHelper.reverse(url)

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

function unify() {
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

				let result = await servicesHelper.unifyPreferences(url)

				resolve(result)
			}
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
				let newUrl = await servicesHelper.switchInstance(url)

				if (newUrl) {
					if (!test) browser.tabs.update({ url: newUrl })
					resolve(true)
				} else resolve()
			}
		})
	})
}

function latency(name, frontend, document, location) {
	let latencyElement = document.getElementById(`latency-${frontend}`)
	let latencyLabel = document.getElementById(`latency-${frontend}-label`)
	latencyElement.addEventListener("click", async () => {
		let reloadWindow = () => location.reload()
		latencyElement.addEventListener("click", reloadWindow)
		let key = `${name} Redirects`
		browser.storage.local.get(key, r => {
			let redirects = r[key]
			const oldHtml = latencyLabel.innerHTML
			latencyLabel.innerHTML = "..."
			testLatency(latencyLabel, redirects[frontend].clearnet, frontend).then(r => {
				browser.storage.local.set({ [`${frontend}Latency`]: r })
				latencyLabel.innerHTML = oldHtml
				processDefaultCustomInstances(name, frontend, "clearnet", document)
				latencyElement.removeEventListener("click", reloadWindow)
			})
		})
	})
}

export default {
	getRandomInstance,
	updateInstances,
	protocolHost,
	processDefaultCustomInstances,
	latency,
	copyCookie,
	getPreferencesFromToken,
	switchInstance,
	copyRaw,
	unify,
	camelCase,
}

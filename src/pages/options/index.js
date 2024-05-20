import utils from "../../assets/javascripts/utils.js"

let config,
	options,
	divs = {}

for (const a of document.getElementById("links").getElementsByTagName("a")) {
	if (!a.href.includes("https://")) {
		a.addEventListener("click", e => {
			const path = a.getAttribute("href").replace("#", "")
			loadPage(path)
			e.preventDefault()
		})
	}
}

config = await utils.getConfig()
options = await utils.getOptions()

/**
 * @param {string} service
 */
async function changeFrontendsSettings(service) {
	options = await utils.getOptions()
	const opacityDiv = document.getElementById(`${service}-opacity`)
	if (document.getElementById(`${service}-enabled`).checked) {
		opacityDiv.style.pointerEvents = 'auto'
		opacityDiv.style.opacity = 1
		opacityDiv.style.userSelect = 'auto'
	} else {
		opacityDiv.style.pointerEvents = 'none'
		opacityDiv.style.opacity = 0.4
		opacityDiv.style.userSelect = 'none'
	}
	for (const frontend in config.services[service].frontends) {
		if (config.services[service].frontends[frontend].instanceList) {
			const frontendDiv = document.getElementById(frontend)
			if (typeof divs[service].frontend !== "undefined") {
				if (
					frontend == divs[service].frontend.value
					||
					(config.services[service].frontends[divs[service].frontend.value].desktopApp && divs[service].embedFrontend && frontend == divs[service].embedFrontend.value)
				) {
					frontendDiv.style.display = ""
					if (config.services[service].frontends[frontend].localhost === true) {
						document.getElementById(`${service}-instance-div`).style.display = ""

						if (options[service].instance == "localhost") {
							frontendDiv.style.display = "none"
						}
					} else {
						document.getElementById(`${service}-instance-div`).style.display = "none"
					}
				} else {
					frontendDiv.style.display = "none"
				}
			}
		}
	}
	if (document.getElementById(`${service}-redirectType`)) {
		const frontend = options[service].frontend
		if (config.services[service].frontends[frontend].embeddable) {
			document.getElementById(`${service}-redirectType`).innerHTML = `
			<option value="both" data-localise="__MSG_both__">both</options>
			<option value="sub_frame" data-localise="__MSG_onlyEmbedded__">Only Embedded</option>
			<option value="main_frame" data-localise="__MSG_onlyNotEmbedded__">Only Not Embedded</option>
			`
		}
		else if (config.services[service].frontends[frontend].desktopApp && Object.values(config.services[service].frontends).some(frontend => frontend.embeddable)) {
			document.getElementById(`${service}-redirectType`).innerHTML = `
			<option value="both" data-localise="__MSG_both__">both</options>
			<option value="main_frame" data-localise="__MSG_onlyNotEmbedded__">Only Not Embedded</option>
			`
			if (options[service].redirectType == "sub_frame") {
				options[service].redirectType = "main_frame"
				browser.storage.local.set({ options })
			}
		} else {
			document.getElementById(`${service}-redirectType`).innerHTML =
				'<option value="main_frame" data-localise="__MSG_onlyNotEmbedded__">Only Not Embedded</option>'
			options[service].redirectType = "main_frame"

			browser.storage.local.set({ options })
		}
		document.getElementById(`${service}-redirectType`).value = options[service].redirectType
		if (config.services[service].frontends[frontend].desktopApp && options[service].redirectType != "main_frame") {
			document.getElementById(`${service}-embedFrontend-div`).style.display = ''
			document.getElementById(divs[service].embedFrontend.value).style.display = ''
		}
		else if (config.services[service].frontends[frontend].desktopApp && options[service].redirectType == "main_frame") {
			document.getElementById(`${service}-embedFrontend-div`).style.display = 'none'
			document.getElementById(divs[service].embedFrontend.value).style.display = 'none'
		} else {
			document.getElementById(`${service}-embedFrontend-div`).style.display = 'none'
		}
	}
	const frontend_name_element = document.getElementById(`${service}_page`).getElementsByClassName("frontend_name")[0]
	frontend_name_element.href = config.services[service].frontends[divs[service].frontend.value].url
}

/**
 * @param {string} path
 */
async function loadPage(path) {
	options = await utils.getOptions()
	for (const section of document.getElementById("pages").getElementsByTagName("section")) section.style.display = "none"
	document.getElementById(`${path}_page`).style.display = "block"

	for (const element of document.getElementsByClassName("title")) {
		const a = element.getElementsByTagName('a')[0]
		if (a.getAttribute("href") == `#${path}`) {
			element.classList.add("selected")
		} else {
			element.classList.remove("selected")
		}
	}

	for (const service in config.services) {
		if (options[service].enabled) {
			document.getElementById(`${service}-link`).style.opacity = 1
		} else {
			document.getElementById(`${service}-link`).style.opacity = 0.4
		}
	}

	window.history.pushState({ id: "100" }, "Page 2", `/pages/options/index.html#${path}`)

	if (path != 'general') {
		const service = path;

		divs[service] = {}

		for (const option in config.services[service].options) {
			divs[service][option] = document.getElementById(`${service}-${option}`)
			if (typeof config.services[service].options[option] == "boolean") divs[service][option].checked = options[service][option]
			else divs[service][option].value = options[service][option]
			divs[service][option].addEventListener("change", async () => {
				let options = await utils.getOptions()
				if (typeof config.services[service].options[option] == "boolean")
					options[service][option] = divs[service][option].checked
				else
					options[service][option] = divs[service][option].value
				browser.storage.local.set({ options })
				changeFrontendsSettings(service)
			})
		}

		changeFrontendsSettings(service)


		for (const frontend in config.services[service].frontends) {
			if (config.services[service].frontends[frontend].instanceList) {
				processCustomInstances(frontend, document)
				document.getElementById(`ping-${frontend}`).addEventListener("click", async () => {
					document.getElementById(`ping-${frontend}`).getElementsByTagName('x')[0].innerHTML = "Pinging..."
					await ping(frontend)
					document.getElementById(`ping-${frontend}`).getElementsByTagName('x')[0].innerHTML = "Ping instances"
				})
			}
		}

		!async function () {
			const blacklist = await utils.getBlacklist(options)
			const redirects = await utils.getList(options)

			for (const frontend in config.services[service].frontends) {
				if (config.services[service].frontends[frontend].instanceList) {
					if (redirects == 'disabled' || blacklist == 'disabled') {
						document.getElementById(frontend).getElementsByClassName('clearnet')[0].style.display = 'none'
						document.getElementById(frontend).getElementsByClassName('ping')[0].style.display = 'none'
					}
					else if (!redirects || !blacklist) {
						document.getElementById(frontend)
							.getElementsByClassName('clearnet')[0]
							.getElementsByClassName("checklist")[0]
							.getElementsByClassName('loading')[0]
							.innerHTML = 'Could not fetch instances.'
					}
					else {
						createList(frontend, config.networks, document, redirects, blacklist)
					}
				}
			}
		}()
	}
}

async function calcCustomInstances(frontend) {
	let options = await utils.getOptions()
	let customInstances = options[frontend]
	const pingCache = await utils.getPingCache()

	document.getElementById(frontend).getElementsByClassName("custom-checklist")[0].innerHTML = customInstances
		.map(
			x => {
				let time = pingCache[x]
				let timeText = ""
				if (time) {
					const { color, text } = processTime(time)
					timeText = `<span class="ping" style="color:${color};">${text}</span>`
				}
				return `<div>
							<x>
								<a href="${x}" target="_blank">${x}</a>
								${timeText}
							</x>
							<button class="add clear-${x}">
								<svg xmlns="https://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
									<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
								</svg>
							</button>
						</div>
						<hr>`
			})
		.join("\n")
	for (const item of customInstances) {
		document.getElementById(frontend).getElementsByClassName(`clear-${item}`)[0].addEventListener("click", async () => {
			const index = customInstances.indexOf(item)
			if (index > -1) customInstances.splice(index, 1)
			options = await utils.getOptions()
			options[frontend] = customInstances
			browser.storage.local.set({ options }, async () => {
				calcCustomInstances(frontend)
				const blacklist = await utils.getBlacklist(options)
				const redirects = await utils.getList(options)
				createList(frontend, config.networks, document, redirects, blacklist)
			})
		})
	}
}

async function processCustomInstances(frontend, document) {
	calcCustomInstances(frontend)
	document.getElementById(frontend).getElementsByClassName("custom-instance-form")[0].addEventListener("submit", async event => {
		event.preventDefault()
		let options = await utils.getOptions()
		let customInstances = options[frontend]
		let frontendCustomInstanceInput = document.getElementById(frontend).getElementsByClassName("custom-instance")[0]
		let url
		try {
			url = new URL(frontendCustomInstanceInput.value)
		} catch (error) {
			return
		}
		let protocolHostVar = utils.protocolHost(url)
		if (frontendCustomInstanceInput.validity.valid) {
			if (!customInstances.includes(protocolHostVar)) {
				customInstances.push(protocolHostVar)
				options = await utils.getOptions()
				options[frontend] = customInstances
				browser.storage.local.set({ options }, () => {
					frontendCustomInstanceInput.value = ""
					calcCustomInstances(frontend)
				})
			}
		}
	})
}

/**
 * @param {string} frontend
 * @param {*} networks
 * @param {Document} document
 * @param {*} redirects
 * @param {*} blacklist
 */
async function createList(frontend, networks, document, redirects, blacklist) {
	const pingCache = await utils.getPingCache()
	const options = await utils.getOptions()
	for (const network in networks) {
		const checklist = document.getElementById(frontend)
			.getElementsByClassName(network)[0]
			.getElementsByClassName("checklist")[0]

		if (!redirects[frontend]) {
			checklist.innerHTML = '<div class="block block-option">No instances found.</div>'
			break
		}

		const instances = redirects[frontend][network]
		if (!instances || instances.length === 0) continue

		document.getElementById(frontend)
			.getElementsByClassName("custom-instance")[0]
			.placeholder = redirects[frontend].clearnet[0]

		const sortedInstances = instances.sort((a, b) => blacklist.cloudflare.includes(a) && !blacklist.cloudflare.includes(b))

		const content = sortedInstances
			.map(x => {
				const cloudflare = blacklist.cloudflare.includes(x) ?
					`<a target="_blank" href="https://libredirect.github.io/docs.html#instances">
                        <span style="color:red;">cloudflare</span>
                    </a>` : ""

				let time = pingCache[x]
				let timeText = ""
				if (time) {
					const { color, text } = processTime(time)
					timeText = `<span class="ping" style="color:${color};">${text}</span>`
				}

				const chosen = options[frontend].includes(x) ? `<span style="color:grey;">chosen</span>` : ""

				const warnings = [cloudflare, timeText, chosen].join(" ")
				return `<div class="frontend">
                            <x>
                                <a href="${x}" target="_blank">${x}</a>
								${warnings}
                            </x>
                            <button class="add add-${x}">
                                <svg xmlns="https://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                            </button>
                        </div>`
			})

		checklist.innerHTML = [
			`<div class="block block-option">
                <label>${utils.camelCase(network)}</label>
            </div>`,
			...content,
			"<br>"
		].join("\n<hr>\n")

		for (const instance of instances) {
			checklist.getElementsByClassName(`add-${instance}`)[0]
				.addEventListener("click", async () => {
					let options = await utils.getOptions()
					if (!options[frontend].includes(instance)) {
						options[frontend].push(instance)
						browser.storage.local.set({ options }, () => {
							calcCustomInstances(frontend)
							createList(frontend, config.networks, document, redirects, blacklist)
						})
					}
				})
		}
	}
}

const r = window.location.href.match(/#(.*)/)
if (r) loadPage(r[1])
else loadPage("general")

/**
 * @param {string} frontend
 */
async function ping(frontend) {
	const instanceElements = [
		...document.getElementById(frontend).getElementsByClassName("custom-checklist")[0].getElementsByTagName('x'),
		...document.getElementById(frontend).getElementsByClassName('clearnet')[0].getElementsByTagName('x')
	]

	let pingCache = await utils.getPingCache()
	let redundancyList = {}
	for (const element of instanceElements) {
		let span = element.getElementsByClassName('ping')[0]
		if (!span) span = document.createElement('span')
		span.classList = ['ping']
		span.innerHTML = '<span style="color:lightblue">pinging...</span>'
		element.appendChild(span)
		const href = element.getElementsByTagName('a')[0].href
		const innerHTML = element.getElementsByTagName('a')[0].innerHTML
		const time = redundancyList[innerHTML] ?? await utils.ping(href)
		const { color, text } = processTime(time)
		span.innerHTML = `<span style="color:${color};">${text}</span>`
		pingCache[innerHTML] = time
		redundancyList[innerHTML] = time

		browser.storage.local.set({ pingCache })
	}
}

/**
 * @param {number} time
 */
function processTime(time) {
	let text
	let color
	if (time < 5000) {
		text = `${time}ms`
		if (time <= 1000) color = "green"
		else if (time <= 2000) color = "orange"
	}
	else if (time >= 5000) {
		color = "red"
		if (time == 5000) text = "5000ms+"
		if (time > 5000) text = `Error: ${time - 5000}`
	}
	else {
		color = "red"
		text = 'Server not found'
	}
	return { color, text }
}

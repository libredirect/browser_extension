window.browser = window.browser || window.chrome

/**
 * @param {Array.<T>} instances 
 * @returns {T}
 */
function getRandomInstance(instances) {
	return instances[~~(instances.length * Math.random())]
}

/**
 * @param {string} str
 */
function camelCase(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @param {URL} url
 */
function protocolHost(url) {
	if (url.username && url.password) return `${url.protocol}//${url.username}:${url.password}@${url.host}`
	if (url.pathname == "/TekstoLibre/" && url.host.endsWith("github.io")) // workaround
		return `${url.protocol}//${url.host}${url.pathname.slice(0, -1)}`
	return `${url.protocol}//${url.host}`
}

/**
 * @typedef FrontendInfo
 * @prop {boolean} instanceList
 * @prop {string} name
 * @prop {string} url
 */

/**
 * @typedef {Object} Service
 * @prop {Object.<string, FrontendInfo>} frontends
 * @prop {Object} options
 */

/**
 * @typedef {Object} Config
 * @prop {Object.<string, Service>} services
 */

/**
 * @returns {Promise<Config>}
 */
function getConfig() {
	return new Promise(resolve => {
		fetch("/config.json")
			.then(response => response.text())
			.then(json => {
				resolve(JSON.parse(json))
				return
			})
	})
}

/**
 * @typedef {Object} Option
 * @prop {string} frontend
 */

/**
 * @returns {Promise<Object.<string, Option | string[]>>}
 */
function getOptions() {
	return new Promise(resolve =>
		browser.storage.local.get("options", r => {
			resolve(r.options)
		})
	)
}

function getPingCache() {
	return new Promise(resolve =>
		browser.storage.local.get("pingCache", r => {
			resolve(r.pingCache ?? {})
		})
	)
}

function getBlacklist(options) {
	return new Promise(resolve => {
		let url
		if (options.fetchInstances == 'github') {
			url = 'https://raw.githubusercontent.com/libredirect/instances/main/blacklist.json'
		}
		else if (options.fetchInstances == 'codeberg') {
			url = 'https://codeberg.org/LibRedirect/instances/raw/branch/main/blacklist.json'
		}
		else {
			resolve('disabled')
			return
		}
		const http = new XMLHttpRequest()
		http.open("GET", url, true)
		http.onreadystatechange = () => {
			if (http.status === 200 && http.readyState == XMLHttpRequest.DONE) {
				resolve(JSON.parse(http.responseText))
				return
			}
		}
		http.onerror = () => {
			resolve()
			return
		}
		http.ontimeout = () => {
			resolve()
			return
		}
		http.send(null)
	})
}

function getList(options) {
	return new Promise(resolve => {
		let url
		if (options.fetchInstances == 'github') {
			url = 'https://raw.githubusercontent.com/libredirect/instances/main/data.json'
		}
		else if (options.fetchInstances == 'codeberg') {
			url = 'https://codeberg.org/LibRedirect/instances/raw/branch/main/data.json'
		}
		else {
			resolve('disabled')
			return
		}
		const http = new XMLHttpRequest()
		http.open("GET", url, true)
		http.onreadystatechange = () => {
			if (http.status === 200 && http.readyState == XMLHttpRequest.DONE) {
				resolve(JSON.parse(http.responseText))
				return
			}
		}
		http.onerror = () => {
			resolve()
			return
		}
		http.ontimeout = () => {
			resolve()
			return
		}
		http.send(null)
	})
}

/**
 * @param {string} href
 */
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

/**
 * @param {string} href
 */
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

export default {
	getRandomInstance,
	protocolHost,
	getList,
	getBlacklist,
	camelCase,
	getConfig,
	getOptions,
	getPingCache,
	ping,
}

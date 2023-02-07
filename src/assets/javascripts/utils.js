window.browser = window.browser || window.chrome

function getRandomInstance(instances) {
	return instances[~~(instances.length * Math.random())]
}

function camelCase(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

function protocolHost(url) {
	if (url.username && url.password) return `${url.protocol}//${url.username}:${url.password}@${url.host}`
	return `${url.protocol}//${url.host}`
}

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

function getOptions() {
	return new Promise(resolve =>
		browser.storage.local.get("options", r => {
			resolve(r.options)
		})
	)
}

function getBlacklist() {
	return new Promise(resolve => {
		const http = new XMLHttpRequest()
		http.open("GET", "https://raw.githubusercontent.com/libredirect/instances/main/blacklist.json", true)
		http.onreadystatechange = () => {
			if (http.status === 200 && http.readyState == XMLHttpRequest.DONE) {
				resolve(JSON.parse(http.responseText))
				return
			}
		}
		http.send(null)
	})
}

function getList() {
	return new Promise(resolve => {
		const http = new XMLHttpRequest()
		http.open("GET", "https://raw.githubusercontent.com/libredirect/instances/main/data.json", true)
		http.onreadystatechange = () => {
			if (http.status === 200 && http.readyState == XMLHttpRequest.DONE) {
				resolve(JSON.parse(http.responseText))
				return
			}
		}
		http.send(null)
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
	ping,
}

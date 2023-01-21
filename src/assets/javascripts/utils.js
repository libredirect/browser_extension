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

export default {
	getRandomInstance,
	protocolHost,
	getList,
	getBlacklist,
	camelCase,
	getConfig,
	getOptions
}

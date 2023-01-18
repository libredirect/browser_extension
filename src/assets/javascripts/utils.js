window.browser = window.browser || window.chrome

import servicesHelper from "./services.js"

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
	switchInstance,
	copyRaw,
	getList,
	getBlacklist,
	camelCase,
}

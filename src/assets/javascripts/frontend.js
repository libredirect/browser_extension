"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"

export async function FrontEnd({ name, enable, frontends, frontend, redirect, reverse }) {
	let these = {}
	these.redirects = {}
	these.enable = enable
	these.frontend = frontend
	these.protocol = "normal"
	these.name = name
	these.protocolFallback = true
	these.redirectType = "both"

	let init = () => {
		return new Promise(async resolve =>
			browser.storage.local.get(these.name, async r => {
				r = r[these.name]
				if (r) {
					these.redirects = r[these.redirects]
					these.enable = r[these.enable]
					these.frontend = r[these.frontend]
					these.protocol = r[these.protocol]
					these.name = r[these.name]
					these.protocolFallback = r[these.protocolFallback]
				} else {
					await these.initDefaults()
					init()
				}
				resolve()
			})
		)
	}

	these.initDefaults = () => {
		return new Promise(resolve => {
			fetch("/instances/data.json")
				.then(response => response.text())
				.then(list =>
					fetch("/instances/blacklist.json")
						.then(response => response.text())
						.then(blackList => these.setRedirects(JSON.parse(list), JSON.parse(blackList)).then(() => resolve()))
				)
		})
	}

	these.setRedirects = (list, blackList) => {
		return new Promise(resolve => {
			for (const frontend in frontends) {
				these.redirects[frontend] = {}

				these.redirects[frontend].cookies = [...frontends[frontend].cookies]

				for (const protocol in list[frontend]) {
					these.redirects[frontend][protocol] = {}

					these.redirects[frontend][protocol].all = [...list[frontend][protocol]]

					these.redirects[frontend][protocol].custom = []

					these.redirects[frontend][protocol].checked = [...list[frontend][protocol]]
					for (const instance of blackList.cloudflare) {
						const a = these.redirects[frontend][protocol].checked.indexOf(instance)
						if (a > -1) these.redirects[frontend][protocol].checked.splice(a, 1)
					}
					for (const instance of blackList.offline) {
						const a = these.redirects[frontend][protocol].checked.indexOf(instance)
						if (a > -1) these.redirects[frontend][protocol].checked.splice(a, 1)
					}
				}
			}
			browser.storage.local.set(
				{
					[these.name]: {
						[these.redirects]: these.redirects,
						[these.enable]: these.enable,
						[these.frontend]: these.frontend,
						[these.protocol]: these.protocol,
						[these.name]: these.name,
						[these.protocolFallback]: these.protocolFallback,
					},
				},
				() => resolve()
			)
		})
	}

	these.unify = from => {
		return new Promise(async resolve => {
			const protocolHost = utils.protocolHost(from)
			const list = these.redirects[these.frontend][these.protocol]
			if (![...list.checked, ...list.custom].includes(protocolHost)) {
				resolve()
				return
			}
			for (const cookie of these.redirects[these.frontend].cookies) {
				await utils.copyCookie(frontend, protocolHost, [...list.checked, list.custom], cookie)
			}
			resolve(true)
		})
	}

	these.switch = (url, disableOverride) => {
		if (!these.enable && !disableOverride) return

		const protocolHost = utils.protocolHost(url)

		const list = these.redirects[these.frontend][these.protocol]
		if (!list.all.includes(protocolHost)) return

		let userList = [...list.checked, ...list.custom]
		if (userList.length === 0 && these.protocolFallback) userList = [...list.normal.all]

		const i = userList.indexOf(protocolHost)
		if (i > -1) userList.splice(i, 1)
		if (userList.length === 0) return

		const randomInstance = utils.getRandomInstance(userList)
		return `${randomInstance}${url.pathname}${url.search}`
	}

	these.redirect = (url, type, initiator, disableOverride) => {
		if (!these.enable && !disableOverride) return
		if (initiator && these.redirects[these.frontend][these.protocol].all.includes(initiator.origin)) return "BYPASSTAB"
		const result = redirect(url, type, these.frontend, these.redirectType)
		if (result == "SKIP") return "SKIP"
		if (result) {
			const list = these.redirects[these.frontend][these.protocol]
			const userList = [...list.checked, ...list.custom]
			const randomInstance = utils.getRandomInstance(userList)
			const url = new URL(result)
			return `${randomInstance}${url.pathname}${url.search}`
		}
	}

	this.reverse = url => {
		const protocolHost = utils.protocolHost(url)
		const list = these.redirects[these.frontend][these.protocol]
		if (!list.all.includes(protocolHost)) return
		return reverse(url)
	}

	await init()
	browser.storage.onChanged.addListener(init)

	return these
}

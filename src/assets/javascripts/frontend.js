"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"

// cookieTokens
export async function FrontEnd({ name, enable, frontends, redirect, reverse, unify }) {
	let these = {}
	these.redirects = {}
	these.enable = enable
	these.frontend = frontends[0]
	these.protocol = "normal"
	these.name = name
	these.protocolFallback = true
	these.redirectType = "both"
	these.unify = unify

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
	these.unify = ({ test, from, tabId }) => {
		return new Promise(async resolve => {
			if (!these.enable) {
				resolve()
				return
			}

			const protocolHost = utils.protocolHost(from)
			const list = these.redirects[these.frontend][these.protocol]
			let selectedList = [...list.checked, ...list.custom]
			if (!selectedList.includes(protocolHost)) {
				resolve()
				return
			}

			const i = selectedList.indexOf(protocolHost)
			if (i !== -1) selectedList.splice(i, 1)

			if (these.frontend in these.unify.cookies) {
				if (!test) {
					for (const cookie of these.unify.cookies[these.frontend]) {
						await new Promise(resolve => {
							browser.cookies.getAll(
								{
									url: protocolHost(protocolHost),
									name: cookie,
								},
								cookies => {
									for (const cookie of cookies) {
										if (cookie.name == cookie) {
											for (const url of selectedList) {
												browser.cookies.set({
													url: url,
													name: cookie.name,
													value: cookie.value,
													secure: cookie.secure,
													expirationDate: cookie.expirationDate,
												})
											}
											break
										}
									}
									resolve()
								}
							)
						})
					}
				}
				resolve(true)
				return
			}
			if (these.frontend in these.unify.localStorage) {
				if (!test) {
					browser.storage.local.set({ localStorage_tmp_list: these.unify.localStorage[these.frontend] })
					browser.tabs.executeScript(tabId, {
						file: `/assets/javascripts/localStorage/get.js`,
						runAt: "document_start",
					})
					for (const to of selectedList) {
						browser.tabs.create({ url: to }, tab =>
							browser.tabs.executeScript(tab.id, {
								file: `/assets/javascripts/localStorage/set.js`,
								runAt: "document_start",
							})
						)
					}
				}
				resolve(true)
				return
			}
			resolve()
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

	these.reverse = url => {
		const protocolHost = utils.protocolHost(url)
		const list = these.redirects[these.frontend][these.protocol]
		if (!list.all.includes(protocolHost)) return
		return reverse(url)
	}

	these.removeXFrameOptions = e => {
		let isChanged = false

		const list = these.redirects[these.frontend][these.protocol]
		if (e.type == "main_frame") {
			for (const i in e.responseHeaders) {
				if (e.responseHeaders[i].name == "content-security-policy") {
					const selectedList = [...list.checked, ...list.custom]

					let securityPolicyList = e.responseHeaders[i].value.split(";")
					for (const i in securityPolicyList) securityPolicyList[i] = securityPolicyList[i].trim()

					let newSecurity = ""
					for (const item of securityPolicyList) {
						if (item.trim() == "") continue
						let regex = item.match(/([a-z-]{0,}) (.*)/)
						if (regex == null) continue
						let [, key, vals] = regex
						if (key == "frame-src") vals = vals + " " + selectedList.join(" ")
						newSecurity += key + " " + vals + "; "
					}

					e.responseHeaders[i].value = newSecurity
					isChanged = true
				}
			}
		} else if (e.type == "sub_frame") {
			const url = new URL(e.url)
			const protocolHost = utils.protocolHost(url)
			if (!list.all.includes(protocolHost)) return
			for (const i in e.responseHeaders) {
				if (e.responseHeaders[i].name == "x-frame-options") {
					e.responseHeaders.splice(i, 1)
					isChanged = true
				} else if (e.responseHeaders[i].name == "content-security-policy") {
					e.responseHeaders.splice(i, 1)
					isChanged = true
				}
			}
		}
		if (isChanged) return { responseHeaders: e.responseHeaders }
	}

	await init()
	browser.storage.onChanged.addListener(init)

	return these
}

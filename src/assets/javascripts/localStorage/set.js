window.browser = window.browser || window.chrome

browser.storage.local.get("localStorage_tmp", r => {
	for (const key in r.localStorage_tmp) {
		localStorage.setItem(key, r.localStorage_tmp[key])
	}
	browser.storage.sync.remove("localStorage_tmp", () => window.close())
})

window.browser = window.browser || window.chrome

browser.storage.local.get("localStorage_tmp_list", r => {
	let localStorage_tmp = {}
	for (const item of r.localStorage_tmp_list) {
		localStorage_tmp[item] = localStorage.getItem(item)
	}
	browser.storage.local.remove("localStorage_tmp_list")
	browser.storage.local.set(localStorage_tmp)
})

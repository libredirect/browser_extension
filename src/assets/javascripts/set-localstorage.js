window.browser = window.browser || window.chrome

browser.storage.local.get(["localstorage", "tmp"], r => {
	const localstorageJson = r.localstorage
	const frontend = r.tmp[0]
	const items = localstorageJson[frontend]

	for (const item in items) {
		localStorage.setItem(item, items[item])
	}

	window.close()
})

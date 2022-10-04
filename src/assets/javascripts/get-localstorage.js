window.browser = window.browser || window.chrome

browser.storage.local.get(["localstorage", "tmp"], r => {
	let localstorageJson = r.localstorage
	const frontend = r.tmp[0]
	const items = r.tmp[1]
	localstorageJson[frontend] = {}

	for (const item of items) {
		let tmp = localStorage.getItem(item)
		if (tmp) localstorageJson[frontend][item] = tmp
	}

	browser.storage.local.set({ localstorage: localstorageJson })
})

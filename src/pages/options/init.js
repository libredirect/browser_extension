window.browser = window.browser || window.chrome

import localise from "../../assets/javascripts/localise.js"

function changeTheme() {
	return new Promise(resolve => {
		browser.storage.local.get("theme", r => {
			switch (r.theme) {
				case "dark":
					document.body.classList.add("dark-theme")
					document.body.classList.remove("light-theme")
					break
				case "light":
					document.body.classList.add("light-theme")
					document.body.classList.remove("dark-theme")
					break
				default:
					if (matchMedia("(prefers-color-scheme: light)").matches) {
						document.body.classList.add("light-theme")
						document.body.classList.remove("dark-theme")
					} else {
						document.body.classList.add("dark-theme")
						document.body.classList.remove("light-theme")
					}
			}
			resolve()
		})
	})
}

changeTheme()
if (["ar", "iw", "ku", "fa", "ur"].includes(browser.i18n.getUILanguage())) document.getElementsByTagName("body")[0].classList.add("rtl")
localise.localisePage()

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeTheme)

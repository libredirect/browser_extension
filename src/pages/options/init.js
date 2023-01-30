window.browser = window.browser || window.chrome

import localise from "../../assets/javascripts/localise.js"
import utils from "../../assets/javascripts/utils.js"

function changeTheme() {
	return new Promise(async resolve => {
		switch ((await utils.getOptions()).theme) {
			case "dark":
				document.body.classList.add("dark-theme")
				document.body.classList.remove("light-theme")
				for (const element of document.body.getElementsByClassName('dark')) {
					element.style.display = 'none';
				}
				break
			case "light":
				document.body.classList.add("light-theme")
				document.body.classList.remove("dark-theme")
				for (const element of document.body.getElementsByClassName('light')) {
					element.style.display = 'none';
				}
				break
			default:
				if (matchMedia("(prefers-color-scheme: light)").matches) {
					document.body.classList.add("light-theme")
					document.body.classList.remove("dark-theme")
					for (const element of document.body.getElementsByClassName('light')) {
						element.style.display = 'none';
					}
				} else {
					document.body.classList.add("dark-theme")
					document.body.classList.remove("light-theme")
					for (const element of document.body.getElementsByClassName('dark')) {
						element.style.display = 'none';
					}
				}
		}
		resolve()
	})
}

changeTheme()
if (["ar", "iw", "ku", "fa", "ur"].includes(browser.i18n.getUILanguage())) {
	document.getElementsByTagName("body")[0].classList.add("rtl")
	document.getElementsByTagName("body")[0].dir = "rtl"
}
localise.localisePage()

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeTheme)

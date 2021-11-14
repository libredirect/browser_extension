"use strict";

window.browser = window.browser || window.chrome;

function getCookie() {
	let ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf("PREFS=") == 0) {
			return JSON.parse(
				decodeURIComponent(c.substring("PREFS=".length, c.length))
			);
		}
	}
	return {};
}

browser.storage.sync.get(
	["alwaysProxy", "videoQuality", "invidiousDarkMode", "persistInvidiousPrefs"],
	(result) => {
		if (result.persistInvidiousPrefs) {
			const prefs = getCookie();
			prefs.local = result.alwaysProxy;
			prefs.quality = result.videoQuality;
			prefs.dark_mode = result.invidiousDarkMode;
			document.cookie = `PREFS=${encodeURIComponent(JSON.stringify(prefs))}`;
		}
	}
)
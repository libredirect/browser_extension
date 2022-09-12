import utils from "../../../assets/javascripts/utils.js"

const frontends = new Array("beatbump", "hyperpipe")
const protocols = new Array("clearnet", "tor", "i2p", "loki")

let enable = document.getElementById("youtubeMusic-enable")
const youtubeMusic = document.getElementById("youtubeMusic_page")
const frontend = document.getElementById("youtubeMusic-frontend")
let protocol

function changeFrontendsSettings() {
	for (let i = 0; i < frontends.length; i++) {
		const frontendDiv = document.getElementById(frontends[i])
		if (frontends[i] == frontend.value) {
			frontendDiv.style.display = "block"
		} else {
			frontendDiv.style.display = "none"
		}
	}
}

function changeProtocolSettings() {
	for (let i = 0; i < frontends.length; i++) {
		const frontendDiv = document.getElementById(frontends[i])
		for (let x = 0; x < protocols.length; x++) {
			const protocolDiv = frontendDiv.getElementsByClassName(protocols[x])[0]
			if (protocols[x] == protocol) {
				protocolDiv.style.display = "block"
			} else {
				protocolDiv.style.display = "none"
			}
		}
	}
}

browser.storage.local.get(["disableYoutubeMusic", "youtubeMusicFrontend", "protocol"], r => {
	enable.checked = !r.disableYoutubeMusic
	frontend.value = r.youtubeMusicFrontend
	protocol = r.network
	changeFrontendsSettings()
	changeProtocolSettings()
})

youtubeMusic.addEventListener("change", () => {
	browser.storage.local.set({
		disableYoutubeMusic: !enable.checked,
		youtubeMusicFrontend: frontend.value,
	})
	changeFrontendsSettings()
})

for (let i = 0; i < frontends.length; i++) {
	for (let x = 0; x < protocols.length; x++) {
		utils.processDefaultCustomInstances("youtubeMusic", frontends[i], protocols[x], document)
	}
	utils.latency("youtubeMusic", frontends[i], document, location)
}

import utils from "../../../assets/javascripts/utils.js"

const frontends = new Array("invidious", "piped", "pipedMaterial", "cloudtube")
const protocols = new Array("normal", "tor", "i2p", "loki")
const singleInstanceFrontends = new Array("freetube", "yatte")

const enable = document.getElementById("youtube-enable")
const youtube = document.getElementById("youtube_page")
const youtubeEmbedFrontend = document.getElementById("youtube-embed_frontend")
const onlyEmbeddedVideo = document.getElementById("youtube-redirect_type")
const embeddedFrontendDiv = document.getElementById("youtube-embedded_frontend")
const frontend = document.getElementById("youtube-frontend")
let protocol

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

function changeEmbedFrontendsSettings() {
	if (embeddedFrontendDiv.style.display == "block") {
		for (let i = 0; i < frontends.length; i++) {
			const embeddedFrontendDiv = document.getElementById(frontends[i])
			if (frontends[i] == youtubeEmbedFrontend.value) {
				embeddedFrontendDiv.style.display = "block"
			} else {
				embeddedFrontendDiv.style.display = "none"
			}
		}
	}
}

function changeFrontendsSettings() {
	for (let i = 0; i < frontends.length; i++) {
		const frontendDiv = document.getElementById(frontends[i])
		if (frontends[i] == frontend.value) {
			frontendDiv.style.display = "block"
		} else {
			frontendDiv.style.display = "none"
		}
	}
	let singleInstanceFrontend = false
	for (let i = 0; i < singleInstanceFrontends.length; i++) {
		if (singleInstanceFrontends[i] == frontend.value) {
			singleInstanceFrontend = true
		}
	}
	if (singleInstanceFrontend == true) {
		embeddedFrontendDiv.style.display = "block"
	} else {
		embeddedFrontendDiv.style.display = "none"
	}
}

browser.storage.local.get(["disableYoutube", "onlyEmbeddedVideo", "youtubeRedirects", "youtubeFrontend", "youtubeEmbedFrontend", "protocol"], r => {
	enable.checked = !r.disableYoutube
	onlyEmbeddedVideo.value = r.onlyEmbeddedVideo
	youtubeEmbedFrontend.value = r.youtubeEmbedFrontend
	frontend.value = r.youtubeFrontend
	protocol = r.protocol

	changeFrontendsSettings()
	changeProtocolSettings()
	changeEmbedFrontendsSettings()
})

youtube.addEventListener("change", () => {
	browser.storage.local.set({
		disableYoutube: !enable.checked,
		youtubeEmbedFrontend: youtubeEmbedFrontend.value,
		youtubeFrontend: frontend.value,
		onlyEmbeddedVideo: onlyEmbeddedVideo.value,
	})
	changeFrontendsSettings()
	changeEmbedFrontendsSettings()
})

for (let i = 0; i < frontends.length; i++) {
	for (let x = 0; x < protocols.length; x++) {
		utils.processDefaultCustomInstances("youtube", frontends[i], protocols[x], document)
	}
	utils.latency("youtube", frontends[i], document, location)
}

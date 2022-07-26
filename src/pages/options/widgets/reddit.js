import utils from "../../../assets/javascripts/utils.js"

const frontends = new Array("libreddit", "teddit")
const protocols = new Array("normal", "tor", "i2p", "loki")

const enable = document.getElementById("reddit-enable")
const reddit = document.getElementById("reddit_page")
const frontend = document.getElementById("reddit-frontend")
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

browser.storage.local.get(["disableReddit", "protocol", "redditFrontend"], r => {
	enable.checked = !r.disableReddit
	protocol = r.protocol
	frontend.value = r.redditFrontend
	changeFrontendsSettings()
	changeProtocolSettings()
})

reddit.addEventListener("change", () => {
	browser.storage.local.set({
		disableReddit: !enable.checked,
		redditFrontend: frontend.value,
	})
	changeFrontendsSettings()
})

for (let i = 0; i < frontends.length; i++) {
	for (let x = 0; x < protocols.length; x++) {
		utils.processDefaultCustomInstances("reddit", frontends[i], protocols[x], document)
	}
	utils.latency("reddit", frontends[i], document, location)
}

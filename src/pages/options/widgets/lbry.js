import utils from "../../../assets/javascripts/utils.js"

const frontends = new Array("librarian")
const protocols = new Array("clearnet", "tor", "i2p", "loki")

const enable = document.getElementById("lbry-enable")
const lbry = document.getElementById("lbry_page")
const redirectType = document.getElementById("lbry-redirect_type")
const frontend = document.getElementById("lbry-frontend")
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

browser.storage.local.get(["disableLbryTargets", "protocol", "lbryFrontend", "lbryRedirectType"], r => {
	enable.checked = !r.disableLbryTargets
	protocol = r.network
	redirectType.value = r.lbryRedirectType
	frontend.value = r.lbryFrontend
	changeFrontendsSettings()
	changeProtocolSettings()
})

lbry.addEventListener("change", () => {
	browser.storage.local.set({
		disableLbryTargets: !enable.checked,
		lbryRedirectType: redirectType.value,
		lbryFrontend: frontend.value,
	})
	changeFrontendsSettings()
})

for (let i = 0; i < frontends.length; i++) {
	for (let x = 0; x < protocols.length; x++) {
		utils.processDefaultCustomInstances("lbryTargets", frontends[i], protocols[x], document)
	}
	utils.latency("lbryTargets", frontends[i], document, location)
}

import utils from "../../../assets/javascripts/utils.js"

const frontends = new Array("facil")
const protocols = new Array("normal", "tor", "i2p", "loki")

const enable = document.getElementById("maps-enable")
const maps = document.getElementById("maps_page")
const frontend = document.getElementById("maps-frontend")
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

browser.storage.local.get(["disableMaps", "protocol", "mapsFrontend"], r => {
	enable.checked = !r.disableMaps
	protocol = r.protocol
	frontend.value = r.mapsFrontend
	changeFrontendsSettings()
	changeProtocolSettings()
})

maps.addEventListener("change", () => {
	browser.storage.local.set({
		disableMaps: !enable.checked,
		mapsFrontend: frontend.value,
	})
	changeFrontendsSettings()
})

for (let i = 0; i < frontends.length; i++) {
	for (let x = 0; x < protocols.length; x++) {
		utils.processDefaultCustomInstances("maps", frontends[i], protocols[x], document)
	}
	utils.latency("maps", frontends[i], document, location)
}

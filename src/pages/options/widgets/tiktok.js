import utils from "../../../assets/javascripts/utils.js"

// UNCOMMENT ALL COMMENTS ONCE OTHER FRONTENDS EXIST

const frontends = new Array("proxiTok")
const protocols = new Array("normal", "tor", "i2p", "loki")

const enable = document.getElementById("tiktok-enable")
const tiktok = document.getElementById("tiktok_page")
//const frontend = document.getElementById("tiktok-frontend");
let protocol

/*
function changeFrontendsSettings() {
    for (let i = 0; i < frontends.length; i++) {
        const frontendDiv = document.getElementById(frontends[i])
        if (frontends[i] == frontend.value) {
            frontendDiv.style.display = 'block'
        } else {
            frontendDiv.style.display = 'none'
        }
    }
}
*/

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

browser.storage.local.get(["disableTiktok", "protocol"], r => {
	enable.checked = !r.disableTiktok
	protocol = r.protocol
	changeProtocolSettings()
})

tiktok.addEventListener("change", () => {
	browser.storage.local.set({ disableTiktok: !enable.checked })
})

for (let i = 0; i < frontends.length; i++) {
	for (let x = 0; x < protocols.length; x++) {
		utils.processDefaultCustomInstances("tiktok", frontends[i], protocols[x], document)
	}
	utils.latency("tiktok", frontends[i], document, location)
}

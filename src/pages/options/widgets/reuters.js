import utils from "../../../assets/javascripts/utils.js"

// UNCOMMENT ALL COMMENTS ONCE OTHER FRONTENDS EXIST

const frontends = new Array("neuters")
const protocols = new Array("normal", "tor", "i2p", "loki")

const enable = document.getElementById("reuters-enable")
const reuters = document.getElementById("reuters_page")
//const frontend = document.getElementById("reuters-frontend");
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

browser.storage.local.get(["disableReuters", "protocol"], r => {
	enable.checked = !r.disableReuters
	protocol = r.protocol
	changeProtocolSettings()
})

reuters.addEventListener("change", () => {
	browser.storage.local.set({ disableReuters: !enable.checked })
})

for (let i = 0; i < frontends.length; i++) {
	for (let x = 0; x < protocols.length; x++) {
		utils.processDefaultCustomInstances("reuters", frontends[i], protocols[x], document)
	}
	utils.latency("reuters", frontends[i], document, location)
}

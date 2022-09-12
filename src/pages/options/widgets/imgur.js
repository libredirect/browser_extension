import utils from "../../../assets/javascripts/utils.js"

// UNCOMMENT ALL COMMENTS ONCE OTHER FRONTENDS EXIST

const frontends = new Array("rimgo")
const protocols = new Array("clearnet", "tor", "i2p", "loki")

const enable = document.getElementById("imgur-enable")
const imgur = document.getElementById("imgur_page")
//const frontend = document.getElementById("imgur-frontend");
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

browser.storage.local.get(["disableImgur", "protocol"], r => {
	enable.checked = !r.disableImgur
	protocol = r.network
	changeProtocolSettings()
})

imgur.addEventListener("change", () => {
	browser.storage.local.set({ disableImgur: !enable.checked })
})

for (let i = 0; i < frontends.length; i++) {
	for (let x = 0; x < protocols.length; x++) {
		utils.processDefaultCustomInstances("imgur", frontends[i], protocols[x], document)
	}
	utils.latency("imgur", frontends[i], document, location)
}

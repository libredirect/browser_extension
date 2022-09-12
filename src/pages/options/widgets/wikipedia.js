import utils from "../../../assets/javascripts/utils.js"

// UNCOMMENT ALL COMMENTS ONCE OTHER FRONTENDS EXIST

const frontends = new Array("wikiless")
const protocols = new Array("clearnet", "tor", "i2p", "loki")

const enable = document.getElementById("wikipedia-enable")
const wikipedia = document.getElementById("wikipedia_page")
//const frontend = document.getElementById("wikipedia-frontend");
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

browser.storage.local.get(["disableWikipedia", "protocol"], r => {
	enable.checked = !r.disableWikipedia
	protocol = r.network
	changeProtocolSettings()
})

wikipedia.addEventListener("change", () => {
	browser.storage.local.set({ disableWikipedia: !enable.checked })
})

for (let i = 0; i < frontends.length; i++) {
	for (let x = 0; x < protocols.length; x++) {
		utils.processDefaultCustomInstances("wikipedia", frontends[i], protocols[x], document)
	}
	utils.latency("wikipedia", frontends[i], document, location)
}

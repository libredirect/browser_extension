import utils from "../../../assets/javascripts/utils.js"

// GOAL: to never mention frontends/protocls outside these two arrays, so that adding a new frontend/protocol is as easy as adding it here.
// This may be expanded across the whole project, where almost everything becomes a template, and the frontend/protocol parts just become a JSON file.

// ONCE FINISHED: add librex and see if it works
const frontends = new Array("searx", "searxng", "whoogle", "librex") // Add librex once /javascripts/search.js is made agnostic
const protocols = new Array("clearnet", "tor", "i2p", "loki")
//let frontendProtocols = (frontends.length)

// I will leave comments of my privious attemps so that people can learn from my mistakes. :)

/*
for (let i = 0; i < frontends.length; i++) {
  this.frontends[i] = frontends[i].getElementsByClassName(protocol)
}
*/
// There was a class here, but I deleted a bit of it
/*
    this.searxDiv = searxDiv.getElementsByClassName(protocol)[0];
    this.searxngDiv = searxngDiv.getElementsByClassName(protocol)[0];
    this.librexDiv = librexDiv.getElementsByClassName(protocol)[0];
    */

/*
  * Here I was trying to solve the issue by making a 2D array, but I later realised I was overcomplicating things
for (var i = 0; i < frontends.length; i++) {
  frontendProtocols[i] = new Array(protocols.length)
}
*/

const enable = document.getElementById("search-enable")
const search = document.getElementById("search_page")
const frontend = document.getElementById("search-frontend")
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
		//if (frontends[i] == frontend.value) {       // Here we are checking if the frontend matches the current one. This skips the protocol checking for that frontend, speeding things up. I no longer do this as protocol setting is only set once in the ui so every frontend needs to get their protocols setup immidiately.
		for (let x = 0; x < protocols.length; x++) {
			const protocolDiv = frontendDiv.getElementsByClassName(protocols[x])[0]
			if (protocols[x] == protocol) {
				//if the frontend value equals the selected one, it will show. Otherwise, it will be hidden
				protocolDiv.style.display = "block"
			} else {
				protocolDiv.style.display = "none"
			}
		}
		/*
    } else {
      continue
    }
    */
	}
}

browser.storage.local.get(["disableSearch", "searchFrontend", "protocol"], r => {
	enable.checked = !r.disableSearch
	frontend.value = r.searchFrontend
	protocol = r.network

	changeFrontendsSettings()
	changeProtocolSettings()
})

for (let i = 0; i < frontends.length; i++) {
	for (let x = 0; x < protocols.length; x++) {
		utils.processDefaultCustomInstances("search", frontends[i], protocols[x], document)
	}
	utils.latency("search", frontends[i], document, location)
}

search.addEventListener("change", () => {
	browser.storage.local.set({
		disableSearch: !enable.checked,
		searchFrontend: frontend.value,
	})
	changeFrontendsSettings()
})

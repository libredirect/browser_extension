import utils from "../../../assets/javascripts/utils.js";

// UNCOMMENT ALL COMMENTS ONCE OTHER FRONTENDS EXIST

const frontends = new Array("nitter")
const protocols = new Array("normal", "tor", "i2p", "loki")

const enable = document.getElementById("twitter-enable");
const twitter = document.getElementById('twitter_page');
const redirectType = document.getElementById("twitter-redirect_type");
//const frontend = document.getElementById("twitter-frontend");
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
                protocolDiv.style.display = 'block'
            } else {
                protocolDiv.style.display = 'none'
            }
        }
    }
}

browser.storage.local.get(
    [
        "disableTwitter",
        "protocol",
        "twitterRedirectType"
    ],
    r => {
        enable.checked = !r.disableTwitter;
        protocol = r.protocol;
        redirectType.value = r.twitterRedirectType;
        changeProtocolSettings();
    }
)

twitter.addEventListener("change", () => {
    browser.storage.local.set({
        disableTwitter: !enable.checked,
        twitterRedirectType: redirectType.value,
    });
})

for (let i = 0; i < frontends.length; i++) {
    for (let x = 0; x < protocols.length; x++){
        utils.processDefaultCustomInstances('twitter', frontends[i], protocols[x], document)
    }
    utils.latency('twitter', frontends[i], document, location)
}

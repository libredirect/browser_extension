import utils from "../../../assets/javascripts/utils.js";

const frontends = new Array("simplyTranslate", "lingva")
const protocols = new Array("normal", "tor", "i2p", "loki")

const enable = document.getElementById("translate-enable");
const translate = document.getElementById('translate_page');
const frontend = document.getElementById("translate-frontend");
let protocol

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
        "translateDisable",
        "translateFrontend",
        "protocol"
    ],
    r => {
        enable.checked = !r.translateDisable;
        frontend.value = r.translateFrontend;
        protocol = r.protocol;
        changeFrontendsSettings();
        changeProtocolSettings();
    }
);

translate.addEventListener("change", () => {
    browser.storage.local.set({
        translateDisable: !enable.checked,
        translateFrontend: frontend.value,
    })
    changeFrontendsSettings();
})

for (let i = 0; i < frontends.length; i++) {
    for (let x = 0; x < protocols.length; x++){
        utils.processDefaultCustomInstances('translate', frontends[i], protocols[x], document)
    }
    utils.latency('translate', frontends[i], document, location)
}

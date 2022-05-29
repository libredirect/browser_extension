import mediumHelper from "../../../assets/javascripts/medium.js";
import utils from "../../../assets/javascripts/utils.js";

let disable = document.getElementById("disable-medium");
let protocol = document.getElementById("protocol")

browser.storage.local.get(
    [
        "disableMedium",
        "mediumProtocol"
    ],
    r => {
        disable.checked = !r.disableMedium;
        protocol.value = r.mediumProtocol;
        changeProtocolSettings();
    }
)
utils.processDefaultCustomInstances('medium', 'scribe', 'normal', document);
utils.processDefaultCustomInstances('medium', 'scribe', 'tor', document);

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableMedium: !disable.checked,
        mediumProtocol: protocol.value,
    })
    changeProtocolSettings();
})

function changeProtocolSettings() {
    let normalDiv = document.getElementsByClassName("normal")[0];
    let torDiv = document.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

utils.latency('medium', 'scribe', document, location)
import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("medium-enable");
const protocol = document.getElementById("medium-protocol")
const medium = document.getElementById('medium_page');

function changeProtocolSettings() {
    const normalDiv = medium.getElementsByClassName("normal")[0];
    const torDiv = medium.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

medium.addEventListener("change", () => {
    changeProtocolSettings();
    browser.storage.local.set({
        disableMedium: !enable.checked,
        mediumProtocol: protocol.value,
    })
})

browser.storage.local.get(
    [
        "disableMedium",
        "mediumProtocol"
    ],
    r => {
        enable.checked = !r.disableMedium;
        protocol.value = r.mediumProtocol;
        changeProtocolSettings();
    }
)

utils.processDefaultCustomInstances('medium', 'scribe', 'normal', document);
utils.processDefaultCustomInstances('medium', 'scribe', 'tor', document);
utils.latency('medium', 'scribe', document, location)
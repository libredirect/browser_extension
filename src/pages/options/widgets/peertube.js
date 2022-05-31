import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("peertube-enable");
const protocol = document.getElementById("peertube-protocol");
const peertube = document.getElementById('peertube_page');

function changeProtocolSettings() {
    const normalDiv = peertube.getElementsByClassName("normal")[0];
    const torDiv = peertube.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

browser.storage.local.get(
    [
        "disablePeertubeTargets",
        "peertubeTargetsProtocol"
    ],
    r => {
        enable.checked = !r.disablePeertubeTargets;
        protocol.value = r.peertubeTargetsProtocol;
        changeProtocolSettings();
    }
)

peertube.addEventListener("change", () => {
    changeProtocolSettings();
    browser.storage.local.set({
        disablePeertubeTargets: !enable.checked,
        peertubeTargetsProtocol: protocol.value
    })
})

utils.processDefaultCustomInstances('peertube', 'simpleertube', 'normal', document);
utils.processDefaultCustomInstances('peertube', 'simpleertube', 'tor', document);
utils.latency('peertube', 'simpleertube', document, location)
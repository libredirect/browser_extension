import peertubeHelper from "../../../assets/javascripts/helpers/peertube.js";
import utils from "../../../assets/javascripts/helpers/utils.js";

let disable = document.getElementById("disable-peertube");
let protocol = document.getElementById("protocol")
browser.storage.local.get(
    [
        "disablePeertubeTargets",
        "peertubeTargetsProtocol"
    ],
    r => {
        disable.checked = !r.disablePeertubeTargets;
        protocol.value = r.peertubeTargetsProtocol;
        changeProtocolSettings();
    }
)
utils.processDefaultCustomInstances('peertube', 'simpleertube', 'normal', document);
utils.processDefaultCustomInstances('peertube', 'simpleertube', 'tor', document);

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disablePeertubeTargets: !disable.checked,
        peertubeTargetsProtocol: protocol.value
    })
    changeProtocolSettings();
})

function changeProtocolSettings() {
    const normalDiv = document.getElementsByClassName("normal")[0];
    const torDiv = document.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}
utils.latency('peertube', 'simpleertube', document, location)
import tiktokHelper from "../../../assets/javascripts/tiktok.js";
import utils from "../../../assets/javascripts/utils.js";

let disable = document.getElementById("disable-tiktok");
let protocol = document.getElementById("protocol")

document.addEventListener("change", () => {
    browser.storage.local.set({
        disableTiktok: !disable.checked,
        tiktokProtocol: protocol.value,
    });
    changeProtocolSettings();
})

browser.storage.local.get(
    [
        "disableTiktok",
        "tiktokProtocol",
    ],
    r => {
        disable.checked = !r.disableTiktok;
        protocol.value = r.tiktokProtocol;
        changeProtocolSettings();
        let normalDiv = document.getElementsByClassName("normal")[0];
        let torDiv = document.getElementsByClassName("tor")[0];
        if (r.tiktokProtocol == 'normal') {
            normalDiv.style.display = 'block';
            torDiv.style.display = 'none';
        }
        else if (r.tiktokProtocol == 'tor') {
            normalDiv.style.display = 'none';
            torDiv.style.display = 'block';
        }
    }
)

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

utils.processDefaultCustomInstances('tiktok', 'proxiTok', 'normal', document);
utils.processDefaultCustomInstances('tiktok', 'proxiTok', 'tor', document);

utils.latency('tiktok', 'proxiTok', document, location)
import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("tiktok-enable");
const protocol = document.getElementById("tiktok-protocol")
const tiktok = document.getElementById('tiktok_page');

function changeProtocolSettings() {
    let normalDiv = tiktok.getElementsByClassName("normal")[0];
    let torDiv = tiktok.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

tiktok.addEventListener("change", () => {
    browser.storage.local.set({
        disableTiktok: !enable.checked,
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
        enable.checked = !r.disableTiktok;
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

utils.processDefaultCustomInstances('tiktok', 'proxiTok', 'normal', document);
utils.processDefaultCustomInstances('tiktok', 'proxiTok', 'tor', document);

utils.latency('tiktok', 'proxiTok', document, location)
import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("lbry-enable");
const protocol = document.getElementById("lbry-protocol")

const lbry = document.getElementById('lbry_page');
const normalDiv = lbry.getElementsByClassName("normal")[0];
const torDiv = lbry.getElementsByClassName("tor")[0];

function changeProtocolSettings() {
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
        "disableLbryTargets",
        "lbryTargetsProtocol"
    ],
    r => {
        enable.checked = !r.disableLbryTargets;
        protocol.value = r.lbryTargetsProtocol;
        changeProtocolSettings();
    }
)

lbry.addEventListener("change", () => {
    changeProtocolSettings()
    browser.storage.local.set({
        disableLbryTargets: !enable.checked,
        lbryTargetsProtocol: protocol.value,
    });
})

utils.processDefaultCustomInstances('lbryTargets', 'librarian', 'normal', document);
utils.processDefaultCustomInstances('lbryTargets', 'librarian', 'tor', document);

utils.latency('lbryTargets', 'librarian', document, location)
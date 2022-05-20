import lbryHelper from "../../../assets/javascripts/helpers/lbry.js";
import utils from "../../../assets/javascripts/helpers/utils.js";

let disable = document.getElementById("disable-lbry");
let protocol = document.getElementById("protocol")

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableLbryTargets: !lbryHelper.checked,
        lbryTargetsProtocol: protocol.value,
    });
    changeProtocolSettings()
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

browser.storage.local.get(
    [
        "disableLbryTargets",
        "lbryTargetsProtocol"
    ],
    r => {
        disable.checked = !r.disableLbryTargets;
        protocol.value = r.lbryTargetsProtocol;
        changeProtocolSettings();
    }
)

utils.processDefaultCustomInstances('lbryTargets', 'librarian', 'normal', document);
utils.processDefaultCustomInstances('lbryTargets', 'librarian', 'tor', document);

utils.latency('lbryTargets', 'librarian', document, location)
import sendTargetsHelper from "../../../assets/javascripts/helpers/sendTargets.js";
import utils from "../../../assets/javascripts/helpers/utils.js";

let disable = document.getElementById("disable-sendTargets");
let protocol = document.getElementById("protocol")

browser.storage.local.get(
    [
        "disableSendTarget",
        "sendTargetsProtocol",
    ],
    r => {
        disable.checked = !r.disableSendTarget;
        protocol.value = r.sendTargetsProtocol;
        changeProtocolSettings();
    }
)

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableSendTarget: !disable.checked,
        sendTargetsProtocol: protocol.value,
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

utils.processDefaultCustomInstances('sendTargets', 'send', 'normal', document);
utils.processDefaultCustomInstances('sendTargets', 'send', 'tor', document);

utils.latency('sendTargets', 'send', document, location)
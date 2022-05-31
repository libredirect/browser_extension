import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("sendTargets-enable");
const protocol = document.getElementById("sendTargets-protocol")
const sendTargets = document.getElementById('sendTargets_page');

function changeProtocolSettings() {
    let normalDiv = sendTargets.getElementsByClassName("normal")[0];
    let torDiv = sendTargets.getElementsByClassName("tor")[0];
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
        "disableSendTarget",
        "sendTargetsProtocol",
    ],
    r => {
        enable.checked = !r.disableSendTarget;
        protocol.value = r.sendTargetsProtocol;
        changeProtocolSettings();
    }
)

sendTargets.addEventListener("change", () => {
    changeProtocolSettings();
    browser.storage.local.set({
        disableSendTarget: !enable.checked,
        sendTargetsProtocol: protocol.value,
    })
})

utils.processDefaultCustomInstances('sendTargets', 'send', 'normal', document);
utils.processDefaultCustomInstances('sendTargets', 'send', 'tor', document);

utils.latency('sendTargets', 'send', document, location)
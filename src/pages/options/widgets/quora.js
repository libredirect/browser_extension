import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("quora-enable");
const protocol = document.getElementById("quora-protocol")
const quora = document.getElementById('quora_page');

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

quora.addEventListener("change", () => {
    changeProtocolSettings();
    browser.storage.local.set({
        disableQuora: !enable.checked,
        quoraProtocol: protocol.value,
    })
})

browser.storage.local.get(
    [
        "disableQuora",
        "quoraProtocol"
    ],
    r => {
        enable.checked = !r.disableQuora;
        protocol.value = r.quoraProtocol;
        changeProtocolSettings();
    }
)

utils.processDefaultCustomInstances('quora', 'quetre', 'normal', document);
utils.processDefaultCustomInstances('quora', 'quetre', 'tor', document);
utils.latency('quora', 'quetre', document, location)
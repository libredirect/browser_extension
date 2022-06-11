import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("reuters-enable");
const protocol = document.getElementById("reuters-protocol")
const reuters = document.getElementById('reuters_page');

function changeProtocolSettings() {
    const normalDiv = reuters.getElementsByClassName("normal")[0];
    const torDiv = reuters.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

reuters.addEventListener("change", () => {
    changeProtocolSettings();
    browser.storage.local.set({
        disableReuters: !enable.checked,
        reutersProtocol: protocol.value,
    })
})

browser.storage.local.get(
    [
        "disableReuters",
        "reutersProtocol"
    ],
    r => {
        enable.checked = !r.disableReuters;
        protocol.value = r.reutersProtocol;
        changeProtocolSettings();
    }
)

utils.processDefaultCustomInstances('reuters', 'neuters', 'normal', document);
utils.processDefaultCustomInstances('reuters', 'neuters', 'tor', document);
utils.latency('reuters', 'neuters', document, location)
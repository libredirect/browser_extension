import instagramHelper from "../../../assets/javascripts/helpers/instagram.js";
import utils from "../../../assets/javascripts/helpers/utils.js";

const disable = document.getElementById("disable-bibliogram");
const protocol = document.getElementById("protocol");

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableInstagram: disable.checked,
        instagramProtocol: protocol.value,
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

browser.storage.local.get(
    [
        "disableInstagram",
        "instagramProtocol"
    ],
    r => {
        disable.checked = !r.disableInstagram;
        protocol.value = r.instagramProtocol;
        changeProtocolSettings();
    })

utils.processDefaultCustomInstances('instagram', 'bibliogram', 'normal', document);
utils.processDefaultCustomInstances('instagram', 'bibliogram', 'tor', document);

utils.latency('instagram', 'bibliogram', document, location)
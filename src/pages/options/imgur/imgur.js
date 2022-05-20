import imgurHelper from "../../../assets/javascripts/helpers/imgur.js";
import utils from "../../../assets/javascripts/helpers/utils.js";

let disableImgurElement = document.getElementById("disable-imgur");
let protocolElement = document.getElementById("protocol")

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableImgur: !disableImgurElement.checked,
        imgurProtocol: protocolElement.value,
    });
    changeProtocolSettings(protocolElement.value);
})

function changeProtocolSettings(protocol) {
    let normalDiv = document.getElementsByClassName("normal")[0];
    let torDiv = document.getElementsByClassName("tor")[0];
    let i2pDiv = document.getElementsByClassName("i2p")[0];
    if (protocol == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
        i2pDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
        i2pDiv.style.display = 'none';
    }
    else if (protocol == 'i2p') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'none';
        i2pDiv.style.display = 'block';
    }
}

browser.storage.local.get(
    [
        "disableImgur",
        "imgurProtocol",
    ],
    r => {
        disableImgurElement.checked = !r.disableImgur;
        protocolElement.value = r.imgurProtocol;
        changeProtocolSettings(r.imgurProtocol);
    }
);

utils.processDefaultCustomInstances('imgur', 'rimgo', 'normal', document);
utils.processDefaultCustomInstances('imgur', 'rimgo', 'tor', document);
utils.processDefaultCustomInstances('imgur', 'rimgo', 'i2p', document);

utils.latency('imgur', 'rimgo', document, location)
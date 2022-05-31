import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("imgur-enable");
const protocol = document.getElementById("imgur-protocol")
const imgur = document.getElementById('imgur_page');

const normalDiv = imgur.getElementsByClassName("normal")[0];
const torDiv = imgur.getElementsByClassName("tor")[0];
const i2pDiv = imgur.getElementsByClassName("i2p")[0];

function changeProtocolSettings() {
    if (protocol.value == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
        i2pDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
        i2pDiv.style.display = 'none';
    }
    else if (protocol.value == 'i2p') {
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
        enable.checked = !r.disableImgur;
        protocol.value = r.imgurProtocol;
        changeProtocolSettings();
    }
);

imgur.addEventListener("change", () => {
    changeProtocolSettings();
    browser.storage.local.set({
        disableImgur: !enable.checked,
        imgurProtocol: protocol.value,
    });
})

utils.processDefaultCustomInstances('imgur', 'rimgo', 'normal', document);
utils.processDefaultCustomInstances('imgur', 'rimgo', 'tor', document);
utils.processDefaultCustomInstances('imgur', 'rimgo', 'i2p', document);

utils.latency('imgur', 'rimgo', document, location)
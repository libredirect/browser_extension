import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("instagram-enable");
const protocol = document.getElementById("instagram-protocol");

const instagram = document.getElementById('instagram_page')
const normalDiv = instagram.getElementsByClassName("normal")[0];
const torDiv = instagram.getElementsByClassName("tor")[0];

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
        "disableInstagram",
        "instagramProtocol"
    ],
    r => {
        enable.checked = !r.disableInstagram;
        protocol.value = r.instagramProtocol;
        changeProtocolSettings();
    }
)

instagram.addEventListener("change", () => {
    changeProtocolSettings();
    browser.storage.local.set({
        disableInstagram: !enable.checked,
        instagramProtocol: protocol.value,
    })
})


utils.processDefaultCustomInstances('instagram', 'bibliogram', 'normal', document);
utils.processDefaultCustomInstances('instagram', 'bibliogram', 'tor', document);

utils.latency('instagram', 'bibliogram', document, location)
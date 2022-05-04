import imgurHelper from "../../../assets/javascripts/helpers/imgur.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

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

commonHelper.processDefaultCustomInstances('imgur', 'rimgo', 'normal', document);
commonHelper.processDefaultCustomInstances('imgur', 'rimgo', 'tor', document);
commonHelper.processDefaultCustomInstances('imgur', 'rimgo', 'i2p', document);


let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await imgurHelper.init();
        let redirects = imgurHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.rimgo.normal).then(r => {
            browser.storage.local.set({ rimgoLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('imgur', 'rimgo', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);

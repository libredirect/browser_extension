import instagramHelper from "../../../assets/javascripts/helpers/instagram.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableInstagramElement = document.getElementById("disable-bibliogram");
let protocolElement = document.getElementById("protocol");

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableInstagram: disableInstagramElement.checked,
        instagramProtocol: protocolElement.value,
    })
    changeProtocolSettings(protocolElement.value);
})

function changeProtocolSettings(protocol) {
    let normalDiv = document.getElementsByClassName("normal")[0];
    let torDiv = document.getElementsByClassName("tor")[0];
    if (protocol == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
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
        disableInstagramElement.checked = !r.disableInstagram;

        let protocol = r.instagramProtocol;
        protocolElement.value = protocol;
        changeProtocolSettings(protocol);
    })

commonHelper.processDefaultCustomInstances('instagram', 'bibliogram', 'normal', document);
commonHelper.processDefaultCustomInstances('instagram', 'bibliogram', 'tor', document);

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await instagramHelper.init();
        let redirects = instagramHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.bibliogram.normal).then(r => {
            browser.storage.local.set({ bibliogramLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('instagram', 'bibliogram', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
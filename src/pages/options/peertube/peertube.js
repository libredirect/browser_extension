import peertubeHelper from "../../../assets/javascripts/helpers/peertube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disable = document.getElementById("disable-peertube");
let protocol = document.getElementById("protocol")
browser.storage.local.get(
    [
        "disablePeertubeTargets",
        "peertubeTargetsProtocol"
    ],
    r => {
        disable.checked = !r.disablePeertubeTargets;
        protocol.value = r.peertubeTargetsProtocol;
        changeProtocolSettings();
    }
)
commonHelper.processDefaultCustomInstances('peertube', 'simpleertube', 'normal', document);
commonHelper.processDefaultCustomInstances('peertube', 'simpleertube', 'tor', document);

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disablePeertubeTargets: !disable.checked,
        peertubeTargetsProtocol: protocol.value
    })
    changeProtocolSettings();
})

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

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await peertubeHelper.init();
        let redirects = peertubeHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.simpleertube.normal).then(r => {
            browser.storage.local.set({ simpleertubeLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('peertube', 'simpleertube', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
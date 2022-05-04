import speedtestHelper from "../../../assets/javascripts/helpers/speedtest.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableSpeedtestElement = document.getElementById("disable-speedtest");
let protocolElement = document.getElementById("protocol")

browser.storage.local.get(
    [
        "disableSpeedtest",
        "speedtestProtocol",
    ],
    r => {
        disableSpeedtestElement.checked = !r.disableSpeedtest;

        protocolElement.value = r.speedtestProtocol;
        changeProtocolSettings(r.speedtestProtocol);
    }
)

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableSpeedtest: !disableSpeedtestElement.checked,
        speedtestProtocol: protocolElement.value,
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

commonHelper.processDefaultCustomInstances('librespeed', 'normal', speedtestHelper, document);
commonHelper.processDefaultCustomInstances('librespeed', 'tor', speedtestHelper, document);

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await speedtestHelper.init();
        let redirects = speedtestHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.librespeed.normal).then(r => {
            browser.storage.local.set({ librespeedLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('librespeed', 'normal', speedtestHelper, document)
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
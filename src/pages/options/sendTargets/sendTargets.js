import sendTargetsHelper from "../../../assets/javascripts/helpers/sendTargets.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableSendTargetsElement = document.getElementById("disable-sendTargets");
let protocolElement = document.getElementById("protocol")

browser.storage.local.get(
    [
        "disableSendTarget",
        "sendTargetsProtocol",
    ],
    r => {
        disableSendTargetsElement.checked = !r.disableSendTarget;

        protocolElement.value = r.sendTargetsProtocol;
        changeProtocolSettings(r.sendTargetsProtocol);
    }
)

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableSendTarget: !disableSendTargetsElement.checked,
        sendTargetsProtocol: protocolElement.value,
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

commonHelper.processDefaultCustomInstances('send', 'normal', sendTargetsHelper, document);
commonHelper.processDefaultCustomInstances('send', 'tor', sendTargetsHelper, document,)

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await sendTargetsHelper.init();
        let redirects = sendTargetsHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.send.normal).then(r => {
            browser.storage.local.set({ sendLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('send', 'normal', sendTargetsHelper, document)
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
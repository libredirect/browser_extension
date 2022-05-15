import sendTargetsHelper from "../../../assets/javascripts/helpers/sendTargets.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disable = document.getElementById("disable-sendTargets");
let protocol = document.getElementById("protocol")

browser.storage.local.get(
    [
        "disableSendTarget",
        "sendTargetsProtocol",
    ],
    r => {
        disable.checked = !r.disableSendTarget;
        protocol.value = r.sendTargetsProtocol;
        changeProtocolSettings();
    }
)

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableSendTarget: !disable.checked,
        sendTargetsProtocol: protocol.value,
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

commonHelper.processDefaultCustomInstances('sendTargets', 'send', 'normal', document);
commonHelper.processDefaultCustomInstances('sendTargets', 'send', 'tor', document);

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
            commonHelper.processDefaultCustomInstances('sendTargets', 'send', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
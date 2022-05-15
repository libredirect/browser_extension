import tiktokHelper from "../../../assets/javascripts/helpers/tiktok.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disable = document.getElementById("disable-tiktok");
let protocol = document.getElementById("protocol")

document.addEventListener("change", () => {
    browser.storage.local.set({
        disableTiktok: !disable.checked,
        tiktokProtocol: protocol.value,
    });
    changeProtocolSettings();
})

window.onblur = tiktokHelper.initProxiTokCookies;

browser.storage.local.get(
    [
        "disableTiktok",
        "tiktokProtocol",
    ],
    r => {
        disable.checked = !r.disableTiktok;
        protocol.value = r.tiktokProtocol;
        changeProtocolSettings();
        let normalDiv = document.getElementsByClassName("normal")[0];
        let torDiv = document.getElementsByClassName("tor")[0];
        if (r.tiktokProtocol == 'normal') {
            normalDiv.style.display = 'block';
            torDiv.style.display = 'none';
        }
        else if (r.tiktokProtocol == 'tor') {
            normalDiv.style.display = 'none';
            torDiv.style.display = 'block';
        }
    }
)

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

commonHelper.processDefaultCustomInstances('tiktok', 'proxiTok', 'normal', document);
commonHelper.processDefaultCustomInstances('tiktok', 'proxiTok', 'tor', document);

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await tiktokHelper.init();
        let redirects = tiktokHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.proxiTok.normal).then(r => {
            browser.storage.local.set({ proxiTokLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('tiktok', 'proxiTok', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
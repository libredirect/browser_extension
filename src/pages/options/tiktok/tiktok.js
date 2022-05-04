import tiktokHelper from "../../../assets/javascripts/helpers/tiktok.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disable = document.getElementById("disable-tiktok");
let protocol = document.getElementById("protocol")

let enableCustomSettings = document.getElementById("enable-custom-settings");
let customSettingsDiv = document.getElementsByClassName("custom-settings");

let theme = document.getElementById('proxiTok').getElementsByClassName('theme')[0];
let api_legacy = document.getElementById('proxiTok').getElementsByClassName('api-legacy')[0];

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableTiktok: !disable.checked,
        tiktokProtocol: protocol.value,

        enableTiktokCustomSettings: enableCustomSettings.checked,

        proxiTokTheme: theme.value,
        proxiTokApiLegacy: api_legacy.value,

    });
    changeProtocolSettings(protocol.value);
})

window.onblur = tiktokHelper.initProxiTokCookies;

browser.storage.local.get(
    [
        "disableTiktok",
        "tiktokProtocol",

        "enableTiktokCustomSettings",

        "proxiTokTheme",
        "proxiTokApiLegacy",
    ],
    r => {
        disable.checked = !r.disableTiktok;
        protocol.value = r.tiktokProtocol;
        changeProtocolSettings(r.tiktokProtocol);
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

        enableCustomSettings.checked = r.enableTiktokCustomSettings;
        if (r.enableTiktokCustomSettings)
            customSettingsDiv.style.display = 'block';
        else
            customSettingsDiv.style.display = 'none';

        theme.value = r.proxiTokTheme;
        api_legacy.value = r.proxiTokApiLegacy;
    }
)

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
    if (enableCustomSettings.checked)
        for (const item of customSettingsDiv) item.style.display = 'block';
    else
        for (const item of customSettingsDiv) item.style.display = 'none';
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
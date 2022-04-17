import tiktokHelper from "../../../assets/javascripts/helpers/tiktok.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableTiktokElement = document.getElementById("disable-tiktok");
disableTiktokElement.addEventListener("change",
    event => tiktokHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    event => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        tiktokHelper.setProtocol(protocol);
        changeProtocolSettings(protocol);
    }
);

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

tiktokHelper.init().then(() => {
    disableTiktokElement.checked = !tiktokHelper.getDisable();

    let protocol = tiktokHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    browser.storage.local.get("proxiTokLatency").then(r => {
        commonHelper.processDefaultCustomInstances(
            'proxiTok',
            'normal',
            tiktokHelper,
            document,
            tiktokHelper.getProxiTokNormalRedirectsChecks,
            tiktokHelper.setProxiTokNormalRedirectsChecks,
            tiktokHelper.getProxiTokNormalCustomRedirects,
            tiktokHelper.setProxiTokNormalCustomRedirects,
            r.proxiTokLatency,
        );
    })
    commonHelper.processDefaultCustomInstances(
        'proxiTok',
        'tor',
        tiktokHelper,
        document,
        tiktokHelper.getProxiTokTorRedirectsChecks,
        tiktokHelper.setProxiTokTorRedirectsChecks,
        tiktokHelper.getProxiTokTorCustomRedirects,
        tiktokHelper.setProxiTokTorCustomRedirects
    )
})

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
            commonHelper.processDefaultCustomInstances(
                'proxiTok',
                'normal',
                tiktokHelper,
                document,
                tiktokHelper.getProxiTokNormalRedirectsChecks,
                tiktokHelper.setProxiTokNormalRedirectsChecks,
                tiktokHelper.getProxiTokNormalCustomRedirects,
                tiktokHelper.setProxiTokNormalCustomRedirects,
                r,
            )
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
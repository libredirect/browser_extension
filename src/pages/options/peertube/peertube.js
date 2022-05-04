import peertubeHelper from "../../../assets/javascripts/helpers/peertube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disablePeertubeElement = document.getElementById("disable-peertube");
let protocolElement = document.getElementById("protocol")
browser.storage.local.get(
    [
        "disablePeertubeTargets",
        "peertubeTargetsProtocol"
    ],
    r => {
        disablePeertubeElement.checked = !r.disablePeertubeTargets;

        let protocol = peertubeTargetsProtocol;
        protocolElement.value = protocol;
        changeProtocolSettings(protocol);

        commonHelper.processDefaultCustomInstances('simpleertube', 'normal', peertubeHelper, document);
        commonHelper.processDefaultCustomInstances('simpleertube', 'tor', peertubeHelper, document)
    }
)

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disablePeertubeTargets: !disablePeertubeElement.checked,
        peertubeTargetsProtocol: protocolElement.value
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
            commonHelper.processDefaultCustomInstances(
                'simpleertube',
                'normal',
                peertubeHelper,
                document,
                peertubeHelper.getSimpleertubeNormalRedirectsChecks,
                peertubeHelper.setSimpleertubeNormalRedirectsChecks,
                peertubeHelper.getSimpleertubeNormalCustomRedirects,
                peertubeHelper.setSimpleertubeNormalCustomRedirects,
                r,
            );
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
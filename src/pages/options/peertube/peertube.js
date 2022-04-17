import peertubeHelper from "../../../assets/javascripts/helpers/peertube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disablePeertubeElement = document.getElementById("disable-peertube");
disablePeertubeElement.addEventListener("change",
    (event) => peertubeHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        peertubeHelper.setProtocol(protocol);
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

peertubeHelper.init().then(() => {
    disablePeertubeElement.checked = !peertubeHelper.getDisable();

    let protocol = peertubeHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    browser.storage.local.get("simpleertubeLatency").then(r => {
        commonHelper.processDefaultCustomInstances(
            'simpleertube',
            'normal',
            peertubeHelper,
            document,
            peertubeHelper.getSimpleertubeNormalRedirectsChecks,
            peertubeHelper.setSimpleertubeNormalRedirectsChecks,
            peertubeHelper.getSimpleertubeNormalCustomRedirects,
            peertubeHelper.setSimpleertubeNormalCustomRedirects
        );
    })

    commonHelper.processDefaultCustomInstances(
        'simpleertube',
        'tor',
        peertubeHelper,
        document,
        peertubeHelper.getSimpleertubeTorRedirectsChecks,
        peertubeHelper.setSimpleertubeTorRedirectsChecks,
        peertubeHelper.getSimpleertubeTorCustomRedirects,
        peertubeHelper.setSimpleertubeTorCustomRedirects
    )
})


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
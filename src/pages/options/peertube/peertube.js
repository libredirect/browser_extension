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
    let normalDiv = document.getElementById("normal");
    let torDiv = document.getElementById("tor");
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
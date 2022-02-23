import tiktokHelper from "../../../assets/javascripts/helpers/tiktok.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableTiktokElement = document.getElementById("disable-tiktok");
disableTiktokElement.addEventListener("change",
    (event) => tiktokHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        tiktokHelper.setProtocol(protocol);
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

tiktokHelper.init().then(() => {
    disableTiktokElement.checked = !tiktokHelper.getDisable();

    let protocol = tiktokHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances(
        'proxiTok',
        'normal',
        tiktokHelper,
        document,
        tiktokHelper.getProxiTokNormalRedirectsChecks,
        tiktokHelper.setProxiTokNormalRedirectsChecks,
        tiktokHelper.getProxiTokNormalCustomRedirects,
        tiktokHelper.setProxiTokNormalCustomRedirects
    );

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
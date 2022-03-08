import pixivHelper from "../../../assets/javascripts/helpers/pixiv.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disablePixivElement = document.getElementById("disable-pixiv");
disablePixivElement.addEventListener("change",
    (event) => pixivHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        pixivHelper.setProtocol(protocol);
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

pixivHelper.init().then(() => {
    disablePixivElement.checked = !pixivHelper.getDisable();

    let protocol = pixivHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances(
        'pixivMoe',
        'normal',
        pixivHelper,
        document,
        pixivHelper.getPixivMoeNormalRedirectsChecks,
        pixivHelper.setPixivMoeNormalRedirectsChecks,
        pixivHelper.getPixivMoeNormalCustomRedirects,
        pixivHelper.setPixivMoeNormalCustomRedirects
    );

    commonHelper.processDefaultCustomInstances(
        'pixivMoe',
        'tor',
        pixivHelper,
        document,
        pixivHelper.getPixivMoeTorRedirectsChecks,
        pixivHelper.setPixivMoeTorRedirectsChecks,
        pixivHelper.getPixivMoeTorCustomRedirects,
        pixivHelper.setPixivMoeTorCustomRedirects
    )
})
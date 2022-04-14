import speedtestHelper from "../../../assets/javascripts/helpers/speedtest.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableSpeedtestElement = document.getElementById("disable-speedtest");
disableSpeedtestElement.addEventListener("change",
    (event) => speedtestHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        speedtestHelper.setProtocol(protocol);
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

speedtestHelper.init().then(() => {
    disableSpeedtestElement.checked = !speedtestHelper.getDisable();

    let protocol = speedtestHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances(
        'librespeed',
        'normal',
        speedtestHelper,
        document,
        speedtestHelper.getLibrespeedNormalRedirectsChecks,
        speedtestHelper.setLibrespeedNormalRedirectsChecks,
        speedtestHelper.getLibrespeedNormalCustomRedirects,
        speedtestHelper.setLibrespeedNormalCustomRedirects
    );

    commonHelper.processDefaultCustomInstances(
        'librespeed',
        'tor',
        speedtestHelper,
        document,
        speedtestHelper.getLibrespeedTorRedirectsChecks,
        speedtestHelper.setLibrespeedTorRedirectsChecks,
        speedtestHelper.getLibrespeedTorCustomRedirects,
        speedtestHelper.setLibrespeedTorCustomRedirects
    )
})
import sendTargetsHelper from "../../../assets/javascripts/helpers/sendTargets.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableSendTargetsElement = document.getElementById("disable-sendTargets");
disableSendTargetsElement.addEventListener("change",
    (event) => sendTargetsHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        sendTargetsHelper.setProtocol(protocol);
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

sendTargetsHelper.init().then(() => {
    disableSendTargetsElement.checked = !sendTargetsHelper.getDisable();

    let protocol = sendTargetsHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances(
        'send',
        'normal',
        sendTargetsHelper,
        document,
        sendTargetsHelper.getSendNormalRedirectsChecks,
        sendTargetsHelper.setSendNormalRedirectsChecks,
        sendTargetsHelper.getSendNormalCustomRedirects,
        sendTargetsHelper.setSendNormalCustomRedirects
    );

    commonHelper.processDefaultCustomInstances(
        'send',
        'tor',
        sendTargetsHelper,
        document,
        sendTargetsHelper.getSendTorRedirectsChecks,
        sendTargetsHelper.setSendTorRedirectsChecks,
        sendTargetsHelper.getSendTorCustomRedirects,
        sendTargetsHelper.setSendTorCustomRedirects
    )
})
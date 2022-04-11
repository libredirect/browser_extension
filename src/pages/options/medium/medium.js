import mediumHelper from "../../../assets/javascripts/helpers/medium.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableMediumElement = document.getElementById("disable-medium");
disableMediumElement.addEventListener("change",
    (event) => mediumHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        mediumHelper.setProtocol(protocol);
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


mediumHelper.init().then(() => {
    disableMediumElement.checked = !mediumHelper.getDisable();

    let protocol = mediumHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances(
        'scribe',
        'normal',
        mediumHelper,
        document,
        mediumHelper.getScribeNormalRedirectsChecks,
        mediumHelper.setScribeNormalRedirectsChecks,
        mediumHelper.getScribeNormalCustomRedirects,
        mediumHelper.setScribeNormalCustomRedirects
    )

    commonHelper.processDefaultCustomInstances(
        'scribe',
        'tor',
        mediumHelper,
        document,
        mediumHelper.getScribeTorRedirectsChecks,
        mediumHelper.setScribeTorRedirectsChecks,
        mediumHelper.getScribeTorCustomRedirects,
        mediumHelper.setScribeTorCustomRedirects
    )
})
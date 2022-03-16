import lbryHelper from "../../../assets/javascripts/helpers/lbry.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableLbryElement = document.getElementById("disable-lbry");
disableLbryElement.addEventListener("change",
    (event) => lbryHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    event => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        lbryHelper.setProtocol(protocol);
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

lbryHelper.init().then(() => {
    disableLbryElement.checked = !lbryHelper.getDisable();

    let protocol = lbryHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances(
        'librarian',
        'normal',
        lbryHelper,
        document,
        lbryHelper.getLibrarianNormalRedirectsChecks,
        lbryHelper.setLibrarianNormalRedirectsChecks,
        lbryHelper.getLibrarianNormalCustomRedirects,
        lbryHelper.setLibrarianNormalCustomRedirects
    );

    commonHelper.processDefaultCustomInstances(
        'librarian',
        'tor',
        lbryHelper,
        document,
        lbryHelper.getLibrarianTorRedirectsChecks,
        lbryHelper.setLibrarianTorRedirectsChecks,
        lbryHelper.getLibrarianTorCustomRedirects,
        lbryHelper.setLibrarianTorCustomRedirects
    )
})
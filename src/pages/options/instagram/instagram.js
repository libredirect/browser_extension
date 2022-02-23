import instagramHelper from "../../../assets/javascripts/helpers/instagram.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableInstagramElement = document.getElementById("disable-bibliogram");
disableInstagramElement.addEventListener("change",
    (event) => instagramHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        instagramHelper.setProtocol(protocol);
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

instagramHelper.init().then(() => {
    disableInstagramElement.checked = !instagramHelper.getDisable();

    let protocol = instagramHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);


    commonHelper.processDefaultCustomInstances(
        'bibliogram',
        'normal',
        instagramHelper,
        document,
        instagramHelper.getBibliogramNormalRedirectsChecks,
        instagramHelper.setBibliogramNormalRedirectsChecks,
        instagramHelper.getBibliogramNormalCustomRedirects,
        instagramHelper.setBibliogramNormalCustomRedirects
    )

    commonHelper.processDefaultCustomInstances(
        'bibliogram',
        'tor',
        instagramHelper,
        document,
        instagramHelper.getBibliogramTorRedirectsChecks,
        instagramHelper.setBibliogramTorRedirectsChecks,
        instagramHelper.getBibliogramTorCustomRedirects,
        instagramHelper.setBibliogramTorCustomRedirects
    )
})
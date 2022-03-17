import spotifyHelper from "../../../assets/javascripts/helpers/spotify.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableSpotifyElement = document.getElementById("disable-spotify");
disableSpotifyElement.addEventListener("change",
    (event) => spotifyHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        spotifyHelper.setProtocol(protocol);
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

spotifyHelper.init().then(() => {
    disableSpotifyElement.checked = !spotifyHelper.getDisable();

    let protocol = spotifyHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances(
        'soju',
        'normal',
        spotifyHelper,
        document,
        spotifyHelper.getSojuNormalRedirectsChecks,
        spotifyHelper.setSojuNormalRedirectsChecks,
        spotifyHelper.getSojuNormalCustomRedirects,
        spotifyHelper.setSojuNormalCustomRedirects
    );

    commonHelper.processDefaultCustomInstances(
        'soju',
        'tor',
        spotifyHelper,
        document,
        spotifyHelper.getSojuTorRedirectsChecks,
        spotifyHelper.setSojuTorRedirectsChecks,
        spotifyHelper.getSojuTorCustomRedirects,
        spotifyHelper.setSojuTorCustomRedirects
    )
})
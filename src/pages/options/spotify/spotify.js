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

spotifyHelper.init().then(() => {
    disableSpotifyElement.checked = !spotifyHelper.getDisable();

    let protocol = spotifyHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    browser.storage.local.get("sojuLatency").then(r => {
        commonHelper.processDefaultCustomInstances(
            'soju',
            'normal',
            spotifyHelper,
            document,
            spotifyHelper.getSojuNormalRedirectsChecks,
            spotifyHelper.setSojuNormalRedirectsChecks,
            spotifyHelper.getSojuNormalCustomRedirects,
            spotifyHelper.setSojuNormalCustomRedirects,
            r.sojuLatency,
        );
    })

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

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await spotifyHelper.init();
        let redirects = spotifyHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.soju.normal).then(r => {
            browser.storage.local.set({ sojuLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances(
                'soju',
                'normal',
                spotifyHelper,
                document,
                spotifyHelper.getSojuNormalRedirectsChecks,
                spotifyHelper.setSojuNormalRedirectsChecks,
                spotifyHelper.getSojuNormalCustomRedirects,
                spotifyHelper.setSojuNormalCustomRedirects,
                r,
            )
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
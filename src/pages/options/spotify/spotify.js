import spotifyHelper from "../../../assets/javascripts/helpers/spotify.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableSpotifyElement = document.getElementById("disable-spotify");

browser.storage.local.get(
    [
        "disableSpotifyTargets",
    ],
    r => {
        disableSpotifyElement.checked = !r.disableSpotifyTargets;
    }
)

commonHelper.processDefaultCustomInstances('spotify', 'soju', 'normal', document);

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
            commonHelper.processDefaultCustomInstances('spotify', 'soju', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
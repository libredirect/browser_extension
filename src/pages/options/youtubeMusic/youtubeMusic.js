import youtubeMusicHelper from "../../../assets/javascripts/helpers/youtubeMusic.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableYoutubeMusicElement = document.getElementById("disable-beatbump");

browser.storage.local.get(
    [
        "disableYoutubeMusic",
    ],
    r => {
        disableYoutubeMusicElement.checked = !r.disableYoutubeMusic;
    }
);

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableYoutubeMusic: !disableYoutubeMusicElement.checked,
    })
})

commonHelper.processDefaultCustomInstances('beatbump', 'normal', youtubeMusicHelper, document);

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await youtubeMusicHelper.init();
        let redirects = youtubeMusicHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.beatbump.normal).then(r => {
            browser.storage.local.set({ beatbumpLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('beatbump', 'normal', youtubeMusicHelper, document)
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
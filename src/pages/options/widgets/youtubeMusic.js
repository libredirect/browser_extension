import youtubeMusicHelper from "../../../assets/javascripts/youtubeMusic.js";
import utils from "../../../assets/javascripts/utils.js";

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

utils.processDefaultCustomInstances('youtubeMusic', 'beatbump', 'normal', document);

utils.latency('youtubeMusic', 'beatbump', document, location)
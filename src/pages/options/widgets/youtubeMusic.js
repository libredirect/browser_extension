import utils from "../../../assets/javascripts/utils.js";

let enable = document.getElementById("youtubeMusic-enable");
const youtubeMusic = document.getElementById('youtubeMusic_page');

browser.storage.local.get(
    [
        "disableYoutubeMusic",
    ],
    r => {
        enable.checked = !r.disableYoutubeMusic;
    }
);

youtubeMusic.addEventListener("change", () => {
    browser.storage.local.set({
        disableYoutubeMusic: !enable.checked,
    })
})

utils.processDefaultCustomInstances('youtubeMusic', 'beatbump', 'normal', document);

utils.latency('youtubeMusic', 'beatbump', document, location, true)
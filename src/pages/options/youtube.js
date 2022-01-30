import youtubeHelper from "../../assets/javascripts/helpers/youtube.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const invidiousInstances = youtubeHelper.redirects;

let invidiousInstance = document.getElementById("invidious-instance");
let disableInvidious = document.getElementById("disable-invidious");
let invidiousDarkMode = document.getElementById("invidious-dark-mode");
let persistInvidiousPrefs = document.getElementById("persist-invidious-prefs");
let invidiousVolume = document.getElementById("invidious-volume");
let invidiousPlayerStyle = document.getElementById("invidious-player-style");
let invidiousSubtitles = document.getElementById("invidious-subtitles");
let invidiousAutoplay = document.getElementById("invidious-autoplay");
let invidiousRandomPool = document.getElementById("invidious-random-pool");
let useFreeTube = document.getElementById("use-freetube");
let alwaysProxy = document.getElementById("always-proxy");
let onlyEmbeddedVideo = document.getElementById("only-embed");
let videoQuality = document.getElementById("video-quality");

browser.storage.sync.get(
    [
        "invidiousInstance",
        "disableInvidious",
        "invidiousDarkMode",
        "persistInvidiousPrefs",
        "invidiousVolume",
        "invidiousPlayerStyle",
        "invidiousSubtitles",
        "invidiousAutoplay",
        "invidiousRandomPool",
        "useFreeTube",
        "alwaysProxy",
        "onlyEmbeddedVideo",
        "videoQuality",
    ],
    (result) => {
        invidiousInstance.value = result.invidiousInstance || "";
        disableInvidious.checked = !result.disableInvidious;
        invidiousDarkMode.checked = result.invidiousDarkMode;
        persistInvidiousPrefs.checked = result.persistInvidiousPrefs;
        invidiousVolume.value = result.invidiousVolume;
        document.querySelector("#volume-value").textContent = result.invidiousVolume ? `${result.invidiousVolume}%` : " - ";
        invidiousPlayerStyle.value = result.invidiousPlayerStyle || "";
        invidiousSubtitles.value = result.invidiousSubtitles || "";
        invidiousAutoplay.checked = result.invidiousAutoplay;
        invidiousRandomPool.value = result.invidiousRandomPool || commonHelper.filterInstances(invidiousInstances);
        useFreeTube.checked = result.useFreeTube;
        onlyEmbeddedVideo.checked = result.onlyEmbeddedVideo;
        alwaysProxy.checked = result.alwaysProxy;
        videoQuality.value = result.videoQuality || "";
        let id = "invidious-instance"
        let instances = invidiousRandomPool.value.split(',');
        shared.autocompletes.push({ id: id, instances: instances });
        shared.autocomplete(document.getElementById(id), instances);
    }
)

const invidiousInstanceChange = commonHelper.debounce(
    () => {
        if (invidiousInstance.checkValidity())
            browser.storage.sync.set({
                invidiousInstance: shared.parseURL(invidiousInstance.value),
            });
    },
    500
);
invidiousInstance.addEventListener("input", invidiousInstanceChange);

disableInvidious.addEventListener(
    "change",
    (event) => {
        browser.storage.sync.set({ disableInvidious: !event.target.checked });
    }
);

invidiousDarkMode.addEventListener(
    "change",
    (event) => {
        console.info("InvidiousDarkMode", event.target.checked);
        browser.storage.sync.set({ invidiousDarkMode: event.target.checked });
    }
);

persistInvidiousPrefs.addEventListener(
    "change",
    (event) => {
        console.info("Persist preferences (as cookie)", event.target.checked);
        browser.storage.sync.set({ persistInvidiousPrefs: event.target.checked });
    }
);

const invidiousVolumeChange = commonHelper.debounce(
    () => {
        document.querySelector("#volume-value").textContent = `${invidiousVolume.value}%`;
        browser.storage.sync.set({
            invidiousVolume: invidiousVolume.value,
        });
    },
    1
);
invidiousVolume.addEventListener("input", invidiousVolumeChange);

invidiousPlayerStyle.addEventListener("change", (event) => {
    browser.storage.sync.set({
        invidiousPlayerStyle: event.target.options[invidiousPlayerStyle.selectedIndex].value,
    });
});

const invidiousSubtitlesChange = commonHelper.debounce(
    () => {
        browser.storage.sync.set({ invidiousSubtitles: invidiousSubtitles.value });
    },
    500
);
invidiousSubtitles.addEventListener("input", invidiousSubtitlesChange);

invidiousAutoplay.addEventListener(
    "change",
    (event) => {
        browser.storage.sync.set({ invidiousAutoplay: event.target.checked });
    }
);

const invidiousRandomPoolChange = commonHelper.debounce(
    () => {
        browser.storage.sync.set({ invidiousRandomPool: invidiousRandomPool.value });
    },
    500
);
invidiousRandomPool.addEventListener("input", invidiousRandomPoolChange);


useFreeTube.addEventListener("change", (event) => {
    browser.storage.sync.set({ useFreeTube: event.target.checked });
});

alwaysProxy.addEventListener("change", (event) => {
    browser.storage.sync.set({ alwaysProxy: event.target.checked });
});

onlyEmbeddedVideo.addEventListener("change", (event) => {
    browser.storage.sync.set({ onlyEmbeddedVideo: event.target.checked });
});

videoQuality.addEventListener("change", (event) => {
    browser.storage.sync.set({
        videoQuality: event.target.options[videoQuality.selectedIndex].value,
    });
});
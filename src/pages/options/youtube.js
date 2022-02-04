import youtubeHelper from "../../assets/javascripts/helpers/youtube.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";

let disableYoutubeElement = document.getElementById("disable-invidious");
let youtubeFrontendElement = document.getElementById("youtube-frontend");
let invidiousDarkModeElement = document.getElementById("invidious-dark-mode");
let persistInvidiousPrefsElement = document.getElementById("persist-invidious-prefs");
let invidiousVolumeElement = document.getElementById("invidious-volume");
let invidiousPlayerStyleElement = document.getElementById("invidious-player-style");
let invidiousSubtitlesElement = document.getElementById("invidious-subtitles");
let invidiousAutoplayElement = document.getElementById("invidious-autoplay");
let useFreeTubeElement = document.getElementById("use-freetube");
let invidiousAlwaysProxyElement = document.getElementById("always-proxy");
let invidiousOnlyEmbeddedVideoElement = document.getElementById("only-embed");
let invidiousVideoQualityElement = document.getElementById("video-quality");
let invidiousVolumeValueElement = document.querySelector("#volume-value");

let invidiousDivElement = document.getElementById("invidious")
let pipedDivElement = document.getElementById("piped")

function changeFrontendsSettings(frontend) {
    if (frontend == 'piped') {
        pipedDivElement.style.display = 'block';
        invidiousDivElement.style.display = 'none';
    }
    else if (frontend == 'invidious') {
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'block';
    }
}

youtubeHelper.init().then(() => {
    disableYoutubeElement.checked = !youtubeHelper.getDisableYoutube();
    invidiousDarkModeElement.checked = youtubeHelper.getInvidiousDarkMode();
    persistInvidiousPrefsElement.checked = youtubeHelper.getPersistInvidiousPrefs();
    invidiousVolumeElement.value = youtubeHelper.getInvidiousVolume();
    invidiousVolumeValueElement.textContent = `${youtubeHelper.getInvidiousVolume()}%`;
    invidiousPlayerStyleElement.value = youtubeHelper.getInvidiousPlayerStyle();
    invidiousSubtitlesElement.value = youtubeHelper.getInvidiousSubtitles();
    useFreeTubeElement.checked = youtubeHelper.getUseFreeTube();
    invidiousOnlyEmbeddedVideoElement.checked = youtubeHelper.getInvidiousOnlyEmbeddedVideo();
    invidiousAlwaysProxyElement.checked = youtubeHelper.getInvidiousAlwaysProxy();
    invidiousVideoQualityElement.value = youtubeHelper.getInvidiousVideoQuality();
    invidiousAutoplayElement.checked = youtubeHelper.getInvidiousAutoplay();
    let frontend = youtubeHelper.getFrontend()
    youtubeFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);
});


disableYoutubeElement.addEventListener("change",
    (event) => youtubeHelper.setDisableYoutube(!event.target.checked)
);

invidiousDarkModeElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousDarkMode(event.target.checked)
);

persistInvidiousPrefsElement.addEventListener("change",
    (event) => youtubeHelper.setPersistInvidiousPrefs(event.target.checked)
);

invidiousVolumeElement.addEventListener("input",
    () => {
        youtubeHelper.setInvidiousVolume(invidiousVolumeElement.value);
        invidiousVolumeValueElement.textContent = `${invidiousVolumeElement.value}%`;
    }
);

invidiousPlayerStyleElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousPlayerStyle(event.target.options[invidiousPlayerStyleElement.selectedIndex].value)
);

invidiousSubtitlesElement.addEventListener("input",
    commonHelper.debounce(() => {
        youtubeHelper.setInvidiousSubtitles(invidiousSubtitlesElement.value)
    }, 500)
);

invidiousAutoplayElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousAutoplay(event.target.checked)
);

useFreeTubeElement.addEventListener("change",
    (event) => youtubeHelper.setUseFreeTube(event.target.checked)
);

invidiousAlwaysProxyElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousAlwaysProxy(event.target.checked)
);

invidiousOnlyEmbeddedVideoElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousOnlyEmbeddedVideo(event.target.checked)
);

invidiousVideoQualityElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousVideoQuality(event.target.options[invidiousVideoQualityElement.selectedIndex].value)
);

youtubeFrontendElement.addEventListener("change",
    (event) => {
        let frontend = event.target.options[youtubeFrontendElement.selectedIndex].value
        youtubeHelper.setFrontend(frontend);
        changeFrontendsSettings(frontend);
    }
);
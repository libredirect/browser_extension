import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableYoutubeElement = document.getElementById("disable-invidious");

let youtubeFrontendElement = document.getElementById("youtube-frontend");
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
    else if (frontend == 'freeTube') {
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'none';
    }
}
youtubeFrontendElement.addEventListener("change",
    (event) => {
        let frontend = event.target.options[youtubeFrontendElement.selectedIndex].value
        youtubeHelper.setFrontend(frontend);
        changeFrontendsSettings(frontend);
    }
);

disableYoutubeElement.addEventListener("change",
    (event) => youtubeHelper.setDisableYoutube(!event.target.checked)
);

let invidiousThemeElement = document.getElementById("invidious-theme");
invidiousThemeElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousTheme(event.target.options[invidiousThemeElement.selectedIndex].value)
);

let persistInvidiousPrefsElement = document.getElementById("persist-invidious-prefs");
persistInvidiousPrefsElement.addEventListener("change",
    (event) => youtubeHelper.setPersistInvidiousPrefs(event.target.checked)
);

let invidiousVolumeElement = document.getElementById("invidious-volume");
let invidiousVolumeValueElement = document.querySelector("#volume-value");
invidiousVolumeElement.addEventListener("input",
    () => {
        youtubeHelper.setInvidiousVolume(invidiousVolumeElement.value);
        invidiousVolumeValueElement.textContent = `${invidiousVolumeElement.value}%`;
    }
);
let invidiousClearVolumeElement = document.getElementById("clear-invidious-volume");
invidiousClearVolumeElement.addEventListener("click",
    (_) => {
        youtubeHelper.setInvidiousVolume('--');
        invidiousVolumeValueElement.textContent = `--%`;
        invidiousVolumeElement.value = 50;
    }
);

let invidiousPlayerStyleElement = document.getElementById("invidious-player-style");
invidiousPlayerStyleElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousPlayerStyle(event.target.options[invidiousPlayerStyleElement.selectedIndex].value)
);

let invidiousSubtitlesElement = document.getElementById("invidious-subtitles");
invidiousSubtitlesElement.addEventListener("input",
    commonHelper.debounce(() => {
        youtubeHelper.setInvidiousSubtitles(invidiousSubtitlesElement.value)
    }, 500)
);

let invidiousAutoplayElement = document.getElementById("invidious-autoplay");
invidiousAutoplayElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousAutoplay(event.target.options[invidiousAutoplayElement.selectedIndex].value)
);

let invidiousAlwaysProxyElement = document.getElementById("invidious-always-proxy");
invidiousAlwaysProxyElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousAlwaysProxy(event.target.options[invidiousAlwaysProxyElement.selectedIndex].value)
);

let invidiousOnlyEmbeddedVideoElement = document.getElementById("only-embed");
invidiousOnlyEmbeddedVideoElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousOnlyEmbeddedVideo(event.target.checked)
);

let invidiousVideoQualityElement = document.getElementById("video-quality");
invidiousVideoQualityElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousVideoQuality(event.target.options[invidiousVideoQualityElement.selectedIndex].value)
);


youtubeHelper.init().then(() => {
    disableYoutubeElement.checked = !youtubeHelper.getDisableYoutube();
    invidiousThemeElement.checked = youtubeHelper.getInvidiousTheme();
    persistInvidiousPrefsElement.checked = youtubeHelper.getPersistInvidiousPrefs();
    invidiousVolumeElement.value = youtubeHelper.getInvidiousVolume();
    invidiousVolumeValueElement.textContent = `${youtubeHelper.getInvidiousVolume()}%`;
    invidiousPlayerStyleElement.value = youtubeHelper.getInvidiousPlayerStyle();
    invidiousSubtitlesElement.value = youtubeHelper.getInvidiousSubtitles();
    invidiousOnlyEmbeddedVideoElement.checked = youtubeHelper.getInvidiousOnlyEmbeddedVideo();
    invidiousAlwaysProxyElement.checked = youtubeHelper.getInvidiousAlwaysProxy();
    invidiousVideoQualityElement.value = youtubeHelper.getInvidiousVideoQuality();
    invidiousAutoplayElement.checked = youtubeHelper.getInvidiousAutoplay();
    let frontend = youtubeHelper.getFrontend()
    youtubeFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);
});






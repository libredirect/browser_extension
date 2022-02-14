import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";

let disableYoutubeElement = document.getElementById("disable-invidious");

let youtubeFrontendElement = document.getElementById("youtube-frontend");
let invidiousDivElement = document.getElementById("invidious")
let pipedDivElement = document.getElementById("piped")
let invidiousPipedDivElement = document.getElementById("invidious-piped")

function changeFrontendsSettings(frontend) {
    if (frontend == 'piped') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'block';
        invidiousDivElement.style.display = 'none';
    }
    else if (frontend == 'invidious') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'block';
    }
    else if (frontend == 'freeTube') {
        invidiousPipedDivElement.style.display = 'none'
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

let invidiousAutoplayElement = document.getElementById("invidious-autoplay");
invidiousAutoplayElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousAutoplay(event.target.options[invidiousAutoplayElement.selectedIndex].value)
);

let invidiousOnlyEmbeddedVideoElement = document.getElementById("only-embed");
invidiousOnlyEmbeddedVideoElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousOnlyEmbeddedVideo(event.target.checked)
);

let alwaysUsePreferredElement = document.getElementById("always-use-preferred")
alwaysUsePreferredElement.addEventListener("change",
    (event) => youtubeHelper.setAlwaysusePreferred(event.target.checked)
);

youtubeHelper.init().then(() => {
    disableYoutubeElement.checked = !youtubeHelper.getDisableYoutube();
    invidiousThemeElement.checked = youtubeHelper.getInvidiousTheme();
    invidiousVolumeElement.value = youtubeHelper.getInvidiousVolume();
    invidiousVolumeValueElement.textContent = `${youtubeHelper.getInvidiousVolume()}%`;
    invidiousOnlyEmbeddedVideoElement.checked = youtubeHelper.getInvidiousOnlyEmbeddedVideo();
    alwaysUsePreferredElement.checked = youtubeHelper.getAlwaysusePreferred();
    invidiousAutoplayElement.checked = youtubeHelper.getInvidiousAutoplay();
    let frontend = youtubeHelper.getFrontend();
    youtubeFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);
});

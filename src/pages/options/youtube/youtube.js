import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";

let disableYoutubeElement = document.getElementById("disable-invidious");

let youtubeFrontendElement = document.getElementById("youtube-frontend");
let invidiousDivElement = document.getElementById("invidious");
let pipedDivElement = document.getElementById("piped");
let invidiousPipedDivElement = document.getElementById("invidious-piped");
let freetubeDivElement = document.getElementById("freetube");
let freetubeFrontendElement = document.getElementById("freetube-embedded-frontend");

function changeFrontendsSettings(frontend) {
    if (frontend == 'piped') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'block';
        invidiousDivElement.style.display = 'none';
        freetubeDivElement.style.display = 'none';
    }
    else if (frontend == 'invidious') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'block';
        freetubeDivElement.style.display = 'none';
    }
    else if (frontend == 'freetube') {
        invidiousPipedDivElement.style.display = 'none'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'none';
        freetubeDivElement.style.display = 'block';
    }
}

function changeFreetubeFrontendsSettings(freetubeFrontend) {
    if (freetubeFrontend == 'invidious') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'block';
    }
    if (freetubeFrontend == 'piped') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'block';
        invidiousDivElement.style.display = 'none';
    }
    else if (freetubeFrontend == 'youtube') {
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
freetubeFrontendElement.addEventListener("change",
    (event) => {
        let freetubeFrontend = event.target.options[freetubeFrontendElement.selectedIndex].value
        youtubeHelper.setFreetubeFrontend(freetubeFrontend);
        changeFreetubeFrontendsSettings(freetubeFrontend);
    }
);

disableYoutubeElement.addEventListener("change",
    (event) => youtubeHelper.setDisable(!event.target.checked)
);

let themeElement = document.getElementById("invidious-theme");
themeElement.addEventListener("change",
    (event) => youtubeHelper.setTheme(event.target.options[themeElement.selectedIndex].value)
);

let volumeElement = document.getElementById("invidious-volume");
let volumeValueElement = document.querySelector("#volume-value");
volumeElement.addEventListener("input",
    () => {
        youtubeHelper.setVolume(volumeElement.value);
        volumeValueElement.textContent = `${volumeElement.value}%`;
    }
);
let invidiousClearVolumeElement = document.getElementById("clear-invidious-volume");
invidiousClearVolumeElement.addEventListener("click",
    (_) => {
        youtubeHelper.setVolume('--');
        volumeValueElement.textContent = `--%`;
        volumeElement.value = 50;
    }
);

let autoplayElement = document.getElementById("invidious-autoplay");
autoplayElement.addEventListener("change",
    (event) => youtubeHelper.setAutoplay(event.target.options[autoplayElement.selectedIndex].value)
);

let OnlyEmbeddedVideoElement = document.getElementById("only-embed");
OnlyEmbeddedVideoElement.addEventListener("change",
    (event) => youtubeHelper.setOnlyEmbeddedVideo(event.target.options[OnlyEmbeddedVideoElement.selectedIndex].value)
);

let alwaysUsePreferredElement = document.getElementById("always-use-preferred")
alwaysUsePreferredElement.addEventListener("change",
    (event) => youtubeHelper.setAlwaysusePreferred(event.target.checked)
);

youtubeHelper.init().then(() => {
    disableYoutubeElement.checked = !youtubeHelper.getDisable();
    themeElement.checked = youtubeHelper.getTheme();
    volumeElement.value = youtubeHelper.getVolume();
    volumeValueElement.textContent = `${youtubeHelper.getVolume()}%`;
    OnlyEmbeddedVideoElement.value = youtubeHelper.getOnlyEmbeddedVideo();
    alwaysUsePreferredElement.checked = youtubeHelper.getAlwaysusePreferred();
    autoplayElement.checked = youtubeHelper.getAutoplay();
    let frontend = youtubeHelper.getFrontend();
    youtubeFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);

    let freetubeFrontend = youtubeHelper.getFreetubeFrontend()
    freetubeFrontendElement.value = freetubeFrontend
    if (frontend == "freetube") changeFreetubeFrontendsSettings(freetubeFrontend);
});

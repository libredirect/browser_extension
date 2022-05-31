import youtubeHelper from "../../../assets/javascripts/youtube/youtube.js";
import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("youtube-enable");
const frontend = document.getElementById("youtube-frontend");
const youtubeEmbedFrontend = document.getElementById("youtube-embed_frontend");
const onlyEmbeddedVideo = document.getElementById("youtube-redirect_type");
const protocol = document.getElementById("youtube-protocol");
const youtube = document.getElementById('youtube_page');

const invidiousDiv = document.getElementById("invidious");
const pipedDiv = document.getElementById("piped");
const pipedMaterialDiv = document.getElementById("pipedMaterial");
const freetubeYatteeDiv = document.getElementById("freetube-yatte");

function changeFrontendsSettings() {
    if (frontend.value == 'invidious') {
        invidiousDiv.style.display = 'block';
        pipedDiv.style.display = 'none';
        pipedMaterialDiv.style.display = 'none';
        freetubeYatteeDiv.style.display = 'none';
    }
    else if (frontend.value == 'piped') {
        invidiousDiv.style.display = 'none';
        pipedDiv.style.display = 'block';
        pipedMaterialDiv.style.display = 'none';
        freetubeYatteeDiv.style.display = 'none';
    }
    else if (frontend.value == 'pipedMaterial') {
        invidiousDiv.style.display = 'none';
        pipedDiv.style.display = 'none';
        pipedMaterialDiv.style.display = 'block';
        freetubeYatteeDiv.style.display = 'none';
    }
    else if (frontend.value == 'freetube' || frontend.value == 'yatte') {
        invidiousDiv.style.display = 'none';
        pipedDiv.style.display = 'none';
        pipedMaterialDiv.style.display = 'none';
        freetubeYatteeDiv.style.display = 'block';
        changeYoutubeEmbedFrontendsSettings();
    }
}

function changeYoutubeEmbedFrontendsSettings() {
    if (youtubeEmbedFrontend.value == 'invidious') {
        pipedDiv.style.display = 'none';
        pipedMaterialDiv.style.display = 'none';
        invidiousDiv.style.display = 'block';
    }
    if (youtubeEmbedFrontend.value == 'piped') {
        pipedDiv.style.display = 'block';
        pipedMaterialDiv.style.display = 'none';
        invidiousDiv.style.display = 'none';
    }
    if (youtubeEmbedFrontend.value == 'pipedMaterial') {
        pipedDiv.style.display = 'none';
        pipedMaterialDiv.style.display = 'block';
        invidiousDiv.style.display = 'none';
    }
    else if (youtubeEmbedFrontend.value == 'youtube') {
        pipedDiv.style.display = 'none';
        pipedMaterialDiv.style.display = 'none';
        invidiousDiv.style.display = 'none';
    }
}

function changeProtocolSettings() {
    const normalPipedDiv = document.getElementById('piped').getElementsByClassName("normal")[0];
    const torPipedDiv = document.getElementById('piped').getElementsByClassName("tor")[0];

    const normalPipedMaterialDiv = document.getElementById('pipedMaterial').getElementsByClassName("normal")[0];
    const torPipedMaterialDiv = document.getElementById('pipedMaterial').getElementsByClassName("tor")[0];

    const normalInvidiousDiv = document.getElementById('invidious').getElementsByClassName("normal")[0];
    const torInvidiousDiv = document.getElementById('invidious').getElementsByClassName("tor")[0];

    if (protocol.value == 'normal') {
        normalInvidiousDiv.style.display = 'block';
        torInvidiousDiv.style.display = 'none';

        normalPipedDiv.style.display = 'block';
        torPipedDiv.style.display = 'none';

        normalPipedMaterialDiv.style.display = 'block';
        torPipedMaterialDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalInvidiousDiv.style.display = 'none';
        torInvidiousDiv.style.display = 'block';

        normalPipedDiv.style.display = 'none';
        torPipedDiv.style.display = 'block';

        normalPipedMaterialDiv.style.display = 'none';
        torPipedMaterialDiv.style.display = 'block';
    }
}

youtube.addEventListener("change", () => {
    browser.storage.local.set({
        disableYoutube: !enable.checked,
        youtubeFrontend: frontend.value,
        youtubeEmbedFrontend: youtubeEmbedFrontend.value,
        onlyEmbeddedVideo: onlyEmbeddedVideo.value,
        youtubeProtocol: protocol.value,
    })
    changeProtocolSettings();
    changeYoutubeEmbedFrontendsSettings();
    changeFrontendsSettings();
})

browser.storage.local.get(
    [
        "disableYoutube",
        "onlyEmbeddedVideo",
        "youtubeRedirects",
        "youtubeFrontend",

        "youtubeEmbedFrontend",
        "youtubeProtocol",
    ],
    r => {
        enable.checked = !r.disableYoutube;
        onlyEmbeddedVideo.value = r.onlyEmbeddedVideo;
        frontend.value = r.youtubeFrontend;
        protocol.value = r.youtubeProtocol;

        changeFrontendsSettings();
        changeProtocolSettings();

        youtubeEmbedFrontend.value = youtubeEmbedFrontend.value
        if (r.frontend == "freetube" || r.frontend == "yatte") changeYoutubeEmbedFrontendsSettings()
    }
);

utils.processDefaultCustomInstances('youtube', 'invidious', 'normal', document);
utils.processDefaultCustomInstances('youtube', 'invidious', 'tor', document);
utils.processDefaultCustomInstances('youtube', 'pipedMaterial', 'normal', document);
utils.processDefaultCustomInstances('youtube', 'pipedMaterial', 'tor', document);
utils.processDefaultCustomInstances('youtube', 'piped', 'normal', document);
utils.processDefaultCustomInstances('youtube', 'piped', 'tor', document);

utils.latency('youtube', 'invidious', document, location, true)
utils.latency('youtube', 'piped', document, location, true)
utils.latency('youtube', 'pipedMaterial', document, location, true)

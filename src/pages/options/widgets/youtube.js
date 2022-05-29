import youtubeHelper from "../../../assets/javascripts/youtube/youtube.js";
import utils from "../../../assets/javascripts/utils.js";

let disableYoutube = document.getElementById("disable-invidious");
let youtubeFrontend = document.getElementById("youtube-frontend");
let invidiousDiv = document.getElementById("invidious");
let pipedDiv = document.getElementById("piped");
let pipedMaterialDiv = document.getElementById("pipedMaterial");
let freetubeYatteeDiv = document.getElementById("freetube-yatte");
let youtubeEmbedFrontend = document.getElementById("youtube-embed-frontend");
let OnlyEmbeddedVideo = document.getElementById("only-embed");
let protoco = document.getElementById("protocol");

function changeFrontendsSettings() {
    let frontend = youtubeFrontend.value;

    if (frontend == 'invidious') {
        invidiousDiv.style.display = 'block';
        pipedDiv.style.display = 'none';
        pipedMaterialDiv.style.display = 'none';
        freetubeYatteeDiv.style.display = 'none';
    }
    else if (frontend == 'piped') {
        invidiousDiv.style.display = 'none';
        pipedDiv.style.display = 'block';
        pipedMaterialDiv.style.display = 'none';
        freetubeYatteeDiv.style.display = 'none';
    }
    else if (frontend == 'pipedMaterial') {
        invidiousDiv.style.display = 'none';
        pipedDiv.style.display = 'none';
        pipedMaterialDiv.style.display = 'block';
        freetubeYatteeDiv.style.display = 'none';
    }
    else if (frontend == 'freetube' || frontend == 'yatte') {
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

    if (protoco.value == 'normal') {
        normalInvidiousDiv.style.display = 'block';
        torInvidiousDiv.style.display = 'none';

        normalPipedDiv.style.display = 'block';
        torPipedDiv.style.display = 'none';

        normalPipedMaterialDiv.style.display = 'block';
        torPipedMaterialDiv.style.display = 'none';
    }
    else if (protoco.value == 'tor') {
        normalInvidiousDiv.style.display = 'none';
        torInvidiousDiv.style.display = 'block';

        normalPipedDiv.style.display = 'none';
        torPipedDiv.style.display = 'block';

        normalPipedMaterialDiv.style.display = 'none';
        torPipedMaterialDiv.style.display = 'block';
    }
}

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableYoutube: !disableYoutube.checked,
        youtubeFrontend: youtubeFrontend.value,
        youtubeEmbedFrontend: youtubeEmbedFrontend.value,
        OnlyEmbeddedVideo: OnlyEmbeddedVideo.value,
        youtubeProtocol: protoco.value,
    })
    changeProtocolSettings();
    changeYoutubeEmbedFrontendsSettings();
    changeFrontendsSettings();
})

browser.storage.local.get(
    [
        "disableYoutube",
        "OnlyEmbeddedVideo",
        "youtubeRedirects",
        "youtubeFrontend",

        "youtubeEmbedFrontend",
        "youtubeProtocol",
    ],
    r => {
        disableYoutube.checked = !r.disableYoutube;
        OnlyEmbeddedVideo.value = r.OnlyEmbeddedVideo;
        youtubeFrontend.value = r.youtubeFrontend;
        protoco.value = r.youtubeProtocol;

        changeFrontendsSettings();
        changeProtocolSettings();

        youtubeEmbedFrontend.value = youtubeEmbedFrontend.value
        if (r.youtubeFrontend == "freetube" || r.youtubeFrontend == "yatte") changeYoutubeEmbedFrontendsSettings()
    }
);

const invidiousForm = invidiousDiv.getElementsByTagName('form')[0];
const invidiousCookies = invidiousForm.getElementsByTagName('input')[0];
invidiousForm.addEventListener('submit', async event => {
    event.preventDefault();
    const url = new URL(invidiousCookies.value);
    youtubeHelper.initInvidiousCookies(url);
});

// const pipedForm = pipedDiv.getElementsByTagName('form')[0];
// const pipedCookies = pipedForm.getElementsByTagName('input')[0];
// pipedForm.addEventListener('submit', async event => {
//     event.preventDefault();
//     const url = new URL(pipedCookies.value);
//     youtubeHelper.applyPipedLocalStorage(url);
// });

utils.processDefaultCustomInstances('youtube', 'invidious', 'normal', document);
utils.processDefaultCustomInstances('youtube', 'invidious', 'tor', document);
utils.processDefaultCustomInstances('youtube', 'pipedMaterial', 'normal', document);
utils.processDefaultCustomInstances('youtube', 'pipedMaterial', 'tor', document);
utils.processDefaultCustomInstances('youtube', 'piped', 'normal', document);
utils.processDefaultCustomInstances('youtube', 'piped', 'tor', document);

utils.latency('youtube', 'invidious', document, location, true)
utils.latency('youtube', 'piped', document, location, true)
utils.latency('youtube', 'pipedMaterial', document, location, true)

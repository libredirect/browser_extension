import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";

let disableYoutubeElement = document.getElementById("disable-invidious");
let youtubeFrontendElement = document.getElementById("youtube-frontend");
let invidiousDivElement = document.getElementById("invidious");
let pipedDivElement = document.getElementById("piped");
let pipedMaterialDivElement = document.getElementById("pipedMaterial");
let freetubeYatteeDivElement = document.getElementById("freetube-yatte");
let customSettingsDivElement = document.getElementsByClassName("custom-settings");
let youtubeEmbedFrontendElement = document.getElementById("youtube-embed-frontend");
let enableYoutubeCustomSettingsElement = document.getElementById("enable-youtube-custom-settings");
let OnlyEmbeddedVideoElement = document.getElementById("only-embed");
let bypassWatchOnYoutubeElement = document.getElementById("bypass-watch-on-youtube");
let protocolElement = document.getElementById("protocol");

function changeFrontendsSettings() {
    let frontend = youtubeFrontendElement.value;

    if (enableYoutubeCustomSettingsElement.checked)
        for (const item of customSettingsDivElement) item.style.display = 'block';
    else
        for (const item of customSettingsDivElement) item.style.display = 'none';

    if (frontend == 'invidious') {
        invidiousDivElement.style.display = 'block';
        pipedDivElement.style.display = 'none';
        pipedMaterialDivElement.style.display = 'none';
        freetubeYatteeDivElement.style.display = 'none';
    }
    else if (frontend == 'piped') {
        invidiousDivElement.style.display = 'none';
        pipedDivElement.style.display = 'block';
        pipedMaterialDivElement.style.display = 'none';
        freetubeYatteeDivElement.style.display = 'none';
    }
    else if (frontend == 'pipedMaterial') {
        invidiousDivElement.style.display = 'none';
        pipedDivElement.style.display = 'none';
        pipedMaterialDivElement.style.display = 'block';
        freetubeYatteeDivElement.style.display = 'none';
    }
    else if (frontend == 'freetube' || frontend == 'yatte') {
        invidiousDivElement.style.display = 'none';
        pipedDivElement.style.display = 'none';
        pipedMaterialDivElement.style.display = 'none';
        freetubeYatteeDivElement.style.display = 'block';
        changeYoutubeEmbedFrontendsSettings(youtubeHelper.getYoutubeEmbedFrontend());
    }
}

function changeYoutubeEmbedFrontendsSettings(youtubeEmbedFrontend) {
    if (youtubeEmbedFrontend == 'invidious') {
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'block';
    }
    if (youtubeEmbedFrontend == 'piped') {
        pipedDivElement.style.display = 'block';
        invidiousDivElement.style.display = 'none';
    }
    else if (youtubeEmbedFrontend == 'youtube') {
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'none';
    }
}

function changeProtocolSettings(protocol) {
    let normalPipedDiv = document.getElementById('piped').getElementsByClassName("normal")[0];
    let torPipedDiv = document.getElementById('piped').getElementsByClassName("tor")[0];

    let normalPipedMaterialDiv = document.getElementById('pipedMaterial').getElementsByClassName("normal")[0];
    let torPipedMaterialDiv = document.getElementById('pipedMaterial').getElementsByClassName("tor")[0];

    let normalInvidiousDiv = document.getElementById('invidious').getElementsByClassName("normal")[0];
    let torInvidiousDiv = document.getElementById('invidious').getElementsByClassName("tor")[0];

    if (protocol == 'normal') {
        normalInvidiousDiv.style.display = 'block';
        torInvidiousDiv.style.display = 'none';

        normalPipedDiv.style.display = 'block';
        torPipedDiv.style.display = 'none';

        normalPipedMaterialDiv.style.display = 'block';
        torPipedMaterialDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
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
        disableYoutube: !disableYoutubeElement.checked,
        youtubeFrontend: youtubeFrontendElement.value,
        youtubeEmbedFrontend: youtubeEmbedFrontendElement.value,
        enableYoutubeCustomSettings: enableYoutubeCustomSettingsElement.checked,
        OnlyEmbeddedVideo: OnlyEmbeddedVideoElement.value,
        bypassWatchOnYoutube: bypassWatchOnYoutubeElement.checked,
        youtubeProtocol: protocolElement.value,
    })
    changeYoutubeEmbedFrontendsSettings(youtubeEmbedFrontendElement.value);
    changeProtocolSettings(protocolElement.value);
    changeFrontendsSettings();
})

browser.storage.local.get(
    [
        "disableYoutube",
        "enableYoutubeCustomSettings",
        "OnlyEmbeddedVideo",
        "youtubeRedirects",
        "youtubeFrontend",

        "alwaysUsePreferred",
        "youtubeEmbedFrontend",
        "youtubeProtocol",
        "bypassWatchOnYoutube",
    ],
    r => {
        disableYoutubeElement.checked = !r.disableYoutube;
        enableYoutubeCustomSettingsElement.checked = r.enableYoutubeCustomSettings;

        OnlyEmbeddedVideoElement.value = r.OnlyEmbeddedVideo;
        bypassWatchOnYoutubeElement.checked = r.bypassWatchOnYoutube;

        let frontend = r.youtubeFrontend;
        youtubeFrontendElement.value = frontend;
        changeFrontendsSettings();

        let protocol = r.youtubeProtocol;
        protocolElement.value = protocol;
        changeProtocolSettings(protocol);

        let youtubeEmbedFrontend = r.youtubeEmbedFrontend;
        youtubeEmbedFrontendElement.value = youtubeEmbedFrontend
        if (frontend == "freetube" || frontend == "yatte") {
            changeYoutubeEmbedFrontendsSettings(youtubeEmbedFrontend)
        };
    }
);


window.onblur = () => {
    youtubeHelper.initInvidiousCookies();
}
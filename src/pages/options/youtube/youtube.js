import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";



let youtubeFrontendElement = document.getElementById("youtube-frontend");
let invidiousDivElement = document.getElementById("invidious");
let pipedDivElement = document.getElementById("piped");
let pipedMaterialDivElement = document.getElementById("pipedMaterial");
let invidiousPipedPipedMaterialDivElement = document.getElementById("invidious-piped-pipedMaterial");
let freetubeYatteeDivElement = document.getElementById("freetube-yatte");
let customSettingsDivElement = document.getElementsByClassName("custom-settings");

function changeFrontendsSettings() {
    console.log('changeFrontendsSettings()');
    let frontend = youtubeFrontendElement.value;

    console.log("customSettingsDivElement", customSettingsDivElement[0].style.display);
    if (enableYoutubeCustomSettingsElement.checked)
        for (const item of customSettingsDivElement) item.style.display = 'block';
    else {
        console.log("setting it to none");
        for (const item of customSettingsDivElement) item.style.display = 'none';
    }

    if (frontend == 'invidious') {
        invidiousPipedPipedMaterialDivElement.style.display = 'block'
        invidiousDivElement.style.display = 'block';
        pipedDivElement.style.display = 'none';
        pipedMaterialDivElement.style.display = 'none';
        freetubeYatteeDivElement.style.display = 'none';
    }
    else if (frontend == 'piped') {
        invidiousPipedPipedMaterialDivElement.style.display = 'block'
        invidiousDivElement.style.display = 'none';
        pipedDivElement.style.display = 'block';
        pipedMaterialDivElement.style.display = 'none';
        freetubeYatteeDivElement.style.display = 'none';
    }
    else if (frontend == 'pipedMaterial') {
        invidiousPipedPipedMaterialDivElement.style.display = 'block'
        invidiousDivElement.style.display = 'none';
        pipedDivElement.style.display = 'none';
        pipedMaterialDivElement.style.display = 'block';
        freetubeYatteeDivElement.style.display = 'none';
    }
    else if (frontend == 'freetube' || frontend == 'yatte') {
        invidiousPipedPipedMaterialDivElement.style.display = 'none'
        invidiousDivElement.style.display = 'none';
        pipedDivElement.style.display = 'none';
        pipedMaterialDivElement.style.display = 'none';
        freetubeYatteeDivElement.style.display = 'block';
        changeYoutubeEmbedFrontendsSettings(youtubeHelper.getYoutubeEmbedFrontend());
    }
}

function changeYoutubeEmbedFrontendsSettings(youtubeEmbedFrontend) {
    if (youtubeEmbedFrontend == 'invidious') {
        invidiousPipedPipedMaterialDivElement.style.display = 'block'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'block';
    }
    if (youtubeEmbedFrontend == 'piped') {
        invidiousPipedPipedMaterialDivElement.style.display = 'block'
        pipedDivElement.style.display = 'block';
        invidiousDivElement.style.display = 'none';
    }
    else if (youtubeEmbedFrontend == 'youtube') {
        invidiousPipedPipedMaterialDivElement.style.display = 'none'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'none';
    }
}
youtubeFrontendElement.addEventListener("change",
    event => {
        let frontend = event.target.options[youtubeFrontendElement.selectedIndex].value
        youtubeHelper.setFrontend(frontend);
        changeFrontendsSettings();
    }
);

let youtubeEmbedFrontendElement = document.getElementById("youtube-embed-frontend");
youtubeEmbedFrontendElement.addEventListener("change",
    event => {
        let youtubeEmbedFrontend = event.target.options[youtubeEmbedFrontendElement.selectedIndex].value
        youtubeHelper.setYoutubeEmbedFrontend(youtubeEmbedFrontend);
        changeYoutubeEmbedFrontendsSettings(youtubeEmbedFrontend);
    }
);

let disableYoutubeElement = document.getElementById("disable-invidious");
disableYoutubeElement.addEventListener("change",
    event => youtubeHelper.setDisable(!event.target.checked)
);

let enableYoutubeCustomSettingsElement = document.getElementById("enable-youtube-custom-settings");
enableYoutubeCustomSettingsElement.addEventListener("change",
    event => {
        youtubeHelper.setEnableCustomSettings(event.target.checked)
        changeFrontendsSettings();
    }
);


let volumeElement = document.getElementById("invidious-volume");
let volumeValueElement = document.getElementById("volume-value");
volumeElement.addEventListener("input",
    () => {
        youtubeHelper.setVolume(volumeElement.value);
        volumeValueElement.textContent = `${volumeElement.value}%`;
    }
);

let autoplayElement = document.getElementById("invidious-autoplay");
autoplayElement.addEventListener("change",
    event => youtubeHelper.setAutoplay(event.target.checked)
);

let OnlyEmbeddedVideoElement = document.getElementById("only-embed");
OnlyEmbeddedVideoElement.addEventListener("change",
    event => youtubeHelper.setOnlyEmbeddedVideo(event.target.options[OnlyEmbeddedVideoElement.selectedIndex].value)
);

let bypassWatchOnYoutubeElement = document.getElementById("bypass-watch-on-youtube")
bypassWatchOnYoutubeElement.addEventListener("change",
    event => youtubeHelper.setBypassWatchOnYoutube(event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    event => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        youtubeHelper.setProtocol(protocol);
        changeProtocolSettings(protocol);
    }
);

function changeProtocolSettings(protocol) {
    let normalPipedDiv = document.getElementById("piped-normal");
    let torPipedDiv = document.getElementById("piped-tor");

    let normalPipedMaterialDiv = document.getElementById("pipedMaterial-normal");
    let torPipedMaterialDiv = document.getElementById("pipedMaterial-tor");

    let normalInvidiousDiv = document.getElementById("invidious-normal");
    let torInvidiousDiv = document.getElementById("invidious-tor");

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

youtubeHelper.init().then(() => {
    disableYoutubeElement.checked = !youtubeHelper.getDisable();
    enableYoutubeCustomSettingsElement.checked = youtubeHelper.getEnableCustomSettings();
    volumeElement.value = youtubeHelper.getVolume();
    volumeValueElement.textContent = `${youtubeHelper.getVolume()}%`;
    OnlyEmbeddedVideoElement.value = youtubeHelper.getOnlyEmbeddedVideo();
    bypassWatchOnYoutubeElement.checked = youtubeHelper.getBypassWatchOnYoutube();
    autoplayElement.value = youtubeHelper.getAutoplay();
    let frontend = youtubeHelper.getFrontend();
    youtubeFrontendElement.value = frontend;
    changeFrontendsSettings();

    let protocol = youtubeHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    let youtubeEmbedFrontend = youtubeHelper.getYoutubeEmbedFrontend()
    youtubeEmbedFrontendElement.value = youtubeEmbedFrontend
    if (frontend == "freetube" || frontend == "yatte") {
        changeYoutubeEmbedFrontendsSettings(youtubeEmbedFrontend)
    };
});

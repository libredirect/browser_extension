import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";

let disableYoutubeElement = document.getElementById("disable-invidious");

let youtubeFrontendElement = document.getElementById("youtube-frontend");
let invidiousDivElement = document.getElementById("invidious");
let pipedDivElement = document.getElementById("piped");
let pipedMaterialDivElement = document.getElementById("pipedMaterial");
let invidiousPipedDivElement = document.getElementById("invidious-piped");
let freetubeYatteeDivElement = document.getElementById("freetube-yatte");

function changeFrontendsSettings(frontend) {
    if (frontend == 'invidious') {
        invidiousPipedDivElement.style.display = 'block'
        invidiousDivElement.style.display = 'block';
        pipedDivElement.style.display = 'none';
        pipedMaterialDivElement.style.display = 'none';
        freetubeYatteeDivElement.style.display = 'none';
    }
    else if (frontend == 'piped') {
        invidiousPipedDivElement.style.display = 'block'
        invidiousDivElement.style.display = 'none';
        pipedDivElement.style.display = 'block';
        pipedMaterialDivElement.style.display = 'none';
        freetubeYatteeDivElement.style.display = 'none';
    }
    else if (frontend == 'piped') {
        invidiousPipedDivElement.style.display = 'block'
        invidiousDivElement.style.display = 'none';
        pipedDivElement.style.display = 'block';
        pipedMaterialDivElement.style.display = 'none';
        freetubeYatteeDivElement.style.display = 'none';
    }
    else if (frontend == 'pipedMaterial') {
        invidiousPipedDivElement.style.display = 'block'
        invidiousDivElement.style.display = 'none';
        pipedDivElement.style.display = 'none';
        pipedMaterialDivElement.style.display = 'block';
        freetubeYatteeDivElement.style.display = 'none';
    }
    else if (frontend == 'freetube' || frontend == 'yatte') {
        invidiousPipedDivElement.style.display = 'none'
        invidiousDivElement.style.display = 'none';
        pipedDivElement.style.display = 'none';
        pipedMaterialDivElement.style.display = 'none';
        freetubeYatteeDivElement.style.display = 'block';
        changeYoutubeEmbedFrontendsSettings(youtubeHelper.getYoutubeEmbedFrontend());
    }
}

function changeYoutubeEmbedFrontendsSettings(youtubeEmbedFrontend) {
    if (youtubeEmbedFrontend == 'invidious') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'block';
    }
    if (youtubeEmbedFrontend == 'piped') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'block';
        invidiousDivElement.style.display = 'none';
    }
    else if (youtubeEmbedFrontend == 'youtube') {
        invidiousPipedDivElement.style.display = 'none'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'none';
    }
}
youtubeFrontendElement.addEventListener("change",
    event => {
        let frontend = event.target.options[youtubeFrontendElement.selectedIndex].value
        youtubeHelper.setFrontend(frontend);
        changeFrontendsSettings(frontend);
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

disableYoutubeElement.addEventListener("change",
    event => youtubeHelper.setDisable(!event.target.checked)
);

let volumeElement = document.getElementById("invidious-volume");
let volumeValueElement = document.getElementById("volume-value");
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
    event => youtubeHelper.setAutoplay(event.target.options[autoplayElement.selectedIndex].value)
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
    volumeElement.value = youtubeHelper.getVolume();
    volumeValueElement.textContent = `${youtubeHelper.getVolume()}%`;
    OnlyEmbeddedVideoElement.value = youtubeHelper.getOnlyEmbeddedVideo();
    bypassWatchOnYoutubeElement.checked = youtubeHelper.getBypassWatchOnYoutube();
    autoplayElement.value = youtubeHelper.getAutoplay();
    let frontend = youtubeHelper.getFrontend();
    youtubeFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);

    let protocol = youtubeHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    let youtubeEmbedFrontend = youtubeHelper.getYoutubeEmbedFrontend()
    youtubeEmbedFrontendElement.value = youtubeEmbedFrontend
    if (frontend == "freetube" || frontend == "yatte") {
        changeYoutubeEmbedFrontendsSettings(youtubeEmbedFrontend)
    };
});

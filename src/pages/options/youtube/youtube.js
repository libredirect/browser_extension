import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";

let disableYoutubeElement = document.getElementById("disable-invidious");

let youtubeFrontendElement = document.getElementById("youtube-frontend");
let invidiousDivElement = document.getElementById("invidious");
let pipedDivElement = document.getElementById("piped");
let invidiousPipedDivElement = document.getElementById("invidious-piped");
let freetubeYatteDivElement = document.getElementById("freetube-yatte");




function changeFrontendsSettings(frontend) {
    if (frontend == 'piped') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'block';
        invidiousDivElement.style.display = 'none';
        freetubeYatteDivElement.style.display = 'none';
    }
    else if (frontend == 'invidious') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'block';
        freetubeYatteDivElement.style.display = 'none';
    }
    else if (frontend == 'freetube' || frontend == 'yatte') {
        invidiousPipedDivElement.style.display = 'none'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'none';
        freetubeYatteDivElement.style.display = 'block';
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

let themeElement = document.getElementById("invidious-theme");
themeElement.addEventListener("change",
    event => youtubeHelper.setTheme(event.target.options[themeElement.selectedIndex].value)
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

let alwaysUsePreferredElement = document.getElementById("always-use-preferred")
alwaysUsePreferredElement.addEventListener("change",
    event => youtubeHelper.setAlwaysusePreferred(event.target.checked)
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

    let normalInvidiousDiv = document.getElementById("invidious-normal");
    let torInvidiousDiv = document.getElementById("invidious-tor");
    if (protocol == 'normal') {
        normalPipedDiv.style.display = 'block';
        normalInvidiousDiv.style.display = 'block';
        torInvidiousDiv.style.display = 'none';
        torPipedDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalPipedDiv.style.display = 'none';
        normalInvidiousDiv.style.display = 'none';
        torInvidiousDiv.style.display = 'block';
        torPipedDiv.style.display = 'block';
    }
}

youtubeHelper.init().then(() => {
    disableYoutubeElement.checked = !youtubeHelper.getDisable();
    themeElement.checked = youtubeHelper.getTheme();
    volumeElement.value = youtubeHelper.getVolume();
    volumeValueElement.textContent = `${youtubeHelper.getVolume()}%`;
    OnlyEmbeddedVideoElement.value = youtubeHelper.getOnlyEmbeddedVideo();
    alwaysUsePreferredElement.checked = youtubeHelper.getAlwaysusePreferred();
    bypassWatchOnYoutubeElement.checked = youtubeHelper.getBypassWatchOnYoutube();
    autoplayElement.checked = youtubeHelper.getAutoplay();
    let frontend = youtubeHelper.getFrontend();
    youtubeFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);

    let protocol = youtubeHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    let youtubeEmbedFrontend = youtubeHelper.getYoutubeEmbedFrontend()
    youtubeEmbedFrontendElement.value = youtubeEmbedFrontend
    if (frontend == "freetube" || frontend == "yatte") {
        console.log("youtubeEmbedFrontend", youtubeEmbedFrontend);
        changeYoutubeEmbedFrontendsSettings(youtubeEmbedFrontend)
    };
});

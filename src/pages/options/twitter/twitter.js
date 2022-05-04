import twitterHelper from "../../../assets/javascripts/helpers/twitter.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableTwitterElement = document.getElementById("disable-nitter");
let customSettingsDivElement = document.getElementsByClassName("custom-settings");
let protocolElement = document.getElementById("protocol");
let enableYoutubeCustomSettingsElement = document.getElementById("enable-twitter-custom-settings");
let bypassWatchOnTwitterElement = document.getElementById("bypass-watch-on-twitter");

let theme = document.getElementById('nitter').getElementsByClassName("theme")[0];
let infiniteScroll = document.getElementById('nitter').getElementsByClassName("infiniteScroll")[0];
let stickyProfile = document.getElementById('nitter').getElementsByClassName('stickyProfile')[0];
let bidiSupport = document.getElementById('nitter').getElementsByClassName('bidiSupport')[0];
let hideTweetStats = document.getElementById('nitter').getElementsByClassName('hideTweetStats')[0];
let hideBanner = document.getElementById('nitter').getElementsByClassName('hideBanner')[0];
let hidePins = document.getElementById('nitter').getElementsByClassName('hidePins')[0];
let hideReplies = document.getElementById('nitter').getElementsByClassName('hideReplies')[0];
let squareAvatars = document.getElementById('nitter').getElementsByClassName('squareAvatars')[0];
let mp4Playback = document.getElementById('nitter').getElementsByClassName('mp4Playback')[0];
let hlsPlayback = document.getElementById('nitter').getElementsByClassName('hlsPlayback')[0];
let proxyVideos = document.getElementById('nitter').getElementsByClassName('proxyVideos')[0];
let muteVideos = document.getElementById('nitter').getElementsByClassName('muteVideos')[0];
let autoplayGifs = document.getElementById('nitter').getElementsByClassName('autoplayGifs')[0];
let nitterElement = document.getElementById("nitter");

browser.storage.local.get(
    [
        "disableTwitter",
        "twitterProtocol",
        "enableTwitterCustomSettings",
        "bypassWatchOnTwitter",
        "nitterTheme",
        "nitterInfiniteScroll",
        "nitterStickyProfile",
        "nitterBidiSupport",
        "nitterHideTweetStats",
        "nitterHideBanner",
        "nitterHidePins",
        "nitterHideReplies",
        "nitterSquareAvatars",
        "nitterMp4Playback",
        "nitterHlsPlayback",
        "nitterProxyVideos",
        "nitterMuteVideos",
        "nitterAutoplayGifs",
    ],
    r => {
        disableTwitterElement.checked = !r.disableTwitter;
        enableYoutubeCustomSettingsElement.checked = r.enableTwitterCustomSettings;
        bypassWatchOnTwitterElement.checked = r.bypassWatchOnTwitter;
        protocolElement.value = r.twitterProtocol;
        changeProtocolSettings(r.twitterProtocol);
        
        // Display
        theme.value = r.nitterTheme;
        infiniteScroll.checked = r.nitterInfiniteScroll;
        stickyProfile.checked = r.nitterStickyProfile;
        bidiSupport.checked = r.nitterBidiSupport;
        hideTweetStats.checked = r.nitterHideTweetStats;
        hideBanner.checked = r.nitterHideBanner;
        hidePins.checked = r.nitterHidePins;
        hideReplies.checked = r.nitterHideReplies;
        squareAvatars.checked = r.nitterSquareAvatars;
        
        // Media
        mp4Playback.checked = r.nitterMp4Playback;
        hlsPlayback.checked = r.nitterHlsPlayback;
        proxyVideos.checked = r.nitterProxyVideos;
        muteVideos.checked = r.nitterMuteVideos;
        autoplayGifs.checked = r.nitterAutoplayGifs;
    }
)

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableTwitter: !disableTwitterElement.checked,
        twitterProtocol: protocolElement.value,
        enableTwitterCustomSettings: enableYoutubeCustomSettingsElement.checked,
        bypassWatchOnTwitter: bypassWatchOnTwitterElement.checked,

        // Display
        nitterTheme: theme.value,
        nitterInfiniteScroll: infiniteScroll.checked,
        nitterStickyProfile: stickyProfile.checked,
        nitterBidiSupport: bidiSupport.checked,
        nitterHideTweetStats: hideTweetStats.checked,
        nitterHideBanner: hideBanner.checked,
        nitterHidePins: hidePins.checked,
        nitterHideReplies: hideReplies.checked,
        nitterSquareAvatars: squareAvatars.checked,

        // Media
        nitterMp4Playback: mp4Playback.checked,
        nitterHlsPlayback: hlsPlayback.checked,
        nitterProxyVideos: proxyVideos.checked,
        nitterMuteVideos: muteVideos.checked,
        nitterAutoplayGifs: autoplayGifs.checked,
    });
    init();
})

function changeProtocolSettings(protocol) {
    let normalDiv = nitterElement.getElementsByClassName("normal")[0];
    let torDiv = nitterElement.getElementsByClassName("tor")[0];
    if (protocol == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
    if (enableYoutubeCustomSettingsElement.checked)
        for (const item of customSettingsDivElement) item.style.display = 'block';
    else
        for (const item of customSettingsDivElement) item.style.display = 'none';
}

// commonHelper.processDefaultCustomInstances('nitter', 'normal', twitterHelper, document);
// commonHelper.processDefaultCustomInstances('nitter', 'tor', twitterHelper, document)
window.onblur = twitterHelper.initNitterCookies;

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await twitterHelper.init();
        let redirects = twitterHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.nitter.normal).then(r => {
            browser.storage.local.set({ nitterLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('nitter', 'normal', twitterHelper, document)
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
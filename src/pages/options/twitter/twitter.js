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
document.addEventListener("change", async _ => {
    twitterHelper.setDisable(!disableTwitterElement.checked)
    twitterHelper.setProtocol(protocolElement.value);
    twitterHelper.setEnableCustomSettings(enableYoutubeCustomSettingsElement.checked);
    twitterHelper.setBypassWatchOnTwitter(bypassWatchOnTwitterElement.checked);
    changeProtocolSettings(protocolElement.value);

    await twitterHelper.setSettings({
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

function init() {
    twitterHelper.init().then(() => {
        disableTwitterElement.checked = !twitterHelper.getDisable();
        enableYoutubeCustomSettingsElement.checked = twitterHelper.getEnableCustomSettings();
        bypassWatchOnTwitterElement.checked = twitterHelper.getBypassWatchOnTwitter();

        let protocol = twitterHelper.getProtocol();
        protocolElement.value = protocol;
        changeProtocolSettings(protocol);
        theme.value = twitterHelper.getTheme();
        infiniteScroll.checked = twitterHelper.getInfiniteScroll();
        stickyProfile.checked = twitterHelper.getStickyProfile();
        bidiSupport.checked = twitterHelper.getBidiSupport();
        hideTweetStats.checked = twitterHelper.getHideTweetStats();
        hideBanner.checked = twitterHelper.getHideBanner();
        hidePins.checked = twitterHelper.getHidePins();
        hideReplies.checked = twitterHelper.getHideReplies();
        squareAvatars.checked = twitterHelper.getSquareAvatars();
        mp4Playback.checked = twitterHelper.getMp4Playback();
        hlsPlayback.checked = twitterHelper.getHlsPlayback();
        proxyVideos.checked = twitterHelper.getProxyVideos();
        muteVideos.checked = twitterHelper.getMuteVideos();
        autoplayGifs.checked = twitterHelper.getAutoplayGifs();

        commonHelper.processDefaultCustomInstances(
            'nitter',
            'normal',
            twitterHelper,
            document,
            twitterHelper.getNitterNormalRedirectsChecks,
            twitterHelper.setNitterNormalRedirectsChecks,
            twitterHelper.getNitterNormalCustomRedirects,
            twitterHelper.setNitterNormalCustomRedirects
        )
        commonHelper.processDefaultCustomInstances(
            'nitter',
            'tor',
            twitterHelper,
            document,
            twitterHelper.getNitterTorRedirectsChecks,
            twitterHelper.setNitterTorRedirectsChecks,
            twitterHelper.getNitterTorCustomRedirects,
            twitterHelper.setNitterTorCustomRedirects
        )
    });
}
init();

import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let invidiousAlwaysProxyElement = document.getElementById("invidious-always-proxy");
invidiousAlwaysProxyElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousAlwaysProxy(event.target.options[invidiousAlwaysProxyElement.selectedIndex].value)
);

let invidiousPlayerStyleElement = document.getElementById("invidious-player-style");
invidiousPlayerStyleElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousPlayerStyle(event.target.options[invidiousPlayerStyleElement.selectedIndex].value)
);

let invidiousVideoQualityElement = document.getElementById("video-quality");
invidiousVideoQualityElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousVideoQuality(event.target.options[invidiousVideoQualityElement.selectedIndex].value)
);

let invidiousSubtitlesElement = document.getElementById("invidious-subtitles");
invidiousSubtitlesElement.addEventListener("change",
    () => youtubeHelper.setInvidiousSubtitles(invidiousSubtitlesElement.value)
);

// let persistInvidiousPrefsElement = document.getElementById("persist-invidious-prefs");
// persistInvidiousPrefsElement.addEventListener("change",
//     (event) => youtubeHelper.setPersistInvidiousPrefs(event.target.checked)
// );


youtubeHelper.init().then(() => {
    invidiousPlayerStyleElement.value = youtubeHelper.getInvidiousPlayerStyle();
    invidiousAlwaysProxyElement.value = youtubeHelper.getInvidiousAlwaysProxy();
    console.log("youtubeHelper.getInvidiousAlwaysProxy()", youtubeHelper.getInvidiousAlwaysProxy())
    invidiousVideoQualityElement.value = youtubeHelper.getInvidiousVideoQuality();
    invidiousSubtitlesElement.value = youtubeHelper.getInvidiousSubtitles();
    // persistInvidiousPrefsElement.checked = youtubeHelper.getPersistInvidiousPrefs();

    commonHelper.processDefaultCustomInstances(
        'invidious',
        'normal',
        youtubeHelper,
        document,
        youtubeHelper.getInvidiousNormalRedirectsChecks,
        youtubeHelper.setInvidiousNormalRedirectsChecks,
        youtubeHelper.getInvidiousNormalCustomRedirects,
        youtubeHelper.setInvidiousNormalCustomRedirects
    );

    commonHelper.processDefaultCustomInstances(
        'invidious',
        'tor',
        youtubeHelper,
        document,
        youtubeHelper.getInvidiousTorRedirectsChecks,
        youtubeHelper.setInvidiousTorRedirectsChecks,
        youtubeHelper.getInvidiousTorCustomRedirects,
        youtubeHelper.setInvidiousTorCustomRedirects
    );
});


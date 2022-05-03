window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "theme",
        "youtubeAutoplay",
        "youtubeVolume",
        "youtubeListen",

        "pipedDisableLBRY",
        "pipedProxyLBRY",
        "pipedSelectedSkip",
        "pipedSponsorblock",

        "pipedMaterialSkipToLastPoint",
    ],
    r => {
        let prefs = {};
        if (localStorage.getItem("PREFERENCES"))
            prefs = JSON.parse(localStorage.getItem("PREFERENCES"));

        if (r.theme == 'dark') prefs.darkMode = true;
        if (r.theme == 'light') prefs.darkMode = false;

        prefs.volume = r.youtubeVolume / 100;
        prefs.playerAutoplay = r.youtubeAutoplay;

        prefs.listen = r.youtubeListen;
        prefs.disableLBRY = r.pipedDisableLBRY;
        prefs.proxyLBRY = r.pipedProxyLBRY;
        prefs.sponsorblock = r.pipedSponsorblock;
        prefs.skipToLastPoint = r.pipedMaterialSkipToLastPoint;
        prefs.selectedSkip = r.pipedSelectedSkip;

        localStorage.setItem("PREFERENCES", JSON.stringify(prefs));
    }
)
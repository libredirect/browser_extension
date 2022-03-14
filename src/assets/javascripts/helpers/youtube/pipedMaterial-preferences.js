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
        let theme = r.theme ?? "dark";
        let youtubeAutoplay = r.youtubeAutoplay ?? false;
        let youtubeVolume = r.youtubeVolume ?? 100;
        let youtubeListen = r.youtubeListen ?? false;

        let pipedDisableLBRY = r.pipedDisableLBRY ?? false;
        let pipedProxyLBRY = r.pipedProxyLBRY ?? false;
        let pipedSelectedSkip = r.pipedSelectedSkip ?? [];
        let pipedSponsorblock = r.pipedSponsorblock ?? true;

        let pipedMaterialSkipToLastPoint = r.pipedMaterialSkipToLastPoint ?? true;

        let prefs = {};
        if (localStorage.getItem("PREFERENCES")) prefs = JSON.parse(localStorage.getItem("PREFERENCES"));

        if (theme == 'dark') prefs.darkMode = true;
        if (theme == 'light') prefs.darkMode = false;

        prefs.volume = youtubeVolume / 100;
        prefs.playerAutoplay = youtubeAutoplay;

        prefs.listen = youtubeListen;
        prefs.disableLBRY = pipedDisableLBRY;
        prefs.proxyLBRY = pipedProxyLBRY;
        prefs.sponsorblock = pipedSponsorblock;
        prefs.skipToLastPoint = pipedMaterialSkipToLastPoint;
        prefs.selectedSkip = pipedSelectedSkip;

        localStorage.setItem("PREFERENCES", JSON.stringify(prefs));
    }
)
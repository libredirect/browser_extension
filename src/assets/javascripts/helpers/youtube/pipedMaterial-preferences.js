window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "theme",
        "applyThemeToSites",
        "youtubeAutoplay",
    ],
    r => {
        let applyThemeToSites = r.applyThemeToSites ?? false;
        let theme = r.theme ?? "DEFAULT";
        let youtubeAutoplay = r.youtubeAutoplay ?? "DEFAULT";

        let prefs = {};
        if (localStorage.getItem("PREFERENCES")) prefs = JSON.parse(localStorage.getItem("PREFERENCES"));

        if (applyThemeToSites && theme == 'dark') prefs.darkMode = true;
        if (applyThemeToSites && theme == 'light') prefs.darkMode = false;

        if (youtubeAutoplay != "DEFAULT") prefs.playerAutoplay = youtubeAutoplay == 'true';

        console.log("prefs", JSON.stringify(prefs));

        localStorage.setItem("PREFERENCES", JSON.stringify(prefs));
    }
)

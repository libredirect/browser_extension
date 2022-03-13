window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "theme",
        "youtubeVolume",
        "youtubeAutoplay",
    ],
    r => {
        let theme = r.theme ?? "dark";
        let youtubeAutoplay = r.youtubeAutoplay ?? false;
        let youtubeVolume = r.youtubeVolume ?? 100;

        let prefs = {};
        if (localStorage.getItem("PREFERENCES")) prefs = JSON.parse(localStorage.getItem("PREFERENCES"));

        if (theme == 'dark') prefs.darkMode = true;
        if (theme == 'light') prefs.darkMode = false;

        prefs.playerAutoplay = youtubeAutoplay == 'true';
        prefs.volume = youtubeVolume / 100;

        localStorage.setItem("PREFERENCES", JSON.stringify(prefs));
    }
)

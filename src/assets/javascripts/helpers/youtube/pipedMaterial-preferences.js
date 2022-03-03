window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "youtubeTheme",
        "youtubeAutoplay"
    ],
    res => {
        let prefs = JSON.parse(
            decodeURIComponent(
                localStorage.getItem("PREFERENCES")
            )
        ) ?? {};
        let oldPrefs = { ...prefs };

        if (res.youtubeTheme == 'dark') prefs.darkMode = true;
        if (res.youtubeTheme == 'light') prefs.darkMode = false;

        if (res.youtubeAutoplay != "DEFAULT") prefs.playerAutoplay = res.youtubeAutoplay;

        if (oldPrefs != prefs) localStorage.setItem("PREFERENCES", encodeURIComponent(JSON.stringify(prefs)));
    }
)

window.onunload = () => localStorage.removeItem("PREFERENCES");
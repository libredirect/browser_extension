window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "theme",
        "youtubeAutoplay"
    ],
    res => {
        let prefs = JSON.parse(
            decodeURIComponent(
                localStorage.getItem("PREFERENCES")
            )
        ) ?? {};
        let oldPrefs = { ...prefs };

        if (res.theme == 'dark') prefs.darkMode = true;
        if (res.theme == 'light') prefs.darkMode = false;

        if (res.youtubeAutoplay != "DEFAULT") prefs.playerAutoplay = res.youtubeAutoplay;

        if (oldPrefs != prefs) localStorage.setItem("PREFERENCES", encodeURIComponent(JSON.stringify(prefs)));
    }
)

window.onunload = () => localStorage.removeItem("PREFERENCES");
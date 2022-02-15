
function getCookie() {
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf("PREFS=") == 0)
            return JSON.parse(
                decodeURIComponent(c.substring("PREFS=".length, c.length))
            );
    }
    return {};
}

browser.storage.sync.get(
    [
        "invidiousAlwaysProxy",
        "invidiousVideoQuality",
        "invidiousDarkMode",
        "OnlyEmbeddedVideo",
        "volume",
        "invidiousPlayerStyle",
        "invidiousSubtitles",
        "autoplay",
    ], (result) => {
        const prefs = getCookie();

        prefs.local = result.invidiousAlwaysProxy;
        prefs.quality = result.invidiousVideoQuality;
        prefs.dark_mode = result.invidiousDarkMode;
        prefs.volume = result.volume;
        prefs.player_style = result.invidiousPlayerStyle;
        prefs.subtitles = result.invidiousSubtitles;
        prefs.autoplay = result.autoplay;

        document.cookie = `PREFS=${encodeURIComponent(JSON.stringify(prefs))}`;
    }
)

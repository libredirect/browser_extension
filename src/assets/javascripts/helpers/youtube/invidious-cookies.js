
function getCookie() {
    for (const c of document.cookie.split(";")) {
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf("PREFS=") == 0)
            return JSON.parse(
                decodeURIComponent(c.substring("PREFS=".length, c.length))
            );
    }
    return {};
}

browser.storage.local.get(
    [
        "invidiousAlwaysProxy",
        "invidiousSubtitles",
        "invidiousPlayerStyle",
        "youtubeVolume",
        "youtubeAutoplay",
        "OnlyEmbeddedVideo",
        "youtubeTheme",
        "invidiousVideoQuality",
    ], (result) => {
        let prefs = getCookie();
        let changed = false;

        if (result.invidiousAlwaysProxy !== undefined && prefs.local !== result.invidiousAlwaysProxy) {
            prefs.local = result.invidiousAlwaysProxy;
            changed = true;
        }
        if (result.invidiousVideoQuality !== undefined && prefs.quality !== result.invidiousVideoQuality) {
            prefs.quality = result.invidiousVideoQuality;
            changed = true;
        }
        if (result.youtubeTheme !== undefined && prefs.dark_mode !== result.youtubeTheme) {
            prefs.dark_mode = result.youtubeTheme;
            changed = true;
        }
        if (result.youtubeVolume !== undefined && prefs.volume !== result.youtubeVolume) {
            prefs.volume = result.youtubeVolume;
            changed = true;
        }
        if (result.invidiousPlayerStyle !== undefined && prefs.player_style !== result.invidiousPlayerStyle) {
            prefs.player_style = result.invidiousPlayerStyle;
            changed = true;
        }
        if (result.invidiousSubtitles !== undefined && prefs.subtitles === result.invidiousSubtitles) {
            prefs.subtitles = result.invidiousSubtitles;
            changed = true;
        }
        if (result.youtubeAutoplay !== undefined && prefs.autoplay !== result.youtubeAutoplay) {
            prefs.autoplay = result.youtubeAutoplay;
            changed = true;
        }

        if (changed) document.cookie = `PREFS=${encodeURIComponent(JSON.stringify(prefs))}`;

    }
)

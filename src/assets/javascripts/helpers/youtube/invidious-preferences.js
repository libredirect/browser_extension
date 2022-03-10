window.browser = window.browser || window.chrome;

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
        "theme",
        "invidiousVideoQuality",
    ],
    r => {
    }
)

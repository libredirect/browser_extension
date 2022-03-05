window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "theme",
        "applyThemeToSites",

        "youtubeVolume",
        "youtubeAutoplay"
    ],
    r => {
        let applyThemeToSites = r.applyThemeToSites ?? false;

        if (
            applyThemeToSites &&
            r.theme != "DEFAULT" &&
            localStorage.getItem("theme") != r.theme
        )
            localStorage.setItem("theme", r.theme);

        if (
            r.youtubeVolume != "--" &&
            localStorage.getItem("volume") != r.youtubeVolume
        )
            localStorage.setItem("volume", r.youtubeVolume / 100);

        if (
            r.youtubeAutoplay != "DEFAULT" &&
            localStorage.getItem("playerAutoPlay") != r.youtubeAutoplay
        )
            localStorage.setItem("playerAutoPlay", r.youtubeAutoplay);
    }
)

window.onunload = () => {
    localStorage.removeItem("theme");
    localStorage.removeItem("volume");
    localStorage.removeItem("playerAutoPlay");
};

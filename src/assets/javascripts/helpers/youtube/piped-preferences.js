window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "youtubeTheme",
        "youtubeVolume",
        "youtubeAutoplay"
    ],
    res => {
        if (
            res.youtubeTheme != "DEFAULT" &&
            localStorage.getItem("theme") != res.youtubeTheme
        )
            localStorage.setItem("theme", res.youtubeTheme);

        if (
            res.youtubeVolume != "--" &&
            localStorage.getItem("volume") != res.youtubeVolume
        )
            localStorage.setItem("volume", res.youtubeVolume / 100);

        if (
            res.youtubeAutoplay != "DEFAULT" &&
            localStorage.getItem("playerAutoPlay") != res.youtubeAutoplay
        )
            localStorage.setItem("playerAutoPlay", res.youtubeAutoplay);
    }
)

window.onunload = () => {
    localStorage.removeItem("theme");
    localStorage.removeItem("volume");
    localStorage.removeItem("playerAutoPlay");
};

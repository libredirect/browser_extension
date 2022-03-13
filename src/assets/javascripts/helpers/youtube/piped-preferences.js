window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "theme",
        "youtubeVolume",
        "youtubeAutoplay"
    ],
    r => {
        let theme = r.theme ?? "dark";
        let youtubeAutoplay = r.youtubeAutoplay ?? false;
        let youtubeVolume = r.youtubeVolume ?? 100;

        localStorage.setItem("theme", theme);
        localStorage.setItem("volume", youtubeVolume / 100);
        localStorage.setItem("playerAutoPlay", youtubeAutoplay);
    }
)
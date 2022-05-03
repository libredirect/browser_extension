window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "youtubeVolume",
        "youtubeAutoplay",
        "youtubeListen",

        "pipedBufferGoal",
        "pipedComments",
        "pipedDisableLBRY",
        "pipedEnabledCodecs",
        "pipedHomepage",
        "pipedMinimizeDescription",
        "pipedProxyLBRY",
        "pipedQuality",
        "pipedRegion",
        "pipedSelectedSkip",
        "pipedSponsorblock",
        "pipedDdlTheme",
        "pipedWatchHistory",
    ],
    r => {
        localStorage.setItem("bufferGoal", r.pipedBufferGoal.toString());
        localStorage.setItem("comments", r.pipedComments);
        localStorage.setItem("disableLBRY", r.pipedDisableLBRY);
        localStorage.setItem("enabledCodecs", r.pipedEnabledCodecs);
        localStorage.setItem("homepage", r.pipedHomepage);
        localStorage.setItem("listen", r.youtubeListen);
        localStorage.setItem("minimizeDescription", r.pipedMinimizeDescription);
        localStorage.setItem("playerAutoPlay", r.youtubeAutoplay);
        localStorage.setItem("proxyLBRY", r.pipedProxyLBRY);
        localStorage.setItem("quality", r.pipedQuality);
        localStorage.setItem("region", r.pipedRegion);
        localStorage.setItem("selectedSkip", r.pipedSelectedSkip);
        localStorage.setItem("sponsorblock", r.pipedSponsorblock);
        localStorage.setItem("theme", r.pipedDdlTheme);
        localStorage.setItem("volume", r.youtubeVolume / 100);
        localStorage.setItem("watchHistory", r.pipedWatchHistory);
    }
)
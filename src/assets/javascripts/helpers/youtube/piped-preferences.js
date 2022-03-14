window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "theme",
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
        "pipedWatchHistory",
    ],
    r => {
        let theme = r.theme ?? "dark";
        let youtubeAutoplay = r.youtubeAutoplay ?? false;
        let youtubeVolume = r.youtubeVolume ?? 100;
        let youtubeListen = r.youtubeListen ?? false;

        let pipedBufferGoal = r.pipedBufferGoal ?? 10;
        let pipedComments = r.pipedComments ?? true;
        let pipedDisableLBRY = r.pipedDisableLBRY ?? false;
        let pipedEnabledCodecs = r.pipedEnabledCodecs ?? "av1,vp9,avc";
        let pipedHomepage = r.pipedHomepage ?? "trending";
        let pipedMinimizeDescription = r.pipedMinimizeDescription ?? false;
        let pipedProxyLBRY = r.pipedProxyLBRY ?? false;
        let pipedQuality = r.pipedQuality ?? 0;
        let pipedRegion = r.pipedRegion ?? "US";
        let pipedSelectedSkip = r.pipedSelectedSkip ?? [];
        let pipedSponsorblock = r.pipedSponsorblock ?? true;
        let pipedWatchHistory = r.pipedWatchHistory ?? false;

        localStorage.setItem("bufferGoal", pipedBufferGoal);
        localStorage.setItem("comments", pipedComments);
        localStorage.setItem("disableLBRY", pipedDisableLBRY);
        localStorage.setItem("enabledCodecs", pipedEnabledCodecs);
        localStorage.setItem("homepage", pipedHomepage);
        localStorage.setItem("listen", youtubeListen);
        localStorage.setItem("minimizeDescription", pipedMinimizeDescription);
        localStorage.setItem("playerAutoPlay", youtubeAutoplay);
        localStorage.setItem("proxyLBRY", pipedProxyLBRY);
        localStorage.setItem("quality", pipedQuality);
        localStorage.setItem("region", pipedRegion);
        localStorage.setItem("selectedSkip", pipedSelectedSkip);
        localStorage.setItem("sponsorblock", pipedSponsorblock);
        localStorage.setItem("theme", theme);
        localStorage.setItem("volume", youtubeVolume / 100);
        localStorage.setItem("watchHistory", pipedWatchHistory);
    }
)
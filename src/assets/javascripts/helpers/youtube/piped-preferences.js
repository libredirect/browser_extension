window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "piped_bufferGoal",
        "piped_comments",
        "piped_disableLBRY",
        "piped_enabledCodecs",
        "piped_homepage",
        "piped_listen",
        "piped_minimizeDescription",
        "piped_playerAutoPlay",
        "piped_proxyLBRY",
        "piped_quality",
        "piped_region",
        "piped_selectedSkip",
        "piped_sponsorblock",
        "piped_theme",
        "piped_volume",
        "piped_watchHistory",
    ],
    r => {
        localStorage.setItem("bufferGoal", r.piped_bufferGoal);
        localStorage.setItem("comments", r.piped_comments);
        localStorage.setItem("disableLBRY", r.piped_disableLBRY);
        localStorage.setItem("enabledCodecs", r.piped_enabledCodecs);
        localStorage.setItem("homepage", r.piped_homepage);
        localStorage.setItem("listen", r.piped_listen);
        localStorage.setItem("minimizeDescription", r.piped_minimizeDescription);
        localStorage.setItem("playerAutoPlay", r.piped_playerAutoPlay);
        localStorage.setItem("proxyLBRY", r.piped_proxyLBRY);
        localStorage.setItem("quality", r.piped_quality);
        localStorage.setItem("region", r.piped_region);
        localStorage.setItem("selectedSkip", r.piped_selectedSkip);
        localStorage.setItem("sponsorblock", r.piped_sponsorblock);
        localStorage.setItem("theme", r.piped_theme);
        localStorage.setItem("volume", r.piped_volume);
        localStorage.setItem("watchHistory", r.piped_watchHistory);
    }
)
window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "piped_bufferGoal",
        "piped_comments",
        "piped_disableLBRY",
        "piped_enabledCodecs",
        "piped_homepage",
        "piped_instance",
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
        if (r.piped_bufferGoal !== undefined) localStorage.setItem("bufferGoal", r.piped_bufferGoal);
        if (r.piped_comments !== undefined) localStorage.setItem("comments", r.piped_comments);
        if (r.piped_disableLBRY !== undefined) localStorage.setItem("disableLBRY", r.piped_disableLBRY);
        if (r.piped_hl !== undefined) localStorage.setItem("hl", r.piped_hl);
        if (r.piped_enabledCodecs !== undefined) localStorage.setItem("enabledCodecs", r.piped_enabledCodecs);
        if (r.piped_homepage !== undefined) localStorage.setItem("homepage", r.piped_homepage);
        if (r.piped_instance !== undefined) localStorage.setItem("instance", r.piped_instance);
        if (r.piped_listen !== undefined) localStorage.setItem("listen", r.piped_listen);
        if (r.piped_minimizeDescription !== undefined) localStorage.setItem("minimizeDescription", r.piped_minimizeDescription);
        if (r.piped_playerAutoPlay !== undefined) localStorage.setItem("playerAutoPlay", r.piped_playerAutoPlay);
        if (r.piped_proxyLBRY !== undefined) localStorage.setItem("proxyLBRY", r.piped_proxyLBRY);
        if (r.piped_quality !== undefined) localStorage.setItem("quality", r.piped_quality);
        if (r.piped_region !== undefined) localStorage.setItem("region", r.piped_region);
        if (r.piped_selectedSkip !== undefined) localStorage.setItem("selectedSkip", r.piped_selectedSkip);
        if (r.piped_sponsorblock !== undefined) localStorage.setItem("sponsorblock", r.piped_sponsorblock);
        if (r.piped_theme !== undefined) localStorage.setItem("theme", r.piped_theme);
        if (r.piped_volume !== undefined) localStorage.setItem("volume", r.piped_volume);
        if (r.piped_watchHistory !== undefined) localStorage.setItem("watchHistory", r.piped_watchHistory);

        window.close();
    }
)
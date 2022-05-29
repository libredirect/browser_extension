window.browser = window.browser || window.chrome;

browser.storage.local.set(
    {
        'piped_bufferGoal': localStorage.getItem("bufferGoal"),
        'piped_comments': localStorage.getItem("comments"),
        'piped_disableLBRY': localStorage.getItem("disableLBRY"),
        'piped_enabledCodecs': localStorage.getItem("enabledCodecs"),
        'piped_hl': localStorage.getItem("hl"),
        'piped_homepage': localStorage.getItem("homepage"),
        'piped_instance': localStorage.getItem("instance"),
        'piped_listen': localStorage.getItem("listen"),
        'piped_minimizeDescription': localStorage.getItem("minimizeDescription"),
        'piped_playerAutoPlay': localStorage.getItem("playerAutoPlay"),
        'piped_proxyLBRY': localStorage.getItem("proxyLBRY"),
        'piped_quality': localStorage.getItem("quality"),
        'piped_region': localStorage.getItem("region"),
        'piped_selectedSkip': localStorage.getItem("selectedSkip"),
        'piped_sponsorblock': localStorage.getItem("sponsorblock"),
        'piped_theme': localStorage.getItem("theme"),
        'piped_volume': localStorage.getItem("volume"),
        'piped_watchHistory': localStorage.getItem("watchHistory"),
    }
)

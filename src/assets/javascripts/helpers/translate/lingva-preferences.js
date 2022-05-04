window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "theme",
        "applyThemeToSites",
    ],
    r => {
        let applyThemeToSites = r.applyThemeToSites;
        let theme = r.theme;

        if (applyThemeToSites && theme != "DEFAULT") localStorage.setItem("chakra-ui-color-mode", r.theme);
    }
)
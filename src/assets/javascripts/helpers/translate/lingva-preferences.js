window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "theme",
        "applyThemeToSites",
    ],
    r => {
        let applyThemeToSites = r.applyThemeToSites ?? false;
        let theme = r.theme ?? "DEFAULT";

        if (applyThemeToSites && theme != "DEFAULT") localStorage.setItem("chakra-ui-color-mode", r.theme);
    }
)

window.onunload = () => {
    localStorage.removeItem("chakra-ui-color-mode");
};

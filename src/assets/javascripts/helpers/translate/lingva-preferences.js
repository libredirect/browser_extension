window.browser = window.browser || window.chrome;

browser.storage.local.get(
    [
        "theme",
    ],
    r => {
        let theme = r.theme;

        if (theme != "DEFAULT") localStorage.setItem("chakra-ui-color-mode", r.theme);
    }
)
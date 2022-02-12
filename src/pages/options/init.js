window.browser = window.browser || window.chrome;

function changeTheme() {
    browser.storage.sync.get("theme", (result) => {
        switch (result.theme) {
            case "dark-theme":
                document.body.classList.add("dark-theme");
                document.body.classList.remove("light-theme");
                break;
            case "light-theme":
                document.body.classList.add("light-theme");
                document.body.classList.remove("dark-theme");
                break;
            default:
                if (matchMedia("(prefers-color-scheme: light)").matches) {
                    document.body.classList.add("light-theme");
                    document.body.classList.remove("dark-theme");
                } else {
                    document.body.classList.add("dark-theme");
                    document.body.classList.remove("light-theme");
                }

        }
    })
}

changeTheme()

browser.storage.onChanged.addListener(changeTheme)

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeTheme)

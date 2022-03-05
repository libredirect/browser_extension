window.browser = window.browser || window.chrome;

function changeTheme() {
    browser.storage.local.get(
        "theme",
        result => {
            switch (result.theme) {
                case "dark":
                    document.body.classList.add("dark-theme");
                    document.body.classList.remove("light-theme");
                    break;
                case "light":
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
        }
    )
}

changeTheme()

browser.storage.onChanged.addListener(changeTheme)

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeTheme)

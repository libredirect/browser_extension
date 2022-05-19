window.browser = window.browser || window.chrome;

browser.storage.local.set(
    {
        'pipedMaterial_PREFERENCES': localStorage.getItem("PREFERENCES")
    }
)
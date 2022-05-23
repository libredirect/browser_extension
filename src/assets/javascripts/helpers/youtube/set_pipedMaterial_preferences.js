window.browser = window.browser || window.chrome;

browser.storage.local.get(
    "pipedMaterial_PREFERENCES",
    r => {
        if (r.pipedMaterial_PREFERENCES !== undefined) localStorage.setItem("PREFERENCES", r.pipedMaterial_PREFERENCES)

        window.close();
    }
)
browser.storage.sync.get(
    [
        "theme"
    ],
    (result) => {
        if (result.theme) document.body.classList.add(result.theme);
    }
)
"use strict";

let theme;
function setTheme(val) {
    theme = val;
    browser.storage.sync.set({ theme })
};

export default {
    exceptions,
    theme,
    setTheme,
}
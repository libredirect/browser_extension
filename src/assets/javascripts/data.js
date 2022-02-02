"use strict";

let exceptions;

function setExceptions(val) {
    exceptions = val;
    browser.storage.sync.set({ exceptions })
};

let theme;
function setTheme(val) {
    theme = val;
    browser.storage.sync.set({ theme })
};

export default {
    exceptions,
    theme,
    setTheme,
    setExceptions,
}
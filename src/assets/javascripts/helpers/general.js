"use strict";
window.browser = window.browser || window.chrome;

let alwaysUsePreferred;
const getAlwaysUsePreferred = () => alwaysUsePreferred;
function setAlwaysUsePreferred(val) {
    alwaysUsePreferred = val;
    browser.storage.local.set({ alwaysUsePreferred })
    console.log("alwaysUsePreferred: ", alwaysUsePreferred)
}

let exceptions = {
    "url": [],
    "regex": [],
};

const getExceptions = () => exceptions;
function setExceptions(val) {
    exceptions = val;
    browser.storage.local.set({ exceptions })
    console.log("exceptions: ", val)
}

function isException(url) {
    for (const item of exceptions.url) {
        console.log(item, `${url.protocol}//${url.host}`)
        if (item == `${url.protocol}//${url.host}`) return true;
    }
    for (const item of exceptions.regex)
        if (new RegExp(item).test(url.href)) return true;
    return false;
}

async function init() {
    return new Promise(
        resolve => browser.storage.local.get(
            [
                "exceptions",
                "alwaysUsePreferred"
            ],
            r => { // r = result
                if (r.exceptions) exceptions = r.exceptions;
                alwaysUsePreferred = r.alwaysUsePreferred ?? false;
                resolve();
            }
        )
    )
}

export default {
    getExceptions,
    setExceptions,

    getAlwaysUsePreferred,
    setAlwaysUsePreferred,

    isException,
    init,
}
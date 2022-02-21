"use strict";
window.browser = window.browser || window.chrome;


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

async function init() {
    return new Promise((resolve) => {
        browser.storage.local.get("exceptions", (result) => {
            if (result.exceptions) exceptions = result.exceptions;
            resolve();
        });
    })
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

export default {
    getExceptions,
    setExceptions,

    isException,
    init,
}
"use strict";

let exceptions = {
    "url": [],
    "regex": [],
};
const getExceptions = () => exceptions;
function setExceptions(val) {
    exceptions = val;
    browser.storage.sync.set({ exceptions })
    console.log("exceptions: ", val)
}

async function init() {
    let result = await browser.storage.sync.get("exceptions");
    if (result.exceptions) exceptions = result.exceptions;
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
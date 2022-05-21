"use strict";
window.browser = window.browser || window.chrome;

function isException(url) {
    return new Promise(resolve => {
        browser.storage.local.get(
            'exceptions',
            r => {
                for (const item of r.exceptions.url)
                    if (item == `${url.protocol}//${url.host}`) { resolve(true); return; }
                for (const item of r.exceptions.regex)
                    if (new RegExp(item).test(url.href)) { resolve(true); return; }
                resolve(false); return;
            }
        )
    })
}

function initDefaults() {
    return new Promise(async resolve => {
        await browser.storage.local.set({
            exceptions: {
                "url": [],
                "regex": [],
            },
            theme: "DEFAULT",
            popupFrontends: [
                "youtube",
                "twitter",
                "instagram",
                "tikTok",
                "imgur",
                "reddit",
                "search",
                "medium",
                "translate",
                "maps",
            ],
            autoRedirect: false,
        })
        resolve();
    })
}


const allPopupFrontends = [
    "youtube",
    "youtubeMusic",
    "twitter",
    "instagram",
    "tikTok",
    "imgur",
    "reddit",
    "search",
    "translate",
    "maps",
    "wikipedia",
    "medium",
    "peertube",
    "lbry",
    "sendTargets"
];


export default {
    isException,
    initDefaults,
    allPopupFrontends,
}

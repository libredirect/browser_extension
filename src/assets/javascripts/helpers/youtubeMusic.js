"use strict";

import commonHelper from './common.js'

window.browser = window.browser || window.chrome;

const targets = [
    /https?:\/\/music\.youtube\.com(\/.*|$)/,
];
let redirects = {
    "beatbump": {
        "normal": [
            "https://beatbump.ml"
        ],
        "tor": []
    },
};

const getRedirects = () => redirects;

function getCustomRedirects() {
    return {
        "beatbump": {
            "normal": [...beatbumpNormalRedirectsChecks, ...beatbumpNormalCustomRedirects]
        },
    };
};

function setYoutubeMusicRedirects(val) {
    redirects.beatbump = val;
    browser.storage.local.set({ youtubeMusicRedirects: redirects })
    console.log("youtubeMusicRedirects: ", val)
}

let beatbumpNormalRedirectsChecks;
const getBeatbumpNormalRedirectsChecks = () => beatbumpNormalRedirectsChecks;
function setBeatbumpNormalRedirectsChecks(val) {
    beatbumpNormalRedirectsChecks = val;
    browser.storage.local.set({ beatbumpNormalRedirectsChecks })
    console.log("beatbumpNormalRedirectsChecks: ", val)
}

let beatbumpNormalCustomRedirects = [];
const getBeatbumpNormalCustomRedirects = () => beatbumpNormalCustomRedirects;
function setBeatbumpNormalCustomRedirects(val) {
    beatbumpNormalCustomRedirects = val;
    browser.storage.local.set({ beatbumpNormalCustomRedirects })
    console.log("beatbumpNormalCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.local.set({ disableYoutubeMusic: disable })
    console.log("disableYoutubeMusic: ", disable)
}

function isYoutubeMusic(url, initiator) {
    if (disable) return false
    return targets.some((rx) => rx.test(url.href));
}

function redirect(url, type) {
    let instancesList = [...beatbumpNormalRedirectsChecks, ...beatbumpNormalCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    return `${randomInstance}${url.pathname}${url.search}`.replace("/watch?v=", "/listen?id=");
}

async function init() {
    return new Promise((resolve) => {
        console.log("Init music")
        browser.storage.local.get(
            [
                "disableYoutubeMusic",
                "youtubeMusicRedirects",

                "beatbumpNormalRedirectsChecks",
                "beatbumpNormalCustomRedirects",

                "youtubeMusicProtocol",
            ],
            (result) => {
                disable = result.disableYoutubeMusic ?? false;

                if (result.youtubeMusicRedirects) redirects = result.youtubeMusicRedirects;

                beatbumpNormalRedirectsChecks = result.beatbumpNormalRedirectsChecks ?? [...redirects.beatbump.normal];
                console.log("beatbumpNormalRedirectsChecks", beatbumpNormalRedirectsChecks)
                beatbumpNormalCustomRedirects = result.beatbumpNormalCustomRedirects ?? [];

                resolve();
            });
    });
}

export default {
    getRedirects,
    getCustomRedirects,
    setYoutubeMusicRedirects,

    redirect,
    isYoutubeMusic,

    getDisable,
    setDisable,

    getBeatbumpNormalRedirectsChecks,
    setBeatbumpNormalRedirectsChecks,

    getBeatbumpNormalCustomRedirects,
    setBeatbumpNormalCustomRedirects,

    init,
};

window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
    /^https?:\/\/(www\.|)tiktok\.com.*/
];

let redirects = {
    "proxiTok": {
        "normal": [
            "https://proxitok.herokuapp.com",
        ]
    }
}

const getRedirects = () => redirects;
const getCustomRedirects = function () {
    return {
        "proxiTok": {
            "normal": [...proxiTokRedirectsChecks, ...proxiTokCustomRedirects]
        },
    };
};

function setRedirects(val) {
    redirects.proxiTok = val;
    browser.storage.sync.set({ tiktokRedirects: redirects })
    console.log("tiktokRedirects: ", val)
    for (const item of proxiTokRedirectsChecks)
        if (!redirects.proxiTok.normal.includes(item)) {
            var index = proxiTokRedirectsChecks.indexOf(item);
            if (index !== -1) proxiTokRedirectsChecks.splice(index, 1);
        }
    setProxiTokRedirectsChecks(proxiTokRedirectsChecks);
}

let proxiTokRedirectsChecks;
const getProxiTokRedirectsChecks = () => proxiTokRedirectsChecks;
function setProxiTokRedirectsChecks(val) {
    proxiTokRedirectsChecks = val;
    browser.storage.sync.set({ proxiTokRedirectsChecks })
    console.log("proxiTokRedirectsChecks: ", val)
}

let proxiTokCustomRedirects = [];
const getProxiTokCustomRedirects = () => proxiTokCustomRedirects;
function setProxiTokCustomRedirects(val) {
    proxiTokCustomRedirects = val;
    browser.storage.sync.set({ proxiTokCustomRedirects })
    console.log("proxiTokCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.sync.set({ disableTiktok: disable })
}

function isTiktok(url, initiator) {
    if (disable) return false;
    if (initiator && ([...redirects.proxiTok.normal, ...proxiTokCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))) return false;
    return targets.some((rx) => rx.test(url.href));
}

function redirect(url, type) {
    // https://www.tiktok.com/@keysikaspol/video/7061265241887345946
    // https://www.tiktok.com/@keysikaspol

    if (type != "main_frame" && "sub_frame" && "xmlhttprequest") return null;

    let instancesList = [...proxiTokRedirectsChecks, ...proxiTokCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    let pathName = url.pathname.replace(new RegExp(/@.*\/(?=video)/), "");

    return `${randomInstance}${pathName}`;
}

async function init() {
    return new Promise((resolve) => {
        browser.storage.sync.get(
            [
                "disableTiktok",
                "tiktokRedirects",
                "proxiTokRedirectsChecks",
                "proxiTokCustomRedirects",
            ],
            (result) => {
                disable = result.disableTiktok ?? false;

                if (result.tiktokRedirects) redirects = result.tiktokRedirects;

                proxiTokRedirectsChecks = result.proxiTokRedirectsChecks ?? [...redirects.proxiTok.normal];
                proxiTokCustomRedirects = result.proxiTokCustomRedirects ?? [];

                resolve();
            }
        )
    })
}

export default {

    getRedirects,
    getCustomRedirects,
    setRedirects,

    getDisable,
    setDisable,

    getProxiTokRedirectsChecks,
    setProxiTokRedirectsChecks,

    getProxiTokCustomRedirects,
    setProxiTokCustomRedirects,

    redirect,
    isTiktok,
    init,
};

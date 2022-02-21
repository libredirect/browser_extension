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
            "normal": [...proxiTokNormalRedirectsChecks, ...proxiTokNormalCustomRedirects]
        },
    };
};

function setRedirects(val) {
    redirects.proxiTok = val;
    browser.storage.local.set({ tiktokRedirects: redirects })
    console.log("tiktokRedirects: ", val)
    for (const item of proxiTokNormalRedirectsChecks)
        if (!redirects.proxiTok.normal.includes(item)) {
            var index = proxiTokNormalRedirectsChecks.indexOf(item);
            if (index !== -1) proxiTokNormalRedirectsChecks.splice(index, 1);
        }
    setProxiTokNormalRedirectsChecks(proxiTokNormalRedirectsChecks);
}

let proxiTokNormalRedirectsChecks;
const getProxiTokNormalRedirectsChecks = () => proxiTokNormalRedirectsChecks;
function setProxiTokNormalRedirectsChecks(val) {
    proxiTokNormalRedirectsChecks = val;
    browser.storage.local.set({ proxiTokNormalRedirectsChecks })
    console.log("proxiTokNormalRedirectsChecks: ", val)
}

let proxiTokNormalCustomRedirects = [];
const getProxiTokNormalCustomRedirects = () => proxiTokNormalCustomRedirects;
function setProxiTokNormalCustomRedirects(val) {
    proxiTokNormalCustomRedirects = val;
    browser.storage.local.set({ proxiTokNormalCustomRedirects })
    console.log("proxiTokNormalCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.local.set({ disableTiktok: disable })
}

function isTiktok(url, initiator) {
    if (disable) return false;
    if (initiator && ([...redirects.proxiTok.normal, ...proxiTokNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))) return false;
    return targets.some((rx) => rx.test(url.href));
}

function redirect(url, type) {
    // https://www.tiktok.com/@keysikaspol/video/7061265241887345946
    // https://www.tiktok.com/@keysikaspol

    if (type != "main_frame" && "sub_frame" && "xmlhttprequest") return null;

    let instancesList = [...proxiTokNormalRedirectsChecks, ...proxiTokNormalCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    let pathName = url.pathname.replace(new RegExp(/@.*\/(?=video)/), "");

    return `${randomInstance}${pathName}`;
}

async function init() {
    return new Promise((resolve) => {
        browser.storage.local.get(
            [
                "disableTiktok",
                "tiktokRedirects",
                "proxiTokNormalRedirectsChecks",
                "proxiTokNormalCustomRedirects",
            ],
            (result) => {
                disable = result.disableTiktok ?? false;

                if (result.tiktokRedirects) redirects = result.tiktokRedirects;

                proxiTokNormalRedirectsChecks = result.proxiTokNormalRedirectsChecks ?? [...redirects.proxiTok.normal];
                proxiTokNormalCustomRedirects = result.proxiTokNormalCustomRedirects ?? [];

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

    getProxiTokNormalRedirectsChecks,
    setProxiTokNormalRedirectsChecks,

    getProxiTokNormalCustomRedirects,
    setProxiTokNormalCustomRedirects,

    redirect,
    isTiktok,
    init,
};

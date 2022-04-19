window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
    /^https?:\/{2}(www\.|)tiktok\.com.*/
];

let redirects = {
    "proxiTok": {
        "normal": [],
        "tor": []
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

    for (const item of proxiTokTorRedirectsChecks)
        if (!redirects.proxiTok.normal.includes(item)) {
            var index = proxiTokTorRedirectsChecks.indexOf(item);
            if (index !== -1) proxiTokTorRedirectsChecks.splice(index, 1);
        }
    setProxiTokTorRedirectsChecks(proxiTokTorRedirectsChecks);
}

let proxiTokNormalRedirectsChecks;
const getProxiTokNormalRedirectsChecks = () => proxiTokNormalRedirectsChecks;
function setProxiTokNormalRedirectsChecks(val) {
    proxiTokNormalRedirectsChecks = val;
    browser.storage.local.set({ proxiTokNormalRedirectsChecks })
    console.log("proxiTokNormalRedirectsChecks: ", val)
}

let proxiTokTorRedirectsChecks;
const getProxiTokTorRedirectsChecks = () => proxiTokTorRedirectsChecks;
function setProxiTokTorRedirectsChecks(val) {
    proxiTokTorRedirectsChecks = val;
    browser.storage.local.set({ proxiTokTorRedirectsChecks })
    console.log("proxiTokTorRedirectsChecks: ", val)
}

let proxiTokNormalCustomRedirects = [];
const getProxiTokNormalCustomRedirects = () => proxiTokNormalCustomRedirects;
function setProxiTokNormalCustomRedirects(val) {
    proxiTokNormalCustomRedirects = val;
    browser.storage.local.set({ proxiTokNormalCustomRedirects })
    console.log("proxiTokNormalCustomRedirects: ", val)
}

let proxiTokTorCustomRedirects = [];
const getProxiTokTorCustomRedirects = () => proxiTokTorCustomRedirects;
function setProxiTokTorCustomRedirects(val) {
    proxiTokTorCustomRedirects = val;
    browser.storage.local.set({ proxiTokTorCustomRedirects })
    console.log("proxiTokTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.local.set({ disableTiktok: disable })
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
    protocol = val;
    browser.storage.local.set({ tiktokProtocol: val })
    console.log("tiktokProtocol: ", val)
}

function isTiktok(url, initiator) {
    if (disable) return false;
    if (initiator && ([...redirects.proxiTok.normal, ...proxiTokNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))) return false;
    return targets.some(rx => rx.test(url.href));
}

function redirect(url, type) {
    // https://www.tiktok.com/@keysikaspol/video/7061265241887345946?for_redirection=@keysikaspol
    // https://proxitok.pussthecat.org/video/7061265241887345946
    // https://www.tiktok.com/@keysikaspol
    // https://proxitok.herokuapp.com/video/7061265241887345946

    if (type != "main_frame") return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...proxiTokNormalRedirectsChecks, ...proxiTokNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...proxiTokTorRedirectsChecks, ...proxiTokTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    let pathName = url.pathname.replace(/@.*\/(?=video)/, "");

    return `${randomInstance}${url.pathname}`;
}

function reverse(url) {
    let protocolHost = commonHelper.protocolHost(url);
    if (
        ![...redirects.proxiTok.normal,
        ...redirects.proxiTok.tor,
        ...proxiTokNormalCustomRedirects,
        ...proxiTokTorCustomRedirects].includes(protocolHost)
    ) return;

    return `https://tiktok.com${url.pathname}${url.search}`;
}

async function init() {
    return new Promise(resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(data => {
            let dataJson = JSON.parse(data);
            browser.storage.local.get(
                [
                    "disableTiktok",
                    "tiktokRedirects",

                    "proxiTokNormalRedirectsChecks",
                    "proxiTokNormalCustomRedirects",

                    "proxiTokTorRedirectsChecks",
                    "proxiTokTorCustomRedirects",

                    "tiktokProtocol"
                ],
                r => {
                    redirects.proxiTok = dataJson.proxiTok;
                    disable = r.disableTiktok ?? false;

                    protocol = r.tiktokProtocol ?? "normal";

                    if (r.tiktokRedirects) redirects = r.tiktokRedirects;

                    proxiTokNormalRedirectsChecks = r.proxiTokNormalRedirectsChecks ?? [...redirects.proxiTok.normal];
                    proxiTokNormalCustomRedirects = r.proxiTokNormalCustomRedirects ?? [];

                    proxiTokTorRedirectsChecks = r.proxiTokTorRedirectsChecks ?? [...redirects.proxiTok.tor];
                    proxiTokTorCustomRedirects = r.proxiTokTorCustomRedirects ?? [];

                    resolve();
                }
            )
        });
    });
}

export default {

    getRedirects,
    getCustomRedirects,
    setRedirects,

    getDisable,
    setDisable,

    reverse,

    getProtocol,
    setProtocol,

    getProxiTokNormalRedirectsChecks,
    setProxiTokNormalRedirectsChecks,
    getProxiTokTorRedirectsChecks,
    setProxiTokTorRedirectsChecks,

    getProxiTokTorCustomRedirects,
    setProxiTokTorCustomRedirects,
    getProxiTokNormalCustomRedirects,
    setProxiTokNormalCustomRedirects,

    redirect,
    isTiktok,
    init,
};

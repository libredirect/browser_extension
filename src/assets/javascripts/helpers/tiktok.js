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
let enableCustom;

let theme;
let api_legacy;

function initProxiTokCookies() {
    console.log('initProxiTokCookies')
    if (enableCustom) {
        let checkedInstances = [
            ...proxiTokNormalRedirectsChecks,
            ...proxiTokNormalCustomRedirects,
            ...proxiTokTorRedirectsChecks,
            ...proxiTokTorCustomRedirects
        ]

        for (const instance of checkedInstances) {
            browser.cookies.set({ url: instance, name: "theme", value: theme })
            browser.cookies.set({ url: instance, name: "api-legacy", value: api_legacy ? 'on' : 'off' })
        }
    }
}

function redirect(url, type, initiator) {
    if (disable) return;
    if (initiator &&
        (
            [
                ...redirects.proxiTok.normal,
                ...proxiTokNormalCustomRedirects
            ].includes(initiator.origin) ||
            targets.includes(initiator.host)
        )
    ) return;
    if (!targets.some(rx => rx.test(url.href))) return;
    // https://www.tiktok.com/@keysikaspol/video/7061265241887345946
    // https://www.tiktok.com/@keysikaspol


    if (type != "main_frame") return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...proxiTokNormalRedirectsChecks, ...proxiTokNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...proxiTokTorRedirectsChecks, ...proxiTokTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

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

async function initDefaults() {
    return new Promise(async resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(async data => {
            let dataJson = JSON.parse(data);
            redirects.proxiTok = dataJson.proxiTok;
            await browser.storage.local.set({
                disableTiktok: false,
                tiktokProtocol: "normal",

                tiktokRedirects: {
                    'proxiTok': redirects.proxiTok,
                },

                proxiTokNormalRedirectsChecks: [...redirects.proxiTok.normal],
                proxiTokNormalCustomRedirects: [],

                proxiTokTorRedirectsChecks: [...redirects.proxiTok.tor],
                proxiTokTorCustomRedirects: [],

                enableTiktokCustomSettings: false,

                proxiTokTheme: 'default',
                proxiTokApiLegacy: 'off',

            });
            resolve();
        });
    })
}

async function init() {
    return new Promise(resolve => {
        console.log('redirects', redirects)
        browser.storage.local.get(
            [
                "disableTiktok",
                "tiktokProtocol",
                "tiktokRedirects",

                "proxiTokNormalRedirectsChecks",
                "proxiTokNormalCustomRedirects",

                "proxiTokTorRedirectsChecks",
                "proxiTokTorCustomRedirects",

                "enableTiktokCustomSettings",

                "proxiTokTheme",
                "proxiTokApiLegacy",
            ],
            r => {
                disable = r.disableTiktok;
                protocol = r.tiktokProtocol;
                redirects = r.tiktokRedirects;

                proxiTokNormalRedirectsChecks = r.proxiTokNormalRedirectsChecks;
                proxiTokNormalCustomRedirects = r.proxiTokNormalCustomRedirects;

                proxiTokTorRedirectsChecks = r.proxiTokTorRedirectsChecks;
                proxiTokTorCustomRedirects = r.proxiTokTorCustomRedirects;

                enableCustom = r.enableTiktokCustomSettings;

                theme = r.proxiTokTheme;
                api_legacy = r.proxiTokApiLegacy;

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

    reverse,

    getProxiTokNormalRedirectsChecks,
    setProxiTokNormalRedirectsChecks,
    getProxiTokTorRedirectsChecks,
    setProxiTokTorRedirectsChecks,

    getProxiTokTorCustomRedirects,
    setProxiTokTorCustomRedirects,
    getProxiTokNormalCustomRedirects,
    setProxiTokNormalCustomRedirects,

    initProxiTokCookies,

    redirect,
    initDefaults,
    init,
};

window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = [
    /^https?:\/{2}(www\.|)tiktok\.com.*/
];

const frontends = new Array("proxiTok")
const protocols = new Array("normal", "tor", "i2p", "loki")

let redirects = {}

for (let i = 0; i < frontends.length; i++) {
    redirects[frontends[i]] = {}
    for (let x = 0; x < protocols.length; x++) {
        redirects[frontends[i]][protocols[x]] = []
    }
}

function setRedirects(val) {
    browser.storage.local.get('cloudflareBlackList', r => {
        redirects.proxiTok = val;
        proxiTokNormalRedirectsChecks = [...redirects.proxiTok.normal];
        for (const instance of r.cloudflareBlackList) {
            const a = proxiTokNormalRedirectsChecks.indexOf(instance);
            if (a > -1) proxiTokNormalRedirectsChecks.splice(a, 1);
        }
        browser.storage.local.set({
            tiktokRedirects: redirects,
            proxiTokNormalRedirectsChecks
        })
    })
}

function initProxiTokCookies(test, from) {
    return new Promise(async resolve => {
        await init();
        let protocolHost = utils.protocolHost(from);
        if (![
            ...proxiTokNormalRedirectsChecks,
            ...proxiTokNormalCustomRedirects,
            ...proxiTokTorRedirectsChecks,
            ...proxiTokTorCustomRedirects,
            ...proxiTokI2pCustomRedirects,
            ...proxiTokLokiCustomRedirects,
        ].includes(protocolHost)) resolve();

        if (!test) {
            let checkedInstances = [];
            if (protocol == 'loki') checkedInstances = [...proxiTokI2pCustomRedirects];
            else if (protocol == 'i2p') checkedInstances = [...proxiTokLokiCustomRedirects];
            else if (protocol == 'tor') checkedInstances = [...proxiTokTorRedirectsChecks, ...proxiTokTorCustomRedirects];
            if ((checkedInstances.length === 0 && protocolFallback) || protocol == 'normal') {
                checkedInstances = [...proxiTokNormalRedirectsChecks, ...proxiTokNormalCustomRedirects];
            }
            await utils.copyCookie('proxitok', from, checkedInstances, 'theme');
            await utils.copyCookie('proxitok', from, checkedInstances, 'api-legacy');
        }
        resolve(true);
    })
}

function pasteProxiTokCookies() {
    return new Promise(async resolve => {
        await init();
        if (disableTiktok || protocol === undefined) { resolve(); return; }
        let checkedInstances = [];
        if (protocol == 'loki') checkedInstances = [...proxiTokI2pCustomRedirects];
        else if (protocol == 'i2p') checkedInstances = [...proxiTokLokiCustomRedirects];
        else if (protocol == 'tor') checkedInstances = [...proxiTokTorRedirectsChecks, ...proxiTokTorCustomRedirects];
        if ((checkedInstances.length === 0 && protocolFallback) || protocol == 'normal') {
            checkedInstances = [...proxiTokNormalRedirectsChecks, ...proxiTokNormalCustomRedirects];
        }
        utils.getCookiesFromStorage('proxitok', checkedInstances, 'theme');
        utils.getCookiesFromStorage('proxitok', checkedInstances, 'api-legacy');
        resolve();
    })
}

let
    disableTiktok,
    protocol,
    protocolFallback,
    tiktokRedirects,
    proxiTokNormalRedirectsChecks,
    proxiTokNormalCustomRedirects,
    proxiTokTorRedirectsChecks,
    proxiTokTorCustomRedirects,
    proxiTokI2pCustomRedirects,
    proxiTokLokiCustomRedirects;

function init() {
    return new Promise(async resolve => {
        browser.storage.local.get(
            [
                "disableTiktok",
                "protocol",
                "protocolFallback",
                "tiktokRedirects",
                "proxiTokNormalRedirectsChecks",
                "proxiTokNormalCustomRedirects",
                "proxiTokTorRedirectsChecks",
                "proxiTokTorCustomRedirects",
                "proxiTokI2pCustomRedirects",
                "proxiTokLokiCustomRedirects"
            ],
            r => {
                disableTiktok = r.disableTiktok;
                protocol = r.protocol;
                protocolFallback = r.protocolFallback;
                tiktokRedirects = r.tiktokRedirects;
                proxiTokNormalRedirectsChecks = r.proxiTokNormalRedirectsChecks;
                proxiTokNormalCustomRedirects = r.proxiTokNormalCustomRedirects;
                proxiTokTorRedirectsChecks = r.proxiTokTorRedirectsChecks;
                proxiTokTorCustomRedirects = r.proxiTokTorCustomRedirects;
                proxiTokI2pCustomRedirects = r.proxiTokI2pCustomRedirects;
                proxiTokLokiCustomRedirects = r.proxiTokLokiCustomRedirects;
                resolve();
            }
        )
    })
}

init();
browser.storage.onChanged.addListener(init)

// https://www.tiktok.com/@keysikaspol/video/7061265241887345946
// https://www.tiktok.com/@keysikaspol
function redirect(url, type, initiator, disableOverride) {
    if (disableTiktok && !disableOverride) return;
    if (type != "main_frame") return;
    const all = [
        ...tiktokRedirects.proxiTok.normal,
        ...proxiTokNormalCustomRedirects
    ];
    if (initiator && (all.includes(initiator.origin) || targets.includes(initiator.host))) return;
    if (!targets.some(rx => rx.test(url.href))) return;

    let instancesList = [];
    if (protocol == 'loki') instancesList = [...proxiTokI2pCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...proxiTokLokiCustomRedirects];
    else if (protocol == 'tor') instancesList = [...proxiTokTorRedirectsChecks, ...proxiTokTorCustomRedirects];
    if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
        instancesList = [...proxiTokNormalRedirectsChecks, ...proxiTokNormalCustomRedirects];
    }
    if (instancesList.length === 0) return;

    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}`;
}

function reverse(url) {
    return new Promise(async resolve => {
        await init();
        let protocolHost = utils.protocolHost(url);
        const all = [
            ...tiktokRedirects.proxiTok.normal,
            ...tiktokRedirects.proxiTok.tor,
            ...proxiTokNormalCustomRedirects,
            ...proxiTokTorCustomRedirects,
            ...proxiTokI2pCustomRedirects,
            ...proxiTokLokiCustomRedirects
        ];
        if (!all.includes(protocolHost)) { resolve(); return; }

        resolve(`https://tiktok.com${url.pathname}${url.search}`);
    })
}

function switchInstance(url, disableOverride) {
    return new Promise(async resolve => {
        await init();
        if (disableTiktok && !disableOverride) { resolve(); return; }
        let protocolHost = utils.protocolHost(url);
        const all = [
            ...tiktokRedirects.proxiTok.tor,
            ...tiktokRedirects.proxiTok.normal,

            ...proxiTokNormalCustomRedirects,
            ...proxiTokTorCustomRedirects,
            ...proxiTokI2pCustomRedirects,
            ...proxiTokLokiCustomRedirects
        ];
        if (!all.includes(protocolHost)) { resolve(); return; }

        let instancesList = [];
        if (protocol == 'loki') instancesList = [...proxiTokI2pCustomRedirects];
        else if (protocol == 'i2p') instancesList = [...proxiTokLokiCustomRedirects];
        else if (protocol == 'tor') instancesList = [...proxiTokTorRedirectsChecks, ...proxiTokTorCustomRedirects];
        if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
            instancesList = [...proxiTokNormalRedirectsChecks, ...proxiTokNormalCustomRedirects];
        }

        const i = instancesList.indexOf(protocolHost);
        if (i > -1) instancesList.splice(i, 1);
        if (instancesList.length === 0) { resolve(); return; }

        const randomInstance = utils.getRandomInstance(instancesList);
        resolve(`${randomInstance}${url.pathname}${url.search}`);
    })
}

function initDefaults() {
    return new Promise(async resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(async data => {
            let dataJson = JSON.parse(data);
            for (let i = 0; i < frontends.length; i++) {
            redirects[frontends[i]] = dataJson[frontends[i]]
            }
            browser.storage.local.set({
                disableTiktok: false,

                tiktokRedirects: redirects,

                proxiTokNormalRedirectsChecks: [...redirects.proxiTok.normal],
                proxiTokNormalCustomRedirects: [],

                proxiTokTorRedirectsChecks: [...redirects.proxiTok.tor],
                proxiTokTorCustomRedirects: [],

                proxiTokI2pRedirectsChecks: [...redirects.proxiTok.i2p],
                proxiTokI2pCustomRedirects: [],

                proxiTokLokiRedirectsChecks: [...redirects.proxiTok.loki],
                proxiTokLokiCustomRedirects: []
            }, () => resolve());
        });
    })
}

export default {
    setRedirects,

    redirect,
    reverse,
    switchInstance,

    initProxiTokCookies,
    pasteProxiTokCookies,

    initDefaults
};

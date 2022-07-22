window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = [
    /^https?:\/{2}(?:www\.|)imdb\.com.*/
];

const frontends = new Array("libremdb")
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
        redirects.libremdb = val;
        libremdbNormalRedirectsChecks = [...redirects.libremdb.normal];
        for (const instance of r.cloudflareBlackList) {
            const a = libremdbNormalRedirectsChecks.indexOf(instance);
            if (a > -1) libremdbNormalRedirectsChecks.splice(a, 1);
        }
        browser.storage.local.set({
            imdbRedirects: redirects,
            libremdbNormalRedirectsChecks
        })
    })
}

let
    disableImdb,
    protocol,
    protocolFallback,
    imdbRedirects,
    libremdbNormalRedirectsChecks,
    libremdbNormalCustomRedirects,
    libremdbTorRedirectsChecks,
    libremdbTorCustomRedirects,
    libremdbI2pCustomRedirects,
    libremdbLokiCustomRedirects;

function init() {
    return new Promise(async resolve => {
        browser.storage.local.get(
            [
                "disableImdb",
                "protocol",
                "protocolFallback",
                "imdbRedirects",
                "libremdbNormalRedirectsChecks",
                "libremdbNormalCustomRedirects",
                "libremdbTorRedirectsChecks",
                "libremdbTorCustomRedirects",
                "libremdbI2pCustomRedirects",
                "libremdbLokiCustomRedirects"
            ],
            r => {
                disableImdb = r.disableImdb;
                protocol = r.protocol;
                protocolFallback = r.protocolFallback;
                imdbRedirects = r.imdbRedirects;
                libremdbNormalRedirectsChecks = r.libremdbNormalRedirectsChecks;
                libremdbNormalCustomRedirects = r.libremdbNormalCustomRedirects;
                libremdbTorRedirectsChecks = r.libremdbTorRedirectsChecks;
                libremdbTorCustomRedirects = r.libremdbTorCustomRedirects;
                libremdbI2pCustomRedirects = r.libremdbI2pCustomRedirects;
                libremdbLokiCustomRedirects = r.libremdbLokiCustomRedirects;
                resolve();
            }
        )
    })
}

init();
browser.storage.onChanged.addListener(init)

function redirect(url, type, initiator, disableOverride) {
    if (disableImdb && !disableOverride) return;
    if (url.pathname == "/") return;
    if (type != "main_frame") return;
    const all = [
        ...imdbRedirects.libremdb.normal,
        ...libremdbNormalCustomRedirects
    ];
    if (initiator && (all.includes(initiator.origin) || targets.includes(initiator.host))) return;
    if (!targets.some(rx => rx.test(url.href))) return;

    let instancesList = [];
    if (protocol == 'loki') instancesList = [...libremdbLokiCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...libremdbI2pCustomRedirects];
    else if (protocol == 'tor') instancesList = [...libremdbTorRedirectsChecks, ...libremdbTorCustomRedirects];
    if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
        instancesList = [...libremdbNormalRedirectsChecks, ...libremdbNormalCustomRedirects];
    }
    if (instancesList.length === 0) { return; }

    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}`;
}

function reverse(url) {
    return new Promise(async resolve => {
        await init();
        let protocolHost = utils.protocolHost(url);
        const all = [
            ...imdbRedirects.libremdb.normal,
            ...imdbRedirects.libremdb.tor,
            ...libremdbNormalCustomRedirects,
            ...libremdbTorCustomRedirects,
            ...libremdbI2pCustomRedirects,
            ...libremdbLokiCustomRedirects
        ];
        if (!all.includes(protocolHost)) { resolve(); return; }

        resolve(`https://imdb.com${url.pathname}${url.search}`);
    })
}

function switchInstance(url, disableOverride) {
    return new Promise(async resolve => {
        await init();
        if (disableImdb && !disableOverride) { resolve(); return; }
        let protocolHost = utils.protocolHost(url);
        const all = [
            ...imdbRedirects.libremdb.tor,
            ...imdbRedirects.libremdb.normal,

            ...libremdbNormalCustomRedirects,
            ...libremdbTorCustomRedirects,
            ...libremdbI2pCustomRedirects,
            ...libremdbLokiCustomRedirects
        ];
        if (!all.includes(protocolHost)) { resolve(); return; }

        let instancesList = [];
        if (protocol == 'loki') instancesList = [...libremdbLokiCustomRedirects];
        else if (protocol == 'i2p') instancesList = [...libremdbI2pCustomRedirects];
        else if (protocol == 'tor') instancesList = [...libremdbTorRedirectsChecks, ...libremdbTorCustomRedirects];
        if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
            instancesList = [...libremdbNormalRedirectsChecks, ...libremdbNormalCustomRedirects];
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
                disableImdb: true,
                imdbRedirects: redirects,

                libremdbNormalRedirectsChecks: [...redirects.libremdb.normal],
                libremdbNormalCustomRedirects: [],

                libremdbTorRedirectsChecks: [...redirects.libremdb.tor],
                libremdbTorCustomRedirects: [],

                libremdbI2pCustomRedirects: [],

                libremdbLokiCustomRedirects: []
            }, () => resolve());
        });
    })
}

export default {
    setRedirects,

    redirect,
    reverse,
    switchInstance,

    initDefaults
};

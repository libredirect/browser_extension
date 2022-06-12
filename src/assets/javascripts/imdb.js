window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = [
    /^https?:\/{2}(www\.|)imdb\.com.*/
];

let redirects = {
    "libremdb": {
        "normal": [],
        "tor": []
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
    imdbProtocol,
    imdbRedirects,
    libremdbNormalRedirectsChecks,
    libremdbNormalCustomRedirects,
    libremdbTorRedirectsChecks,
    libremdbTorCustomRedirects;

function init() {
    return new Promise(async resolve => {
        browser.storage.local.get(
            [
                "disableImdb",
                "imdbProtocol",
                "imdbRedirects",
                "libremdbNormalRedirectsChecks",
                "libremdbNormalCustomRedirects",
                "libremdbTorRedirectsChecks",
                "libremdbTorCustomRedirects",
            ],
            r => {
                disableImdb = r.disableImdb;
                imdbProtocol = r.imdbProtocol;
                imdbRedirects = r.imdbRedirects;
                libremdbNormalRedirectsChecks = r.libremdbNormalRedirectsChecks;
                libremdbNormalCustomRedirects = r.libremdbNormalCustomRedirects;
                libremdbTorRedirectsChecks = r.libremdbTorRedirectsChecks;
                libremdbTorCustomRedirects = r.libremdbTorCustomRedirects;
                resolve();
            }
        )
    })
}

init();
browser.storage.onChanged.addListener(init)

function redirect(url, type, initiator) {
    if (disableImdb) return;
    if (url.pathname == "/") return;
    if (type != "main_frame") return;
    const all = [
        ...imdbRedirects.libremdb.normal,
        ...libremdbNormalCustomRedirects
    ];
    if (initiator && (all.includes(initiator.origin) || targets.includes(initiator.host))) return;
    if (!targets.some(rx => rx.test(url.href))) return;

    let instancesList;
    if (imdbProtocol == 'normal') instancesList = [...libremdbNormalRedirectsChecks, ...libremdbNormalCustomRedirects];
    if (imdbProtocol == 'tor') instancesList = [...libremdbTorRedirectsChecks, ...libremdbTorCustomRedirects];
    if (instancesList.length === 0) return;

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
            ...libremdbTorCustomRedirects
        ];
        if (!all.includes(protocolHost)) { resolve(); return; }

        resolve(`https://imdb.com${url.pathname}${url.search}`);
    })
}

function switchInstance(url) {
    return new Promise(async resolve => {
        await init();
        let protocolHost = utils.protocolHost(url);
        const all = [
            ...imdbRedirects.libremdb.tor,
            ...imdbRedirects.libremdb.normal,

            ...libremdbNormalCustomRedirects,
            ...libremdbTorCustomRedirects,
        ];
        if (!all.includes(protocolHost)) { resolve(); return; }

        let instancesList;
        if (imdbProtocol == 'normal') instancesList = [...libremdbNormalCustomRedirects, ...libremdbNormalRedirectsChecks];
        else if (imdbProtocol == 'tor') instancesList = [...libremdbTorCustomRedirects, ...libremdbTorRedirectsChecks];

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
            redirects.libremdb = dataJson.libremdb;
            browser.storage.local.set({
                disableImdb: false,
                imdbProtocol: "normal",

                imdbRedirects: redirects,

                libremdbNormalRedirectsChecks: [...redirects.libremdb.normal],
                libremdbNormalCustomRedirects: [],

                libremdbTorRedirectsChecks: [...redirects.libremdb.tor],
                libremdbTorCustomRedirects: [],
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

window.browser = window.browser || window.chrome;

import utils from './utils.js'

let targets = ["odysee.com"];

let redirects = {
    "librarian": {
        "normal": [
            "https://lbry.bcow.xyz",
            "https://odysee.076.ne.jp",
            "https://lbry.ix.tc",
            "https://librarian.pussthecat.org",
            "https://lbry.mutahar.rocks",
            "https://librarian.esmailelbob.xyz",
        ],
        "tor": [
            "http://ecc5mi5ncdw6mxhjz6re6g2uevtpbzxjvxgrxia2gyvrlnil3srbnhyd.onion",
            "http://vrmbc4brkgkaysmi3fenbzkayobxjh24slmhtocambn3ewe62iuqt3yd.onion",
        ]
    }
}

function setRedirects(val) {
    redirects.librarian = val;
    browser.storage.local.set({ lbryTargetsRedirects: redirects })
    for (const item of librarianNormalRedirectsChecks)
        if (!redirects.librarian.normal.includes(item)) {
            var index = librarianNormalRedirectsChecks.indexOf(item);
            if (index !== -1) librarianNormalRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set(librarianNormalRedirectsChecks);

    for (const item of librarianTorRedirectsChecks)
        if (!redirects.librarian.normal.includes(item)) {
            var index = librarianTorRedirectsChecks.indexOf(item);
            if (index !== -1) librarianTorRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set(librarianTorRedirectsChecks)
}

let
    disableLbryTargets,
    lbryTargetsProtocol,
    lbryTargetsRedirects,
    librarianNormalRedirectsChecks,
    librarianNormalCustomRedirects,
    librarianTorRedirectsChecks,
    librarianTorCustomRedirects;

function init() {
    return new Promise(resolve => {
        browser.storage.local.get(
            [
                "disableLbryTargets",
                "lbryTargetsProtocol",
                "lbryTargetsRedirects",
                "librarianNormalRedirectsChecks",
                "librarianNormalCustomRedirects",
                "librarianTorRedirectsChecks",
                "librarianTorCustomRedirects",
            ],
            r => {
                disableLbryTargets = r.disableLbryTargets;
                lbryTargetsProtocol = r.lbryTargetsProtocol;
                lbryTargetsRedirects = r.lbryTargetsRedirects;
                librarianNormalRedirectsChecks = r.librarianNormalRedirectsChecks;
                librarianNormalCustomRedirects = r.librarianNormalCustomRedirects;
                librarianTorRedirectsChecks = r.librarianTorRedirectsChecks;
                librarianTorCustomRedirects = r.librarianTorCustomRedirects;
                resolve();
            }
        )
    })
}
init();
browser.storage.onChanged.addListener(init)

function all() {
    return [
        ...redirects.librarian.normal,
        ...redirects.librarian.tor,
        ...librarianNormalCustomRedirects,
        ...librarianTorCustomRedirects,
    ];
}

function switchInstance(url) {
    return new Promise(async resolve => {
        await init();
        const protocolHost = utils.protocolHost(url);
        if (!all().includes(protocolHost)) { resolve(); return; }

        let instancesList;
        if (lbryTargetsProtocol == 'normal') instancesList = [...librarianNormalRedirectsChecks, ...librarianNormalCustomRedirects];
        else if (lbryTargetsProtocol == 'tor') instancesList = [...librarianTorRedirectsChecks, ...librarianTorCustomRedirects];

        const i = instancesList.indexOf(protocolHost);
        if (i > -1) instancesList.splice(i, 1);
        if (instancesList.length === 0) { resolve(); return; }

        const randomInstance = utils.getRandomInstance(instancesList);
        resolve(`${randomInstance}${url.pathname}${url.search}`);
    })
}

function redirect(url, type, initiator) {
    if (disableLbryTargets) return;
    if (initiator && (all().includes(initiator.origin) || targets.includes(initiator.host))) return;
    if (!targets.includes(url.host)) return;
    if (type != "main_frame") return;

    let instancesList;
    if (lbryTargetsProtocol == 'normal') instancesList = [...librarianNormalRedirectsChecks, ...librarianNormalCustomRedirects];
    if (lbryTargetsProtocol == 'tor') instancesList = [...librarianTorRedirectsChecks, ...librarianTorCustomRedirects];
    if (instancesList.length === 0) return;

    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
}

function initDefaults() {
    return new Promise(resolve => {
        browser.storage.local.get('cloudflareBlackList', async r => {
            librarianNormalRedirectsChecks = [...redirects.librarian.normal];
            for (const instance of r.cloudflareBlackList) {
                let i;

                i = librarianNormalRedirectsChecks.indexOf(instance);
                if (i > -1) librarianNormalRedirectsChecks.splice(i, 1);
            }
            await browser.storage.local.set({
                disableLbryTargets: true,
                lbryTargetsRedirects: {
                    'librarian': redirects.librarian
                },

                librarianNormalRedirectsChecks: librarianNormalRedirectsChecks,
                librarianNormalCustomRedirects: [],

                librarianTorRedirectsChecks: [...redirects.librarian.tor],
                librarianTorCustomRedirects: [],

                lbryTargetsProtocol: "normal",
            })
            resolve();
        })
    })
}

export default {
    setRedirects,
    switchInstance,
    redirect,
    initDefaults,
};

window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

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

const getRedirects = () => redirects;

function setRedirects(val) {
    redirects.librarian = val;
    browser.storage.local.set({ lbryTargetsRedirects: redirects })
    console.log("lbryTargetsRedirects: ", val)
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

let librarianNormalRedirectsChecks;
let librarianTorRedirectsChecks;
let librarianNormalCustomRedirects = [];
let librarianTorCustomRedirects = [];

let disable; // disableLbryTargets
let protocol; // lbryTargetsProtocol

function switchInstance(url) {
    let protocolHost = commonHelper.protocolHost(url);

    let librarianList = [
        ...redirects.librarian.normal,
        ...redirects.librarian.tor,
        ...librarianNormalCustomRedirects,
        ...librarianTorCustomRedirects,
    ];

    if (!librarianList.includes(protocolHost)) return;

    let instancesList;
    if (protocol == 'normal') instancesList = [...librarianNormalRedirectsChecks, ...librarianNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...librarianTorRedirectsChecks, ...librarianTorCustomRedirects];

    console.log("instancesList", instancesList);
    let index = instancesList.indexOf(protocolHost);
    if (index > -1) instancesList.splice(index, 1);

    if (instancesList.length === 0) return null;

    let randomInstance = commonHelper.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
}

function redirect(url, type, initiator) {
    if (disable) return null;
    if (initiator && ([...redirects.librarian.normal, ...librarianNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))) return null;
    if (!targets.includes(url.host)) return null;

    if (type != "main_frame") return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...librarianNormalRedirectsChecks, ...librarianNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...librarianTorRedirectsChecks, ...librarianTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    return `${randomInstance}${url.pathname}${url.search}`;
}

async function initDefaults() {
    browser.storage.local.get('cloudflareList', async r => {
        librarianNormalRedirectsChecks = [...redirects.librarian.normal];
        for (const instance of r.cloudflareList) {
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
    })
}


async function init() {
    return new Promise(resolve => {
        browser.storage.local.get(
            [
                "disableLbryTargets",
                "lbryTargetsRedirects",

                "librarianNormalRedirectsChecks",
                "librarianNormalCustomRedirects",

                "librarianTorRedirectsChecks",
                "librarianTorCustomRedirects",

                "lbryTargetsProtocol"
            ],
            r => {
                disable = r.disableLbryTargets;

                protocol = r.lbryTargetsProtocol;

                redirects = r.lbryTargetsRedirects;

                librarianNormalRedirectsChecks = r.librarianNormalRedirectsChecks;
                librarianNormalCustomRedirects = r.librarianNormalCustomRedirects;

                librarianTorRedirectsChecks = r.librarianTorRedirectsChecks;
                librarianTorCustomRedirects = r.librarianTorCustomRedirects;

                resolve();
            }
        )
    });
}

export default {

    getRedirects,
    setRedirects,
    switchInstance,

    redirect,
    init,
    initDefaults,
};

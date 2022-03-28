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
const getCustomRedirects = function () {
    return {
        "librarian": {
            "normal": [...librarianNormalRedirectsChecks, ...librarianNormalCustomRedirects]
        },
    };
};

function setRedirects(val) {
    redirects.librarian = val;
    browser.storage.local.set({ lbryTargetsRedirects: redirects })
    console.log("lbryTargetsRedirects: ", val)
    for (const item of librarianNormalRedirectsChecks)
        if (!redirects.librarian.normal.includes(item)) {
            var index = librarianNormalRedirectsChecks.indexOf(item);
            if (index !== -1) librarianNormalRedirectsChecks.splice(index, 1);
        }
    setLibrarianNormalRedirectsChecks(librarianNormalRedirectsChecks);

    for (const item of librarianTorRedirectsChecks)
        if (!redirects.librarian.normal.includes(item)) {
            var index = librarianTorRedirectsChecks.indexOf(item);
            if (index !== -1) librarianTorRedirectsChecks.splice(index, 1);
        }
    setLibrarianTorRedirectsChecks(librarianTorRedirectsChecks);
}

let librarianNormalRedirectsChecks;
const getLibrarianNormalRedirectsChecks = () => librarianNormalRedirectsChecks;
function setLibrarianNormalRedirectsChecks(val) {
    librarianNormalRedirectsChecks = val;
    browser.storage.local.set({ librarianNormalRedirectsChecks })
    console.log("librarianNormalRedirectsChecks: ", val)
}

let librarianTorRedirectsChecks;
const getLibrarianTorRedirectsChecks = () => librarianTorRedirectsChecks;
function setLibrarianTorRedirectsChecks(val) {
    librarianTorRedirectsChecks = val;
    browser.storage.local.set({ librarianTorRedirectsChecks })
    console.log("librarianTorRedirectsChecks: ", val)
}

let librarianNormalCustomRedirects = [];
const getLibrarianNormalCustomRedirects = () => librarianNormalCustomRedirects;
function setLibrarianNormalCustomRedirects(val) {
    librarianNormalCustomRedirects = val;
    browser.storage.local.set({ librarianNormalCustomRedirects })
    console.log("librarianNormalCustomRedirects: ", val)
}

let librarianTorCustomRedirects = [];
const getLibrarianTorCustomRedirects = () => librarianTorCustomRedirects;
function setLibrarianTorCustomRedirects(val) {
    librarianTorCustomRedirects = val;
    browser.storage.local.set({ librarianTorCustomRedirects })
    console.log("librarianTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.local.set({ disableLbryTargets: disable })
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
    protocol = val;
    browser.storage.local.set({ lbryTargetsProtocol: val })
    console.log("lbryTargetsProtocol: ", val)
}

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

async function init() {
    return new Promise(resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(data => {
            let dataJson = JSON.parse(data);
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

                    disable = r.disableLbryTargets ?? true;

                    protocol = r.lbryTargetsProtocol ?? "normal";

                    if (r.lbryTargetsRedirects) redirects = r.lbryTargetsRedirects;

                    librarianNormalRedirectsChecks = r.librarianNormalRedirectsChecks ?? [...redirects.librarian.normal];
                    librarianNormalCustomRedirects = r.librarianNormalCustomRedirects ?? [];

                    librarianTorRedirectsChecks = r.librarianTorRedirectsChecks ?? [...redirects.librarian.tor];
                    librarianTorCustomRedirects = r.librarianTorCustomRedirects ?? [];

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

    getProtocol,
    setProtocol,

    getLibrarianNormalRedirectsChecks,
    setLibrarianNormalRedirectsChecks,
    getLibrarianTorRedirectsChecks,
    setLibrarianTorRedirectsChecks,

    getLibrarianTorCustomRedirects,
    setLibrarianTorCustomRedirects,
    getLibrarianNormalCustomRedirects,
    setLibrarianNormalCustomRedirects,

    switchInstance,

    redirect,
    init,
};

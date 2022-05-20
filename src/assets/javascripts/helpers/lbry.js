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

async function switchInstance(url) {
    return new Promise(resolve => {
        browser.storage.local.get(
            [
                "lbryTargetsRedirects",
                "lbryTargetsProtocol",

                "librarianNormalRedirectsChecks",
                "librarianNormalCustomRedirects",

                "librarianTorRedirectsChecks",
                "librarianTorCustomRedirects",
            ],
            r => {
                let protocolHost = utils.protocolHost(url);
                if (![
                    ...redirects.librarian.normal,
                    ...redirects.librarian.tor,
                    ...r.librarianNormalCustomRedirects,
                    ...r.librarianTorCustomRedirects,
                ].includes(protocolHost)) resolve();

                let instancesList;
                if (r.lbryTargetsProtocol == 'normal') instancesList = [...r.librarianNormalRedirectsChecks, ...r.librarianNormalCustomRedirects];
                else if (r.lbryTargetsProtocol == 'tor') instancesList = [...r.librarianTorRedirectsChecks, ...r.librarianTorCustomRedirects];

                let index = instancesList.indexOf(protocolHost);
                if (index > -1) instancesList.splice(index, 1);
                if (instancesList.length === 0) resolve();

                let randomInstance = utils.getRandomInstance(instancesList);
                resolve(`${randomInstance}${url.pathname}${url.search}`);
            }
        )
    })
}

function redirect(url, type, initiator) {
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
                if (r.disableLbryTargets) { resolve(); return; }
                if (initiator && (
                    [
                        ...r.lbryTargetsRedirects.librarian.normal,
                        ...r.librarianNormalCustomRedirects,
                        ...r.librarianTorCustomRedirects,
                    ].includes(initiator.origin) ||
                    targets.includes(initiator.host))
                ) { resolve(); return; }
                if (!targets.includes(url.host)) { resolve(); return; }
                if (type != "main_frame") { resolve(); return; }

                let instancesList;
                if (r.lbryTargetsProtocol == 'normal') instancesList = [...r.librarianNormalRedirectsChecks, ...r.librarianNormalCustomRedirects];
                if (r.lbryTargetsProtocol == 'tor') instancesList = [...r.librarianTorRedirectsChecks, ...r.librarianTorCustomRedirects];
                if (instancesList.length === 0) { resolve(); return; }

                let randomInstance = utils.getRandomInstance(instancesList);
                resolve(`${randomInstance}${url.pathname}${url.search}`);
            }
        )
    })
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

export default {
    setRedirects,
    switchInstance,

    redirect,
    initDefaults,
};

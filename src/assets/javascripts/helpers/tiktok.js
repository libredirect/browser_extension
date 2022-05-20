window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = [
    /^https?:\/{2}(www\.|)tiktok\.com.*/
];

let redirects = {
    "proxiTok": {
        "normal": [],
        "tor": []
    }
}
function setRedirects(val) {
    redirects.proxiTok = val;
    browser.storage.local.set({ tiktokRedirects: redirects })
    console.log("tiktokRedirects: ", val)
    for (const item of proxiTokNormalRedirectsChecks)
        if (!redirects.proxiTok.normal.includes(item)) {
            var index = proxiTokNormalRedirectsChecks.indexOf(item);
            if (index !== -1) proxiTokNormalRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ proxiTokNormalRedirectsChecks })

    for (const item of proxiTokTorRedirectsChecks)
        if (!redirects.proxiTok.normal.includes(item)) {
            var index = proxiTokTorRedirectsChecks.indexOf(item);
            if (index !== -1) proxiTokTorRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ proxiTokTorRedirectsChecks })
}

let proxiTokNormalRedirectsChecks;
let proxiTokTorRedirectsChecks;
let proxiTokNormalCustomRedirects = [];
let proxiTokTorCustomRedirects = [];

let disable; // disableTiktok
let protocol;

function initProxiTokCookies(from) {
    return new Promise(resolve => {
        browser.storage.local.get(
            [
                "tiktokProtocol",
                "proxiTokNormalRedirectsChecks",
                "proxiTokNormalCustomRedirects",
                "proxiTokTorRedirectsChecks",
                "proxiTokTorCustomRedirects",
            ],
            r => {
                let protocolHost = utils.protocolHost(from);
                if (![
                    ...r.proxiTokNormalRedirectsChecks,
                    ...r.proxiTokNormalCustomRedirects,
                    ...r.proxiTokTorRedirectsChecks,
                    ...r.proxiTokTorCustomRedirects,
                ].includes(protocolHost)) resolve();

                let checkedInstances;
                if (r.tiktokProtocol == 'normal') checkedInstances = [...r.proxiTokNormalRedirectsChecks, ...r.proxiTokNormalCustomRedirects]
                else if (r.tiktokProtocol == 'tor') checkedInstances = [...r.proxiTokTorRedirectsChecks, ...r.proxiTokTorCustomRedirects]
                for (const to of checkedInstances) {
                    utils.copyCookie('proxitok', from, to, 'theme');
                    utils.copyCookie('proxitok', from, to, 'api-legacy');
                }
                resolve(true);
            }
        )
    })
}

function setProxiTokCookies() {
    browser.storage.local.get(
        [
            "tiktokProtocol",
            "disableTiktok",
            "proxiTokNormalRedirectsChecks",
            "proxiTokNormalCustomRedirects",
            "proxiTokTorRedirectsChecks",
            "proxiTokTorCustomRedirects",
        ],
        r => {
            if (r.disableTiktok || r.tiktokProtocol === undefined) return;
            let checkedInstances;
            if (r.tiktokProtocol == 'normal') checkedInstances = [...r.proxiTokNormalRedirectsChecks, ...r.proxiTokNormalCustomRedirects]
            else if (r.tiktokProtocol == 'tor') checkedInstances = [...r.proxiTokTorRedirectsChecks, ...r.proxiTokTorCustomRedirects]
            for (const to of checkedInstances) {
                utils.getCookiesFromStorage('proxitok', to, 'theme');
                utils.getCookiesFromStorage('proxitok', to, 'api-legacy');
            }
        }
    )
}

function redirect(url, type, initiator) {
    return new Promise(resolve => {
        browser.storage.local.get(
            [
                "disableTiktok",
                "tiktokProtocol",

                "tiktokRedirects",

                "proxiTokNormalRedirectsChecks",
                "proxiTokNormalCustomRedirects",

                "proxiTokTorRedirectsChecks",
                "proxiTokTorCustomRedirects",
            ],
            r => {
                if (r.disableTiktok) { resolve(); return; };
                if (type != "main_frame") { resolve(); return; };
                if (initiator && (
                    [
                        ...r.tiktokRedirects.proxiTok.normal,
                        ...r.proxiTokNormalCustomRedirects
                    ].includes(initiator.origin) ||
                    targets.includes(initiator.host)
                )
                ) { resolve(); return; };
                if (!targets.some(rx => rx.test(url.href))) { resolve(); return; };
                // https://www.tiktok.com/@keysikaspol/video/7061265241887345946
                // https://www.tiktok.com/@keysikaspol

                let instancesList;
                if (r.tiktokProtocol == 'normal') instancesList = [...r.proxiTokNormalRedirectsChecks, ...r.proxiTokNormalCustomRedirects];
                if (r.tiktokProtocol == 'tor') instancesList = [...r.proxiTokTorRedirectsChecks, ...r.proxiTokTorCustomRedirects];
                if (instancesList.length === 0) { resolve(); return; };

                let randomInstance = utils.getRandomInstance(instancesList);
                resolve(`${randomInstance}${url.pathname}`);
            }
        )
    })
}

async function reverse(url) {
    return new Promise(resolve => {
        browser.storage.local.get(
            [
                "tiktokRedirects",
                "proxiTokNormalCustomRedirects",
                "proxiTokTorCustomRedirects",
            ],
            r => {
                let protocolHost = utils.protocolHost(url);
                if (
                    ![
                        ...r.tiktokRedirects.proxiTok.normal,
                        ...r.tiktokRedirects.proxiTok.tor,
                        ...r.proxiTokNormalCustomRedirects,
                        ...r.proxiTokTorCustomRedirects
                    ].includes(protocolHost)
                ) { resolve(); return; }

                resolve(`https://tiktok.com${url.pathname}${url.search}`);
            }
        )
    })
}

async function initDefaults() {
    return new Promise(async resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(async data => {
            let dataJson = JSON.parse(data);
            redirects.proxiTok = dataJson.proxiTok;
            await browser.storage.local.set({
                disableTiktok: false,
                tiktokProtocol: "normal",

                tiktokRedirects: redirects,

                proxiTokNormalRedirectsChecks: [...redirects.proxiTok.normal],
                proxiTokNormalCustomRedirects: [],

                proxiTokTorRedirectsChecks: [...redirects.proxiTok.tor],
                proxiTokTorCustomRedirects: [],
            });
            resolve();
        });
    })
}

export default {
    setRedirects,

    redirect,
    reverse,

    initProxiTokCookies,
    setProxiTokCookies,

    initDefaults
};

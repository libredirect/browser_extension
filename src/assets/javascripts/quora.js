window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = [
    /^https?:\/{2}(www\.|)quora\.com.*/
];

let redirects = {
    "quetre": {
        "normal": [],
        "tor": []
    }
}
function setRedirects(val) {
    browser.storage.local.get('cloudflareBlackList', r => {
        redirects.quetre = val;
        quetreNormalRedirectsChecks = [...redirects.quetre.normal];
        for (const instance of r.cloudflareBlackList) {
            const a = quetreNormalRedirectsChecks.indexOf(instance);
            if (a > -1) quetreNormalRedirectsChecks.splice(a, 1);
        }
        browser.storage.local.set({
            quoraRedirects: redirects,
            quetreNormalRedirectsChecks
        })
    })
}

let
    disableQuora,
    quoraProtocol,
    quoraRedirects,
    quetreNormalRedirectsChecks,
    quetreNormalCustomRedirects,
    quetreTorRedirectsChecks,
    quetreTorCustomRedirects;

function init() {
    return new Promise(async resolve => {
        browser.storage.local.get(
            [
                "disableQuora",
                "quoraProtocol",
                "quoraRedirects",
                "quetreNormalRedirectsChecks",
                "quetreNormalCustomRedirects",
                "quetreTorRedirectsChecks",
                "quetreTorCustomRedirects",
            ],
            r => {
                disableQuora = r.disableQuora;
                quoraProtocol = r.quoraProtocol;
                quoraRedirects = r.quoraRedirects;
                quetreNormalRedirectsChecks = r.quetreNormalRedirectsChecks;
                quetreNormalCustomRedirects = r.quetreNormalCustomRedirects;
                quetreTorRedirectsChecks = r.quetreTorRedirectsChecks;
                quetreTorCustomRedirects = r.quetreTorCustomRedirects;
                resolve();
            }
        )
    })
}

init();
browser.storage.onChanged.addListener(init)

// https://www.quora.com/@keysikaspol/video/7061265241887345946
// https://www.quora.com/@keysikaspol
function redirect(url, type, initiator) {
    if (disableQuora) return;
    if (type != "main_frame") return;
    const all = [
        ...quoraRedirects.quetre.normal,
        ...quetreNormalCustomRedirects
    ];
    if (initiator && (all.includes(initiator.origin) || targets.includes(initiator.host))) return;
    if (!targets.some(rx => rx.test(url.href))) return;

    let instancesList;
    if (quoraProtocol == 'normal') instancesList = [...quetreNormalRedirectsChecks, ...quetreNormalCustomRedirects];
    if (quoraProtocol == 'tor') instancesList = [...quetreTorRedirectsChecks, ...quetreTorCustomRedirects];
    if (instancesList.length === 0) return;

    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}`;
}

function reverse(url) {
    return new Promise(async resolve => {
        await init();
        let protocolHost = utils.protocolHost(url);
        const all = [
            ...quoraRedirects.quetre.normal,
            ...quoraRedirects.quetre.tor,
            ...quetreNormalCustomRedirects,
            ...quetreTorCustomRedirects
        ];
        if (!all.includes(protocolHost)) { resolve(); return; }

        resolve(`https://quora.com${url.pathname}${url.search}`);
    })
}

function switchInstance(url) {
    return new Promise(async resolve => {
        await init();
        let protocolHost = utils.protocolHost(url);
        const all = [
            ...quoraRedirects.quetre.tor,
            ...quoraRedirects.quetre.normal,

            ...quetreNormalCustomRedirects,
            ...quetreTorCustomRedirects,
        ];
        if (!all.includes(protocolHost)) { resolve(); return; }

        let instancesList;
        if (quoraProtocol == 'normal') instancesList = [...quetreNormalCustomRedirects, ...quetreNormalRedirectsChecks];
        else if (quoraProtocol == 'tor') instancesList = [...quetreTorCustomRedirects, ...quetreTorRedirectsChecks];

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
            redirects.quetre = dataJson.quetre;
            browser.storage.local.set({
                disableQuora: false,
                quoraProtocol: "normal",

                quoraRedirects: redirects,

                quetreNormalRedirectsChecks: [...redirects.quetre.normal],
                quetreNormalCustomRedirects: [],

                quetreTorRedirectsChecks: [...redirects.quetre.tor],
                quetreTorCustomRedirects: [],
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

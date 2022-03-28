window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

let targets = [
    /^https?:\/{2}(open\.|)spotify\.com/,
];

let redirects = {
    "soju": {
        "normal": [
            "https://playsoju.netlify.app",
        ],
        "tor": []
    }
}

const getRedirects = () => redirects;
const getCustomRedirects = function () {
    return {
        "soju": {
            "normal": [...sojuNormalRedirectsChecks, ...sojuNormalCustomRedirects]
        },
    };
};

function setRedirects(val) {
    redirects.soju = val;
    browser.storage.local.set({ spotifyTargetsRedirects: redirects })
    console.log("spotifyTargetsRedirects: ", val)
    for (const item of sojuNormalRedirectsChecks)
        if (!redirects.soju.normal.includes(item)) {
            var index = sojuNormalRedirectsChecks.indexOf(item);
            if (index !== -1) sojuNormalRedirectsChecks.splice(index, 1);
        }
    setSojuNormalRedirectsChecks(sojuNormalRedirectsChecks);

    for (const item of sojuTorRedirectsChecks)
        if (!redirects.soju.normal.includes(item)) {
            var index = sojuTorRedirectsChecks.indexOf(item);
            if (index !== -1) sojuTorRedirectsChecks.splice(index, 1);
        }
    setSojuTorRedirectsChecks(sojuTorRedirectsChecks);
}

let sojuNormalRedirectsChecks;
const getSojuNormalRedirectsChecks = () => sojuNormalRedirectsChecks;
function setSojuNormalRedirectsChecks(val) {
    sojuNormalRedirectsChecks = val;
    browser.storage.local.set({ sojuNormalRedirectsChecks })
    console.log("sojuNormalRedirectsChecks: ", val)
}

let sojuTorRedirectsChecks;
const getSojuTorRedirectsChecks = () => sojuTorRedirectsChecks;
function setSojuTorRedirectsChecks(val) {
    sojuTorRedirectsChecks = val;
    browser.storage.local.set({ sojuTorRedirectsChecks })
    console.log("sojuTorRedirectsChecks: ", val)
}

let sojuNormalCustomRedirects = [];
const getSojuNormalCustomRedirects = () => sojuNormalCustomRedirects;
function setSojuNormalCustomRedirects(val) {
    sojuNormalCustomRedirects = val;
    browser.storage.local.set({ sojuNormalCustomRedirects })
    console.log("sojuNormalCustomRedirects: ", val)
}

let sojuTorCustomRedirects = [];
const getSojuTorCustomRedirects = () => sojuTorCustomRedirects;
function setSojuTorCustomRedirects(val) {
    sojuTorCustomRedirects = val;
    browser.storage.local.set({ sojuTorCustomRedirects })
    console.log("sojuTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.local.set({ disableSpotifyTargets: disable })
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
    protocol = val;
    browser.storage.local.set({ spotifyTargetsProtocol: val })
    console.log("spotifyTargetsProtocol: ", val)
}

function switchInstance(url) {
    let protocolHost = commonHelper.protocolHost(url);

    let sojuList = [
        ...redirects.soju.normal,
        ...redirects.soju.tor,
        ...sojuNormalCustomRedirects,
        ...sojuTorCustomRedirects,
    ];

    if (!sojuList.includes(protocolHost)) return;

    let instancesList;
    if (protocol == 'normal') instancesList = [...sojuNormalRedirectsChecks, ...sojuNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...sojuTorRedirectsChecks, ...sojuTorCustomRedirects];

    console.log("instancesList", instancesList);
    let index = instancesList.indexOf(protocolHost);
    if (index > -1) instancesList.splice(index, 1);

    if (instancesList.length === 0) return null;

    let randomInstance = commonHelper.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
}

function redirect(url, type, initiator) {
    if (disable) return null;
    if (initiator && ([...redirects.soju.normal, ...sojuNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))) return null;
    if (!targets.some(rx => rx.test(url.href))) return null;

    if (type != "main_frame") return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...sojuNormalRedirectsChecks, ...sojuNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...sojuTorRedirectsChecks, ...sojuTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    let query = '';
    if (url.pathname != '/') query = `/?s=${url.href}`;

    return `${randomInstance}${query}`;
}

async function init() {
    return new Promise(
        resolve => {
            fetch('/instances/data.json').then(response => response.text()).then(data => {
                let dataJson = JSON.parse(data);
                browser.storage.local.get(
                    [
                        "disableSpotifyTargets",
                        "spotifyTargetsRedirects",

                        "sojuNormalRedirectsChecks",
                        "sojuNormalCustomRedirects",

                        "sojuTorRedirectsChecks",
                        "sojuTorCustomRedirects",

                        "spotifyTargetsProtocol"
                    ],
                    r => {

                        disable = r.disableSpotifyTargets ?? true;

                        protocol = r.spotifyTargetsProtocol ?? "normal";

                        if (r.spotifyTargetsRedirects) redirects = r.spotifyTargetsRedirects;

                        sojuNormalRedirectsChecks = r.sojuNormalRedirectsChecks ?? [...redirects.soju.normal];
                        sojuNormalCustomRedirects = r.sojuNormalCustomRedirects ?? [];

                        sojuTorRedirectsChecks = r.sojuTorRedirectsChecks ?? [...redirects.soju.tor];
                        sojuTorCustomRedirects = r.sojuTorCustomRedirects ?? [];

                        resolve();
                    }
                )
            });
        }
    );
}

export default {

    getRedirects,
    getCustomRedirects,
    setRedirects,

    getDisable,
    setDisable,

    getProtocol,
    setProtocol,

    getSojuNormalRedirectsChecks,
    setSojuNormalRedirectsChecks,
    getSojuTorRedirectsChecks,
    setSojuTorRedirectsChecks,

    getSojuTorCustomRedirects,
    setSojuTorCustomRedirects,
    getSojuNormalCustomRedirects,
    setSojuNormalCustomRedirects,

    switchInstance,

    redirect,
    init,
};

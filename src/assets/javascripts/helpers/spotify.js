window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

let targets = [
    /^https?:\/{2}(open\.|)spotify\.com/,
];

let redirects = {
    "soju": {
        "normal": [
            "https://playsoju.netlify.app",
        ]
    }
}

const getRedirects = () => redirects;
function setRedirects(val) {
    redirects.soju = val;
    browser.storage.local.set({ spotifyTargetsRedirects: redirects })
    console.log("spotifyTargetsRedirects: ", val)
    for (const item of sojuNormalRedirectsChecks)
        if (!redirects.soju.normal.includes(item)) {
            var index = sojuNormalRedirectsChecks.indexOf(item);
            if (index !== -1) sojuNormalRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ sojuNormalRedirectsChecks })

    for (const item of sojuTorRedirectsChecks)
        if (!redirects.soju.normal.includes(item)) {
            var index = sojuTorRedirectsChecks.indexOf(item);
            if (index !== -1) sojuTorRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ sojuTorRedirectsChecks })
}

let sojuNormalRedirectsChecks;
let sojuTorRedirectsChecks;
let sojuNormalCustomRedirects = [];
let sojuTorCustomRedirects = [];

let disable; // disableSpotifyTargets

function switchInstance(url) {
    let protocolHost = commonHelper.protocolHost(url);

    let sojuList = [
        ...redirects.soju.normal,
        ...sojuNormalCustomRedirects
    ];

    if (!sojuList.includes(protocolHost)) return;

    let instancesList = [...sojuNormalRedirectsChecks, ...sojuNormalCustomRedirects];

    console.log("instancesList", instancesList);
    let index = instancesList.indexOf(protocolHost);
    if (index > -1) instancesList.splice(index, 1);

    if (instancesList.length === 0) return null;

    let randomInstance = commonHelper.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
}

function redirect(url, type, initiator) {
    if (disable) return null;
    if (type != "main_frame") return null;
    if (initiator && ([...redirects.soju.normal, ...sojuNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))) return null;
    if (!targets.some(rx => rx.test(url.href))) return null;

    let instancesList = [...sojuNormalRedirectsChecks, ...sojuNormalCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    let query = '';
    if (url.pathname != '/') query = `/?s=${url.href}`;

    return `${randomInstance}${query}`;
}

async function initDefaults() {
    await browser.storage.local.set({
        disableSpotifyTargets: true,

        sojuNormalRedirectsChecks: [...redirects.soju.normal],
        sojuNormalCustomRedirects: [],
    })
}

async function init() {
    browser.storage.local.get(
        [
            "disableSpotifyTargets",

            "sojuNormalRedirectsChecks",
            "sojuNormalCustomRedirects",

            "sojuTorRedirectsChecks",
            "sojuTorCustomRedirects",
        ],
        r => {
            disable = r.disableSpotifyTargets;

            sojuNormalRedirectsChecks = r.sojuNormalRedirectsChecks;
            sojuNormalCustomRedirects = r.sojuNormalCustomRedirects;
        }
    )
}

export default {
    getRedirects,
    setRedirects,

    switchInstance,

    redirect,
    initDefaults,
    init,
};

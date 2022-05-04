window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
    /^https?:\/{2}(www\.|)speedtest\.net\/$/
];

let redirects = {
    "librespeed": {
        "normal": [
            "https://librespeed.org"
        ],
        "tor": []
    }
}

const getRedirects = () => redirects;
function setRedirects(val) {
    redirects.librespeed = val;
    browser.storage.local.set({ speedtestRedirects: redirects })
    console.log("speedtestRedirects: ", val)
    for (const item of librespeedNormalRedirectsChecks)
        if (!redirects.librespeed.normal.includes(item)) {
            var index = librespeedNormalRedirectsChecks.indexOf(item);
            if (index !== -1) librespeedNormalRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ librespeedNormalRedirectsChecks })

    for (const item of librespeedTorRedirectsChecks)
        if (!redirects.librespeed.normal.includes(item)) {
            var index = librespeedTorRedirectsChecks.indexOf(item);
            if (index !== -1) librespeedTorRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ librespeedTorRedirectsChecks })
}

let librespeedNormalRedirectsChecks;
let librespeedTorRedirectsChecks;
let librespeedNormalCustomRedirects = [];
let librespeedTorCustomRedirects = [];

let disable; // disableSpeedtest
let protocol; // speedtestProtocol

function redirect(url, type, initiator) {
    if (disable) return null;
    if (initiator && ([...redirects.librespeed.normal, ...librespeedNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))) return null;
    if (!targets.some(rx => rx.test(url.href))) return null;
    console.log("Librespeed!!");

    if (type != "main_frame" && type != "sub_frame") return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...librespeedNormalRedirectsChecks, ...librespeedNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...librespeedTorRedirectsChecks, ...librespeedTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    return `${randomInstance}`;
}

async function initDefaults() {
    await browser.storage.local.set({
        disableSpeedtest: true,

        speedtestRedirects: redirects,

        librespeedNormalRedirectsChecks: [...redirects.librespeed.normal],
        librespeedNormalCustomRedirects: [],

        librespeedTorRedirectsChecks: [...redirects.librespeed.tor],
        librespeedTorCustomRedirects: [],

        speedtestProtocol: "normal",
    })
}

async function init() {
    browser.storage.local.get(
        [
            "disableSpeedtest",
            "speedtestRedirects",

            "librespeedNormalRedirectsChecks",
            "librespeedNormalCustomRedirects",

            "librespeedTorRedirectsChecks",
            "librespeedTorCustomRedirects",

            "speedtestProtocol"
        ],
        r => {
            disable = r.disableSpeedtest;
            protocol = r.speedtestProtocol;

            librespeedNormalRedirectsChecks = r.librespeedNormalRedirectsChecks;
            librespeedNormalCustomRedirects = r.librespeedNormalCustomRedirects;

            librespeedTorRedirectsChecks = r.librespeedTorRedirectsChecks;
            librespeedTorCustomRedirects = r.librespeedTorCustomRedirects;
        }
    )
}

export default {
    getRedirects,
    setRedirects,

    redirect,
    initDefaults,
    init,
};

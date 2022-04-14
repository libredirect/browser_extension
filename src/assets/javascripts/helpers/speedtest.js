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
const getCustomRedirects = function () {
    return {
        "librespeed": {
            "normal": [...librespeedNormalRedirectsChecks, ...librespeedNormalCustomRedirects],
            "tor": []
        },
    };
};

function setRedirects(val) {
    redirects.librespeed = val;
    browser.storage.local.set({ speedtestRedirects: redirects })
    console.log("speedtestRedirects: ", val)
    for (const item of librespeedNormalRedirectsChecks)
        if (!redirects.librespeed.normal.includes(item)) {
            var index = librespeedNormalRedirectsChecks.indexOf(item);
            if (index !== -1) librespeedNormalRedirectsChecks.splice(index, 1);
        }
    setLibrespeedNormalRedirectsChecks(librespeedNormalRedirectsChecks);

    for (const item of librespeedTorRedirectsChecks)
        if (!redirects.librespeed.normal.includes(item)) {
            var index = librespeedTorRedirectsChecks.indexOf(item);
            if (index !== -1) librespeedTorRedirectsChecks.splice(index, 1);
        }
    setLibrespeedTorRedirectsChecks(librespeedTorRedirectsChecks);
}

let librespeedNormalRedirectsChecks;
const getLibrespeedNormalRedirectsChecks = () => librespeedNormalRedirectsChecks;
function setLibrespeedNormalRedirectsChecks(val) {
    librespeedNormalRedirectsChecks = val;
    browser.storage.local.set({ librespeedNormalRedirectsChecks })
    console.log("librespeedNormalRedirectsChecks: ", val)
}

let librespeedTorRedirectsChecks;
const getLibrespeedTorRedirectsChecks = () => librespeedTorRedirectsChecks;
function setLibrespeedTorRedirectsChecks(val) {
    librespeedTorRedirectsChecks = val;
    browser.storage.local.set({ librespeedTorRedirectsChecks })
    console.log("librespeedTorRedirectsChecks: ", val)
}

let librespeedNormalCustomRedirects = [];
const getLibrespeedNormalCustomRedirects = () => librespeedNormalCustomRedirects;
function setLibrespeedNormalCustomRedirects(val) {
    librespeedNormalCustomRedirects = val;
    browser.storage.local.set({ librespeedNormalCustomRedirects })
    console.log("librespeedNormalCustomRedirects: ", val)
}

let librespeedTorCustomRedirects = [];
const getLibrespeedTorCustomRedirects = () => librespeedTorCustomRedirects;
function setLibrespeedTorCustomRedirects(val) {
    librespeedTorCustomRedirects = val;
    browser.storage.local.set({ librespeedTorCustomRedirects })
    console.log("librespeedTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.local.set({ disableSpeedtest: disable })
    console.log("disableSpeedtest", val);
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
    protocol = val;
    browser.storage.local.set({ speedtestProtocol: val })
    console.log("speedtestProtocol: ", val)
}

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

async function init() {
    return new Promise(resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(data => {
            let dataJson = JSON.parse(data);
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
                    disable = r.disableSpeedtest ?? true;

                    protocol = r.speedtestProtocol ?? "normal";

                    if (r.speedtestRedirects) redirects = r.speedtestRedirects;

                    librespeedNormalRedirectsChecks = r.librespeedNormalRedirectsChecks ?? [...redirects.librespeed.normal];
                    librespeedNormalCustomRedirects = r.librespeedNormalCustomRedirects ?? [];

                    librespeedTorRedirectsChecks = r.librespeedTorRedirectsChecks ?? [...redirects.librespeed.tor];
                    librespeedTorCustomRedirects = r.librespeedTorCustomRedirects ?? [];

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

    getLibrespeedNormalRedirectsChecks,
    setLibrespeedNormalRedirectsChecks,
    getLibrespeedTorRedirectsChecks,
    setLibrespeedTorRedirectsChecks,

    getLibrespeedTorCustomRedirects,
    setLibrespeedTorCustomRedirects,
    getLibrespeedNormalCustomRedirects,
    setLibrespeedNormalCustomRedirects,

    redirect,
    init,
};

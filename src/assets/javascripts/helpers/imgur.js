window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
    /^https?:\/{2}([im]\.)?imgur\.com(\/|$)/
];

let redirects = {
    "rimgo": {
        "normal": [],
        "tor": []
    }
}

const getRedirects = () => redirects;

const getCustomRedirects = function () {
    return {
        "rimgo": {
            "normal": [...rimgoNormalRedirectsChecks, ...rimgoNormalCustomRedirects],
            "tor": [...rimgoTorRedirectsChecks, ...rimgoTorCustomRedirects]
        },
    };
};

function setRedirects(val) {
    redirects.rimgo = val;
    browser.storage.local.set({ imgurRedirects: redirects })
    console.log("imgurRedirects: ", val)
    for (const item of rimgoNormalRedirectsChecks)
        if (!redirects.rimgo.normal.includes(item)) {
            var index = rimgoNormalRedirectsChecks.indexOf(item);
            if (index !== -1) rimgoNormalRedirectsChecks.splice(index, 1);
        }
    setRimgoNormalRedirectsChecks(rimgoNormalRedirectsChecks);

    for (const item of rimgoTorRedirectsChecks)
        if (!redirects.rimgo.normal.includes(item)) {
            var index = rimgoTorRedirectsChecks.indexOf(item);
            if (index !== -1) rimgoTorRedirectsChecks.splice(index, 1);
        }
    setRimgoTorRedirectsChecks(rimgoTorRedirectsChecks);
}

let rimgoNormalRedirectsChecks;
const getRimgoNormalRedirectsChecks = () => rimgoNormalRedirectsChecks;
function setRimgoNormalRedirectsChecks(val) {
    rimgoNormalRedirectsChecks = val;
    browser.storage.local.set({ rimgoNormalRedirectsChecks })
    console.log("rimgoNormalRedirectsChecks: ", val)
}

let rimgoTorRedirectsChecks;
const getRimgoTorRedirectsChecks = () => rimgoTorRedirectsChecks;
function setRimgoTorRedirectsChecks(val) {
    rimgoTorRedirectsChecks = val;
    browser.storage.local.set({ rimgoTorRedirectsChecks })
    console.log("rimgoTorRedirectsChecks: ", val)
}

let rimgoNormalCustomRedirects = [];
const getRimgoNormalCustomRedirects = () => rimgoNormalCustomRedirects;
function setRimgoNormalCustomRedirects(val) {
    rimgoNormalCustomRedirects = val;
    browser.storage.local.set({ rimgoNormalCustomRedirects })
    console.log("rimgoNormalCustomRedirects: ", val)
}

let rimgoTorCustomRedirects = [];
const getRimgoTorCustomRedirects = () => rimgoTorCustomRedirects;
function setRimgoTorCustomRedirects(val) {
    rimgoTorCustomRedirects = val;
    browser.storage.local.set({ rimgoTorCustomRedirects })
    console.log("rimgoTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.local.set({ disableImgur: disable })
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
    protocol = val;
    browser.storage.local.set({ imgurProtocol: val })
    console.log("imgurProtocol: ", val)
}

function isImgur(url, initiator) {
    if (disable) return false;
    if (url.pathname == "/") return false;
    if (
        initiator &&
        ([...redirects.rimgo.normal, ...rimgoNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))
    ) return false;
    return targets.some(rx => rx.test(url.href));
}

function redirect(url, type) {
    // https://imgur.com/gallery/s4WXQmn
    // https://imgur.com/a/H8M4rcp
    // https://imgur.com/gallery/gYiQLWy
    // https://imgur.com/gallery/cTRwaJU
    // https://i.imgur.com/CFSQArP.jpeg

    if (![
        "main_frame",
        "sub_frame",
        "xmlhttprequest",
        "other",
        "image",
        "media",
    ].includes(type)) return null;

    if (url.pathname.includes("delete/")) return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...rimgoNormalRedirectsChecks, ...rimgoNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...rimgoTorRedirectsChecks, ...rimgoTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    return `${randomInstance}${url.pathname}${url.search}`;
}

function switchInstance(url) {
    let protocolHost = commonHelper.protocolHost(url);

    let imgurList = [
        ...redirects.rimgo.normal,
        ...redirects.rimgo.tor,

        ...rimgoNormalCustomRedirects,
        ...rimgoTorCustomRedirects,
    ];
    if (!imgurList.includes(protocolHost)) return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...rimgoNormalCustomRedirects, ...rimgoNormalRedirectsChecks];
    else if (protocol == 'tor') instancesList = [...rimgoTorCustomRedirects, ...rimgoTorRedirectsChecks];

    console.log("instancesList", instancesList);
    let index = instancesList.indexOf(protocolHost);
    if (index > -1) instancesList.splice(index, 1);

    if (instancesList.length === 0) return null;

    let randomInstance = commonHelper.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
}

async function init() {
    return new Promise(resolve => {
        fetch('/instances/data.json')
            .then(response => response.text())
            .then(text => {
                let data = JSON.parse(text);
                browser.storage.local.get(
                    [
                        "disableImgur",
                        "imgurRedirects",

                        "rimgoNormalRedirectsChecks",
                        "rimgoNormalCustomRedirects",
                        "rimgoTorRedirectsChecks",
                        "rimgoTorCustomRedirects",

                        "imgurProtocol",
                    ],
                    r => { 
                        disable = r.disableImgur ?? false;

                        protocol = r.imgurProtocol ?? "normal";

                        redirects.rimgo = data.rimgo;
                        if (r.imgurRedirects) redirects = r.imgurRedirects;

                        rimgoNormalRedirectsChecks = r.rimgoNormalRedirectsChecks ?? [...redirects.rimgo.normal];
                        rimgoNormalCustomRedirects = r.rimgoNormalCustomRedirects ?? [];

                        rimgoTorRedirectsChecks = r.rimgoTorRedirectsChecks ?? [...redirects.rimgo.tor];
                        rimgoTorCustomRedirects = r.rimgoTorCustomRedirects ?? [];

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

    getRimgoNormalRedirectsChecks,
    setRimgoNormalRedirectsChecks,
    getRimgoTorRedirectsChecks,
    setRimgoTorRedirectsChecks,

    getRimgoNormalCustomRedirects,
    setRimgoNormalCustomRedirects,
    getRimgoTorCustomRedirects,
    setRimgoTorCustomRedirects,

    redirect,
    isImgur,
    init,
    switchInstance,
};

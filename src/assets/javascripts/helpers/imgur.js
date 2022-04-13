window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = /^https?:\/{2}([im]\.)?imgur\.com(\/|$)/

let redirects = {
    "rimgo": {
        "normal": [],
        "tor": [],
	"i2p": []
    }
}
const getRedirects = () => redirects;
const getCustomRedirects = function () {
    return {
        "rimgo": {
            "normal": [...rimgoNormalRedirectsChecks, ...rimgoNormalCustomRedirects],
            "tor": [...rimgoTorRedirectsChecks, ...rimgoTorCustomRedirects],
	    "i2p": [...rimgoI2pRedirectsChecks, ...rimgoI2pCustomRedirects]
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
        if (!redirects.rimgo.tor.includes(item)) {
            var index = rimgoTorRedirectsChecks.indexOf(item);
            if (index !== -1) rimgoTorRedirectsChecks.splice(index, 1);
        }
    setRimgoTorRedirectsChecks(rimgoTorRedirectsChecks);

    for (const item of rimgoI2pRedirectsChecks)
	if (!redirects.rimgo.i2p.includes(item)) {
	    var index = rimgoI2pRedirectsChecks.indexOf(item);
	    if (index !== -1) rimgoI2pRedirectsChecks.splice(index, 1);
	}
    setRimgoI2pRedirectsChecks(rimgoI2pRedirectsChecks);
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

let rimgoI2pRedirectsChecks;
const getRimgoI2pRedirectsChecks = () => rimgoI2pRedirectsChecks;
function setRimgoI2pRedirectsChecks(val) {
    rimgoI2pRedirectsChecks = val;
    browser.storage.local.set({ rimgoI2pRedirectsChecks })
    console.log("rimgoI2pRedirectsChecks: ", val)
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

let rimgoI2pCustomRedirects = [];
const getRimgoI2pCustomRedirects = () => rimgoI2pCustomRedirects;
function setRimgoI2pCustomRedirects(val) {
    rimgoI2pCustomRedirects = val;
    browser.storage.local.set({ rimgoI2pCustomRedirects })
    console.log("rimgoI2pCustomRedirects: ", val)
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
    if (protocol == 'i2p') instancesList = [...rimgoI2pRedirectsChecks, ...rimgoI2pCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    return `${randomInstance}${url.pathname}${url.search}`;
}

function switchInstance(url) {
    let protocolHost = commonHelper.protocolHost(url);

    let imgurList = [
        ...redirects.rimgo.normal,
        ...redirects.rimgo.tor,
	...redirects.rimgo.i2p,

        ...rimgoNormalCustomRedirects,
        ...rimgoTorCustomRedirects,
	...rimgoI2pCustomRedirects,
    ];
    if (!imgurList.includes(protocolHost)) return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...rimgoNormalCustomRedirects, ...rimgoNormalRedirectsChecks];
    else if (protocol == 'tor') instancesList = [...rimgoTorCustomRedirects, ...rimgoTorRedirectsChecks];
    else if (protocol == 'i2p') instancesList = [...rimgoI2pCustomRedirects, ...rimgoI2pRedirectsChecks];

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
			"rimgoI2pRedirectsChecks",
			"rimgoI2pCustomRedirects",

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

			rimgoI2pRedirectsChecks = r.rimgoI2pRedirectsChecks ?? [...redirects.rimgo.i2p];
			rimgoI2pCustomRedirects = r.rimgoI2pCustomRedirects ?? [];

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
    getRimgoI2pRedirectsChecks,
    setRimgoI2pRedirectsChecks,

    getRimgoNormalCustomRedirects,
    setRimgoNormalCustomRedirects,
    getRimgoTorCustomRedirects,
    setRimgoTorCustomRedirects,
    getRimgoI2pCustomRedirects,
    setRimgoI2pCustomRedirects,

    redirect,
    isImgur,
    init,
    switchInstance,
};

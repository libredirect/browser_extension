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
function setRedirects(val) {
    redirects.rimgo = val;
    browser.storage.local.set({ imgurRedirects: redirects })
    console.log("imgurRedirects: ", val)
    for (const item of rimgoNormalRedirectsChecks)
        if (!redirects.rimgo.normal.includes(item)) {
            var index = rimgoNormalRedirectsChecks.indexOf(item);
            if (index !== -1) rimgoNormalRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ rimgoNormalRedirectsChecks });

    for (const item of rimgoTorRedirectsChecks)
        if (!redirects.rimgo.tor.includes(item)) {
            var index = rimgoTorRedirectsChecks.indexOf(item);
            if (index !== -1) rimgoTorRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ rimgoTorRedirectsChecks });

    for (const item of rimgoI2pRedirectsChecks)
        if (!redirects.rimgo.i2p.includes(item)) {
            var index = rimgoI2pRedirectsChecks.indexOf(item);
            if (index !== -1) rimgoI2pRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ rimgoI2pRedirectsChecks });

}

let
    disable,
    protocol;

let
    rimgoNormalRedirectsChecks,
    rimgoTorRedirectsChecks,
    rimgoI2pRedirectsChecks,
    rimgoNormalCustomRedirects,
    rimgoTorCustomRedirects,
    rimgoI2pCustomRedirects;

function redirect(url, type, initiator) {
    if (disable) return;
    if (url.pathname == "/") return;
    if (![
        "main_frame",
        "sub_frame",
        "xmlhttprequest",
        "other",
        "image",
        "media",
    ].includes(type)) return;
    if (
        initiator &&
        ([...redirects.rimgo.normal, ...rimgoNormalCustomRedirects].includes(initiator.origin) || targets.test(initiator.host))
    ) return;
    if (!targets.test(url.href)) return;
    if (url.pathname.includes("delete/")) return;

    // https://imgur.com/gallery/s4WXQmn
    // https://imgur.com/a/H8M4rcp
    // https://imgur.com/gallery/gYiQLWy
    // https://imgur.com/gallery/cTRwaJU
    // https://i.imgur.com/CFSQArP.jpeg
    let instancesList;
    if (protocol == 'normal') instancesList = [...rimgoNormalRedirectsChecks, ...rimgoNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...rimgoTorRedirectsChecks, ...rimgoTorCustomRedirects];
    if (protocol == 'i2p') instancesList = [...rimgoI2pRedirectsChecks, ...rimgoI2pCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    return `${randomInstance}${url.pathname}${url.search}`;
}

async function reverse(url) {
    browser.storage.local.get(
        [
            "imgurRedirects",
            "rimgoNormalCustomRedirects",
            "rimgoTorCustomRedirects",
            "rimgoI2pCustomRedirects",
        ],
        r => {
            let protocolHost = commonHelper.protocolHost(url);
            if (
                ![
                    ...r.imgurRedirects.rimgo.normal,
                    ...r.imgurRedirects.rimgo.tor,
                    ...r.imgurRedirects.rimgo.i2p,
                    ...r.rimgoNormalCustomRedirects,
                    ...r.rimgoTorCustomRedirects,
                    ...r.rimgoI2pCustomRedirects
                ].includes(protocolHost)
            ) return;
            return `https://imgur.com${url.pathname}${url.search}`;
        }
    )
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

async function initDefaults() {
    fetch('/instances/data.json').then(response => response.text()).then(async data => {
        let dataJson = JSON.parse(data);
        redirects.rimgo = dataJson.rimgo;
        browser.storage.local.get('cloudflareList', async r => {
            rimgoNormalRedirectsChecks = [...redirects.rimgo.normal];
            for (const instance of r.cloudflareList) {
                let i;

                i = rimgoNormalRedirectsChecks.indexOf(instance);
                if (i > -1) rimgoNormalRedirectsChecks.splice(i, 1);
            }
            await browser.storage.local.set({
                disableImgur: false,
                imgurProtocol: 'normal',
                imgurRedirects: redirects,

                rimgoNormalRedirectsChecks: rimgoNormalRedirectsChecks,
                rimgoNormalCustomRedirects: [],

                rimgoTorRedirectsChecks: [...redirects.rimgo.tor],
                rimgoTorCustomRedirects: [],

                rimgoI2pRedirectsChecks: [...redirects.rimgo.i2p],
                rimgoI2pCustomRedirects: [],
            });
        });
    });
}

async function init() {
    return new Promise(resolve => {
        browser.storage.local.get(
            [
                "disableImgur",
                "imgurRedirects",
                "imgurProtocol",

                "rimgoNormalRedirectsChecks",
                "rimgoNormalCustomRedirects",
                "rimgoTorRedirectsChecks",
                "rimgoTorCustomRedirects",
                "rimgoI2pRedirectsChecks",
                "rimgoI2pCustomRedirects",
            ],
            r => {
                disable = r.disableImgur;
                protocol = r.imgurProtocol;
                redirects = r.imgurRedirects;

                rimgoNormalRedirectsChecks = r.rimgoNormalRedirectsChecks;
                rimgoNormalCustomRedirects = r.rimgoNormalCustomRedirects;
                rimgoTorRedirectsChecks = r.rimgoTorRedirectsChecks;
                rimgoTorCustomRedirects = r.rimgoTorCustomRedirects;
                rimgoI2pRedirectsChecks = r.rimgoI2pRedirectsChecks;
                rimgoI2pCustomRedirects = r.rimgoI2pCustomRedirects;

                resolve();
            }
        )
    });
}

export default {
    getRedirects,
    setRedirects,

    redirect,
    reverse,
    init,
    initDefaults,
    switchInstance,
};

window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = /^https?:\/{2}([im]\.)?imgur\.(com|io)(\/|$)/

let redirects = {
    "rimgo": {
        "normal": [],
        "tor": [],
        "i2p": []
    }
}
function setRedirects() {
    return new Promise(resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(async data => {
            let dataJson = JSON.parse(data);
            redirects.rimgo = dataJson.rimgo;

            rimgoNormalRedirectsChecks = [...redirects.rimgo.normal];
            rimgoTorRedirectsChecks = [...redirects.rimgo.tor];
            rimgoI2pRedirectsChecks = [...redirects.rimgo.i2p];

            for (const instance of r.cloudflareBlackList) {
                const a = rimgoNormalRedirectsChecks.indexOf(instance);
                if (a > -1) rimgoNormalRedirectsChecks.splice(a, 1);

                const b = rimgoTorRedirectsChecks.indexOf(instance);
                if (b > -1) rimgoTorRedirectsChecks.splice(b, 1);

                const c = rimgoI2pRedirectsChecks.indexOf(instance);
                if (c > -1) rimgoI2pRedirectsChecks.splice(c, 1);
            }

            browser.storage.local.set({
                imgurRedirects: redirects,
                rimgoNormalRedirectsChecks,
                rimgoTorRedirectsChecks,
                rimgoI2pRedirectsChecks,
            }, () => resolve());
        })
    })
}

let
    disableImgur,
    imgurRedirects,
    imgurProtocol,
    rimgoNormalRedirectsChecks,
    rimgoNormalCustomRedirects,
    rimgoTorRedirectsChecks,
    rimgoTorCustomRedirects,
    rimgoI2pRedirectsChecks,
    rimgoI2pCustomRedirects;

function init() {
    return new Promise(async resolve => {
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
                disableImgur = r.disableImgur;
                imgurRedirects = r.imgurRedirects;
                imgurProtocol = r.imgurProtocol;
                rimgoNormalRedirectsChecks = r.rimgoNormalRedirectsChecks;
                rimgoNormalCustomRedirects = r.rimgoNormalCustomRedirects;
                rimgoTorRedirectsChecks = r.rimgoTorRedirectsChecks;
                rimgoTorCustomRedirects = r.rimgoTorCustomRedirects;
                rimgoI2pRedirectsChecks = r.rimgoI2pRedirectsChecks;
                rimgoI2pCustomRedirects = r.rimgoI2pCustomRedirects;
                resolve();
            }
        )
    })
}

init();
browser.storage.onChanged.addListener(init)

// https://imgur.com/gallery/s4WXQmn
// https://imgur.com/a/H8M4rcp
// https://imgur.com/gallery/gYiQLWy
// https://imgur.com/gallery/cTRwaJU
// https://i.imgur.com/CFSQArP.jpeg

function all() {
    return [
        ...imgurRedirects.rimgo.normal,
        ...imgurRedirects.rimgo.tor,
        ...imgurRedirects.rimgo.i2p,
        ...rimgoNormalCustomRedirects,
        ...rimgoTorCustomRedirects,
        ...rimgoI2pCustomRedirects,
    ];
}

function redirect(url, type, initiator) {
    if (disableImgur) return;
    if (url.pathname == "/") return;
    if (!["main_frame", "sub_frame", "xmlhttprequest", "other", "image", "media",].includes(type)) return;
    if (initiator && (all().includes(initiator.origin) || targets.test(initiator.host))) return;
    if (!targets.test(url.href)) return;
    if (url.pathname.includes("delete/")) return;

    let instancesList;
    if (imgurProtocol == 'normal') instancesList = [...rimgoNormalRedirectsChecks, ...rimgoNormalCustomRedirects];
    if (imgurProtocol == 'tor') instancesList = [...rimgoTorRedirectsChecks, ...rimgoTorCustomRedirects];
    if (imgurProtocol == 'i2p') instancesList = [...rimgoI2pRedirectsChecks, ...rimgoI2pCustomRedirects];
    if (instancesList.length === 0) return;

    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
}

function reverse(url) {
    return new Promise(async resolve => {
        await init();
        const protocolHost = utils.protocolHost(url);
        if (!all().includes(protocolHost)) { resolve(); return; }
        resolve(`https://imgur.com${url.pathname}${url.search}`);
    })
}

function switchInstance(url) {
    return new Promise(async resolve => {
        await init();
        let protocolHost = utils.protocolHost(url);
        if (!all().includes(protocolHost)) { resolve(); return; }
        let instancesList;
        if (imgurProtocol == 'normal') instancesList = [...rimgoNormalCustomRedirects, ...rimgoNormalRedirectsChecks];
        else if (imgurProtocol == 'tor') instancesList = [...rimgoTorCustomRedirects, ...rimgoTorRedirectsChecks];
        else if (imgurProtocol == 'i2p') instancesList = [...rimgoI2pCustomRedirects, ...rimgoI2pRedirectsChecks];

        const i = instancesList.indexOf(protocolHost);
        if (i > -1) instancesList.splice(i, 1);
        if (instancesList.length === 0) { resolve(); return; }

        const randomInstance = utils.getRandomInstance(instancesList);
        resolve(`${randomInstance}${url.pathname}${url.search}`);
    })
}

function initDefaults() {
    return new Promise(resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(async data => {
            let dataJson = JSON.parse(data);
            redirects.rimgo = dataJson.rimgo;
            browser.storage.local.get('cloudflareBlackList', async r => {
                rimgoNormalRedirectsChecks = [...redirects.rimgo.normal];
                for (const instance of r.cloudflareBlackList) {
                    const i = rimgoNormalRedirectsChecks.indexOf(instance);
                    if (i > -1) rimgoNormalRedirectsChecks.splice(i, 1);
                }
                browser.storage.local.set({
                    disableImgur: false,
                    imgurProtocol: 'normal',
                    imgurRedirects: redirects,

                    rimgoNormalRedirectsChecks: rimgoNormalRedirectsChecks,
                    rimgoNormalCustomRedirects: [],

                    rimgoTorRedirectsChecks: [...redirects.rimgo.tor],
                    rimgoTorCustomRedirects: [],

                    rimgoI2pRedirectsChecks: [...redirects.rimgo.i2p],
                    rimgoI2pCustomRedirects: [],
                }, () => resolve());
            });
        });
    });
}

export default {
    setRedirects,
    redirect,
    reverse,
    initDefaults,
    switchInstance,
};

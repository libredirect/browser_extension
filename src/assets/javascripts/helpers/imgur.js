window.browser = window.browser || window.chrome;

import utils from './utils.js'

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
    rimgoI2pRedirectsChecks;

function redirect(url, type, initiator) {
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
                if (r.disableImgur) { resolve(); return; }
                if (url.pathname == "/") { resolve(); return; }
                if (!["main_frame", "sub_frame", "xmlhttprequest", "other", "image", "media",].includes(type)) { resolve(); return; }
                if (
                    initiator &&
                    (
                        [
                            ...r.imgurRedirects.rimgo.normal,
                            ...r.rimgoNormalCustomRedirects,
                            ...r.rimgoTorCustomRedirects,
                            ...r.rimgoI2pCustomRedirects,
                        ].includes(initiator.origin) || targets.test(initiator.host))
                ) { resolve(); return; }
                if (!targets.test(url.href)) { resolve(); return; }
                if (url.pathname.includes("delete/")) { resolve(); return; }
                // https://imgur.com/gallery/s4WXQmn
                // https://imgur.com/a/H8M4rcp
                // https://imgur.com/gallery/gYiQLWy
                // https://imgur.com/gallery/cTRwaJU
                // https://i.imgur.com/CFSQArP.jpeg
                let instancesList;
                if (r.imgurProtocol == 'normal') instancesList = [...r.rimgoNormalRedirectsChecks, ...r.rimgoNormalCustomRedirects];
                if (r.imgurProtocol == 'tor') instancesList = [...r.rimgoTorRedirectsChecks, ...r.rimgoTorCustomRedirects];
                if (r.imgurProtocol == 'i2p') instancesList = [...r.rimgoI2pRedirectsChecks, ...r.rimgoI2pCustomRedirects];
                if (instancesList.length === 0) { resolve(); return; }

                let randomInstance = utils.getRandomInstance(instancesList)
                resolve(`${randomInstance}${url.pathname}${url.search}`);
            }
        )
    })
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
            let protocolHost = utils.protocolHost(url);
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
    return new Promise(resolve => {
        browser.storage.local.get(
            [
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
                let protocolHost = utils.protocolHost(url);
                if (![
                    ...r.imgurRedirects.rimgo.normal,
                    ...r.imgurRedirects.rimgo.tor,
                    ...r.imgurRedirects.rimgo.i2p,

                    ...r.rimgoNormalCustomRedirects,
                    ...r.rimgoTorCustomRedirects,
                    ...r.rimgoI2pCustomRedirects,
                ].includes(protocolHost)) resolve();

                let instancesList;
                if (r.imgurProtocol == 'normal') instancesList = [...r.rimgoNormalCustomRedirects, ...r.rimgoNormalRedirectsChecks];
                else if (r.imgurProtocol == 'tor') instancesList = [...r.rimgoTorCustomRedirects, ...r.rimgoTorRedirectsChecks];
                else if (r.imgurProtocol == 'i2p') instancesList = [...r.rimgoI2pCustomRedirects, ...r.rimgoI2pRedirectsChecks];

                let index = instancesList.indexOf(protocolHost);
                if (index > -1) instancesList.splice(index, 1);
                if (instancesList.length === 0) resolve();

                let randomInstance = utils.getRandomInstance(instancesList);
                resolve(`${randomInstance}${url.pathname}${url.search}`);
            }
        )
    })
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

export default {
    getRedirects,
    setRedirects,

    redirect,
    reverse,
    initDefaults,
    switchInstance,
};

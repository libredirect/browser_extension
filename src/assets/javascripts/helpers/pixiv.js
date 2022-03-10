window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
    /^https?:\/\/(www\.|)pixiv\.net.*/
];

let redirects = {
    "pixivMoe": {
        "normal": [
            "https://pixiv.moe"
        ],
        "tor": []
    }
}

const getRedirects = () => redirects;
const getCustomRedirects = function () {
    return {
        "pixivMoe": {
            "normal": [...pixivMoeNormalRedirectsChecks, ...pixivMoeNormalCustomRedirects],
            "tor": []
        },
    };
};

function setRedirects(val) {
    redirects.pixivMoe = val;
    browser.storage.local.set({ pixivRedirects: redirects })
    console.log("pixivRedirects: ", val)
    for (const item of pixivMoeNormalRedirectsChecks)
        if (!redirects.pixivMoe.normal.includes(item)) {
            var index = pixivMoeNormalRedirectsChecks.indexOf(item);
            if (index !== -1) pixivMoeNormalRedirectsChecks.splice(index, 1);
        }
    setPixivMoeNormalRedirectsChecks(pixivMoeNormalRedirectsChecks);

    for (const item of pixivMoeTorRedirectsChecks)
        if (!redirects.pixivMoe.normal.includes(item)) {
            var index = pixivMoeTorRedirectsChecks.indexOf(item);
            if (index !== -1) pixivMoeTorRedirectsChecks.splice(index, 1);
        }
    setPixivMoeTorRedirectsChecks(pixivMoeTorRedirectsChecks);
}

let pixivMoeNormalRedirectsChecks;
const getPixivMoeNormalRedirectsChecks = () => pixivMoeNormalRedirectsChecks;
function setPixivMoeNormalRedirectsChecks(val) {
    pixivMoeNormalRedirectsChecks = val;
    browser.storage.local.set({ pixivMoeNormalRedirectsChecks })
    console.log("pixivMoeNormalRedirectsChecks: ", val)
}

let pixivMoeTorRedirectsChecks;
const getPixivMoeTorRedirectsChecks = () => pixivMoeTorRedirectsChecks;
function setPixivMoeTorRedirectsChecks(val) {
    pixivMoeTorRedirectsChecks = val;
    browser.storage.local.set({ pixivMoeTorRedirectsChecks })
    console.log("pixivMoeTorRedirectsChecks: ", val)
}

let pixivMoeNormalCustomRedirects = [];
const getPixivMoeNormalCustomRedirects = () => pixivMoeNormalCustomRedirects;
function setPixivMoeNormalCustomRedirects(val) {
    pixivMoeNormalCustomRedirects = val;
    browser.storage.local.set({ pixivMoeNormalCustomRedirects })
    console.log("pixivMoeNormalCustomRedirects: ", val)
}

let pixivMoeTorCustomRedirects = [];
const getPixivMoeTorCustomRedirects = () => pixivMoeTorCustomRedirects;
function setPixivMoeTorCustomRedirects(val) {
    pixivMoeTorCustomRedirects = val;
    browser.storage.local.set({ pixivMoeTorCustomRedirects })
    console.log("pixivMoeTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.local.set({ disablePixiv: disable })
    console.log("disablePixiv", val);
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
    protocol = val;
    browser.storage.local.set({ pixivProtocol: val })
    console.log("pixivProtocol: ", val)
}

function redirect(url, type, initiator) {
    // https://www.pixiv.net/artworks/96572356
    // https://www.pixiv.net/en/artworks/96572356
    // https://pixiv.moe/illust/96572356

    if (disable) return null;
    if (initiator && ([...redirects.pixivMoe.normal, ...pixivMoeNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))) return null;
    if (!targets.some((rx) => rx.test(url.href))) return null;
    console.log("PixivMoe!!");

    if (type != "main_frame" && type != "sub_frame") return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...pixivMoeNormalRedirectsChecks, ...pixivMoeNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...pixivMoeTorRedirectsChecks, ...pixivMoeTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    let pathName = url.pathname
        .replace('/artworks/', '/illust/')
        .replace(/\/..\//, '/')

    return `${randomInstance}${pathName}`;
}

async function init() {
    return new Promise((resolve) => {
        fetch('/instances/data.json').then(response => response.text()).then(data => {
            let dataJson = JSON.parse(data);
            browser.storage.local.get(
                [
                    "disablePixiv",
                    "pixivRedirects",

                    "pixivMoeNormalRedirectsChecks",
                    "pixivMoeNormalCustomRedirects",

                    "pixivMoeTorRedirectsChecks",
                    "pixivMoeTorCustomRedirects",

                    "pixivProtocol"
                ],
                r => {
                    disable = r.disablePixiv ?? true;

                    protocol = r.pixivProtocol ?? "normal";

                    if (r.pixivRedirects) redirects = r.pixivRedirects;

                    pixivMoeNormalRedirectsChecks = r.pixivMoeNormalRedirectsChecks ?? [...redirects.pixivMoe.normal];
                    pixivMoeNormalCustomRedirects = r.pixivMoeNormalCustomRedirects ?? [];

                    pixivMoeTorRedirectsChecks = r.pixivMoeTorRedirectsChecks ?? [...redirects.pixivMoe.tor];
                    pixivMoeTorCustomRedirects = r.pixivMoeTorCustomRedirects ?? [];

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

    getPixivMoeNormalRedirectsChecks,
    setPixivMoeNormalRedirectsChecks,
    getPixivMoeTorRedirectsChecks,
    setPixivMoeTorRedirectsChecks,

    getPixivMoeTorCustomRedirects,
    setPixivMoeTorCustomRedirects,
    getPixivMoeNormalCustomRedirects,
    setPixivMoeNormalCustomRedirects,

    redirect,
    init,
};

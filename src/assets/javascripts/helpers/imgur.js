window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
    /^https?:\/\/(i|).?imgur.com/
];

let redirects = {
    "rimgo": {
        "normal": [
            "https://i.bcow.xyz",
            "https://rimgo.bcow.xyz",
            "https://rimgo.pussthecat.org",
            "https://img.riverside.rocks",
            "https://rimgo.totaldarkness.net",
            "https://rimgo.bus-hit.me"
        ],
        "tor": [
            "http://l4d4owboqr6xcmd6lf64gbegel62kbudu3x3jnldz2mx6mhn3bsv3zyd.onion",
            "http://jx3dpcwedpzu2mh54obk5gvl64i2ln7pt5mrzd75s4jnndkqwzaim7ad.onion"
        ]
    }
}

const getRedirects = () => redirects;

const getCustomRedirects = function () {
    return {
        "rimgo": {
            "normal": [...rimgoNormalRedirectsChecks, ...rimgoNormalCustomRedirects]
        },
    };
};

function setRedirects(val) {
    redirects.rimgo = val;
    browser.storage.sync.set({ imgurRedirects: redirects })
    console.log("imgurRedirects: ", val)
    for (const item of rimgoNormalRedirectsChecks)
        if (!redirects.rimgo.normal.includes(item)) {
            var index = rimgoNormalRedirectsChecks.indexOf(item);
            if (index !== -1) rimgoNormalRedirectsChecks.splice(index, 1);
        }
    setRimgoNormalRedirectsChecks(rimgoNormalRedirectsChecks);
}

let rimgoNormalRedirectsChecks;
const getRimgoNormalRedirectsChecks = () => rimgoNormalRedirectsChecks;
function setRimgoNormalRedirectsChecks(val) {
    rimgoNormalRedirectsChecks = val;
    browser.storage.sync.set({ rimgoNormalRedirectsChecks })
    console.log("rimgoNormalRedirectsChecks: ", val)
}

let rimgoNormalCustomRedirects = [];
const getRimgoNormalCustomRedirects = () => rimgoNormalCustomRedirects;
function setRimgoNormalCustomRedirects(val) {
    rimgoNormalCustomRedirects = val;
    browser.storage.sync.set({ rimgoNormalCustomRedirects })
    console.log("rimgoNormalCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.sync.set({ disableImgur: disable })
}

function isImgur(url, initiator) {
    if (disable) return false;
    if (url.pathname == "/") return false;
    if (
        initiator &&
        ([...redirects.rimgo.normal, ...rimgoNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))
    ) return false;
    return targets.some((rx) => rx.test(url.href));
}

function redirect(url, type) {
    // https://imgur.com/gallery/s4WXQmn
    // https://imgur.com/a/H8M4rcp
    // https://imgur.com/gallery/gYiQLWy
    // https://imgur.com/gallery/cTRwaJU
    // https://i.imgur.com/CFSQArP.jpeg

    if (type != "main_frame" && "sub_frame" && "xmlhttprequest" && "other") return null;

    let instancesList = [...rimgoNormalRedirectsChecks, ...rimgoNormalCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    return `${randomInstance}${url.pathname}${url.search}`;
}

async function init() {
    return new Promise((resolve) => {
        browser.storage.sync.get(
            [
                "disableImgur",
                "imgurRedirects",
                "rimgoNormalRedirectsChecks",
                "rimgoNormalCustomRedirects",
            ],
            (result) => {
                disable = result.disableImgur ?? false;

                if (result.imgurRedirects) redirects = result.imgurRedirects;

                rimgoNormalRedirectsChecks = result.rimgoNormalRedirectsChecks ?? [...redirects.rimgo.normal];
                rimgoNormalCustomRedirects = result.rimgoNormalCustomRedirects ?? [];

                resolve();
            }
        )
    });
}

export default {
    getRedirects,
    getCustomRedirects,
    setRedirects,

    getDisable,
    setDisable,

    getRimgoNormalRedirectsChecks,
    setRimgoNormalRedirectsChecks,

    getRimgoNormalCustomRedirects,
    setRimgoNormalCustomRedirects,

    redirect,
    isImgur,
    init,
};

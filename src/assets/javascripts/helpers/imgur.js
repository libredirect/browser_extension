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
        "onion": [
            "http://l4d4owboqr6xcmd6lf64gbegel62kbudu3x3jnldz2mx6mhn3bsv3zyd.onion",
            "http://jx3dpcwedpzu2mh54obk5gvl64i2ln7pt5mrzd75s4jnndkqwzaim7ad.onion"
        ]
    }
}

const getRedirects = () => redirects;

const getCustomRedirects = function () {
    return {
        "rimgo": {
            "normal": [...rimgoRedirectsChecks, ...rimgoCustomRedirects]
        },
    };
};

function setRedirects(val) {
    redirects.rimgo = val;
    browser.storage.sync.set({ imgurRedirects: redirects })
    console.log("imgurRedirects: ", val)
    for (const item of rimgoRedirectsChecks)
        if (!redirects.rimgo.normal.includes(item)) {
            var index = rimgoRedirectsChecks.indexOf(item);
            if (index !== -1) rimgoRedirectsChecks.splice(index, 1);
        }
    setRimgoRedirectsChecks(rimgoRedirectsChecks);
}

let rimgoRedirectsChecks;
const getRimgoRedirectsChecks = () => rimgoRedirectsChecks;
function setRimgoRedirectsChecks(val) {
    rimgoRedirectsChecks = val;
    browser.storage.sync.set({ rimgoRedirectsChecks })
    console.log("rimgoRedirectsChecks: ", val)
}

let rimgoCustomRedirects = [];
const getRimgoCustomRedirects = () => rimgoCustomRedirects;
function setRimgoCustomRedirects(val) {
    rimgoCustomRedirects = val;
    browser.storage.sync.set({ rimgoCustomRedirects })
    console.log("rimgoCustomRedirects: ", val)
}

let disableImgur;
const getDisableImgur = () => disableImgur;
function setDisableImgur(val) {
    disableImgur = val;
    browser.storage.sync.set({ disableImgur })
}

function redirect(url, initiator, type) {
    // https://imgur.com/gallery/s4WXQmn
    // https://imgur.com/a/H8M4rcp
    // https://imgur.com/gallery/gYiQLWy
    // https://imgur.com/gallery/cTRwaJU
    // https://i.imgur.com/CFSQArP.jpeg

    if (disableImgur) return null;

    if (url.pathname == "/") return null;

    if (type != "main_frame" && "sub_frame" && "xmlhttprequest" && "other") return null;

    let instancesList = [...rimgoRedirectsChecks, ...rimgoCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    if (initiator && (instancesList.includes(initiator.origin) || targets.includes(initiator.host))) return null;

    return `${randomInstance}${url.pathname}${url.search}`;
}

function isImgur(url) {
    return targets.some((rx) => rx.test(url.href));
}

async function init() {
    let result = await browser.storage.sync.get([
        "disableImgur",
        "imgurRedirects",
        "rimgoRedirectsChecks",
        "rimgoCustomRedirects",
    ])
    disableImgur = result.disableImgur ?? false;
    if (result.imgurRedirects)
        redirects = result.imgurRedirects;

    rimgoRedirectsChecks = result.rimgoRedirectsChecks ?? [...redirects.rimgo.normal];
    rimgoCustomRedirects = result.rimgoCustomRedirects ?? [];
}

export default {
    targets,

    getRedirects,
    getCustomRedirects,
    setRedirects,

    getDisableImgur,
    setDisableImgur,

    getRimgoRedirectsChecks,
    setRimgoRedirectsChecks,

    getRimgoCustomRedirects,
    setRimgoCustomRedirects,

    redirect,
    isImgur,
    init,
};

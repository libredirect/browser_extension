window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

let targets = [];

let redirects = {
    "simpleertube": {
        "normal": [
            "https://tube.simple-web.org",
            "https://tube.fr.tild3.org",
            "https://stube.alefvanoon.xyz",
            "https://st.phreedom.club",
        ],
        "tor": []
    }
}

const getRedirects = () => redirects;
const getCustomRedirects = function () {
    return {
        "simpleertube": {
            "normal": [...simpleertubeNormalRedirectsChecks, ...simpleertubeNormalCustomRedirects]
        },
    };
};

function setRedirects(val) {
    redirects.simpleertube = val;
    browser.storage.local.set({ peertubeTargetsRedirects: redirects })
    console.log("peertubeTargetsRedirects: ", val)
    for (const item of simpleertubeNormalRedirectsChecks)
        if (!redirects.simpleertube.normal.includes(item)) {
            var index = simpleertubeNormalRedirectsChecks.indexOf(item);
            if (index !== -1) simpleertubeNormalRedirectsChecks.splice(index, 1);
        }
    setSimpleertubeNormalRedirectsChecks(simpleertubeNormalRedirectsChecks);

    for (const item of simpleertubeTorRedirectsChecks)
        if (!redirects.simpleertube.normal.includes(item)) {
            var index = simpleertubeTorRedirectsChecks.indexOf(item);
            if (index !== -1) simpleertubeTorRedirectsChecks.splice(index, 1);
        }
    setSimpleertubeTorRedirectsChecks(simpleertubeTorRedirectsChecks);
}

let simpleertubeNormalRedirectsChecks;
const getSimpleertubeNormalRedirectsChecks = () => simpleertubeNormalRedirectsChecks;
function setSimpleertubeNormalRedirectsChecks(val) {
    simpleertubeNormalRedirectsChecks = val;
    browser.storage.local.set({ simpleertubeNormalRedirectsChecks })
    console.log("simpleertubeNormalRedirectsChecks: ", val)
}

let simpleertubeTorRedirectsChecks;
const getSimpleertubeTorRedirectsChecks = () => simpleertubeTorRedirectsChecks;
function setSimpleertubeTorRedirectsChecks(val) {
    simpleertubeTorRedirectsChecks = val;
    browser.storage.local.set({ simpleertubeTorRedirectsChecks })
    console.log("simpleertubeTorRedirectsChecks: ", val)
}

let simpleertubeNormalCustomRedirects = [];
const getSimpleertubeNormalCustomRedirects = () => simpleertubeNormalCustomRedirects;
function setSimpleertubeNormalCustomRedirects(val) {
    simpleertubeNormalCustomRedirects = val;
    browser.storage.local.set({ simpleertubeNormalCustomRedirects })
    console.log("simpleertubeNormalCustomRedirects: ", val)
}

let simpleertubeTorCustomRedirects = [];
const getSimpleertubeTorCustomRedirects = () => simpleertubeTorCustomRedirects;
function setSimpleertubeTorCustomRedirects(val) {
    simpleertubeTorCustomRedirects = val;
    browser.storage.local.set({ simpleertubeTorCustomRedirects })
    console.log("simpleertubeTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.local.set({ disablePeertubeTargets: disable })
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
    protocol = val;
    browser.storage.local.set({ peertubeTargetsProtocol: val })
    console.log("peertubeTargetsProtocol: ", val)
}

function changeInstance(url) {
    let protocolHost = `${url.protocol}//${url.host}`;

    let simpleertubeList = [
        ...redirects.simpleertube.normal,
        ...redirects.simpleertube.tor,
        ...simpleertubeNormalCustomRedirects,
        ...simpleertubeTorCustomRedirects,
    ];

    if (!simpleertubeList.includes(protocolHost)) return;

    let instancesList;
    if (protocol == 'normal') instancesList = [...simpleertubeNormalRedirectsChecks, ...simpleertubeNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...simpleertubeTorRedirectsChecks, ...simpleertubeTorCustomRedirects];

    console.log("instancesList", instancesList);
    let index = instancesList.indexOf(protocolHost);
    if (index > -1) instancesList.splice(index, 1);

    if (instancesList.length === 0) return null;

    let randomInstance = commonHelper.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
}

function redirect(url, type, initiator) {

    let protocolHost = `${url.protocol}//${url.host}`;

    if (disable) return null;
    if (initiator && ([...redirects.simpleertube.normal, ...simpleertubeNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))) return null;
    if (!targets.includes(protocolHost)) return null;

    if (type != "main_frame") return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...simpleertubeNormalRedirectsChecks, ...simpleertubeNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...simpleertubeTorRedirectsChecks, ...simpleertubeTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    if (url.host == 'search.joinpeertube.org') return randomInstance;

    return `${randomInstance}/${url.host}${url.pathname}${url.search}`;
}

async function init() {
    return new Promise(resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(data => {
            let dataJson = JSON.parse(data);
            browser.storage.local.get(
                [
                    "disablePeertubeTargets",
                    "peertubeTargetsRedirects",

                    "simpleertubeNormalRedirectsChecks",
                    "simpleertubeNormalCustomRedirects",

                    "simpleertubeTorRedirectsChecks",
                    "simpleertubeTorCustomRedirects",

                    "peertubeTargetsProtocol"
                ],
                r => {

                    targets = ['https://search.joinpeertube.org', ...dataJson.peertube];

                    disable = r.disablePeertubeTargets ?? true;

                    protocol = r.peertubeTargetsProtocol ?? "normal";

                    if (r.peertubeTargetsRedirects) redirects = r.peertubeTargetsRedirects;

                    simpleertubeNormalRedirectsChecks = r.simpleertubeNormalRedirectsChecks ?? [...redirects.simpleertube.normal];
                    simpleertubeNormalCustomRedirects = r.simpleertubeNormalCustomRedirects ?? [];

                    simpleertubeTorRedirectsChecks = r.simpleertubeTorRedirectsChecks ?? [...redirects.simpleertube.tor];
                    simpleertubeTorCustomRedirects = r.simpleertubeTorCustomRedirects ?? [];

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

    getSimpleertubeNormalRedirectsChecks,
    setSimpleertubeNormalRedirectsChecks,
    getSimpleertubeTorRedirectsChecks,
    setSimpleertubeTorRedirectsChecks,

    getSimpleertubeTorCustomRedirects,
    setSimpleertubeTorCustomRedirects,
    getSimpleertubeNormalCustomRedirects,
    setSimpleertubeNormalCustomRedirects,

    changeInstance,

    redirect,
    init,
};

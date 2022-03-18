window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
    /^https?:\/{2}send.invalid\/$/,
    /^ https ?: \/\/send\.firefox\.com\/$/,
    /^https?:\/{2}sendfiles\.online\/$/
];

let redirects = {
    "send": {
        "normal": [
            "https://send.silkky.cloud",
            "https://send.turingpoint.de",
            "https://send.ephemeral.land",
            "https://send.monks.tools",
            "https://send.jeugdhulp.be",
            "https://send.aurorabilisim.com",
            "https://nhanh.cloud",
            "https://send.datahoarder.dev",
            "https://send.navennec.net",
            "https://fileupload.ggc-project.de",
            "https://drop.chapril.org",
            "https://files.psu.ru",
            "https://send.portailpro.net",
            "https://bytefile.de",
            "https://transfer.acted.org ",
        ],
        "tor": []
    }
}

const getRedirects = () => redirects;
const getCustomRedirects = function () {
    return {
        "send": {
            "normal": [...sendNormalRedirectsChecks, ...sendNormalCustomRedirects]
        },
    };
};

function setRedirects(val) {
    redirects.send = val;
    browser.storage.local.set({ sendTargetsRedirects: redirects })
    console.log("sendTargetsRedirects: ", val)
    for (const item of sendNormalRedirectsChecks)
        if (!redirects.send.normal.includes(item)) {
            var index = sendNormalRedirectsChecks.indexOf(item);
            if (index !== -1) sendNormalRedirectsChecks.splice(index, 1);
        }
    setSendNormalRedirectsChecks(sendNormalRedirectsChecks);

    for (const item of sendTorRedirectsChecks)
        if (!redirects.send.normal.includes(item)) {
            var index = sendTorRedirectsChecks.indexOf(item);
            if (index !== -1) sendTorRedirectsChecks.splice(index, 1);
        }
    setSendTorRedirectsChecks(sendTorRedirectsChecks);
}

let sendNormalRedirectsChecks;
const getSendNormalRedirectsChecks = () => sendNormalRedirectsChecks;
function setSendNormalRedirectsChecks(val) {
    sendNormalRedirectsChecks = val;
    browser.storage.local.set({ sendNormalRedirectsChecks })
    console.log("sendNormalRedirectsChecks: ", val)
}

let sendTorRedirectsChecks;
const getSendTorRedirectsChecks = () => sendTorRedirectsChecks;
function setSendTorRedirectsChecks(val) {
    sendTorRedirectsChecks = val;
    browser.storage.local.set({ sendTorRedirectsChecks })
    console.log("sendTorRedirectsChecks: ", val)
}

let sendNormalCustomRedirects = [];
const getSendNormalCustomRedirects = () => sendNormalCustomRedirects;
function setSendNormalCustomRedirects(val) {
    sendNormalCustomRedirects = val;
    browser.storage.local.set({ sendNormalCustomRedirects })
    console.log("sendNormalCustomRedirects: ", val)
}

let sendTorCustomRedirects = [];
const getSendTorCustomRedirects = () => sendTorCustomRedirects;
function setSendTorCustomRedirects(val) {
    sendTorCustomRedirects = val;
    browser.storage.local.set({ sendTorCustomRedirects })
    console.log("sendTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
    disable = val;
    browser.storage.local.set({ disableSendTarget: disable })
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
    protocol = val;
    browser.storage.local.set({ sendTargetsProtocol: val })
    console.log("sendTargetsProtocol: ", val)
}

function switchInstance(url) {
    let protocolHost = `${url.protocol}//${url.host}`;

    let sendList = [
        ...redirects.send.normal,
        ...redirects.send.tor,
        ...sendNormalCustomRedirects,
        ...sendTorCustomRedirects,
    ];

    if (!sendList.includes(protocolHost)) return;

    if (url.pathname != '/') return;

    let instancesList;
    if (protocol == 'normal') instancesList = [...sendNormalRedirectsChecks, ...sendNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...sendTorRedirectsChecks, ...sendTorCustomRedirects];

    console.log("instancesList", instancesList);
    let index = instancesList.indexOf(protocolHost);
    if (index > -1) instancesList.splice(index, 1);

    if (instancesList.length === 0) return null;

    let randomInstance = commonHelper.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
}

function redirect(url, type, initiator) {

    if (disable) return null;
    if (initiator && ([...redirects.send.normal, ...sendNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))) return null;
    if (!targets.some((rx) => rx.test(url.href))) return null;

    if (type != "main_frame") return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...sendNormalRedirectsChecks, ...sendNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...sendTorRedirectsChecks, ...sendTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    return randomInstance;
}

async function init() {
    return new Promise(resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(data => {
            let dataJson = JSON.parse(data);
            browser.storage.local.get(
                [
                    "disableSendTarget",
                    "sendTargetsRedirects",

                    "sendNormalRedirectsChecks",
                    "sendNormalCustomRedirects",

                    "sendTorRedirectsChecks",
                    "sendTorCustomRedirects",

                    "sendTargetsProtocol"
                ],
                r => {
                    disable = r.disableSendTarget ?? false;

                    protocol = r.sendTargetsProtocol ?? "normal";

                    if (r.sendTargetsRedirects) redirects = r.sendTargetsRedirects;

                    sendNormalRedirectsChecks = r.sendNormalRedirectsChecks ?? [...redirects.send.normal];
                    sendNormalCustomRedirects = r.sendNormalCustomRedirects ?? [];

                    sendTorRedirectsChecks = r.sendTorRedirectsChecks ?? [...redirects.send.tor];
                    sendTorCustomRedirects = r.sendTorCustomRedirects ?? [];

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

    getSendNormalRedirectsChecks,
    setSendNormalRedirectsChecks,
    getSendTorRedirectsChecks,
    setSendTorRedirectsChecks,

    getSendTorCustomRedirects,
    setSendTorCustomRedirects,
    getSendNormalCustomRedirects,
    setSendNormalCustomRedirects,

    switchInstance,

    redirect,
    init,
};

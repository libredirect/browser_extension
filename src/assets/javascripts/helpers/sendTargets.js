window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = [
    /^https?:\/{2}send.invalid\/$/,
    /^ https ?: \/\/send\.firefox\.com\/$/,
    /^https?:\/{2}sendfiles\.online\/$/
];

let redirects = {
    "send": {
        "normal": [],
        "tor": []
    }
}
function setRedirects(val) {
    redirects.send = val;
    browser.storage.local.set({ sendTargetsRedirects: redirects })
    console.log("sendTargetsRedirects: ", val)
    for (const item of sendNormalRedirectsChecks)
        if (!redirects.send.normal.includes(item)) {
            var index = sendNormalRedirectsChecks.indexOf(item);
            if (index !== -1) sendNormalRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ sendNormalRedirectsChecks })

    for (const item of sendTorRedirectsChecks)
        if (!redirects.send.normal.includes(item)) {
            var index = sendTorRedirectsChecks.indexOf(item);
            if (index !== -1) sendTorRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ sendTorRedirectsChecks })
}

let sendNormalRedirectsChecks;
let sendTorRedirectsChecks;
let sendNormalCustomRedirects = [];
let sendTorCustomRedirects = [];

let disable; // disableSendTarget
let protocol; // sendTargetsProtocol

async function switchInstance(url) {
    return new Promise(resolve => {
        browser.storage.local.get(
            [
                "disableSendTarget",
                "sendTargetsRedirects",
                "sendTargetsProtocol",

                "sendNormalRedirectsChecks",
                "sendNormalCustomRedirects",

                "sendTorRedirectsChecks",
                "sendTorCustomRedirects",
            ],
            r => {
                let protocolHost = utils.protocolHost(url);
                if (![
                    ...r.sendTargetsRedirects.send.normal,
                    ...r.sendTargetsRedirects.send.tor,
                    ...r.sendNormalCustomRedirects,
                    ...r.sendTorCustomRedirects,
                ].includes(protocolHost)) resolve();

                if (url.pathname != '/') resolve();

                let instancesList;
                if (r.sendTargetsProtocol == 'normal') instancesList = [...r.sendNormalRedirectsChecks, ...r.sendNormalCustomRedirects];
                else if (r.sendTargetsProtocol == 'tor') instancesList = [...r.sendTorRedirectsChecks, ...r.sendTorCustomRedirects];

                let index = instancesList.indexOf(protocolHost);
                if (index > -1) instancesList.splice(index, 1);
                if (instancesList.length === 0) resolve();

                let randomInstance = utils.getRandomInstance(instancesList);
                resolve(`${randomInstance}${url.pathname}${url.search}`);
            }
        )
    })
}

function redirect(url, type, initiator) {
    if (disable) return null;
    if (type != "main_frame") return null;
    if (initiator && (
        [...redirects.send.normal,
        ...sendNormalCustomRedirects
        ].includes(initiator.origin) ||
        targets.includes(initiator.host)
    )) return null;
    if (!targets.some(rx => rx.test(url.href))) return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...sendNormalRedirectsChecks, ...sendNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...sendTorRedirectsChecks, ...sendTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = utils.getRandomInstance(instancesList);

    return randomInstance;
}

async function initDefaults() {
    fetch('/instances/data.json').then(response => response.text()).then(async data => {
        let dataJson = JSON.parse(data);
        redirects.send = dataJson.send;
        browser.storage.local.get('cloudflareList', async r => {
            sendNormalRedirectsChecks = [...redirects.send.normal];
            for (const instance of r.cloudflareList) {
                let i = sendNormalRedirectsChecks.indexOf(instance);
                if (i > -1) sendNormalRedirectsChecks.splice(i, 1);
            }
            await browser.storage.local.set({
                disableSendTarget: false,
                sendTargetsRedirects: redirects,

                sendNormalRedirectsChecks: sendNormalRedirectsChecks,
                sendNormalCustomRedirects: [],

                sendTorRedirectsChecks: [...redirects.send.tor],
                sendTorCustomRedirects: [],

                sendTargetsProtocol: "normal",
            })
        })
    })
}

async function init() {
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
            disable = r.disableSendTarget;
            protocol = r.sendTargetsProtocol;
            redirects = r.sendTargetsRedirects;

            sendNormalRedirectsChecks = r.sendNormalRedirectsChecks;
            sendNormalCustomRedirects = r.sendNormalCustomRedirects;

            sendTorRedirectsChecks = r.sendTorRedirectsChecks;
            sendTorCustomRedirects = r.sendTorCustomRedirects;
        }
    )
}

export default {
    setRedirects,

    redirect,
    switchInstance,

    initDefaults,
    init,
};

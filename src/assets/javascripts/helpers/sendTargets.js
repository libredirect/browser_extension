window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = [
    /^https?:\/{2}send\.libredirect\.invalid\/$/,
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
    browser.storage.local.get('cloudflareList', r => {
        redirects.send = val;
        sendNormalRedirectsChecks = [...redirects.send.normal];
        for (const instance of r.cloudflareList) {
            const a = sendNormalRedirectsChecks.indexOf(instance);
            if (a > -1) sendNormalRedirectsChecks.splice(a, 1);
        }
        browser.storage.local.set({
            sendTargetsRedirects: redirects,
            sendNormalRedirectsChecks,
        })
    })
}

let sendNormalRedirectsChecks;

function switchInstance(url) {
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
    return new Promise(resolve => {
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
                if (r.disableSendTarget) { resolve(); return; }
                if (type != "main_frame") { resolve(); return; }
                if (
                    initiator && (
                        [
                            ...r.sendTargetsRedirects.send.normal,
                            ...r.sendTargetsRedirects.send.tor,
                            ...r.sendNormalCustomRedirects,
                            ...r.sendTorRedirectsChecks
                        ].includes(initiator.origin) ||
                        targets.includes(initiator.host)
                    )
                ) { resolve(); return; }
                if (!targets.some(rx => rx.test(url.href))) { resolve(); return; }

                let instancesList;
                if (r.sendTargetsProtocol == 'normal') instancesList = [...r.sendNormalRedirectsChecks, ...r.sendNormalCustomRedirects];
                if (r.sendTargetsProtocol == 'tor') instancesList = [...r.sendTorRedirectsChecks, ...r.sendTorCustomRedirects];
                if (instancesList.length === 0) { resolve(); return; }

                let randomInstance = utils.getRandomInstance(instancesList);
                resolve(randomInstance);
            }
        )
    })
}

function initDefaults() {
    return new Promise(resolve => {
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
                resolve();
            })
        })
    })
}

export default {
    setRedirects,
    redirect,
    switchInstance,
    initDefaults,
};

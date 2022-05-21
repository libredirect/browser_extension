window.browser = window.browser || window.chrome;

import utils from './utils.js'

let redirects = {
    "simpleertube": {
        "normal": [
            "https://tube.simple-web.org",
            "https://tube.fr.tild3.org",
            "https://stube.alefvanoon.xyz",
            "https://st.phreedom.club",
            "https://simpleertube.esmailelbob.xyz",
        ],
        "tor": []
    }
}
function setRedirects(val) {
    redirects.simpleertube = val;
    browser.storage.local.set({ peertubeTargetsRedirects: redirects })
    for (const item of simpleertubeNormalRedirectsChecks)
        if (!redirects.simpleertube.normal.includes(item)) {
            var index = simpleertubeNormalRedirectsChecks.indexOf(item);
            if (index !== -1) simpleertubeNormalRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ simpleertubeNormalRedirectsChecks })

    for (const item of simpleertubeTorRedirectsChecks)
        if (!redirects.simpleertube.normal.includes(item)) {
            var index = simpleertubeTorRedirectsChecks.indexOf(item);
            if (index !== -1) simpleertubeTorRedirectsChecks.splice(index, 1);
        }
    browser.storage.local.set({ simpleertubeTorRedirectsChecks })
}
let
    simpleertubeNormalRedirectsChecks,
    simpleertubeTorRedirectsChecks;


async function switchInstance(url) {
    return new Promise(resolve => {
        browser.storage.local.get(
            [
                "peerTubeTargets",
                "peertubeTargetsProtocol",

                "simpleertubeNormalRedirectsChecks",
                "simpleertubeNormalCustomRedirects",

                "simpleertubeTorRedirectsChecks",
                "simpleertubeTorCustomRedirects",
            ],
            r => {
                let protocolHost = utils.protocolHost(url);
                if (![
                    ...redirects.simpleertube.normal,
                    ...redirects.simpleertube.tor,
                    ...r.simpleertubeNormalCustomRedirects,
                    ...r.simpleertubeTorCustomRedirects,
                ].includes(protocolHost)) resolve();

                let instancesList;
                if (r.peertubeTargetsProtocol == 'normal') instancesList = [...r.simpleertubeNormalRedirectsChecks, ...r.simpleertubeNormalCustomRedirects];
                else if (r.peertubeTargetsProtocol == 'tor') instancesList = [...r.simpleertubeTorRedirectsChecks, ...r.simpleertubeTorCustomRedirects];

                let index = instancesList.indexOf(protocolHost);
                if (index > -1) instancesList.splice(index, 1);
                if (instancesList.length === 0) resolve()

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
                "disablePeertubeTargets",

                "peertubeRedirects",

                "simpleertubeNormalRedirectsChecks",
                "simpleertubeNormalCustomRedirects",

                "simpleertubeTorRedirectsChecks",
                "simpleertubeTorCustomRedirects",

                "peerTubeTargets",
                "peertubeTargetsProtocol"
            ],
            r => {
                if (r.disablePeertubeTargets) { resolve(); return; }
                if (
                    initiator &&
                    (
                        [
                            ...r.peertubeRedirects.simpleertube.normal,
                            ...r.simpleertubeNormalCustomRedirects
                        ].includes(initiator.origin) ||
                        r.peerTubeTargets.includes(initiator.host)
                    )
                ) { resolve(); return; }
                let protocolHost = utils.protocolHost(url);
                if (!r.peerTubeTargets.includes(protocolHost)) { resolve(); return; }
                if (type != "main_frame") { resolve(); return; }

                let instancesList;
                if (r.peertubeTargetsProtocol == 'normal') instancesList = [...r.simpleertubeNormalRedirectsChecks, ...r.simpleertubeNormalCustomRedirects];
                if (r.peertubeTargetsProtocol == 'tor') instancesList = [...r.simpleertubeTorRedirectsChecks, ...r.simpleertubeTorCustomRedirects];
                if (instancesList.length === 0) { resolve(); return; }
                let randomInstance = utils.getRandomInstance(instancesList);
                if (url.host == 'search.joinpeertube.org') { resolve(randomInstance); return; }

                resolve(`${randomInstance}/${url.host}${url.pathname}${url.search}`);
            }
        )
    })
}
async function initDefaults() {
    return new Promise(resolve => {
        fetch('/instances/data.json').then(response => response.text()).then(async data => {
            let dataJson = JSON.parse(data);
            browser.storage.local.get('cloudflareList', async r => {
                simpleertubeNormalRedirectsChecks = [...redirects.simpleertube.normal];
                for (const instance of r.cloudflareList) {
                    let i = simpleertubeNormalRedirectsChecks.indexOf(instance);
                    if (i > -1) simpleertubeNormalRedirectsChecks.splice(i, 1);
                }
                await browser.storage.local.set({
                    peerTubeTargets: ['https://search.joinpeertube.org', ...dataJson.peertube],
                    disablePeertubeTargets: true,
                    peertubeRedirects: redirects,

                    simpleertubeNormalRedirectsChecks: simpleertubeNormalRedirectsChecks,
                    simpleertubeNormalCustomRedirects: [],

                    simpleertubeTorRedirectsChecks: [...redirects.simpleertube.tor],
                    simpleertubeTorCustomRedirects: [],

                    peertubeTargetsProtocol: "normal",
                })
                resolve();
            })
        })
    })
}

export default {
    setRedirects,
    switchInstance,
    redirect,
    initDefaults,
};

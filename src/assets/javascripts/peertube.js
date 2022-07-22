window.browser = window.browser || window.chrome;

import utils from './utils.js'

let redirects = {
    "simpleertube": {
        "normal": [
            "https://tube.simple-web.org",
            "https://tube.ftild3.org",
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
    disablePeertubeTargets,
    peertubeRedirects,
    simpleertubeNormalRedirectsChecks,
    simpleertubeNormalCustomRedirects,
    simpleertubeTorRedirectsChecks,
    simpleertubeTorCustomRedirects,
    simpleertubeI2pCustomRedirects,
    simpleertubeLokiCustomRedirects,
    peerTubeTargets,
    protocol,
    protocolFallback;

function init() {
    return new Promise(resolve => {
        browser.storage.local.get(
            [
                "disablePeertubeTargets",
                "peertubeRedirects",
                "simpleertubeNormalRedirectsChecks",
                "simpleertubeNormalCustomRedirects",
                "simpleertubeTorRedirectsChecks",
                "simpleertubeTorCustomRedirects",
                "simpleertubeI2pCustomRedirects",
                "simpleertubeLokiCustomRedirects",
                "peerTubeTargets",
                "protocol",
                "protocolFallback"
            ],
            r => {
                disablePeertubeTargets = r.disablePeertubeTargets;
                peertubeRedirects = r.peertubeRedirects;
                simpleertubeNormalRedirectsChecks = r.simpleertubeNormalRedirectsChecks;
                simpleertubeNormalCustomRedirects = r.simpleertubeNormalCustomRedirects;
                simpleertubeTorRedirectsChecks = r.simpleertubeTorRedirectsChecks;
                simpleertubeTorCustomRedirects = r.simpleertubeTorCustomRedirects;
                simpleertubeI2pCustomRedirects = r.simpleertubeI2pCustomRedirects;
                simpleertubeLokiCustomRedirects = r.simpleertubeLokiCustomRedirects;
                peerTubeTargets = r.peerTubeTargets;
                protocol = r.protocol;
                protocolFallback = r.protocolFallback;
                resolve();
            }
        )
    })
}

init();
browser.storage.onChanged.addListener(init)

function all() {
    return [
        ...redirects.simpleertube.normal,
        ...redirects.simpleertube.tor,
        ...simpleertubeNormalCustomRedirects,
        ...simpleertubeTorCustomRedirects,
        ...simpleertubeI2pCustomRedirects,
        ...simpleertubeLokiCustomRedirects
    ];
}

function redirect(url, type, initiator, disableOverride) {
    if (disablePeertubeTargets && !disableOverride) return;
    if (initiator && (all().includes(initiator.origin) || peerTubeTargets.includes(initiator.host))) return;
    let protocolHost = utils.protocolHost(url);
    if (!peerTubeTargets.includes(protocolHost)) return;
    if (type != "main_frame") return;

    let instancesList = [];
    if (protocol == 'loki') instancesList = [...simpleertubeLokiCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...simpleertubeI2pCustomRedirects];
    else if (protocol == 'tor') instancesList = [...simpleertubeTorRedirectsChecks, ...simpleertubeTorCustomRedirects];
    if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
        instancesList = [...simpleertubeNormalRedirectsChecks, ...simpleertubeNormalCustomRedirects];
    }
    if (instancesList.length === 0) { return; }

    const randomInstance = utils.getRandomInstance(instancesList);
    if (url.host == 'search.joinpeertube.org' || url.host == 'sepiasearch.org') return randomInstance;
    return `${randomInstance}/${url.host}${url.pathname}${url.search}`;
}

function switchInstance(url, disableOverride) {
    return new Promise(async resolve => {
        await init();
        if (disablePeertubeTargets && !disableOverride) { resolve(); return; }
        const protocolHost = utils.protocolHost(url);
        if (!all().includes(protocolHost)) { resolve(); return; }

        let instancesList = [];
        if (protocol == 'loki') instancesList = [...simpleertubeLokiCustomRedirects];
        else if (protocol == 'i2p') instancesList = [...simpleertubeI2pCustomRedirects];
        else if (protocol == 'tor') instancesList = [...simpleertubeTorRedirectsChecks, ...simpleertubeTorCustomRedirects];
        if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
            instancesList = [...simpleertubeNormalRedirectsChecks, ...simpleertubeNormalCustomRedirects];
        }

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
            browser.storage.local.get('cloudflareBlackList', async r => {
                simpleertubeNormalRedirectsChecks = [...redirects.simpleertube.normal];
                for (const instance of r.cloudflareBlackList) {
                    let i = simpleertubeNormalRedirectsChecks.indexOf(instance);
                    if (i > -1) simpleertubeNormalRedirectsChecks.splice(i, 1);
                }
                browser.storage.local.set({
                    peerTubeTargets: ['https://search.joinpeertube.org', ...dataJson.peertube],
                    disablePeertubeTargets: true,
                    peertubeRedirects: redirects,

                    simpleertubeNormalRedirectsChecks: simpleertubeNormalRedirectsChecks,
                    simpleertubeNormalCustomRedirects: [],

                    simpleertubeTorRedirectsChecks: [...redirects.simpleertube.tor],
                    simpleertubeTorCustomRedirects: [],

                    simpleertubeI2pCustomRedirects: [],

                    simpleertubeLokiCustomRedirects: []
                }, () => resolve());
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

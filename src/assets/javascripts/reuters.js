window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = [
    /^https?:\/{2}(www\.|)reuters\.com.*/
];

let redirects = {
    "neuters": {
        "normal": [
            'https://neuters.de',
        ],
        "tor": []
    }
}

let
    disableReuters,
    reutersProtocol,
    reutersRedirects,
    neutersNormalRedirectsChecks,
    neutersNormalCustomRedirects,
    neutersTorRedirectsChecks,
    neutersTorCustomRedirects;

function init() {
    return new Promise(async resolve => {
        browser.storage.local.get(
            [
                "disableReuters",
                "reutersProtocol",
                "reutersRedirects",
                "neutersNormalRedirectsChecks",
                "neutersNormalCustomRedirects",
                "neutersTorRedirectsChecks",
                "neutersTorCustomRedirects",
            ],
            r => {
                disableReuters = r.disableReuters;
                reutersProtocol = r.reutersProtocol;
                reutersRedirects = r.reutersRedirects;
                neutersNormalRedirectsChecks = r.neutersNormalRedirectsChecks;
                neutersNormalCustomRedirects = r.neutersNormalCustomRedirects;
                neutersTorRedirectsChecks = r.neutersTorRedirectsChecks;
                neutersTorCustomRedirects = r.neutersTorCustomRedirects;
                resolve();
            }
        )
    })
}

init();
browser.storage.onChanged.addListener(init)

function redirect(url, type, initiator) {
    if (disableReuters) return;
    if (type != "main_frame") return;
    const all = [
        ...reutersRedirects.neuters.normal,
        ...neutersNormalCustomRedirects
    ];
    if (initiator && (all.includes(initiator.origin) || targets.includes(initiator.host))) return;
    if (!targets.some(rx => rx.test(url.href))) return;

    let instancesList;
    if (reutersProtocol == 'normal') instancesList = [...neutersNormalRedirectsChecks, ...neutersNormalCustomRedirects];
    if (reutersProtocol == 'tor') instancesList = [...neutersTorRedirectsChecks, ...neutersTorCustomRedirects];
    if (instancesList.length === 0) return;

    const randomInstance = utils.getRandomInstance(instancesList);
    // stolen from https://addons.mozilla.org/en-US/firefox/addon/reuters-redirect/
    if (
        url.pathname.startsWith('/article/') ||
        url.pathname.startsWith('/pf/') ||
        url.pathname.startsWith('/arc/') ||
        url.pathname.startsWith('/resizer/')
    )
        return null;
    else if (url.pathname.endsWith('/'))
        return `${randomInstance}${url.pathname}`;
    else
        return `${randomInstance}${url.pathname}/`;
}

function initDefaults() {
    return new Promise(resolve => {
        browser.storage.local.set({
            disableReuters: true,
            reutersProtocol: "normal",

            reutersRedirects: redirects,

            neutersNormalRedirectsChecks: [...redirects.neuters.normal],
            neutersNormalCustomRedirects: [],

            neutersTorRedirectsChecks: [...redirects.neuters.tor],
            neutersTorCustomRedirects: [],
        }, () => resolve());
    });
}

export default {
    redirect,
    initDefaults
};

"use strict";

import utils from './utils.js'

window.browser = window.browser || window.chrome;

const targets = [
    /^https?:\/{2}music\.youtube\.com(\/.*|$)/,
];
let redirects = {
    "beatbump": {
        "normal": [
            "https://beatbump.ml"
        ],
        "tor": []
    },
};

let
    disableYoutubeMusic,
    beatbumpNormalRedirectsChecks,
    beatbumpNormalCustomRedirects;

function init() {
    browser.storage.local.get(
        [
            "disableYoutubeMusic",
            "beatbumpNormalRedirectsChecks",
            "beatbumpNormalCustomRedirects",
        ],
        r => {
            disableYoutubeMusic = r.disableYoutubeMusic;
            beatbumpNormalRedirectsChecks = r.beatbumpNormalRedirectsChecks;
            beatbumpNormalCustomRedirects = r.beatbumpNormalCustomRedirects;
        }
    )
}

init();
browser.storage.onChanged.addListener(init)

/* 
Video
https://music.youtube.com/watch?v=_PkGiKBW-DA&list=RDAMVM_PkGiKBW-DA
https://beatbump.ml/listen?id=_PkGiKBW-DA&list=RDAMVM_PkGiKBW-DA

Playlist
https://music.youtube.com/playlist?list=PLqxd0OMLeWy64zlwhjouj92ISc38FbOns
https://music.youtube.com/playlist?list=PLqxd0OMLeWy7lrJSzt9LnOJjbC1IaruPM
https://music.youtube.com/playlist?list=PLQod4DlD72ZMJmOrSNbmEmK_iZ1oXPzKd
https://beatbump.ml/playlist/VLPLqxd0OMLeWy64zlwhjouj92ISc38FbOns

Channel
https://music.youtube.com/channel/UCfgmMDI7T5tOQqjnOBRe_wg
https://beatbump.ml/artist/UCfgmMDI7T5tOQqjnOBRe_wg

Albums
https://music.youtube.com/playlist?list=OLAK5uy_n-9HVh3cryV2gREZM9Sc0JwEKYjjfi0dU
https://music.youtube.com/playlist?list=OLAK5uy_lcr5O1zS8f6WIFI_yxqVp2RK9Dyy2bbw0
https://beatbump.ml/release?id=MPREb_3DURc4yEUtD
https://beatbump.ml/release?id=MPREb_evaZrV1WNdS

https://music.youtube.com/playlist?list=OLAK5uy_n6OHVllUZUCnlIY1m-gUaH8uqkN3Y-Ca8
https://music.youtube.com/playlist?list=OLAK5uy_nBOTxAc3_RGB82-Z54jdARGxGaCYlpngY
https://beatbump.ml/release?id=MPREb_QygdC0wEoLe

https://music.youtube.com/watch?v=R6gSMSYKhKU&list=OLAK5uy_n-9HVh3cryV2gREZM9Sc0JwEKYjjfi0dU

Search
https://music.youtube.com/search?q=test
https://beatbump.ml/search/test?filter=EgWKAQIIAWoKEAMQBBAKEAkQBQ%3D%3D

*/
function redirect(url, disableOverride) {
    if (disableYoutubeMusic && !disableOverride) return;
    if (!targets.some(rx => rx.test(url.href))) return;

    let instancesList = [...beatbumpNormalRedirectsChecks, ...beatbumpNormalCustomRedirects];
    if (instancesList.length === 0) return;
    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`
        .replace("/watch?v=", "/listen?id=")
        .replace("/channel/", "/artist/")
        .replace("/playlist?list=", "/playlist/VL")
        .replace(/\/search\?q=.*/, searchQuery => searchQuery.replace("?q=", "/") + "?filter=EgWKAQIIAWoKEAMQBBAKEAkQBQ%3D%3D");
}

async function initDefaults() {
    return new Promise(resolve =>
        browser.storage.local.set({
            disableYoutubeMusic: true,
            youtubeMusicRedirects: redirects,

            beatbumpNormalRedirectsChecks: [...redirects.beatbump.normal],
            beatbumpNormalCustomRedirects: [],
        }, () => resolve())
    )
}

export default {
    redirect,
    initDefaults,
};

"use strict";

window.browser = window.browser || window.chrome;

async function initDefaults() {
    await browser.storage.local.set({
        youtubeListen: false,
        youtubeVolume: 100,
        youtubeAutoplay: false,
        invidiousAlwaysProxy: false,
        invidiousQuality: 'hd720',
        invidiousPlayerStyle: 'invidious',
        invidiousVideoLoop: false,
        invidiousContinueAutoplay: true,
        invidiousContinue: false,
        invidiousSpeed: '1.0',
        invidiousQualityDash: 'auto',
        invidiousComments: ['youtube', ''],
        invidiousCaptions: ['', '', ''],
        invidiousRelatedVideos: true,
        invidiousAnnotations: false,
        invidiousExtendDesc: false,
        invidiousVrMode: true,
        invidiousSavePlayerPos: false,
        invidiousRegion: 'US',
        invidiousDarkMode: '',
        invidiousThinMode: false,
        invidiousDefaultHome: 'Popular',
        invidiousFeedMenuList: ['Popular', 'Trending']
    })
}

async function initInvidiousCookies() {
    console.log('initInvidiousCookies() starting')
    await browser.storage.local.get(
        [
            "disableYoutube",
            "youtubeFrontend",
            "youtubeProtocol",

            "enableYoutubeCustomSettings",

            "invidiousNormalRedirectsChecks",
            "invidiousNormalCustomRedirects",
            "invidiousTorRedirectsChecks",
            "invidiousTorCustomRedirects",

            "youtubeListen",
            "youtubeVolume",
            "youtubeAutoplay",
            "invidiousQuality",
            "invidiousAlwaysProxy",
            "invidiousQuality",
            "invidiousPlayerStyle",
            "invidiousVideoLoop",
            "invidiousContinueAutoplay",
            "invidiousContinue",
            "invidiousSpeed",
            "invidiousQualityDash",
            "invidiousComments",
            "invidiousCaptions",
            "invidiousRelatedVideos",
            "invidiousAnnotations",
            "invidiousExtendDesc",
            "invidiousVrMode",
            "invidiousSavePlayerPos",
            "invidiousRegion",
            "invidiousDarkMode",
            "invidiousThinMode",
            "invidiousDefaultHome",
            "invidiousFeedMenuList",
        ],
        r => {
            if (!r.disableYoutube && r.youtubeFrontend == 'invidious' && r.enableYoutubeCustomSettings) {
                let checkedInstances;
                if (r.youtubeProtocol == 'normal')
                    checkedInstances = [...r.invidiousNormalRedirectsChecks, ...r.invidiousNormalCustomRedirects]
                else if (r.youtubeProtocol == 'tor')
                    checkedInstances = [...r.invidiousTorRedirectsChecks, ...r.invidiousTorCustomRedirects]

                for (const instanceUrl of checkedInstances)
                    browser.cookies.get(
                        { url: instanceUrl, name: "PREFS" },
                        cookie => {
                            let prefs = {};
                            if (cookie) {
                                prefs = JSON.parse(decodeURIComponent(cookie.value));
                                browser.cookies.remove({ url: instanceUrl, name: "PREFS" });
                            }

                            prefs.local = r.invidiousAlwaysProxy;
                            prefs.video_loop = r.invidiousVideoLoop;
                            prefs.continue_autoplay = r.invidiousContinueAutoplay;
                            prefs.continue = r.invidiousContinue;
                            prefs.listen = r.youtubeListen;
                            prefs.speed = parseFloat(r.invidiousSpeed);
                            prefs.quality = r.invidiousQuality;
                            prefs.quality_dash = r.invidiousQualityDash;

                            prefs.comments = r.invidiousComments;
                            prefs.captions = r.invidiousCaptions;

                            prefs.related_videos = r.invidiousRelatedVideos;
                            prefs.annotations = r.invidiousAnnotations
                            prefs.extend_desc = r.invidiousExtendDesc;
                            prefs.vr_mode = r.invidiousVrMode;
                            prefs.save_player_pos = r.invidiousSavePlayerPos;

                            prefs.volume = parseInt(r.youtubeVolume);
                            prefs.player_style = r.invidiousPlayerStyle;
                            prefs.autoplay = r.youtubeAutoplay;

                            prefs.region = r.invidiousRegion;
                            prefs.dark_mode = r.invidiousDarkMode;
                            prefs.thin_mode = r.invidiousThinMode;
                            prefs.default_home = r.invidiousDefaultHome;
                            prefs.feed_menu = r.invidiousFeedMenuList;

                            browser.cookies.set({
                                url: instanceUrl, name: "PREFS",
                                value: encodeURIComponent(JSON.stringify(prefs))
                            })
                        }
                    )
            }
        }
    )
}

export default {
    initDefaults,
    initInvidiousCookies,
}
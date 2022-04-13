"use strict";

window.browser = window.browser || window.chrome;

export let youtubeListen;
export const getYoutubeListen = () => youtubeListen;

export let volume;
export const getVolume = () => volume;
export function setVolume(val) {
    volume = val;
    browser.storage.local.set({ youtubeVolume: volume })
    console.log("youtubeVolume: ", volume)
}

export let youtubeAutoplay;
export const getAutoplay = () => youtubeAutoplay;
export function setAutoplay(val) {
    youtubeAutoplay = val;
    browser.storage.local.set({ youtubeAutoplay })
    console.log("youtubeAutoplay: ", youtubeAutoplay)
}

export let invidiousQuality;
export const getInvidiousQuality = () => invidiousQuality;

export let invidiousAlwaysProxy;
export const getInvidiousAlwaysProxy = () => invidiousAlwaysProxy;

export let invidiousPlayerStyle;
export const getInvidiousPlayerStyle = () => invidiousPlayerStyle;

export let invidiousVideoLoop;
export const getInvidiousVideoLoop = () => invidiousVideoLoop;

export let invidiousContinueAutoplay;
export const getInvidiousContinueAutoplay = () => invidiousContinueAutoplay;

export let invidiousContinue;
export const getInvidiousContinue = () => invidiousContinue;

export let invidiousSpeed;
export const getInvidiousSpeed = () => invidiousSpeed;

export let invidiousQualityDash;
export const getInvidiousQualityDash = () => invidiousQualityDash;

export let invidiousComments;
export const getInvidiousComments = () => invidiousComments;

export let invidiousCaptions;
export const getInvidiousCaptions = () => invidiousCaptions;

export let invidiousRelatedVideos;
export const getInvidiousRelatedVideos = () => invidiousRelatedVideos;

export let invidiousAnnotations;
export const getInvidiousAnnotations = () => invidiousAnnotations;

export let invidiousExtendDesc;
export const getInvidiousExtendDesc = () => invidiousExtendDesc;

export let invidiousVrMode;
export const getInvidiousVrMode = () => invidiousVrMode;

export let invidiousSavePlayerPos;
export const getInvidiousSavePlayerPos = () => invidiousSavePlayerPos;

export let invidiousRegion;
export const getInvidiousRegion = () => invidiousRegion;

export let invidiousDarkMode;
export const getInvidiousDarkMode = () => invidiousDarkMode;

export let invidiousThinMode;
export const getInvidiousThinMode = () => invidiousThinMode;

export let invidiousDefaultHome;
export const getInvidiousDefaultHome = () => invidiousDefaultHome;

export let invidiousFeedMenuList;
export const getInvidiousFeedMenuList = () => invidiousFeedMenuList;

export let pipedBufferGoal;
export const getPipedBufferGoal = () => pipedBufferGoal;

export let pipedComments;
export const getPipedComments = () => pipedComments;

export let pipedDisableLBRY;
export const getPipedDisableLBRY = () => pipedDisableLBRY;

export let pipedEnabledCodecs;
export const getPipedEnabledCodecs = () => pipedEnabledCodecs;

export let pipedHomepage;
export const getPipedHomepage = () => pipedHomepage;

export let pipedMinimizeDescription;
export const getPipedMinimizeDescription = () => pipedMinimizeDescription;

export let pipedProxyLBRY;
export const getPipedProxyLBRY = () => pipedProxyLBRY;

export let pipedQuality;
export const getPipedQuality = () => pipedQuality;

export let pipedRegion;
export const getPipedRegion = () => pipedRegion;

export let pipedSelectedSkip;
export const getPipedSelectedSkip = () => pipedSelectedSkip;

export let pipedSponsorblock;
export const getPipedSponsorblock = () => pipedSponsorblock;

export let pipedDdlTheme;
export const getPipedDdlTheme = () => pipedDdlTheme;

export let pipedWatchHistory;
export const getPipedWatchHistory = () => pipedWatchHistory;

export let pipedMaterialSkipToLastPoint;
export const getPipedMaterialSkipToLastPoint = () => pipedMaterialSkipToLastPoint;

export async function initOptions() {
    return new Promise(
        resolve => {
            browser.storage.local.get(
                [
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

                    "pipedBufferGoal",
                    "pipedComments",
                    "pipedDisableLBRY",
                    "pipedEnabledCodecs",
                    "pipedHomepage",
                    "pipedMinimizeDescription",
                    "pipedProxyLBRY",
                    "pipedQuality",
                    "pipedRegion",
                    "pipedSelectedSkip",
                    "pipedSponsorblock",
                    "pipedDdlTheme",
                    "pipedWatchHistory",

                    "pipedMaterialSkipToLastPoint",
                ],
                r => {

                    youtubeListen = r.youtubeListen ?? false;
                    volume = r.youtubeVolume ?? 100;
                    youtubeAutoplay = r.youtubeAutoplay ?? false;

                    invidiousVideoLoop = r.invidiousVideoLoop ?? false;
                    invidiousAlwaysProxy = r.invidiousAlwaysProxy ?? false;
                    invidiousPlayerStyle = r.invidiousPlayerStyle ?? 'invidious';
                    invidiousQuality = r.invidiousQuality ?? 'hd720';
                    invidiousContinueAutoplay = r.invidiousContinueAutoplay ?? true;
                    invidiousContinue = r.invidiousContinue ?? false;
                    invidiousSpeed = r.invidiousSpeed ?? '1.0';
                    invidiousQualityDash = r.invidiousQualityDash ?? 'auto';
                    invidiousComments = r.invidiousComments ?? ['youtube', ''];
                    invidiousCaptions = r.invidiousCaptions ?? ['', '', ''];
                    invidiousRelatedVideos = r.invidiousRelatedVideos ?? true;
                    invidiousAnnotations = r.invidiousAnnotations ?? false;
                    invidiousExtendDesc = r.invidiousExtendDesc ?? false;
                    invidiousVrMode = r.invidiousVrMode ?? true;
                    invidiousSavePlayerPos = r.invidiousSavePlayerPos ?? false;

                    invidiousRegion = r.invidiousRegion ?? 'US';
                    invidiousDarkMode = r.invidiousDarkMode ?? '';
                    invidiousThinMode = r.invidiousThinMode ?? false;
                    invidiousDefaultHome = r.invidiousDefaultHome ?? 'Popular';
                    invidiousFeedMenuList = r.invidiousFeedMenuList ?? ['Popular', 'Trending'];

                    pipedBufferGoal = r.pipedBufferGoal ?? 300;
                    pipedComments = r.pipedComments ?? true;
                    pipedDisableLBRY = r.pipedDisableLBRY ?? false;
                    pipedEnabledCodecs = r.pipedEnabledCodecs ?? ["av1", "vp9", "avc"];
                    pipedHomepage = r.pipedHomepage ?? "trending";
                    pipedMinimizeDescription = r.pipedMinimizeDescription ?? false;
                    pipedProxyLBRY = r.pipedProxyLBRY ?? false;
                    pipedQuality = r.pipedQuality ?? 0;
                    pipedRegion = r.pipedRegion ?? "US";

                    pipedSelectedSkip = r.pipedSelectedSkip ?? ["sponsor", "interaction", "selfpromo", "music_offtopic"];
                    pipedSponsorblock = r.pipedSponsorblock ?? true;
                    pipedDdlTheme = r.pipedDdlTheme ?? 'auto';
                    pipedWatchHistory = r.pipedWatchHistory ?? false;

                    pipedMaterialSkipToLastPoint = r.pipedMaterialSkipToLastPoint ?? true;

                    resolve();
                }
            )
        }
    )
}
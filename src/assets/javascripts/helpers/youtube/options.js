"use strict";

window.browser = window.browser || window.chrome;

export let youtubeListen;
export const getYoutubeListen = () => youtubeListen;
export function setYoutubeListen(val) {
    youtubeListen = val;
    browser.storage.local.set({ youtubeListen })
    console.log("youtubeListen: ", youtubeListen)
}

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
export function setinvidiousQuality(val) {
    invidiousQuality = val;
    browser.storage.local.set({ invidiousQuality })
    console.log("invidiousQuality: ", invidiousQuality)
}

export let invidiousAlwaysProxy;
export const getInvidiousAlwaysProxy = () => invidiousAlwaysProxy;
export function setInvidiousAlwaysProxy(val) {
    invidiousAlwaysProxy = val;
    browser.storage.local.set({ invidiousAlwaysProxy })
    console.log("invidiousAlwaysProxy: ", invidiousAlwaysProxy);
}

export let invidiousPlayerStyle;
export const getInvidiousPlayerStyle = () => invidiousPlayerStyle;
export function setInvidiousPlayerStyle(val) {
    invidiousPlayerStyle = val;
    browser.storage.local.set({ invidiousPlayerStyle })
    console.log("invidiousPlayerStyle: ", invidiousPlayerStyle)
}

export let invidiousVideoLoop;
export const getInvidiousVideoLoop = () => invidiousVideoLoop;
export function setInvidiousVideoLoop(val) {
    invidiousVideoLoop = val;
    browser.storage.local.set({ invidiousVideoLoop })
    console.log("invidiousVideoLoop: ", invidiousVideoLoop)
}

export let invidiousContinueAutoplay;
export const getInvidiousContinueAutoplay = () => invidiousContinueAutoplay;
export function setInvidiousContinueAutoplay(val) {
    invidiousContinueAutoplay = val;
    browser.storage.local.set({ invidiousContinueAutoplay })
    console.log("invidiousContinueAutoplay: ", invidiousContinueAutoplay)
}

export let invidiousContinue;
export const getInvidiousContinue = () => invidiousContinue;
export function setInvidiousContinue(val) {
    invidiousContinue = val;
    browser.storage.local.set({ invidiousContinue })
    console.log("invidiousContinue: ", invidiousContinue)
}

export let invidiousSpeed;
export const getInvidiousSpeed = () => invidiousSpeed;
export function setInvidiousSpeed(val) {
    invidiousSpeed = val;
    browser.storage.local.set({ invidiousSpeed })
    console.log("invidiousSpeed: ", invidiousSpeed)
}

export let invidiousQualityDash;
export const getInvidiousQualityDash = () => invidiousQualityDash;
export function setInvidiousQualityDash(val) {
    invidiousQualityDash = val;
    browser.storage.local.set({ invidiousQualityDash })
    console.log("invidiousQualityDash: ", invidiousQualityDash)
}

export let invidiousComments;
export const getInvidiousComments = () => invidiousComments;
export function setInvidiousComments(val) {
    invidiousComments = val;
    browser.storage.local.set({ invidiousComments })
    console.log("invidiousComments: ", invidiousComments)
}


export let invidiousCaptions;
export const getInvidiousCaptions = () => invidiousCaptions;
export function setInvidiousCaptions(val) {
    invidiousCaptions = val;
    browser.storage.local.set({ invidiousCaptions })
    console.log("invidiousCaptions: ", invidiousCaptions)
}

export let invidiousRelatedVideos;
export const getInvidiousRelatedVideos = () => invidiousRelatedVideos;
export function setInvidiousRelatedVideos(val) {
    invidiousRelatedVideos = val;
    browser.storage.local.set({ invidiousRelatedVideos })
    console.log("invidiousRelatedVideos: ", invidiousRelatedVideos)
}

export let invidiousAnnotations;
export const getInvidiousAnnotations = () => invidiousAnnotations;
export function setInvidiousAnnotations(val) {
    invidiousAnnotations = val;
    browser.storage.local.set({ invidiousAnnotations })
    console.log("invidiousAnnotations: ", invidiousAnnotations)
}

export let invidiousExtendDesc;
export const getInvidiousExtendDesc = () => invidiousExtendDesc;
export function setInvidiousExtendDesc(val) {
    invidiousExtendDesc = val;
    browser.storage.local.set({ invidiousExtendDesc })
    console.log("invidiousExtendDesc: ", invidiousExtendDesc)
}

export let invidiousVrMode;
export const getInvidiousVrMode = () => invidiousVrMode;
export function setInvidiousVrMode(val) {
    invidiousVrMode = val;
    browser.storage.local.set({ invidiousVrMode })
    console.log("invidiousVrMode: ", invidiousVrMode)
}

export let invidiousSavePlayerPos;
export const getInvidiousSavePlayerPos = () => invidiousSavePlayerPos;
export function setInvidiousSavePlayerPos(val) {
    invidiousSavePlayerPos = val;
    browser.storage.local.set({ invidiousSavePlayerPos })
    console.log("invidiousSavePlayerPos: ", invidiousSavePlayerPos)
}

export let pipedBufferGoal;
export const getPipedBufferGoal = () => pipedBufferGoal;
export function setPipedBufferGoal(val) {
    pipedBufferGoal = val;
    browser.storage.local.set({ pipedBufferGoal })
    console.log("pipedBufferGoal: ", pipedBufferGoal)
}

export let pipedComments;
export const getPipedComments = () => pipedComments;
export function setPipedComments(val) {
    pipedComments = val;
    browser.storage.local.set({ pipedComments })
    console.log("pipedComments: ", pipedComments)
}

export let pipedDisableLBRY;
export const getPipedDisableLBRY = () => pipedDisableLBRY;
export function setPipedDisableLBRY(val) {
    pipedDisableLBRY = val;
    browser.storage.local.set({ pipedDisableLBRY })
    console.log("pipedDisableLBRY: ", pipedDisableLBRY)
}

export let pipedEnabledCodecs;
export const getPipedEnabledCodecs = () => pipedEnabledCodecs;
export function setPipedEnabledCodecs(val) {
    pipedEnabledCodecs = val;
    browser.storage.local.set({ pipedEnabledCodecs })
    console.log("pipedEnabledCodecs: ", pipedEnabledCodecs)
}

export let pipedHomepage;
export const getPipedHomepage = () => pipedHomepage;
export function setPipedHomepage(val) {
    pipedHomepage = val;
    browser.storage.local.set({ pipedHomepage })
    console.log("pipedHomepage: ", pipedHomepage)
}

export let pipedMinimizeDescription;
export const getPipedMinimizeDescription = () => pipedMinimizeDescription;
export function setPipedMinimizeDescription(val) {
    pipedMinimizeDescription = val;
    browser.storage.local.set({ pipedMinimizeDescription })
    console.log("pipedMinimizeDescription: ", pipedMinimizeDescription)
}

export let pipedProxyLBRY;
export const getPipedProxyLBRY = () => pipedProxyLBRY;
export function setPipedProxyLBRY(val) {
    pipedProxyLBRY = val;
    browser.storage.local.set({ pipedProxyLBRY })
    console.log("pipedProxyLBRY: ", pipedProxyLBRY)
}

export let pipedQuality;
export const getPipedQuality = () => pipedQuality;
export function setPipedQuality(val) {
    pipedQuality = val;
    browser.storage.local.set({ pipedQuality })
    console.log("pipedQuality: ", pipedQuality)
}

export let pipedRegion;
export const getPipedRegion = () => pipedRegion;
export function setPipedRegion(val) {
    pipedRegion = val;
    browser.storage.local.set({ pipedRegion })
    console.log("pipedRegion: ", pipedRegion)
}

export let pipedSelectedSkip;
export const getPipedSelectedSkip = () => pipedSelectedSkip;
export function setPipedSelectedSkip(val) {
    pipedSelectedSkip = val;
    browser.storage.local.set({ pipedSelectedSkip })
    console.log("pipedSelectedSkip: ", pipedSelectedSkip)
}

export let pipedSponsorblock;
export const getPipedSponsorblock = () => pipedSponsorblock;
export function setPipedSponsorblock(val) {
    pipedSponsorblock = val;
    browser.storage.local.set({ pipedSponsorblock })
    console.log("pipedSponsorblock: ", pipedSponsorblock)
}

export let pipedWatchHistory;
export const getPipedWatchHistory = () => pipedWatchHistory;
export function setPipedWatchHistory(val) {
    pipedWatchHistory = val;
    browser.storage.local.set({ pipedWatchHistory })
    console.log("pipedWatchHistory: ", pipedWatchHistory)
}

export let pipedMaterialSkipToLastPoint;
export const getPipedMaterialSkipToLastPoint = () => pipedMaterialSkipToLastPoint;
export function setPipedMaterialSkipToLastPoint(val) {
    pipedMaterialSkipToLastPoint = val;
    browser.storage.local.set({ pipedMaterialSkipToLastPoint })
    console.log("pipedMaterialSkipToLastPoint: ", pipedMaterialSkipToLastPoint)
}

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
                    pipedWatchHistory = r.pipedWatchHistory ?? false;

                    pipedMaterialSkipToLastPoint = r.pipedMaterialSkipToLastPoint ?? true;

                    resolve();
                }
            )
        }
    )
}
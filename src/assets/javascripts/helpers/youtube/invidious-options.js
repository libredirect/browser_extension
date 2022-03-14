"use strict";

window.browser = window.browser || window.chrome;

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

export async function invidiousInit() {
    return new Promise(
        resolve => {
            browser.storage.local.get(
                [
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
                ],
                r => {
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

                    resolve();
                }
            )
        }
    )
}

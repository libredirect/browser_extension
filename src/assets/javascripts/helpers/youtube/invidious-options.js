"use strict";

export let invidiousQuality;
export const getinvidiousQuality = () => invidiousQuality;
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

export let invidiousListen;
export const getInvidiousListen = () => invidiousListen;
export function setInvidiousListen(val) {
    invidiousListen = val;
    browser.storage.local.set({ invidiousListen })
    console.log("invidiousListen: ", invidiousListen)
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
                    "invidiousListen",
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
                    invidiousQuality = r.invidiousQuality ?? 'DEFAULT';
                    invidiousAlwaysProxy = r.invidiousAlwaysProxy ?? 'DEFAULT';
                    invidiousPlayerStyle = r.invidiousPlayerStyle ?? 'DEFAULT';
                    invidiousVideoLoop = r.invidiousVideoLoop ?? 'DEFAULT';
                    invidiousContinueAutoplay = r.invidiousContinueAutoplay ?? 'DEFAULT';
                    invidiousContinue = r.invidiousContinue ?? 'DEFAULT';
                    invidiousListen = r.invidiousListen ?? 'DEFAULT';
                    invidiousSpeed = r.invidiousSpeed ?? 'DEFAULT';
                    invidiousQualityDash = r.invidiousQualityDash ?? 'DEFAULT';
                    invidiousComments = r.invidiousComments ?? ['DEFAULT', 'DEFAULT'];
                    invidiousCaptions = r.invidiousCaptions ?? ['DEFAULT', 'DEFAULT', 'DEFAULT'];
                    invidiousRelatedVideos = r.invidiousRelatedVideos ?? 'DEFAULT';
                    invidiousAnnotations = r.invidiousAnnotations ?? 'DEFAULT';
                    invidiousExtendDesc = r.invidiousExtendDesc ?? 'DEFAULT';
                    invidiousVrMode = r.invidiousVrMode ?? 'DEFAULT';
                    invidiousSavePlayerPos = r.invidiousSavePlayerPos ?? 'DEFAULT';


                    resolve();
                }
            )
        }
    )
}

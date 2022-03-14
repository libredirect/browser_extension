"use strict";

window.browser = window.browser || window.chrome;

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

export async function pipedInit() {
    return new Promise(
        resolve => {
            browser.storage.local.get(
                [
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
                ],
                r => {
                    pipedBufferGoal = r.pipedBufferGoal ?? 10;
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

                    resolve();
                }
            )
        }
    )
}

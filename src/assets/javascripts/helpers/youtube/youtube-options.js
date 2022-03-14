"use strict";

window.browser = window.browser || window.chrome;

export let youtubeListen;
export const getYoutubeListen = () => youtubeListen;
export function setYoutubeListen(val) {
    youtubeListen = val;
    browser.storage.local.set({ youtubeListen })
    console.log("youtubeListen: ", youtubeListen)
}

export async function youtubeInit() {
    return new Promise(
        resolve => {
            browser.storage.local.get(
                [
                    "youtubeListen"
                ],
                r => {
                    youtubeListen = r.youtubeListen ?? false;

                    resolve();
                }
            )
        }
    )
}

async function initDefaults() {
    await browser.storage.local.set({
        youtubeVolume: 100,
        youtubeAutoplay: false,
        youtubeListen: false,

        pipedBufferGoal: 300,
        pipedComments: true,
        pipedDisableLBRY: false,
        pipedEnabledCodecs: ["av1", "vp9", "avc"],
        pipedHomepage: "trending",
        pipedMinimizeDescription: false,
        pipedProxyLBRY: false,
        pipedQuality: 0,
        pipedRegion: "US",
        pipedSelectedSkip: ["sponsor", "interaction", "selfpromo", "music_offtopic"],
        pipedSponsorblock: true,
        pipedDdlTheme: 'auto',
        pipedWatchHistory: false,
    })
}

function initPipedLocalStorage(tabId) {
    if (!disable && frontend == 'piped' && enableCustomSettings)
      browser.tabs.executeScript(
        tabId,
        {
          file: "/assets/javascripts/helpers/youtube/piped-preferences.js",
          runAt: "document_start"
        }
      );
  }

export default {
    initDefaults,
    initPipedLocalStorage
}
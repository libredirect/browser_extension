async function initDefaults() {
  await browser.storage.local.set({
    theme: "dark",
    youtubeAutoplay: false,
    youtubeVolume: 100,
    youtubeListen: false,

    pipedDisableLBRY: false,
    pipedProxyLBRY: false,
    pipedSelectedSkip: [],
    pipedSponsorblock: true,

    pipedMaterialSkipToLastPoint: true,
  })
}

function initPipedMaterialLocalStorage(tabId) {
  if (!disable && frontend == 'pipedMaterial' && enableCustomSettings)
    browser.tabs.executeScript(
      tabId,
      {
        file: "/assets/javascripts/helpers/youtube/pipedMaterial-preferences.js",
        runAt: "document_start"
      }
    );
}

export default {
  initDefaults,
  initPipedMaterialLocalStorage,
}
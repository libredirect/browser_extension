"use strict";
window.browser = window.browser || window.chrome;

import commonHelper from '../common.js'

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

async function copyPipedLocalStorage(url, tabId) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "pipedNormalRedirectsChecks",
        "pipedNormalCustomRedirects",
        "pipedTorRedirectsChecks",
        "pipedTorCustomRedirects",
      ],
      r => {
        let protocolHost = commonHelper.protocolHost(url);
        if (![
          ...r.pipedNormalCustomRedirects,
          ...r.pipedNormalRedirectsChecks,
          ...r.pipedTorRedirectsChecks,
          ...r.pipedTorCustomRedirects,
        ].includes(protocolHost)) resolve();
        browser.tabs.executeScript(
          tabId,
          {
            file: "/assets/javascripts/helpers/youtube/get_piped_settings.js",
            runAt: "document_start"
          }
        );
        resolve(true);
      })
  })
}

async function initPipedLocalStorage(url, tabId) {
  browser.storage.local.get(
    [
      "youtubeProtocol",
      "pipedNormalRedirectsChecks",
      "pipedNormalCustomRedirects",
      "pipedTorRedirectsChecks",
      "pipedTorCustomRedirects",
    ],
    r => {
      let protocolHost = commonHelper.protocolHost(url);
      if (![
        ...r.pipedNormalRedirectsChecks,
        ...r.pipedTorRedirectsChecks,
        ...r.pipedNormalCustomRedirects,
        ...r.pipedTorCustomRedirects,
      ].includes(protocolHost)) return;
      browser.tabs.executeScript(
        tabId,
        {
          file: "/assets/javascripts/helpers/youtube/piped-preferences.js",
          runAt: "document_start"
        }
      );
      return true;
    })
}

export default {
  initDefaults,
  initPipedLocalStorage,
  copyPipedLocalStorage,
}
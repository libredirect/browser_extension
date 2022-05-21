"use strict";

window.browser = window.browser || window.chrome;

import utils from '../utils.js'

const targets = [
  /^https?:\/{2}(www\.|music\.|m\.|)youtube\.com(\/.*|$)/,

  /^https?:\/{2}img\.youtube\.com\/vi\/.*\/..*/, // https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
  /^https?:\/{2}(i|s)\.ytimg\.com\/vi\/.*\/..*/,

  /^https?:\/{2}(www\.|music\.|)youtube\.com\/watch\?v\=..*/,

  /^https?:\/{2}youtu\.be\/..*/,

  /^https?:\/{2}(www\.|)(youtube|youtube-nocookie)\.com\/embed\/..*/,
];
let redirects = {
  "invidious": {
    "normal": [],
    "tor": []
  },
  "piped": {
    "normal": [],
    "tor": []
  },
  "pipedMaterial": {
    "normal": [
      "https://piped-material.xn--17b.net",
      "https://piped-material.ftp.sh",
    ],
    "tor": []
  }
};
function setRedirects(val) {
  browser.storage.local.get('cloudflareList', r => {
    redirects.invidious = val.invidious;
    redirects.piped = val.piped;
    invidiousNormalRedirectsChecks = [...redirects.invidious.normal];
    pipedNormalRedirectsChecks = [...redirects.piped.normal];
    for (const instance of r.cloudflareList) {
      const a = invidiousNormalRedirectsChecks.indexOf(instance);
      if (a > -1) invidiousNormalRedirectsChecks.splice(a, 1);

      const b = pipedNormalRedirectsChecks.indexOf(instance);
      if (b > -1) pipedNormalRedirectsChecks.splice(b, 1);
    }
    browser.storage.local.set({
      youtubeRedirects: redirects,
      invidiousNormalRedirectsChecks,
      invidiousTorRedirectsChecks: redirects.invidious.tor,
      pipedNormalRedirectsChecks,
      pipedTorRedirectsChecks: redirects.piped.tor,
    })
  })
}

let
  invidiousNormalRedirectsChecks,
  invidiousTorRedirectsChecks,

  pipedNormalRedirectsChecks,
  pipedTorRedirectsChecks,

  pipedMaterialNormalRedirectsChecks,
  pipedMaterialTorRedirectsChecks;

function redirect(url, details, initiator) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableYoutube",
        "OnlyEmbeddedVideo",
        "youtubeFrontend",
        "youtubeProtocol",
        "youtubeEmbedFrontend",

        "youtubeRedirects",

        "invidiousNormalRedirectsChecks",
        "invidiousNormalCustomRedirects",

        "invidiousTorRedirectsChecks",
        "invidiousTorCustomRedirects",

        "pipedNormalRedirectsChecks",
        "pipedNormalCustomRedirects",

        "pipedTorRedirectsChecks",
        "pipedTorCustomRedirects",

        "pipedMaterialNormalRedirectsChecks",
        "pipedMaterialNormalCustomRedirects",

        "pipedMaterialTorRedirectsChecks",
        "pipedMaterialTorCustomRedirects",
      ],
      r => {
        if (r.disableYoutube) { resolve(); return; }
        if (!targets.some(rx => rx.test(url.href))) { resolve(); return; }

        if (
          initiator && (
            [
              ...r.youtubeRedirects.invidious.normal,
              ...r.invidiousNormalCustomRedirects,
              ...r.youtubeRedirects.invidious.tor,
              ...r.invidiousTorCustomRedirects,

              ...r.youtubeRedirects.piped.normal,
              ...r.youtubeRedirects.piped.tor,
              ...r.pipedNormalCustomRedirects,
              ...r.pipedTorCustomRedirects
            ].includes(initiator.origin)
          )
        ) { resolve('BYPASSTAB'); return; }

        const isInvidious = r.youtubeFrontend == 'invidious';
        const isPiped = r.youtubeFrontend == 'piped';
        const isPipedMaterial = r.youtubeFrontend == 'pipedMaterial'
        const isFreetube = r.youtubeFrontend == 'freetube';
        const isYatte = r.youtubeFrontend == 'yatte';

        const isFrontendYoutube = r.youtubeEmbedFrontend == "youtube";
        const isFrontendInvidious = r.youtubeEmbedFrontend == 'invidious';
        const isFrontendPiped = r.youtubeEmbedFrontend == 'piped';
        const isFrontendPipedMaterial = r.youtubeEmbedFrontend == 'pipedMaterial';

        const isOnlyEmbeddedVideo = r.OnlyEmbeddedVideo == 'onlyNotEmbedded';
        const isOnlyNotEmbedded = r.OnlyEmbeddedVideo == 'onlyNotEmbedded'

        const is_main_frame = details.type === "main_frame";
        const is_sub_frame = details.type === "sub_frame";

        if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/)) { resolve(); return; } // Don't redirect YouTube Player API.

        if (r.youtubeFrontend == 'yatte' && is_main_frame)
          resolve(url.href.replace(/^https?:\/{2}/, 'yattee://'));

        else if (isFreetube && is_main_frame)
          resolve(`freetube://https:${url.pathname}${url.search}`);

        else if (isFreetube && params && isFrontendYoutube)
          resolve();

        else if (isInvidious || ((isFreetube || isYatte) && isFrontendInvidious && is_sub_frame)) {

          if (isOnlyEmbeddedVideo && !is_sub_frame) { resolve(); return; }
          if (isOnlyNotEmbedded && params && !((isFreetube || isYatte) && isFrontendInvidious && is_sub_frame)) { resolve(); return; }

          let instancesList;
          if (r.youtubeProtocol == 'normal') instancesList = [...r.invidiousNormalRedirectsChecks, ...r.invidiousNormalCustomRedirects];
          else if (r.youtubeProtocol == 'tor') instancesList = [...r.invidiousTorRedirectsChecks, ...r.invidiousTorCustomRedirects];
          if (instancesList.length === 0) { resolve(); return; }
          let randomInstance = utils.getRandomInstance(instancesList);

          resolve(`${randomInstance}${url.pathname}${url.search}`);
        } else if (isPiped || ((isFreetube || isYatte) && isFrontendPiped && is_sub_frame)) {

          if (isOnlyEmbeddedVideo && !is_sub_frame) { resolve(); return; }
          if (
            isOnlyNotEmbedded && params &&
            !((isFreetube || isYatte) && isFrontendPiped && is_sub_frame)
          ) { resolve(); return; }

          let instancesList;
          if (r.youtubeProtocol == 'normal') instancesList = [...r.pipedNormalRedirectsChecks, ...r.pipedNormalCustomRedirects];
          else if (r.youtubeProtocol == 'tor') instancesList = [...r.pipedTorRedirectsChecks, ...r.pipedTorCustomRedirects];
          if (instancesList.length === 0) { resolve(); return; }
          let randomInstance = utils.getRandomInstance(instancesList);

          resolve(`${randomInstance}${url.pathname}${url.search}`)
        }
        else if (isPipedMaterial || ((isFreetube || isYatte) && isFrontendPipedMaterial && is_sub_frame)) {
          if (isOnlyEmbeddedVideo && details.type !== "sub_frame") { resolve(); return; }
          if (
            isOnlyNotEmbedded && params &&
            !((isFreetube || isYatte) && isFrontendPipedMaterial && is_sub_frame)
          ) { resolve(); return; }

          let instancesList;
          if (r.youtubeProtocol == 'normal') instancesList = [...r.pipedMaterialNormalRedirectsChecks, ...r.pipedMaterialNormalCustomRedirects];
          else if (r.youtubeProtocol == 'tor') instancesList = [...r.pipedMaterialTorRedirectsChecks, ...r.pipedMaterialTorCustomRedirects];
          let randomInstance = utils.getRandomInstance(instancesList);

          resolve(`${randomInstance}${url.pathname}${url.search}`);
        }
        else resolve('CANCEL');
      }
    )
  })
}

function reverse(url) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "youtubeRedirects",
        "invidiousNormalCustomRedirects",
        "invidiousTorCustomRedirects",
        "pipedNormalCustomRedirects",
        "pipedTorCustomRedirects",
        "pipedMaterialNormalCustomRedirects",
        "pipedMaterialTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(url);
        if (![
          ...r.youtubeRedirects.invidious.normal,
          ...r.youtubeRedirects.invidious.tor,

          ...r.youtubeRedirects.piped.normal,
          ...r.youtubeRedirects.piped.tor,

          ...r.youtubeRedirects.pipedMaterial.normal,
          ...r.youtubeRedirects.pipedMaterial.tor,

          ...r.invidiousNormalCustomRedirects,
          ...r.invidiousTorCustomRedirects,

          ...r.pipedNormalCustomRedirects,
          ...r.pipedTorCustomRedirects,

          ...r.pipedMaterialNormalCustomRedirects,
          ...r.pipedMaterialTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }

        resolve(`https://youtube.com${url.pathname}${url.search}`);
      })
  })
}

function switchInstance(url) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "youtubeRedirects",
        "youtubeFrontend",
        "youtubeProtocol",

        "invidiousNormalRedirectsChecks",
        "invidiousNormalCustomRedirects",

        "invidiousTorRedirectsChecks",
        "invidiousTorCustomRedirects",

        "pipedNormalRedirectsChecks",
        "pipedNormalCustomRedirects",

        "pipedTorRedirectsChecks",
        "pipedTorCustomRedirects",

        "pipedMaterialNormalRedirectsChecks",
        "pipedMaterialNormalCustomRedirects",

        "pipedMaterialTorRedirectsChecks",
        "pipedMaterialTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(url);
        if (![
          ...r.youtubeRedirects.invidious.normal,
          ...r.youtubeRedirects.invidious.tor,

          ...r.youtubeRedirects.piped.normal,
          ...r.youtubeRedirects.piped.tor,

          ...r.youtubeRedirects.pipedMaterial.normal,
          ...r.youtubeRedirects.pipedMaterial.tor,

          ...r.invidiousNormalCustomRedirects,
          ...r.invidiousTorCustomRedirects,

          ...r.pipedNormalCustomRedirects,
          ...r.pipedTorCustomRedirects,

          ...r.pipedMaterialNormalCustomRedirects,
          ...r.pipedMaterialTorCustomRedirects
        ].includes(protocolHost)) { resolve(); return; }


        let instancesList;
        if (r.youtubeProtocol == 'normal') {
          if (r.youtubeFrontend == 'invidious') instancesList = [...r.invidiousNormalRedirectsChecks, ...r.invidiousNormalCustomRedirects];
          else if (r.youtubeFrontend == 'piped') instancesList = [...r.pipedNormalRedirectsChecks, ...r.pipedNormalCustomRedirects];
          else if (r.youtubeFrontend == 'pipedMaterial') instancesList = [...r.pipedMaterialNormalRedirectsChecks, ...r.pipedMaterialNormalCustomRedirects];
        }
        else if (r.youtubeProtocol == 'tor') {
          if (r.youtubeFrontend == 'invidious') instancesList = [...r.invidiousTorRedirectsChecks, ...r.invidiousTorCustomRedirects];
          else if (r.youtubeFrontend == 'piped') instancesList = [...r.pipedTorRedirectsChecks, ...r.pipedTorCustomRedirects];
          else if (r.youtubeFrontend == 'pipedMaterial') instancesList = [...r.pipedMaterialTorRedirectsChecks, ...r.pipedMaterialTorCustomRedirects];
        }

        let index = instancesList.indexOf(protocolHost);
        if (index > -1) instancesList.splice(index, 1);
        if (instancesList.length == 0) { resolve(); return; }

        let randomInstance = utils.getRandomInstance(instancesList);
        resolve(`${randomInstance}${url.pathname}${url.search}`);
      }
    )
  })
}

function initDefaults() {
  return new Promise(async resolve => {
    fetch('/instances/data.json').then(response => response.text()).then(async data => {
      let dataJson = JSON.parse(data);
      redirects.invidious = dataJson.invidious;
      redirects.piped = dataJson.piped;
      browser.storage.local.get('cloudflareList', async r => {

        invidiousNormalRedirectsChecks = [...redirects.invidious.normal];
        pipedNormalRedirectsChecks = [...redirects.piped.normal];
        pipedMaterialNormalRedirectsChecks = [...redirects.pipedMaterial.normal];

        for (const instance of r.cloudflareList) {
          let i;

          i = invidiousNormalRedirectsChecks.indexOf(instance);
          if (i > -1) invidiousNormalRedirectsChecks.splice(i, 1);

          i = pipedNormalRedirectsChecks.indexOf(instance);
          if (i > -1) pipedNormalRedirectsChecks.splice(i, 1);

          i = pipedMaterialNormalRedirectsChecks.indexOf(instance);
          if (i > -1) pipedMaterialNormalRedirectsChecks.splice(i, 1);
        }

        await browser.storage.local.set({
          disableYoutube: false,
          enableYoutubeCustomSettings: false,
          OnlyEmbeddedVideo: 'both',

          youtubeRedirects: redirects,

          youtubeFrontend: 'invidious',

          invidiousNormalRedirectsChecks: invidiousNormalRedirectsChecks,
          invidiousNormalCustomRedirects: [],

          invidiousTorRedirectsChecks: [...redirects.invidious.tor],
          invidiousTorCustomRedirects: [],

          pipedNormalRedirectsChecks: pipedNormalRedirectsChecks,
          pipedNormalCustomRedirects: [],

          pipedTorRedirectsChecks: [...redirects.piped.tor],
          pipedTorCustomRedirects: [],

          pipedMaterialNormalRedirectsChecks: pipedMaterialNormalRedirectsChecks,
          pipedMaterialNormalCustomRedirects: [],

          pipedMaterialTorRedirectsChecks: [...redirects.pipedMaterial.tor],
          pipedMaterialTorCustomRedirects: [],

          youtubeEmbedFrontend: 'invidious',
          youtubeProtocol: 'normal',
        })
        resolve();
      })
    })
  })
}

function initInvidiousCookies(test, from) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "youtubeProtocol",
        "invidiousNormalRedirectsChecks",
        "invidiousNormalCustomRedirects",
        "invidiousTorRedirectsChecks",
        "invidiousTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(from);
        if (![
          ...r.invidiousNormalRedirectsChecks,
          ...r.invidiousTorRedirectsChecks,
          ...r.invidiousNormalCustomRedirects,
          ...r.invidiousTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }
        if (!test) {
          let checkedInstances;
          if (r.youtubeProtocol == 'normal') checkedInstances = [...r.invidiousNormalRedirectsChecks, ...r.invidiousNormalCustomRedirects]
          else if (r.youtubeProtocol == 'tor') checkedInstances = [...r.invidiousTorRedirectsChecks, ...r.invidiousTorCustomRedirects]
          for (const to of checkedInstances)
            utils.copyCookie('invidious', from, to, 'PREFS');
        }
        resolve(true);
      }
    )
  })
}

function setInvidiousCookies() {
  browser.storage.local.get(
    [
      "disableYoutube",
      "youtubeProtocol",
      "youtubeFrontend",
      "invidiousNormalRedirectsChecks",
      "invidiousNormalCustomRedirects",
      "invidiousTorRedirectsChecks",
      "invidiousTorCustomRedirects",
    ],
    r => {
      if (r.disableYoutube || r.youtubeFrontend != 'invidious' || r.youtubeProtocol === undefined) return;
      let checkedInstances;
      if (r.youtubeProtocol == 'normal') checkedInstances = [...r.invidiousNormalRedirectsChecks, ...r.invidiousNormalCustomRedirects]
      else if (r.youtubeProtocol == 'tor') checkedInstances = [...r.invidiousTorRedirectsChecks, ...r.invidiousTorCustomRedirects]
      for (const to of checkedInstances)
        utils.getCookiesFromStorage('invidious', to, 'PREFS');
    }
  )
}

function initPipedLocalStorage(test, url, tabId) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "pipedNormalRedirectsChecks",
        "pipedNormalCustomRedirects",
        "pipedTorRedirectsChecks",
        "pipedTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(url);
        if (![
          ...r.pipedNormalCustomRedirects,
          ...r.pipedNormalRedirectsChecks,
          ...r.pipedTorRedirectsChecks,
          ...r.pipedTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }

        if (!test)
          browser.tabs.executeScript(
            tabId,
            {
              file: "/assets/javascripts/helpers/youtube/get_piped_settings.js",
              runAt: "document_start"
            }
          );
        resolve(true);
      }
    )
  })
}

function setPipedLocalStorage(url, tabId) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableYoutube",
        "youtubeFrontend",
        "pipedNormalRedirectsChecks",
        "pipedNormalCustomRedirects",
        "pipedTorRedirectsChecks",
        "pipedTorCustomRedirects",
      ],
      r => {
        if (!r.disableYoutube && r.youtubeFrontend == 'pipedMaterial') { resolve(); return; }
        let protocolHost = utils.protocolHost(url);
        if (![
          ...r.pipedNormalRedirectsChecks,
          ...r.pipedTorRedirectsChecks,
          ...r.pipedNormalCustomRedirects,
          ...r.pipedTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }
        browser.tabs.executeScript(
          tabId,
          {
            file: "/assets/javascripts/helpers/youtube/set_piped_preferences.js",
            runAt: "document_start"
          }
        );
        resolve(true);
      }
    )
  })
}

function initPipedMaterialLocalStorage(test, url, tabId,) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "pipedMaterialNormalRedirectsChecks",
        "pipedMaterialNormalCustomRedirects",
        "pipedMaterialTorRedirectsChecks",
        "pipedMaterialTorCustomRedirects",
      ],
      r => {
        const protocolHost = utils.protocolHost(url);
        if (![
          ...r.pipedMaterialNormalCustomRedirects,
          ...r.pipedMaterialNormalRedirectsChecks,
          ...r.pipedMaterialTorRedirectsChecks,
          ...r.pipedMaterialTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }

        if (!test)
          browser.tabs.executeScript(
            tabId,
            {
              file: "/assets/javascripts/helpers/youtube/get_pipedMaterial_preferences.js",
              runAt: "document_start"
            }
          );
        resolve(true);
      }
    )
  })
}

function setPipedMaterialLocalStorage(url, tabId) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableYoutube",
        "youtubeFrontend",
        "pipedMaterialNormalRedirectsChecks",
        "pipedMaterialTorRedirectsChecks",
        "pipedMaterialNormalCustomRedirects",
        "pipedMaterialTorCustomRedirects",
      ],
      r => {
        if (r.disableYoutube || r.youtubeFrontend != 'pipedMaterial') { resolve(); return; }
        const protocolHost = utils.protocolHost(url);
        if (![
          ...r.pipedMaterialNormalRedirectsChecks,
          ...r.pipedMaterialTorRedirectsChecks,
          ...r.pipedMaterialNormalCustomRedirects,
          ...r.pipedMaterialTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }
        browser.tabs.executeScript(
          tabId,
          {
            file: "/assets/javascripts/helpers/youtube/set_pipedMaterial_preferences.js",
            runAt: "document_start"
          }
        );
        resolve(true);
      }
    )
  })
}

function removeXFrameOptions(e) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "youtubeRedirects",
        "pipedMaterialNormalRedirectsChecks",
        "pipedMaterialTorRedirectsChecks",
        "invidiousNormalCustomRedirects",
        "invidiousTorCustomRedirects",
      ],
      r => {
        const url = new URL(e.url);
        let protocolHost = utils.protocolHost(url);
        const list = [
          ...r.youtubeRedirects.invidious.normal,
          ...r.youtubeRedirects.invidious.tor,
          ...r.youtubeRedirects.piped.normal,
          ...r.youtubeRedirects.piped.tor,

          ...r.invidiousNormalCustomRedirects,
          ...r.invidiousTorCustomRedirects,

          ...r.pipedNormalCustomRedirects,
          ...r.pipedTorCustomRedirects
        ];
        if (!list.includes(protocolHost) || e.type != 'sub_frame') { resolve(); return; }
        let isChanged = false;
        for (const i in e.responseHeaders) if (e.responseHeaders[i].name == 'x-frame-options') {
          e.responseHeaders.splice(i, 1);
          isChanged = true;
        }
        if (isChanged) resolve({ responseHeaders: e.responseHeaders });
      })
  })
}

export default {
  setRedirects,
  initPipedMaterialLocalStorage,
  setPipedLocalStorage,
  setPipedMaterialLocalStorage,
  initInvidiousCookies,
  setInvidiousCookies,

  redirect,
  reverse,

  switchInstance,

  initPipedLocalStorage,

  initDefaults,

  removeXFrameOptions,
};

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
  disableYoutube,
  OnlyEmbeddedVideo,
  youtubeFrontend,
  youtubeProtocol,
  youtubeEmbedFrontend,
  youtubeRedirects,
  invidiousNormalRedirectsChecks,
  invidiousNormalCustomRedirects,
  invidiousTorRedirectsChecks,
  invidiousTorCustomRedirects,
  pipedNormalRedirectsChecks,
  pipedNormalCustomRedirects,
  pipedTorRedirectsChecks,
  pipedTorCustomRedirects,
  pipedMaterialNormalRedirectsChecks,
  pipedMaterialNormalCustomRedirects,
  pipedMaterialTorRedirectsChecks,
  pipedMaterialTorCustomRedirects;

function init() {
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
        disableYoutube = r.disableYoutube;
        OnlyEmbeddedVideo = r.OnlyEmbeddedVideo;
        youtubeFrontend = r.youtubeFrontend;
        youtubeProtocol = r.youtubeProtocol;
        youtubeEmbedFrontend = r.youtubeEmbedFrontend;
        youtubeRedirects = r.youtubeRedirects;
        invidiousNormalRedirectsChecks = r.invidiousNormalRedirectsChecks;
        invidiousNormalCustomRedirects = r.invidiousNormalCustomRedirects;
        invidiousTorRedirectsChecks = r.invidiousTorRedirectsChecks;
        invidiousTorCustomRedirects = r.invidiousTorCustomRedirects;
        pipedNormalRedirectsChecks = r.pipedNormalRedirectsChecks;
        pipedNormalCustomRedirects = r.pipedNormalCustomRedirects;
        pipedTorRedirectsChecks = r.pipedTorRedirectsChecks;
        pipedTorCustomRedirects = r.pipedTorCustomRedirects;
        pipedMaterialNormalRedirectsChecks = r.pipedMaterialNormalRedirectsChecks;
        pipedMaterialNormalCustomRedirects = r.pipedMaterialNormalCustomRedirects;
        pipedMaterialTorRedirectsChecks = r.pipedMaterialTorRedirectsChecks;
        pipedMaterialTorCustomRedirects = r.pipedMaterialTorCustomRedirects;
        resolve();
      }
    )
  })
}

init();
browser.storage.onChanged.addListener(init)

function all() {
  return [
    ...youtubeRedirects.invidious.normal,
    ...youtubeRedirects.invidious.tor,

    ...youtubeRedirects.piped.normal,
    ...youtubeRedirects.piped.tor,

    ...youtubeRedirects.pipedMaterial.normal,
    ...youtubeRedirects.pipedMaterial.tor,

    ...invidiousNormalCustomRedirects,
    ...invidiousTorCustomRedirects,

    ...pipedNormalCustomRedirects,
    ...pipedTorCustomRedirects,

    ...pipedMaterialNormalCustomRedirects,
    ...pipedMaterialTorCustomRedirects,
  ];
}

function redirect(url, details, initiator) {
  if (disableYoutube) return;
  if (!targets.some(rx => rx.test(url.href))) return;
  if (initiator && all().includes(initiator.origin)) return 'BYPASSTAB';

  const isInvidious = youtubeFrontend == 'invidious';
  const isPiped = youtubeFrontend == 'piped';
  const isPipedMaterial = youtubeFrontend == 'pipedMaterial'
  const isFreetube = youtubeFrontend == 'freetube';
  const isYatte = youtubeFrontend == 'yatte';

  const isFrontendYoutube = youtubeEmbedFrontend == "youtube";
  const isFrontendInvidious = youtubeEmbedFrontend == 'invidious';
  const isFrontendPiped = youtubeEmbedFrontend == 'piped';
  const isFrontendPipedMaterial = youtubeEmbedFrontend == 'pipedMaterial';

  const isOnlyEmbeddedVideo = OnlyEmbeddedVideo == 'onlyNotEmbedded';
  const isOnlyNotEmbedded = OnlyEmbeddedVideo == 'onlyNotEmbedded'

  const is_main_frame = details.type === "main_frame";
  const is_sub_frame = details.type === "sub_frame";

  if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/)) return; // Don't redirect YouTube Player API.

  if (youtubeFrontend == 'yatte' && is_main_frame)
    return url.href.replace(/^https?:\/{2}/, 'yattee://');

  else if (isFreetube && is_main_frame)
    return `freetube://https:/${url.pathname}${url.search}`;

  else if (isFreetube && params && isFrontendYoutube)
    return;

  else if (isInvidious || ((isFreetube || isYatte) && isFrontendInvidious && is_sub_frame)) {

    if (isOnlyEmbeddedVideo && !is_sub_frame) return;
    if (isOnlyNotEmbedded && params && !((isFreetube || isYatte) && isFrontendInvidious && is_sub_frame)) return;

    let instancesList;
    if (youtubeProtocol == 'normal') instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects];
    else if (youtubeProtocol == 'tor') instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects];
    if (instancesList.length === 0) return;
    let randomInstance = utils.getRandomInstance(instancesList);

    return `${randomInstance}${url.pathname}${url.search}`;
  } else if (isPiped || ((isFreetube || isYatte) && isFrontendPiped && is_sub_frame)) {

    if (isOnlyEmbeddedVideo && !is_sub_frame) return;
    if (
      isOnlyNotEmbedded && params &&
      !((isFreetube || isYatte) && isFrontendPiped && is_sub_frame)
    ) return;

    let instancesList;
    if (youtubeProtocol == 'normal') instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects];
    else if (youtubeProtocol == 'tor') instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects];
    if (instancesList.length === 0) return;

    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
  }
  else if (isPipedMaterial || ((isFreetube || isYatte) && isFrontendPipedMaterial && is_sub_frame)) {
    if (isOnlyEmbeddedVideo && details.type !== "sub_frame") return;
    if (
      isOnlyNotEmbedded && params &&
      !((isFreetube || isYatte) && isFrontendPipedMaterial && is_sub_frame)
    ) return;

    let instancesList;
    if (youtubeProtocol == 'normal') instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects];
    else if (youtubeProtocol == 'tor') instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects];

    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
  }
  else return 'CANCEL';
}

function reverse(url) {
  return new Promise(async resolve => {
    await init();
    const protocolHost = utils.protocolHost(url);
    if (!all().includes(protocolHost)) { resolve(); return; }
    resolve(`https://youtube.com${url.pathname}${url.search}`);
  })
}

function switchInstance(url) {
  return new Promise(async resolve => {
    await init();
    const protocolHost = utils.protocolHost(url);
    const instances = all();
    if (!instances.includes(protocolHost)) { resolve(); return; }

    let instancesList;
    if (youtubeProtocol == 'normal') {
      if (youtubeFrontend == 'invidious') instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects];
      else if (youtubeFrontend == 'piped') instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects];
      else if (youtubeFrontend == 'pipedMaterial') instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects];
    }
    else if (youtubeProtocol == 'tor') {
      if (youtubeFrontend == 'invidious') instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects];
      else if (youtubeFrontend == 'piped') instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects];
      else if (youtubeFrontend == 'pipedMaterial') instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects];
    }

    const i = instancesList.indexOf(protocolHost);
    if (i > -1) instancesList.splice(i, 1);
    if (instancesList.length == 0) { resolve(); return; }

    const randomInstance = utils.getRandomInstance(instancesList);
    resolve(`${randomInstance}${url.pathname}${url.search}`);
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
  return new Promise(async resolve => {
    await init();
    if (disableYoutube || youtubeFrontend != 'invidious') { resolve(); return; }
    const protocolHost = utils.protocolHost(from);
    if (![
      ...invidiousNormalRedirectsChecks,
      ...invidiousTorRedirectsChecks,
      ...invidiousNormalCustomRedirects,
      ...invidiousTorCustomRedirects,
    ].includes(protocolHost)) { resolve(); return; }
    if (!test) {
      let checkedInstances;
      if (youtubeProtocol == 'normal') checkedInstances = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects]
      else if (youtubeProtocol == 'tor') checkedInstances = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects]
      const i = checkedInstances.indexOf(protocolHost);
      if (i !== -1) checkedInstances.splice(i, 1);
      for (const to of checkedInstances)
        utils.copyCookie('invidious', from, to, 'PREFS');
    }
    resolve(true);
  })
}

function setInvidiousCookies() {
  return new Promise(async resolve => {
    await init();
    if (disableYoutube || youtubeFrontend != 'invidious') { resolve(); return; }
    let checkedInstances;
    if (youtubeProtocol == 'normal') checkedInstances = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects]
    else if (youtubeProtocol == 'tor') checkedInstances = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects]
    for (const to of checkedInstances)
      utils.getCookiesFromStorage('invidious', to, 'PREFS');
    resolve();
  })
}

function initPipedLocalStorage(test, url, tabId) {
  return new Promise(async resolve => {
    await init();
    if (disableYoutube || youtubeFrontend != 'piped') { resolve(); return; }
    const protocolHost = utils.protocolHost(url);
    if (![
      ...pipedNormalCustomRedirects,
      ...pipedNormalRedirectsChecks,
      ...pipedTorRedirectsChecks,
      ...pipedTorCustomRedirects,
    ].includes(protocolHost)) { resolve(); return; }

    if (!test) {

      browser.tabs.executeScript(tabId, { file: "/assets/javascripts/youtube/get_piped_preferences.js", runAt: "document_start" });

      let checkedInstances;
      if (youtubeProtocol == 'normal') checkedInstances = [...pipedNormalCustomRedirects, ...pipedNormalRedirectsChecks]
      else if (youtubeProtocol == 'tor') checkedInstances = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects]
      const i = checkedInstances.indexOf(protocolHost);
      if (i !== -1) checkedInstances.splice(i, 1);
      for (const to of checkedInstances) {
        browser.tabs.create({ url: to },
          tab => browser.tabs.executeScript(tab.id, { file: "/assets/javascripts/youtube/set_piped_preferences.js", runAt: "document_start" }))
      }
    }
    resolve(true);
  })
}

function initPipedMaterialLocalStorage(test, url, tabId,) {
  return new Promise(async resolve => {
    await init();
    if (disableYoutube || youtubeFrontend != 'pipedMaterial') { resolve(); return; }
    const protocolHost = utils.protocolHost(url);
    if (![
      ...pipedMaterialNormalRedirectsChecks,
      ...pipedMaterialNormalCustomRedirects,
      ...pipedMaterialTorRedirectsChecks,
      ...pipedMaterialTorCustomRedirects,
    ].includes(protocolHost)) { resolve(); return; }

    if (!test) {
      browser.tabs.executeScript(tabId, { file: "/assets/javascripts/youtube/get_pipedMaterial_preferences.js", runAt: "document_start" });

      let checkedInstances;
      if (youtubeProtocol == 'normal') checkedInstances = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects]
      else if (youtubeProtocol == 'tor') checkedInstances = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects]
      const i = checkedInstances.indexOf(protocolHost);
      if (i !== -1) checkedInstances.splice(i, 1);
      for (const to of checkedInstances)
        browser.tabs.create(
          { url: to },
          tab => browser.tabs.executeScript(tab.id, { file: "/assets/javascripts/youtube/set_pipedMaterial_preferences.js", runAt: "document_start" })
        );
    }
    resolve(true);
  })
}

function removeXFrameOptions(e) {
  const url = new URL(e.url);
  let protocolHost = utils.protocolHost(url);
  const instances = all();
  if (!instances.includes(protocolHost) || e.type != 'sub_frame') return;

  let isChanged = false;
  for (const i in e.responseHeaders)
    if (e.responseHeaders[i].name == 'x-frame-options') {
      e.responseHeaders.splice(i, 1);
      isChanged = true;
    }
  if (isChanged) return { responseHeaders: e.responseHeaders };
}

export default {
  setRedirects,
  initPipedLocalStorage,
  initPipedMaterialLocalStorage,
  initInvidiousCookies,
  setInvidiousCookies,
  redirect,
  reverse,
  switchInstance,
  initDefaults,
  removeXFrameOptions,
};

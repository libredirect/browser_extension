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

const frontends = new Array("invidious", "piped", "pipedMaterial")
const protocols = new Array("normal", "tor", "i2p", "loki")

let redirects = {};

for (let i = 0; i < frontends.length; i++) {
    redirects[frontends[i]] = {}
    for (let x = 0; x < protocols.length; x++) {
        redirects[frontends[i]][protocols[x]] = []
    }
}

function setRedirects(val) {
  browser.storage.local.get('cloudflareBlackList', r => {
    redirects.invidious = val.invidious;
    redirects.piped = val.piped;
    redirects.pipedMaterial = val.pipedMaterial
    invidiousNormalRedirectsChecks = [...redirects.invidious.normal];
    pipedNormalRedirectsChecks = [...redirects.piped.normal];
    pipedMaterialNormalRedirectsChecks = [...redirects.pipedMaterial.normal]
    for (const instance of r.cloudflareBlackList) {
      const a = invidiousNormalRedirectsChecks.indexOf(instance);
      if (a > -1) invidiousNormalRedirectsChecks.splice(a, 1);

      const b = pipedNormalRedirectsChecks.indexOf(instance);
      if (b > -1) pipedNormalRedirectsChecks.splice(b, 1);

      const c = pipedMaterialNormalRedirectsChecks.indexOf(instance);
      if (c > -1) pipedMaterialNormalRedirectsChecks.splice(c, 1);
    }
    browser.storage.local.set({
      youtubeRedirects: redirects,
      invidiousNormalRedirectsChecks,
      invidiousTorRedirectsChecks: redirects.invidious.tor,
      pipedNormalRedirectsChecks,
      pipedTorRedirectsChecks: redirects.piped.tor,
      pipedMaterialNormalRedirectsChecks,
      pipedMaterialTorRedirectsChecks: redirects.pipedMaterial.tor
    })
  })
}

let
  disableYoutube,
  onlyEmbeddedVideo,
  youtubeFrontend,
  protocol,
  protocolFallback,
  youtubeEmbedFrontend,
  youtubeRedirects,
  invidiousNormalRedirectsChecks,
  invidiousNormalCustomRedirects,
  invidiousTorRedirectsChecks,
  invidiousTorCustomRedirects,
  invidiousI2pCustomRedirects,
  invidiousLokiCustomRedirects,
  pipedNormalRedirectsChecks,
  pipedNormalCustomRedirects,
  pipedTorRedirectsChecks,
  pipedTorCustomRedirects,
  pipedI2pCustomRedirects,
  pipedLokiCustomRedirects,
  pipedMaterialNormalRedirectsChecks,
  pipedMaterialNormalCustomRedirects,
  pipedMaterialTorRedirectsChecks,
  pipedMaterialTorCustomRedirects,
  pipedMaterialI2pCustomRedirects,
  pipedMaterialLokiCustomRedirects;

function init() {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableYoutube",
        "onlyEmbeddedVideo",
        "youtubeFrontend",
        "protocol",
        "protocolFallback",
        "youtubeEmbedFrontend",
        "youtubeRedirects",
        "invidiousNormalRedirectsChecks",
        "invidiousNormalCustomRedirects",
        "invidiousTorRedirectsChecks",
        "invidiousTorCustomRedirects",
        "invidiousI2pCustomRedirects",
        "invidiousLokiCustomRedirects",
        "pipedNormalRedirectsChecks",
        "pipedNormalCustomRedirects",
        "pipedTorRedirectsChecks",
        "pipedTorCustomRedirects",
        "pipedI2pCustomRedirects",
        "pipedLokiCustomRedirects",
        "pipedMaterialNormalRedirectsChecks",
        "pipedMaterialNormalCustomRedirects",
        "pipedMaterialTorRedirectsChecks",
        "pipedMaterialTorCustomRedirects",
        "pipedMaterialI2pCustomRedirects",
        "pipedMaterialLokiCustomRedirects"
      ],
      r => {
        disableYoutube = r.disableYoutube;
        onlyEmbeddedVideo = r.onlyEmbeddedVideo;
        youtubeFrontend = r.youtubeFrontend;
        protocol = r.protocol;
        protocolFallback = r.protocolFallback;
        youtubeEmbedFrontend = r.youtubeEmbedFrontend;
        youtubeRedirects = r.youtubeRedirects;
        invidiousNormalRedirectsChecks = r.invidiousNormalRedirectsChecks;
        invidiousNormalCustomRedirects = r.invidiousNormalCustomRedirects;
        invidiousTorRedirectsChecks = r.invidiousTorRedirectsChecks;
        invidiousTorCustomRedirects = r.invidiousTorCustomRedirects;
        invidiousI2pCustomRedirects = r.invidiousI2pCustomRedirects;
        invidiousLokiCustomRedirects = r.invidiousLokiCustomRedirects;
        pipedNormalRedirectsChecks = r.pipedNormalRedirectsChecks;
        pipedNormalCustomRedirects = r.pipedNormalCustomRedirects;
        pipedTorRedirectsChecks = r.pipedTorRedirectsChecks;
        pipedTorCustomRedirects = r.pipedTorCustomRedirects;
        pipedI2pCustomRedirects = r.pipedI2pCustomRedirects;
        pipedLokiCustomRedirects = r.pipedLokiCustomRedirects;
        pipedMaterialNormalRedirectsChecks = r.pipedMaterialNormalRedirectsChecks;
        pipedMaterialNormalCustomRedirects = r.pipedMaterialNormalCustomRedirects;
        pipedMaterialTorRedirectsChecks = r.pipedMaterialTorRedirectsChecks;
        pipedMaterialTorCustomRedirects = r.pipedMaterialTorCustomRedirects;
        pipedMaterialI2pCustomRedirects - r.pipedMaterialI2pCustomRedirects;
        pipedMaterialLokiCustomRedirects = r.pipedMaterialLokiCustomRedirects;
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
    ...invidiousI2pCustomRedirects,
    ...invidiousLokiCustomRedirects,

    ...pipedNormalCustomRedirects,
    ...pipedTorCustomRedirects,
    ...pipedI2pCustomRedirects,
    ...pipedLokiCustomRedirects,

    ...pipedMaterialNormalCustomRedirects,
    ...pipedMaterialTorCustomRedirects,
    ...pipedMaterialI2pCustomRedirects,
    ...pipedMaterialLokiCustomRedirects
  ];
}

function redirect(url, type, initiator, disableOverride) {
  if (disableYoutube && !disableOverride) return;
  if (!targets.some(rx => rx.test(url.href))) return;
  if (initiator && all().includes(initiator.origin)) return 'BYPASSTAB';

  const isInvidious = youtubeFrontend == 'invidious';
  const isPiped = youtubeFrontend == 'piped';
  const isPipedMaterial = youtubeFrontend == 'pipedMaterial'
  const isFreetube = youtubeFrontend == 'freetube';
  const isYatte = youtubeFrontend == 'yatte';

  //const isFrontendYoutube = youtubeEmbedFrontend == "youtube";
  const isFrontendInvidious = youtubeEmbedFrontend == 'invidious';
  const isFrontendPiped = youtubeEmbedFrontend == 'piped';
  const isFrontendPipedMaterial = youtubeEmbedFrontend == 'pipedMaterial';

  const main_frame = type === "main_frame";
  const sub_frame = type === "sub_frame";

  if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/)) return; // Don't redirect YouTube Player API.
  if (onlyEmbeddedVideo == 'onlyEmbedded' && main_frame) return;
  if (onlyEmbeddedVideo == 'onlyNotEmbedded' && !main_frame) return;

  //if ((isFreetube || isYatte) && sub_frame && isFrontendYoutube) return;

  if (isYatte && main_frame) return url.href.replace(/^https?:\/{2}/, 'yattee://');
  if (isFreetube && main_frame) return `freetube://https://youtube.com${url.pathname}${url.search}`;

  if (isInvidious || ((isFreetube || isYatte) && sub_frame && isFrontendInvidious)) {
    let instancesList = [];
    if (protocol == 'loki') instancesList = [...invidiousLokiCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...invidiousI2pCustomRedirects];
    else if (protocol == 'tor') instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects];
    if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
      instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects];
    }
    if (instancesList.length === 0) return;
    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
  }
  if (isPiped || ((isFreetube || isYatte) && sub_frame && isFrontendPiped)) {
    let instancesList = [];
    if (protocol == 'loki') instancesList = [...pipedLokiCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...pipedI2pCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects];
    if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
      instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects];
    }
    if (instancesList.length === 0) return;
    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
  }
  if (isPipedMaterial || ((isFreetube || isYatte) && sub_frame && isFrontendPipedMaterial)) {
    let instancesList = [];
    if (protocol == 'loki') instancesList = [...pipedMaterialLokiCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...pipedMaterialI2pCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects];
    if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
      instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects];
    }
    const randomInstance = utils.getRandomInstance(instancesList);
    return `${randomInstance}${url.pathname}${url.search}`;
  }
  return 'CANCEL';
}

function reverse(url) {
  return new Promise(async resolve => {
    await init();
    const protocolHost = utils.protocolHost(url);
    if (!all().includes(protocolHost)) { resolve(); return; }
    resolve(`https://youtube.com${url.pathname}${url.search}`);
  })
}

function switchInstance(url, disableOverride) {
  return new Promise(async resolve => {
    await init();
    if (disableYoutube && !disableOverride) { resolve(); return; }
    const protocolHost = utils.protocolHost(url);
    if (!all().includes(protocolHost)) { resolve(); return; }

    let instancesList = [];
    if (protocol == 'loki') {
      if (youtubeFrontend == 'invidious') instancesList = [...invidiousLokiCustomRedirects]; //...invidiousLokiRedirectsChecks, 
      else if (youtubeFrontend == 'piped') instancesList = [...pipedLokiCustomRedirects]; //...pipedLokiRedirectsChecks, 
      else if (youtubeFrontend == 'pipedMaterial') instancesList = [...pipedMaterialLokiCustomRedirects]; //...pipedMaterialLokiRedirectsChecks, 
    }
    else if (protocol == 'i2p') {
      if (youtubeFrontend == 'invidious') instancesList = [...invidiousI2pCustomRedirects]; //...invidiousI2pRedirectsChecks, 
      else if (youtubeFrontend == 'piped') instancesList = [...pipedI2pCustomRedirects]; //...pipedI2pRedirectsChecks, 
      else if (youtubeFrontend == 'pipedMaterial') instancesList = [...pipedMaterialI2pCustomRedirects]; //...pipedMaterialI2pRedirectsChecks, 
    }
    else if (protocol == 'tor') {
      if (youtubeFrontend == 'invidious') instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects];
      else if (youtubeFrontend == 'piped') instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects];
      else if (youtubeFrontend == 'pipedMaterial') instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects];
    }
    if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
      if (youtubeFrontend == 'invidious') instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects];
      else if (youtubeFrontend == 'piped') instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects];
      else if (youtubeFrontend == 'pipedMaterial') instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects];
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
      for (let i = 0; i < frontends.length; i++) {
        redirects[frontends[i]] = dataJson[frontends[i]]
      }
      browser.storage.local.get('cloudflareBlackList', async r => {

        invidiousNormalRedirectsChecks = [...redirects.invidious.normal];
        pipedNormalRedirectsChecks = [...redirects.piped.normal];
        pipedMaterialNormalRedirectsChecks = [...redirects.pipedMaterial.normal];

        for (const instance of r.cloudflareBlackList) {
          const a = invidiousNormalRedirectsChecks.indexOf(instance);
          if (a > -1) invidiousNormalRedirectsChecks.splice(a, 1);

          const b = pipedNormalRedirectsChecks.indexOf(instance);
          if (b > -1) pipedNormalRedirectsChecks.splice(b, 1);

          const c = pipedMaterialNormalRedirectsChecks.indexOf(instance);
          if (c > -1) pipedMaterialNormalRedirectsChecks.splice(c, 1);
        }

        browser.storage.local.set({
          disableYoutube: false,
          enableYoutubeCustomSettings: false,
          onlyEmbeddedVideo: 'both',

          youtubeRedirects: redirects,

          youtubeFrontend: 'invidious',

          invidiousNormalRedirectsChecks: invidiousNormalRedirectsChecks,
          invidiousNormalCustomRedirects: [],

          invidiousTorRedirectsChecks: [...redirects.invidious.tor],
          invidiousTorCustomRedirects: [],

          invidiousI2pCustomRedirects: [],

          invidiousLokiCustomRedirects: [],

          pipedNormalRedirectsChecks: pipedNormalRedirectsChecks,
          pipedNormalCustomRedirects: [],

          pipedTorRedirectsChecks: [...redirects.piped.tor],
          pipedTorCustomRedirects: [],

          pipedI2pCustomRedirects: [],

          pipedLokiCustomRedirects: [],

          pipedMaterialNormalRedirectsChecks: pipedMaterialNormalRedirectsChecks,
          pipedMaterialNormalCustomRedirects: [],

          pipedMaterialTorRedirectsChecks: [...redirects.pipedMaterial.tor],
          pipedMaterialTorCustomRedirects: [],

          pipedMaterialI2pCustomRedirects: [],

          pipedMaterialLokiCustomRedirects: [],

          youtubeEmbedFrontend: 'invidious'
        }, () => resolve())
      })
    })
  })
}

function copyPasteInvidiousCookies(test, from) {
  return new Promise(async resolve => {
    await init();
    if (disableYoutube || youtubeFrontend != 'invidious') { resolve(); return; }
    const protocolHost = utils.protocolHost(from);
    if (![
      ...invidiousNormalRedirectsChecks,
      ...invidiousTorRedirectsChecks,
      ...invidiousNormalCustomRedirects,
      ...invidiousTorCustomRedirects,
      ...invidiousI2pCustomRedirects,
      ...invidiousLokiCustomRedirects
    ].includes(protocolHost)) { resolve(); return; }
    if (!test) {
      let checkedInstances = [];

      if (protocol == 'loki') checkedInstances = [...invidiousLokiCustomRedirects];
      else if (protocol == 'i2p') checkedInstances = [...invidiousI2pCustomRedirects];
      else if (protocol == 'tor') checkedInstances = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects]
      if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
        checkedInstances = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects]
      }
      const i = checkedInstances.indexOf(protocolHost);
      if (i !== -1) checkedInstances.splice(i, 1);
      await utils.copyCookie('invidious', from, checkedInstances, 'PREFS');
    }
    resolve(true);
  })
}

function pasteInvidiousCookies() {
  return new Promise(async resolve => {
    await init();
    if (disableYoutube || youtubeFrontend != 'invidious') { resolve(); return; }
    let checkedInstances = [];
    if (protocol == 'loki') checkedInstances = [...invidiousLokiCustomRedirects];
    else if (protocol == 'i2p') checkedInstances = [...invidiousI2pCustomRedirects];
    else if (protocol == 'tor') checkedInstances = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects]
    if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
      checkedInstances = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects]
    }
    utils.getCookiesFromStorage('invidious', checkedInstances, 'PREFS');
    resolve();
  })
}

function copyPastePipedLocalStorage(test, url, tabId) {
  return new Promise(async resolve => {
    await init();
    if (disableYoutube || youtubeFrontend != 'piped') { resolve(); return; }
    const protocolHost = utils.protocolHost(url);
    if (![
      ...pipedNormalCustomRedirects,
      ...pipedNormalRedirectsChecks,
      ...pipedTorRedirectsChecks,
      ...pipedTorCustomRedirects,
      ...pipedI2pCustomRedirects,
      ...pipedLokiCustomRedirects
    ].includes(protocolHost)) { resolve(); return; }

    if (!test) {
      browser.tabs.executeScript(tabId, { file: "/assets/javascripts/youtube/get_piped_preferences.js", runAt: "document_start" });

      let checkedInstances = [];
      if (protocol == 'loki') checkedInstances = [...pipedLokiCustomRedirects];
      else if (protocol == 'i2p') checkedInstances = [...pipedI2pCustomRedirects];
      else if (protocol == 'tor') checkedInstances = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects]
      if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
        checkedInstances = [...pipedNormalCustomRedirects, ...pipedNormalRedirectsChecks]
      }
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
function pastePipedLocalStorage() {
  return new Promise(async resolve => {
    await init();
    if (disableYoutube || youtubeFrontend != 'piped') { resolve(); return; }
    let checkedInstances = [];
    if (protocol == 'loki') checkedInstances = [...pipedLokiCustomRedirects];
    else if (protocol == 'i2p') checkedInstances = [...pipedI2pCustomRedirects];
    else if (protocol == 'tor') checkedInstances = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects]
    if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
      checkedInstances = [...pipedNormalCustomRedirects, ...pipedNormalRedirectsChecks]
    }
    for (const to of checkedInstances) {
      browser.tabs.create({ url: to },
        tab => browser.tabs.executeScript(tab.id, { file: "/assets/javascripts/youtube/set_piped_preferences.js", runAt: "document_start" }))
    }
    resolve();
  })
}

function copyPastePipedMaterialLocalStorage(test, url, tabId,) {
  return new Promise(async resolve => {
    await init();
    if (disableYoutube || youtubeFrontend != 'pipedMaterial') { resolve(); return; }
    const protocolHost = utils.protocolHost(url);
    if (![
      ...pipedMaterialNormalRedirectsChecks,
      ...pipedMaterialNormalCustomRedirects,
      ...pipedMaterialTorRedirectsChecks,
      ...pipedMaterialTorCustomRedirects,
      ...pipedMaterialI2pCustomRedirects,
      ...pipedMaterialLokiCustomRedirects
    ].includes(protocolHost)) { resolve(); return; }

    if (!test) {
      browser.tabs.executeScript(tabId, { file: "/assets/javascripts/youtube/get_pipedMaterial_preferences.js", runAt: "document_start" });

      let checkedInstances = [];
      if (protocol == 'loki') checkedInstances = [...pipedMaterialLokiCustomRedirects];
      else if (protocol == 'i2p') checkedInstances = [...pipedMaterialI2pCustomRedirects];
      else if (protocol == 'tor') checkedInstances = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects]
      if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
        checkedInstances = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects]
      }
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

function pastePipedMaterialLocalStorage() {
  return new Promise(async resolve => {
    await init();
    if (disableYoutube || youtubeFrontend != 'pipedMaterial') { resolve(); return; }
    let checkedInstances = [];
    if (protocol == 'loki') checkedInstances = [...pipedMaterialLokiCustomRedirects];
    else if (protocol == 'i2p') checkedInstances = [...pipedMaterialI2pCustomRedirects];
    else if (protocol == 'tor') checkedInstances = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects]
    if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
      checkedInstances = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects]
    }
    for (const to of checkedInstances) {
      browser.tabs.create({ url: to },
        tab => browser.tabs.executeScript(tab.id, { file: "/assets/javascripts/youtube/set_pipedMaterial_preferences.js", runAt: "document_start" }))
    }
    resolve();
  })
}

function removeXFrameOptions(e) {
  let isChanged = false;

  if (e.type == 'main_frame') {
    for (const i in e.responseHeaders) {
      if (e.responseHeaders[i].name == 'content-security-policy') {
        let instancesList = [];
        if (protocol == 'loki') {
          if (youtubeFrontend == 'invidious') instancesList = [...invidiousLokiCustomRedirects]; //...invidiousLokiRedirectsChecks, 
          if (youtubeFrontend == 'piped') instancesList = [...pipedLokiCustomRedirects]; //...pipedLokiRedirectsChecks, 
          if (youtubeFrontend == 'pipedMaterial') instancesList = [...pipedMaterialLokiCustomRedirects]; //...pipedMaterialLokiRedirectsChecks, 
        }
        else if (protocol == 'i2p') {
          if (youtubeFrontend == 'invidious') instancesList = [...invidiousI2pCustomRedirects]; //...invidiousI2pRedirectsChecks, 
          if (youtubeFrontend == 'piped') instancesList = [...pipedI2pCustomRedirects]; //...pipedI2pRedirectsChecks, 
          if (youtubeFrontend == 'pipedMaterial') instancesList = [...pipedMaterialI2pCustomRedirects]; //...pipedMaterialI2pRedirectsChecks, 
        }
        else if (protocol == 'tor') {
          if (youtubeFrontend == 'invidious') instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects];
          if (youtubeFrontend == 'piped') instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects];
          if (youtubeFrontend == 'pipedMaterial') instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects];
        }
        if ((instancesList.length === 0 && protocolFallback) || protocol == 'normal') {
          if (youtubeFrontend == 'invidious') instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects];
          if (youtubeFrontend == 'piped') instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects];
          if (youtubeFrontend == 'pipedMaterial') instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects];
        }
        let securityPolicyList = e.responseHeaders[i].value.split(';');
        for (const i in securityPolicyList) securityPolicyList[i] = securityPolicyList[i].trim();

        let newSecurity = '';
        for (const item of securityPolicyList) {
          if (item.trim() == '') continue
          let regex = item.match(/([a-z-]{0,}) (.*)/)
          if (regex == null) continue
          let [, key, vals] = regex;
          if (key == 'frame-src') vals = vals + ' ' + instancesList.join(' ');
          newSecurity += key + ' ' + vals + '; ';
        }

        e.responseHeaders[i].value = newSecurity;
        isChanged = true;
      }
    }
  }
  else if (e.type == 'sub_frame') {
    const url = new URL(e.url);
    const protocolHost = utils.protocolHost(url);
    if (all().includes(protocolHost)) {
      for (const i in e.responseHeaders) {
        if (e.responseHeaders[i].name == 'x-frame-options') {
          e.responseHeaders.splice(i, 1);
          isChanged = true;
        }
        else if (e.responseHeaders[i].name == 'content-security-policy') {
          e.responseHeaders.splice(i, 1);
          isChanged = true;
        }
      }
    }
  }
  if (isChanged) return { responseHeaders: e.responseHeaders };
}

export default {
  setRedirects,
  copyPastePipedLocalStorage,
  pastePipedLocalStorage,
  copyPastePipedMaterialLocalStorage,
  pastePipedMaterialLocalStorage,
  copyPasteInvidiousCookies,
  pasteInvidiousCookies,
  redirect,
  reverse,
  switchInstance,
  initDefaults,
  removeXFrameOptions,
};

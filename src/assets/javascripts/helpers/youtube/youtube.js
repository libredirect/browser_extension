"use strict";

window.browser = window.browser || window.chrome;

import commonHelper from '../common.js'
import piped from './piped.js';
import pipedMaterial from './pipedMaterial.js';

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

const getRedirects = () => redirects;

let
  invidiousNormalRedirectsChecks,
  invidiousNormalCustomRedirects,
  invidiousTorRedirectsChecks,
  invidiousTorCustomRedirects;

let
  pipedNormalRedirectsChecks,
  pipedNormalCustomRedirects,
  pipedTorRedirectsChecks,
  pipedTorCustomRedirects;

let
  pipedMaterialNormalRedirectsChecks,
  pipedMaterialNormalCustomRedirects,
  pipedMaterialTorRedirectsChecks,
  pipedMaterialTorCustomRedirects;

let
  disable,
  protocol,
  OnlyEmbeddedVideo,
  frontend,
  youtubeEmbedFrontend;

function redirect(url, details, initiator) {
  if (disable) return null;

  let protocolHost = commonHelper.protocolHost(url);

  if (!targets.some(rx => rx.test(url.href))) return null;

  if (
    initiator && (
      [
        ...redirects.invidious.normal,
        ...invidiousNormalCustomRedirects,
        ...redirects.invidious.tor,
        ...invidiousTorCustomRedirects,

        ...redirects.piped.normal,
        ...redirects.piped.tor,
        ...pipedNormalCustomRedirects,
        ...pipedTorCustomRedirects
      ].includes(initiator.origin)
    )
  ) return 'BYPASSTAB';

  if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/)) return null; // Don't redirect YouTube Player API.

  if (frontend == 'yatte' && details.type === "main_frame")
    return url.href.replace(/^https?:\/{2}/, 'yattee://');

  else if (frontend == 'freetube' && details.type === "main_frame") {
    return `freetube://https:${url.pathname}${url.search}`;
  }

  else if (frontend == 'freetube' && details.type !== "main_frame" && youtubeEmbedFrontend == "youtube")
    return null;

  else if (
    frontend == 'invidious' ||
    ((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'invidious' && details.type == "sub_frame")
  ) {

    if (OnlyEmbeddedVideo == 'onlyEmbedded' && details.type !== "sub_frame") return null;
    if (
      OnlyEmbeddedVideo == 'onlyNotEmbedded' && details.type !== "main_frame" &&
      !((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'invidious' && details.type === "sub_frame")
    ) return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    return `${randomInstance}${url.pathname}${url.search}`;

  } else if (
    frontend == 'piped' ||
    ((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'piped' && details.type === "sub_frame")
  ) {

    if (OnlyEmbeddedVideo == 'onlyEmbedded' && details.type !== "sub_frame") return null;
    if (
      OnlyEmbeddedVideo == 'onlyNotEmbedded' && details.type !== "main_frame" &&
      !((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'piped' && details.type == "sub_frame")
    ) return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    return `${randomInstance}${url.pathname}${url.search}`;
  }
  else if (frontend == 'pipedMaterial' ||
    ((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'pipedMaterial' && details.type === "sub_frame")) {
    if (OnlyEmbeddedVideo == 'onlyEmbedded' && details.type !== "sub_frame") return null;
    if (
      OnlyEmbeddedVideo == 'onlyNotEmbedded' && details.type !== "main_frame" &&
      !((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'pipedMaterial' && details.type == "sub_frame")
    ) return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects];
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    return `${randomInstance}${url.pathname}${url.search}`;
  }
  return 'CANCEL';
}

function reverse(url) {
  browser.storage.local.get(
    [
      "youtubeRedirects",
      "invidiousNormalCustomRedirects",
      "invidiousTorCustomRedirects",
      "pipedNormalCustomRedirects",
      "pipedTorCustomRedirects",
    ],
    r => {
      let protocolHost = commonHelper.protocolHost(url);
      if (![
        ...r.youtubeRedirects.invidious.normal,
        ...r.youtubeRedirects.invidious.tor,

        ...r.youtubeRedirects.piped.normal,
        ...r.youtubeRedirects.piped.tor,

        ...r.invidiousNormalCustomRedirects,
        ...r.invidiousTorCustomRedirects,

        ...r.pipedNormalCustomRedirects,
        ...r.pipedTorCustomRedirects,
      ].includes(protocolHost)) return;

      return `https://youtube.com${url.pathname}${url.search}`;
    })
}

function switchInstance(url) {
  let protocolHost = commonHelper.protocolHost(url);
  if (
    protocol == 'normal' &&
    ![
      ...redirects.invidious.normal,
      ...redirects.piped.normal,
      ...redirects.pipedMaterial.normal,

      ...invidiousNormalCustomRedirects,
      ...pipedNormalCustomRedirects,
      ...pipedMaterialNormalCustomRedirects
    ].includes(protocolHost)
  ) return null;

  if (protocol == 'tor' &&
    ![
      ...redirects.invidious.tor,
      ...redirects.piped.tor,
      ...redirects.pipedMaterial.tor,

      ...invidiousTorCustomRedirects,
      ...pipedTorCustomRedirects,
      ...pipedMaterialTorCustomRedirects
    ].includes(protocolHost)
  ) return null;

  let instancesList;
  if (frontend == 'invidious') {
    if (protocol == 'normal') instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects];
  }
  else if (frontend == 'piped') {
    if (protocol == 'normal') instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects];
  }
  else if (frontend == 'pipedMaterial') {
    if (protocol == 'normal') instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects];
  }

  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length == 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return `${randomInstance}${url.pathname}${url.search}`;
}

function isPipedorInvidious(url, type, frontend) {
  init();
  let protocolHost = commonHelper.protocolHost(url);

  if (type !== "main_frame" && type !== "sub_frame") return false;

  if (frontend == 'invidious')
    return [
      ...redirects.invidious.normal,
      ...redirects.invidious.tor,
      ...invidiousNormalCustomRedirects,
      ...invidiousTorCustomRedirects,
    ].includes(protocolHost);

  if (frontend == 'piped')
    return [
      ...redirects.piped.normal,
      ...redirects.piped.tor,
      ...pipedNormalCustomRedirects,
      ...pipedTorCustomRedirects,
    ].includes(protocolHost);

  if (frontend == 'pipedMaterial')
    return [
      ...redirects.pipedMaterial.normal,
      ...redirects.pipedMaterial.tor,
      ...pipedMaterialNormalCustomRedirects,
      ...pipedMaterialTorCustomRedirects,
    ].includes(protocolHost);

  return [
    ...redirects.invidious.normal,
    ...redirects.invidious.tor,
    ...invidiousNormalCustomRedirects,
    ...invidiousTorCustomRedirects,

    ...redirects.piped.normal,
    ...redirects.piped.tor,
    ...pipedNormalCustomRedirects,
    ...pipedTorCustomRedirects,
  ].includes(protocolHost);
}

async function initDefaults() {
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

        await piped.initDefaults();
        await pipedMaterial.initDefaults();
        resolve();
      })
    })
  })
}

async function init() {
  return new Promise(
    resolve => {
      browser.storage.local.get(
        [
          "disableYoutube",
          "OnlyEmbeddedVideo",
          "youtubeRedirects",
          "youtubeFrontend",

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

          "youtubeEmbedFrontend",
          "youtubeProtocol",
        ],
        r => {
          redirects = r.youtubeRedirects;

          disable = r.disableYoutube;
          protocol = r.youtubeProtocol;
          frontend = r.youtubeFrontend;

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

          youtubeEmbedFrontend = r.youtubeEmbedFrontend;
          OnlyEmbeddedVideo = r.OnlyEmbeddedVideo;

          resolve();
        });
    })
}

async function initInvidiousCookies(from) {
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
        let protocolHost = commonHelper.protocolHost(from);
        if (![
          ...r.invidiousNormalRedirectsChecks,
          ...r.invidiousTorRedirectsChecks,
          ...r.invidiousNormalCustomRedirects,
          ...r.invidiousTorCustomRedirects,
        ].includes(protocolHost)) resolve();
        let checkedInstances;
        if (r.youtubeProtocol == 'normal') checkedInstances = [...r.invidiousNormalRedirectsChecks, ...r.invidiousNormalCustomRedirects]
        else if (r.youtubeProtocol == 'tor') checkedInstances = [...r.invidiousTorRedirectsChecks, ...r.invidiousTorCustomRedirects]
        for (const to of checkedInstances)
          commonHelper.copyCookie('invidious', from, to, 'PREFS');
        resolve(true);
      }
    )
  }
  )
}

function removeXFrameOptions(e) {
  const url = new URL(e.url);
  let protocolHost = commonHelper.protocolHost(url);
  const list = [
    ...redirects.invidious.normal,
    ...invidiousNormalCustomRedirects,
    ...redirects.invidious.tor,
    ...invidiousTorCustomRedirects,

    ...redirects.piped.normal,
    ...redirects.piped.tor,
    ...pipedNormalCustomRedirects,
    ...pipedTorCustomRedirects
  ];
  if (!list.includes(protocolHost) || e.type != 'sub_frame') return;
  let isChanged = false;
  for (const i in e.responseHeaders) if (e.responseHeaders[i].name == 'x-frame-options') {
    e.responseHeaders.splice(i, 1);
    isChanged = true;
  }
  if (isChanged) return { responseHeaders: e.responseHeaders };
}

let
  initPipedLocalStorage = piped.initPipedLocalStorage,
  initPipedMaterialLocalStorage = pipedMaterial.initPipedMaterialLocalStorage,
  copyPipedLocalStorage = piped.copyPipedLocalStorage;

export default {
  initPipedLocalStorage,
  initPipedMaterialLocalStorage,
  initInvidiousCookies,
  getRedirects,

  redirect,
  reverse,

  switchInstance,

  isPipedorInvidious,

  copyPipedLocalStorage,

  initDefaults,
  init,

  removeXFrameOptions,
};

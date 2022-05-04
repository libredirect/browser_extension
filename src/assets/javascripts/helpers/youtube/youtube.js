"use strict";

window.browser = window.browser || window.chrome;

import commonHelper from '../common.js'
import invidious from './invidious.js'
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
    "normal": [
      "https://piped.kavin.rocks",
      "https://piped.silkky.cloud",
      "https://piped.tokhmi.xyz",
      "https://piped.moomoo.me",
      "https://il.ax",
      "https://piped.syncpundit.com",
      "https://piped.mha.fi",
      "https://piped.mint.lgbt",
      "https://piped.privacy.com.de",
      "https://piped.notyourcomputer.net"
    ],
    "tor": [
      "http://piped2bbch4xslbl2ckr6k62q56kon56ffowxaqzy42ai22a4sash3ad.onion"
    ]
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

let invidiousNormalRedirectsChecks;
let invidiousNormalCustomRedirects = [];
let invidiousTorRedirectsChecks;
let invidiousTorCustomRedirects = [];

let pipedNormalRedirectsChecks;
let pipedNormalCustomRedirects = [];
let pipedTorRedirectsChecks;
let pipedTorCustomRedirects = [];

let pipedMaterialNormalRedirectsChecks;
let pipedMaterialNormalCustomRedirects = [];
let pipedMaterialTorRedirectsChecks;
let pipedMaterialTorCustomRedirects = [];

let disable;
let protocol;
let OnlyEmbeddedVideo;
let frontend;
let youtubeEmbedFrontend;
let bypassWatchOnYoutube;
let alwaysUsePreferred;

function redirect(url, details, initiator) {
  if (disable) return null;

  let protocolHost = commonHelper.protocolHost(url);

  let isInvidious = [
    ...redirects.invidious.normal,
    ...redirects.invidious.tor
  ].includes(protocolHost);

  let isCheckedInvidious = [
    ...invidiousNormalRedirectsChecks,
    ...invidiousNormalCustomRedirects,
    ...invidiousTorRedirectsChecks,
    ...invidiousTorCustomRedirects,
  ].includes(protocolHost);

  let isPiped = [
    ...redirects.piped.normal,
    ...redirects.piped.tor
  ].includes(protocolHost);

  let isCheckedPiped = [
    ...pipedNormalRedirectsChecks,
    ...pipedNormalCustomRedirects,
    ...pipedTorRedirectsChecks,
    ...pipedTorCustomRedirects,
  ].includes(protocolHost)

  if (
    alwaysUsePreferred && frontend == 'invidious' &&
    (isInvidious || isPiped) && !isCheckedInvidious
  ) return switchInstance(url);

  if (
    alwaysUsePreferred && frontend == 'piped' &&
    (isInvidious || isPiped) && !isCheckedPiped
  ) return switchInstance(url);

  if (!targets.some(rx => rx.test(url.href))) return null;

  if (
    bypassWatchOnYoutube &&
    initiator && (
      [...redirects.invidious.normal,
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
  let protocolHost = commonHelper.protocolHost(url);
  if (![
    ...redirects.invidious.normal,
    ...redirects.invidious.tor,
    ...invidiousNormalCustomRedirects,
    ...invidiousTorCustomRedirects,
    ...redirects.piped.normal,
    ...redirects.piped.tor,
    ...pipedNormalCustomRedirects,
    ...pipedTorCustomRedirects,
  ].includes(protocolHost)) return;

  return `https://youtube.com${url.pathname}${url.search}`;
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
  console.log('youtube initDefaults')
  return new Promise(async resolve => {
    fetch('/instances/data.json').then(response => response.text()).then(async data => {
      let dataJson = JSON.parse(data);
      redirects.invidious = dataJson.invidious;
      await browser.storage.local.set({
        disableYoutube: false,
        enableYoutubeCustomSettings: false,
        OnlyEmbeddedVideo: 'both',

        youtubeRedirects: {
          'invidious': dataJson.invidious,
          'piped': redirects.piped,
          'pipedMaterial': redirects.pipedMaterial
        },

        youtubeFrontend: 'invidious',

        invidiousNormalRedirectsChecks: [...redirects.invidious.normal],
        invidiousNormalCustomRedirects: [],

        invidiousTorRedirectsChecks: [...redirects.invidious.tor],
        invidiousTorCustomRedirects: [],

        pipedNormalRedirectsChecks: [...redirects.piped.normal],
        pipedNormalCustomRedirects: [],

        pipedTorRedirectsChecks: [...redirects.piped.tor],
        pipedTorCustomRedirects: [],

        pipedMaterialNormalRedirectsChecks: [...redirects.pipedMaterial.normal],
        pipedMaterialNormalCustomRedirects: [],

        pipedMaterialTorRedirectsChecks: [...redirects.pipedMaterial.tor],
        pipedMaterialTorCustomRedirects: [],

        alwaysUsePreferred: false,
        youtubeEmbedFrontend: 'invidious',
        youtubeProtocol: 'normal',
        bypassWatchOnYoutube: true,
      })

      await invidious.initDefaults();
      await piped.initDefaults();
      await pipedMaterial.initDefaults();
      resolve();
    }
    )
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

          "alwaysUsePreferred",
          "youtubeEmbedFrontend",
          "youtubeProtocol",
          "bypassWatchOnYoutube",
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
          alwaysUsePreferred = r.alwaysUsePreferred;
          bypassWatchOnYoutube = r.bypassWatchOnYoutube;

          resolve();
        });
    })
}

let
  initPipedLocalStorage = piped.initPipedLocalStorage,
  initPipedMaterialLocalStorage = pipedMaterial.initPipedMaterialLocalStorage,
  initInvidiousCookies = invidious.initInvidiousCookies;

export default {
  initPipedLocalStorage,
  initPipedMaterialLocalStorage,
  initInvidiousCookies,
  getRedirects,

  redirect,
  reverse,

  switchInstance,

  isPipedorInvidious,

  initDefaults,

  init,
};

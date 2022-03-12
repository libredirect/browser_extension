"use strict";

import commonHelper from '../common.js'
import {
  invidiousQuality,
  getinvidiousQuality,
  setinvidiousQuality,

  invidiousAlwaysProxy,
  setInvidiousAlwaysProxy,
  getInvidiousAlwaysProxy,

  invidiousPlayerStyle,
  getInvidiousPlayerStyle,
  setInvidiousPlayerStyle,

  invidiousInit,
  invidiousVideoLoop,
  getInvidiousVideoLoop,
  setInvidiousVideoLoop,

  invidiousContinueAutoplay,
  getInvidiousContinueAutoplay,
  setInvidiousContinueAutoplay,

  invidiousContinue,
  getInvidiousContinue,
  setInvidiousContinue,

  invidiousListen,
  getInvidiousListen,
  setInvidiousListen,

  invidiousSpeed,
  getInvidiousSpeed,
  setInvidiousSpeed,

  invidiousQualityDash,
  getInvidiousQualityDash,
  setInvidiousQualityDash,

  invidiousComments,
  getInvidiousComments,
  setInvidiousComments,

  invidiousCaptions,
  getInvidiousCaptions,
  setInvidiousCaptions,

  invidiousRelatedVideos,
  getInvidiousRelatedVideos,
  setInvidiousRelatedVideos,

  invidiousAnnotations,
  getInvidiousAnnotations,
  setInvidiousAnnotations,

  invidiousExtendDesc,
  getInvidiousExtendDesc,
  setInvidiousExtendDesc,

  invidiousVrMode,
  getInvidiousVrMode,
  setInvidiousVrMode,

  invidiousSavePlayerPos,
  getInvidiousSavePlayerPos,
  setInvidiousSavePlayerPos,

} from './invidious-options.js'

window.browser = window.browser || window.chrome;

const targets = [
  /^https?:\/\/(www\.|music\.|m\.|)youtube\.com(\/.*|$)/,

  /^https?:\/\/img\.youtube\.com\/vi\/.*\/..*/, // https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
  /^https?:\/\/(i|s)\.ytimg\.com\/vi\/.*\/..*/,

  /^https?:\/\/(www\.|music\.|)youtube\.com\/watch\?v\=..*/,

  /^https?:\/\/youtu\.be\/..*/,

  /^https?:\/\/(www\.|)(youtube|youtube-nocookie)\.com\/embed\/..*/,
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
      "https://piped.mint.lgbt",
      "https://il.ax"
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

let applyThemeToSites;
function getCustomRedirects() {
  return {
    "invidious": {
      "normal": [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects],
      "tor": [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects]
    },
    "piped": {
      "normal": [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects],
      "tor": [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects]
    }
  };
};

function setInvidiousRedirects(val) {
  redirects.invidious = val;
  browser.storage.local.set({ youtubeRedirects: redirects })
  console.log("invidiousRedirects: ", val)
}

let invidiousNormalRedirectsChecks;
const getInvidiousNormalRedirectsChecks = () => invidiousNormalRedirectsChecks;
function setInvidiousNormalRedirectsChecks(val) {
  invidiousNormalRedirectsChecks = val;
  browser.storage.local.set({ invidiousNormalRedirectsChecks })
  console.log("invidiousNormalRedirectsChecks: ", val)
}

let invidiousNormalCustomRedirects = [];
const getInvidiousNormalCustomRedirects = () => invidiousNormalCustomRedirects;
function setInvidiousNormalCustomRedirects(val) {
  invidiousNormalCustomRedirects = val;
  browser.storage.local.set({ invidiousNormalCustomRedirects })
  console.log("invidiousNormalCustomRedirects: ", val)
}

let invidiousTorRedirectsChecks;
const getInvidiousTorRedirectsChecks = () => invidiousTorRedirectsChecks;
function setInvidiousTorRedirectsChecks(val) {
  invidiousTorRedirectsChecks = val;
  browser.storage.local.set({ invidiousTorRedirectsChecks })
  console.log("invidiousTorRedirectsChecks: ", val)
}

let invidiousTorCustomRedirects = [];
const getInvidiousTorCustomRedirects = () => invidiousTorCustomRedirects;
function setInvidiousTorCustomRedirects(val) {
  invidiousTorCustomRedirects = val;
  browser.storage.local.set({ invidiousTorCustomRedirects })
  console.log("invidiousTorCustomRedirects: ", val)
}

let pipedNormalRedirectsChecks;
const getPipedNormalRedirectsChecks = () => pipedNormalRedirectsChecks;
function setPipedNormalRedirectsChecks(val) {
  pipedNormalRedirectsChecks = val;
  browser.storage.local.set({ pipedNormalRedirectsChecks })
  console.log("pipedNormalRedirectsChecks: ", val)
}

let pipedNormalCustomRedirects = [];
const getPipedNormalCustomRedirects = () => pipedNormalCustomRedirects;
function setPipedNormalCustomRedirects(val) {
  pipedNormalCustomRedirects = val;
  browser.storage.local.set({ pipedNormalCustomRedirects })
  console.log("pipedNormalCustomRedirects: ", val)
}

let pipedTorRedirectsChecks;
const getPipedTorRedirectsChecks = () => pipedTorRedirectsChecks;
function setPipedTorRedirectsChecks(val) {
  pipedTorRedirectsChecks = val;
  browser.storage.local.set({ pipedTorRedirectsChecks })
  console.log("pipedTorRedirectsChecks: ", val)
}

let pipedTorCustomRedirects = [];
const getPipedTorCustomRedirects = () => pipedTorCustomRedirects;
function setPipedTorCustomRedirects(val) {
  pipedTorCustomRedirects = val;
  browser.storage.local.set({ pipedTorCustomRedirects })
  console.log("pipedTorCustomRedirects: ", val)
}

function setPipedRedirects(val) {
  redirects.piped = val;
  browser.storage.local.set({ youtubeRedirects: redirects })
  console.log("pipedRedirects: ", val)
}

let pipedMaterialNormalRedirectsChecks;
const getPipedMaterialNormalRedirectsChecks = () => pipedMaterialNormalRedirectsChecks;
function setPipedMaterialNormalRedirectsChecks(val) {
  pipedMaterialNormalRedirectsChecks = val;
  browser.storage.local.set({ pipedMaterialNormalRedirectsChecks })
  console.log("pipedMaterialNormalRedirectsChecks: ", val)
}

let pipedMaterialNormalCustomRedirects = [];
const getPipedMaterialNormalCustomRedirects = () => pipedMaterialNormalCustomRedirects;
function setPipedMaterialNormalCustomRedirects(val) {
  pipedMaterialNormalCustomRedirects = val;
  browser.storage.local.set({ pipedMaterialNormalCustomRedirects })
  console.log("pipedMaterialNormalCustomRedirects: ", val)
}

let pipedMaterialTorRedirectsChecks;
const getPipedMaterialTorRedirectsChecks = () => pipedMaterialTorRedirectsChecks;
function setPipedMaterialTorRedirectsChecks(val) {
  pipedMaterialTorRedirectsChecks = val;
  browser.storage.local.set({ pipedMaterialTorRedirectsChecks })
  console.log("pipedMaterialTorRedirectsChecks: ", val)
}

let pipedMaterialTorCustomRedirects = [];
const getPipedMaterialTorCustomRedirects = () => pipedMaterialTorCustomRedirects;
function setPipedMaterialTorCustomRedirects(val) {
  pipedMaterialTorCustomRedirects = val;
  browser.storage.local.set({ pipedMaterialTorCustomRedirects })
  console.log("pipedMaterialTorCustomRedirects: ", val)
}

function setPipedMaterialRedirects(val) {
  redirects.pipedMaterial = val;
  browser.storage.local.set({ youtubeRedirects: redirects })
  console.log("pipedMaterialRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ disableYoutube: disable })
  console.log("disableYoutube: ", disable)
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
  protocol = val;
  browser.storage.local.set({ youtubeProtocol: val })
  console.log("youtubeProtocol: ", val)
}

let OnlyEmbeddedVideo;
function setOnlyEmbeddedVideo(val) {
  OnlyEmbeddedVideo = val;
  browser.storage.local.set({ OnlyEmbeddedVideo })
  console.log("OnlyEmbeddedVideo: ", OnlyEmbeddedVideo)
}
const getOnlyEmbeddedVideo = () => OnlyEmbeddedVideo;

let theme;

let volume;
const getVolume = () => volume;
function setVolume(val) {
  volume = val;
  browser.storage.local.set({ youtubeVolume: volume })
  console.log("youtubeVolume: ", volume)
}

let autoplay;
const getAutoplay = () => autoplay;
function setAutoplay(val) {
  autoplay = val;
  browser.storage.local.set({ youtubeAutoplay: autoplay })
  console.log("autoplay: ", autoplay)
}

let frontend;
const getFrontend = () => frontend;
function setFrontend(val) {
  frontend = val;
  browser.storage.local.set({ youtubeFrontend: val })
  console.log("youtubeFrontend: ", val)
}

let youtubeEmbedFrontend;
const getYoutubeEmbedFrontend = () => youtubeEmbedFrontend;
function setYoutubeEmbedFrontend(val) {
  youtubeEmbedFrontend = val;
  browser.storage.local.set({ youtubeEmbedFrontend })
  console.log("youtubeEmbedFrontend: ", youtubeEmbedFrontend)
}

let bypassWatchOnYoutube;
const getBypassWatchOnYoutube = () => bypassWatchOnYoutube;
function setBypassWatchOnYoutube(val) {
  bypassWatchOnYoutube = val;
  browser.storage.local.set({ bypassWatchOnYoutube })
  console.log("bypassWatchOnYoutube: ", bypassWatchOnYoutube)
}

let exceptions = {
  "url": [],
  "regex": [],
};
const getExceptions = () => exceptions;
function setExceptions(val) {
  exceptions = val;
  browser.storage.local.set({ youtubeEmbedExceptions: val })
  console.log("youtubeEmbedExceptions: ", val)
}

function isException(url) {
  for (const item of exceptions.url) {
    let protocolHost = `${url.protocol}//${url.host}`
    console.log(item, protocolHost)
    if (item == protocolHost) return true;
  }
  for (const item of exceptions.regex)
    if (new RegExp(item).test(url.href)) return true;
  return false;
}

let alwaysUsePreferred;
function redirect(url, details, initiator) {
  if (disable) return null;

  let protocolHost = `${url.protocol}//${url.host}`;

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
  ) return changeInstance(url);

  if (
    alwaysUsePreferred && frontend == 'piped' &&
    (isInvidious || isPiped) && !isCheckedPiped
  ) return changeInstance(url);

  if (!targets.some((rx) => rx.test(url.href))) return null;

  if (
    details.type != "main_frame" &&
    details.frameAncestors && details.frameAncestors.length > 0 &&
    isException(new URL(details.frameAncestors[0].url))
  ) {
    console.log(`Canceled ${url.href}`, details.frameAncestors[0].url)
    return null;
  }
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
    return url.href.replace(/^https?:\/\//, 'yattee://');

  else if (frontend == 'freetube' && details.type === "main_frame")
    return `freetube://${url}`;

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

function changeInstance(url) {
  let protocolHost = `${url.protocol}//${url.host}`;
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
  else return null;

  console.log("instancesList", instancesList);
  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return `${randomInstance}${url.pathname}${url.search}`;
}

function isPipedorInvidious(url, type, frontend) {
  let protocolHost = `${url.protocol}//${url.host}`;

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

function initPipedLocalStorage(tabId) {
  browser.tabs.executeScript(
    tabId,
    {
      file: "/assets/javascripts/helpers/youtube/piped-preferences.js",
      runAt: "document_start"
    }
  );
}

function initPipedMaterialLocalStorage(tabId) {
  browser.tabs.executeScript(
    tabId,
    {
      file: "/assets/javascripts/helpers/youtube/pipedMaterial-preferences.js",
      runAt: "document_start"
    }
  );
}

function initInvidiousCookies() {

  let checkedInstances = [
    ...invidiousNormalRedirectsChecks,
    ...invidiousNormalCustomRedirects,
    ...invidiousTorRedirectsChecks,
    ...invidiousTorCustomRedirects,
  ];

  for (const instanceUrl of checkedInstances)
    browser.cookies.get(
      {
        url: instanceUrl,
        name: "PREFS",
      },
      cookie => {
        let prefs = {};
        if (cookie) browser.cookies.remove({ url: instanceUrl, name: "PREFS" })

        if (invidiousAlwaysProxy != "DEFAULT") prefs.local = invidiousAlwaysProxy == 'true';
        if (applyThemeToSites && theme != "DEFAULT") prefs.dark_mode = theme;
        if (invidiousVideoLoop != "DEFAULT") prefs.video_loop = invidiousVideoLoop == 'true';
        if (invidiousContinueAutoplay != "DEFAULT") prefs.continue_autoplay = invidiousContinueAutoplay == 'true';
        if (invidiousContinue != "DEFAULT") prefs.continue = invidiousContinue == 'true';
        if (invidiousListen != "DEFAULT") prefs.listen = invidiousListen == 'true';
        if (invidiousSpeed != "DEFAULT") prefs.speed = parseFloat(invidiousSpeed);
        if (invidiousQuality != "DEFAULT") prefs.quality = invidiousQuality;
        if (invidiousQualityDash != "DEFAULT") prefs.quality_dash = invidiousQualityDash;

        if (invidiousComments[0] != "DEFAULT" || invidiousComments[1] != "DEFAULT") prefs.comments = []

        if (invidiousComments[0] != "DEFAULT") prefs.comments[0] = invidiousComments[0];
        else if (invidiousComments[1] != "DEFAULT") prefs.comments[0] = ""
        if (invidiousComments[1] != "DEFAULT") prefs.comments[1] = invidiousComments[1];
        else if (invidiousComments[0] != "DEFAULT") prefs.comments[1] = ""

        if (invidiousCaptions[0] != "DEFAULT" || invidiousCaptions[1] != "DEFAULT" || invidiousCaptions[2] != "DEFAULT") prefs.captions = [];

        if (invidiousCaptions[0] != "DEFAULT") prefs.captions[0] = invidiousCaptions[0];
        else if (invidiousCaptions[1] != "DEFAULT" || invidiousCaptions[2] != "DEFAULT") prefs.captions[0] = "";

        if (invidiousCaptions[1] != "DEFAULT") prefs.captions[1] = invidiousCaptions[1];
        else if (invidiousCaptions[0] != "DEFAULT" || invidiousCaptions[2] != "DEFAULT") prefs.captions[1] = "";

        if (invidiousCaptions[2] != "DEFAULT") prefs.captions[2] = invidiousCaptions[2];
        else if (invidiousCaptions[0] != "DEFAULT" || invidiousCaptions[1] != "DEFAULT") prefs.captions[2] = "";

        if (invidiousRelatedVideos != "DEFAULT") prefs.related_videos = invidiousRelatedVideos == 'true';
        if (invidiousAnnotations != "DEFAULT") prefs.annotations = invidiousAnnotations == 'true';
        if (invidiousExtendDesc != "DEFAULT") prefs.extend_desc = invidiousExtendDesc == 'true';
        if (invidiousVrMode != "DEFAULT") prefs.vr_mode = invidiousVrMode == 'true';
        if (invidiousSavePlayerPos != "DEFAULT") prefs.save_player_pos = invidiousSavePlayerPos == 'true';

        if (volume != "--") prefs.volume = parseInt(volume);
        if (invidiousPlayerStyle != "DEFAULT") prefs.player_style = invidiousPlayerStyle;
        if (autoplay != "DEFAULT") prefs.autoplay = autoplay == 'true';

        if (Object.entries(prefs).length !== 0)
          browser.cookies.set({
            url: instanceUrl,
            name: "PREFS",
            value: encodeURIComponent(JSON.stringify(prefs))
          })
      })
}

async function init() {
  await invidiousInit();
  return new Promise(
    resolve => {
      fetch('/instances/data.json').then(response => response.text()).then(data => {
        let dataJson = JSON.parse(data);
        browser.storage.local.get(
          [
            "theme",
            "applyThemeToSites",
            "disableYoutube",
            "OnlyEmbeddedVideo",
            "youtubeVolume",
            "youtubeAutoplay",
            "youtubeRedirects",
            "youtubeFrontend",

            "invidiousNormalRedirectsChecks",
            "invidiousNormalCustomRedirects",

            "invidiousTorRedirectsChecks",
            "invidiousTorCustomRedirects",

            "pipedNormalRedirectsChecks",
            "pipedNormalCustomRedirects",

            "pipedMaterialNormalRedirectsChecks",
            "pipedMaterialNormalCustomRedirects",

            "pipedMaterialTorRedirectsChecks",
            "pipedMaterialTorCustomRedirects",

            "pipedTorRedirectsChecks",
            "pipedTorCustomRedirects",
            "alwaysUsePreferred",
            "youtubeEmbedFrontend",

            "youtubeProtocol",

            "youtubeEmbedExceptions",
            "bypassWatchOnYoutube"
          ],
          r => { // r = result
            redirects.invidious = dataJson.invidious;
            if (r.youtubeRedirects) redirects = r.youtubeRedirects;

            disable = r.disableYoutube ?? false;
            protocol = r.youtubeProtocol ?? 'normal';
            frontend = r.youtubeFrontend ?? 'invidious';
            youtubeEmbedFrontend = r.youtubeEmbedFrontend ?? 'invidious';

            theme = r.theme ?? 'DEFAULT';
            applyThemeToSites = r.applyThemeToSites ?? false;

            volume = r.youtubeVolume ?? '--';
            autoplay = r.youtubeAutoplay ?? 'DEFAULT';

            OnlyEmbeddedVideo = r.OnlyEmbeddedVideo ?? 'both';

            invidiousNormalRedirectsChecks = r.invidiousNormalRedirectsChecks ?? [...redirects.invidious.normal];
            invidiousNormalCustomRedirects = r.invidiousNormalCustomRedirects ?? [];

            invidiousTorRedirectsChecks = r.invidiousTorRedirectsChecks ?? [...redirects.invidious.tor];
            invidiousTorCustomRedirects = r.invidiousTorCustomRedirects ?? [];

            pipedNormalRedirectsChecks = r.pipedNormalRedirectsChecks ?? [...redirects.piped.normal];
            pipedNormalCustomRedirects = r.pipedNormalCustomRedirects ?? [];

            pipedTorRedirectsChecks = r.pipedTorRedirectsChecks ?? [...redirects.piped.tor];
            pipedTorCustomRedirects = r.pipedTorCustomRedirects ?? [];

            pipedMaterialNormalRedirectsChecks = r.pipedMaterialNormalRedirectsChecks ?? [...redirects.pipedMaterial.normal];
            pipedMaterialNormalCustomRedirects = r.pipedMaterialNormalCustomRedirects ?? [];

            pipedMaterialTorRedirectsChecks = r.pipedMaterialTorRedirectsChecks ?? [...redirects.pipedMaterial.tor];
            pipedMaterialTorCustomRedirects = r.pipedMaterialTorCustomRedirects ?? [];

            alwaysUsePreferred = r.alwaysUsePreferred ?? false;

            bypassWatchOnYoutube = r.bypassWatchOnYoutube ?? true;

            if (r.youtubeEmbedExceptions) exceptions = r.youtubeEmbedExceptions;

            initInvidiousCookies();
            resolve();

          });
      });
    })
}

export default {
  getBypassWatchOnYoutube,
  setBypassWatchOnYoutube,

  initPipedLocalStorage,
  initPipedMaterialLocalStorage,

  getFrontend,
  setFrontend,

  getYoutubeEmbedFrontend,
  setYoutubeEmbedFrontend,

  getRedirects,
  getCustomRedirects,
  setInvidiousRedirects,
  setPipedRedirects,

  redirect,
  changeInstance,

  isPipedorInvidious,

  initInvidiousCookies,

  setInvidiousAlwaysProxy,
  getInvidiousAlwaysProxy,

  setinvidiousQuality,
  getinvidiousQuality,

  setInvidiousPlayerStyle,
  getInvidiousPlayerStyle,

  getInvidiousVideoLoop,
  setInvidiousVideoLoop,

  getDisable,
  setDisable,

  getProtocol,
  setProtocol,

  setOnlyEmbeddedVideo,
  getOnlyEmbeddedVideo,

  setVolume,
  getVolume,

  setAutoplay,
  getAutoplay,

  getInvidiousContinueAutoplay,
  setInvidiousContinueAutoplay,

  getInvidiousContinue,
  setInvidiousContinue,

  getInvidiousListen,
  setInvidiousListen,

  getInvidiousSpeed,
  setInvidiousSpeed,

  getInvidiousQualityDash,
  setInvidiousQualityDash,

  getInvidiousComments,
  setInvidiousComments,

  getInvidiousCaptions,
  setInvidiousCaptions,

  getInvidiousRelatedVideos,
  setInvidiousRelatedVideos,

  getInvidiousAnnotations,
  setInvidiousAnnotations,

  getInvidiousExtendDesc,
  setInvidiousExtendDesc,

  getInvidiousVrMode,
  setInvidiousVrMode,

  getInvidiousSavePlayerPos,
  setInvidiousSavePlayerPos,

  getInvidiousNormalRedirectsChecks,
  setInvidiousNormalRedirectsChecks,

  getInvidiousNormalCustomRedirects,
  setInvidiousNormalCustomRedirects,

  getPipedNormalRedirectsChecks,
  setPipedNormalRedirectsChecks,

  getPipedNormalCustomRedirects,
  setPipedNormalCustomRedirects,

  getInvidiousTorRedirectsChecks,
  setInvidiousTorRedirectsChecks,

  getInvidiousTorCustomRedirects,
  setInvidiousTorCustomRedirects,

  getPipedTorRedirectsChecks,
  setPipedTorRedirectsChecks,

  getPipedTorCustomRedirects,
  setPipedTorCustomRedirects,

  getPipedMaterialNormalRedirectsChecks,
  setPipedMaterialNormalRedirectsChecks,

  getPipedMaterialNormalCustomRedirects,
  setPipedMaterialNormalCustomRedirects,

  getPipedMaterialTorRedirectsChecks,
  setPipedMaterialTorRedirectsChecks,

  getPipedMaterialTorCustomRedirects,
  setPipedMaterialTorCustomRedirects,

  setPipedMaterialRedirects,

  getExceptions,
  setExceptions,
  isException,

  init,
};
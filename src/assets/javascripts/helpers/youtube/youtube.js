"use strict";

import commonHelper from '../common.js'

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
  }
};

const getRedirects = () => redirects;

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

let invidiousAlwaysProxy;
function setInvidiousAlwaysProxy(val) {
  invidiousAlwaysProxy = val;
  browser.storage.local.set({ invidiousAlwaysProxy })
  console.log("invidiousAlwaysProxy: ", invidiousAlwaysProxy);
}
const getInvidiousAlwaysProxy = () => invidiousAlwaysProxy;

let OnlyEmbeddedVideo;
function setOnlyEmbeddedVideo(val) {
  OnlyEmbeddedVideo = val;
  browser.storage.local.set({ OnlyEmbeddedVideo })
  console.log("OnlyEmbeddedVideo: ", OnlyEmbeddedVideo)
}
const getOnlyEmbeddedVideo = () => OnlyEmbeddedVideo;

let invidiousVideoQuality;
function setInvidiousVideoQuality(val) {
  invidiousVideoQuality = val;
  browser.storage.local.set({ invidiousVideoQuality })
  console.log("invidiousVideoQuality: ", invidiousVideoQuality)
}
const getInvidiousVideoQuality = () => invidiousVideoQuality;

let theme;
const getTheme = () => theme;
function setTheme(val) {
  theme = val;
  browser.storage.local.set({ youtubeTheme: theme })
  console.log("theme: ", theme)
}

let volume;
const getVolume = () => volume;
function setVolume(val) {
  volume = val;
  browser.storage.local.set({ youtubeVolume: volume })
  console.log("youtubeVolume: ", volume)
}

let invidiousPlayerStyle;
const getInvidiousPlayerStyle = () => invidiousPlayerStyle;
function setInvidiousPlayerStyle(val) {
  invidiousPlayerStyle = val;
  browser.storage.local.set({ invidiousPlayerStyle })
  console.log("invidiousPlayerStyle: ", invidiousPlayerStyle)
}

let invidiousSubtitles;
let getInvidiousSubtitles = () => invidiousSubtitles;
function setInvidiousSubtitles(val) {
  invidiousSubtitles = val;
  browser.storage.local.set({ invidiousSubtitles })
  console.log("invidiousSubtitles: ", invidiousSubtitles)
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

let persistInvidiousPrefs;
const getPersistInvidiousPrefs = () => persistInvidiousPrefs;
function setPersistInvidiousPrefs(val) {
  persistInvidiousPrefs = val;
  browser.storage.local.set({ persistInvidiousPrefs })
  console.log("persistInvidiousPrefs: ", persistInvidiousPrefs)
}

let alwaysusePreferred;
const getAlwaysusePreferred = () => alwaysusePreferred;
function setAlwaysusePreferred(val) {
  alwaysusePreferred = val;
  browser.storage.local.set({ alwaysusePreferred })
  console.log("alwaysusePreferred: ", alwaysusePreferred)
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

function redirect(url, details, initiator) {
  if (disable) return null;

  let isTargets = targets.some((rx) => rx.test(url.href));
  let protocolHost = `${url.protocol}//${url.host}`;

  let isInvidious = [...redirects.invidious.normal, ...redirects.invidious.tor].includes(protocolHost);
  if (isInvidious) {
    let myInvidiousInstances = [
      ...invidiousNormalRedirectsChecks,
      ...invidiousNormalCustomRedirects,

      ...invidiousTorRedirectsChecks,
      ...invidiousTorCustomRedirects,
    ];
    for (const item of myInvidiousInstances) if (item == protocolHost) isInvidious = false;
  }

  let isPiped = [...redirects.piped.normal, ...redirects.piped.tor].includes(protocolHost);
  if (isPiped) {
    let myPipedInstances = [
      ...pipedNormalRedirectsChecks,
      ...pipedNormalCustomRedirects,

      ...pipedTorRedirectsChecks,
      ...pipedTorCustomRedirects,
    ];
    for (const item of myPipedInstances) if (item == protocolHost) isPiped = false;
  }

  if (frontend == 'invidious') {
    if (alwaysusePreferred) {
      if (!(isTargets | redirects.piped.normal.includes(protocolHost) | isInvidious)) return null;
    }
    else {
      if (!(isTargets | isPiped)) return null;
    }
  }
  if (frontend == 'piped') {
    if (alwaysusePreferred) {
      if (!(isTargets | isPiped | redirects.invidious.normal.includes(protocolHost))) return null;
    }
    else {
      if (!(isTargets | isInvidious)) return null;
    }
  }
  else
    if (!isTargets) return null;


  if (details.type != "main_frame" && details.frameAncestors && details.frameAncestors.length > 0 && isException(new URL(details.frameAncestors[0].url))) {
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

    return `${randomInstance}${url.pathname.replace("/shorts/", "/watch?v=")}${url.search}`;

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

    return `${randomInstance}${url.pathname.replace("/shorts/", "/watch?v=")}${url.search}`;
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
      ...invidiousNormalCustomRedirects,
      ...pipedNormalCustomRedirects
    ].includes(protocolHost)
  ) return null;
  if (protocol == 'tor' && ![
    ...redirects.invidious.tor,
    ...redirects.piped.tor,
    ...invidiousTorCustomRedirects,
    ...pipedTorCustomRedirects
  ].includes(protocolHost)) return null;

  let instancesList;
  if (frontend == 'invidious') {
    if (protocol == 'normal') instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects];
  }
  else if (frontend == 'piped') {
    if (protocol == 'normal') instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects];
  }

  console.log("instancesList", instancesList);
  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return randomInstance;
}

function isPipedorInvidious(url, type) {
  let protocolHost = `${url.protocol}//${url.host}`;
  return (type === "main_frame" || type === "sub_frame") && [
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

function isUrlPipedorInvidious(url, frontend) {
  try {
    url = new URL(url);
  }
  catch (error) {
    return
  }
  let protocolHost = `${url.protocol}//${url.host}`;

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

function addUrlParams(url) {
  let protocolHost = `${url.protocol}//${url.host}`;
  let isChanged = false;
  console.log("Adding URL Params", protocolHost);
  if (
    [
      ...redirects.invidious.normal,
      ...redirects.invidious.tor,
      ...invidiousNormalCustomRedirects,
      ...invidiousTorCustomRedirects
    ].includes(protocolHost)
  ) {
    if (!url.searchParams.has("dark_mode") && theme != "DEFAULT") {
      url.searchParams.append("dark_mode", theme);
      isChanged = true;
    }

    if (!url.searchParams.has("volume") && volume != "--") {
      url.searchParams.append("volume", volume);
      isChanged = true;
    }

    if (!url.searchParams.has("autoplay") && autoplay != "DEFAULT") {
      url.searchParams.append("autoplay", autoplay);
      isChanged = true;
    }

    if (!url.searchParams.has("local") && invidiousAlwaysProxy != "DEFAULT") {
      url.searchParams.append("local", invidiousAlwaysProxy);
      isChanged = true;
    }

    if (!url.searchParams.has("quality") && invidiousVideoQuality != "DEFAULT") {
      url.searchParams.append("quality", invidiousVideoQuality);
      isChanged = true;
    }

    if (!url.searchParams.has("player_style") && invidiousPlayerStyle != "DEFAULT") {
      url.searchParams.append("player_style", invidiousPlayerStyle);
      isChanged = true;
    };

    if (!url.searchParams.has("subtitles") && invidiousSubtitles.trim() != '') {
      url.searchParams.append("subtitles", invidiousSubtitles);
      isChanged = true;
    }

  } else if (
    [
      ...redirects.piped.normal,
      ...redirects.piped.tor,
      ...pipedNormalCustomRedirects,
      ...pipedTorCustomRedirects,
    ].includes(protocolHost)
  ) {

    if (!url.searchParams.has("theme") && theme != "DEFAULT") {
      url.searchParams.append("theme", theme);
      isChanged = true;
    }

    if (!url.searchParams.has("volume") && volume != "--") {
      url.searchParams.append("volume", volume / 100);
      isChanged = true;
    }

    if (!url.searchParams.has("playerAutoPlay") && autoplay != "DEFAULT") {
      url.searchParams.append("playerAutoPlay", autoplay);
      isChanged = true;
    }

  }
  if (isChanged) return url.href;
  else return;
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

function initInvidiousCookies(tabId) {
  browser.tabs.executeScript(
    tabId,
    {
      file: "/assets/javascripts/helpers/youtube/invidious-preferences.js",
      runAt: "document_start"
    }
  );
}

async function init() {
  return new Promise((resolve) => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
      browser.storage.local.get(
        [
          "invidiousAlwaysProxy",
          "invidiousVideoQuality",
          "youtubeTheme",
          "persistInvidiousPrefs",
          "disableYoutube",
          "OnlyEmbeddedVideo",
          "youtubeVolume",
          "invidiousPlayerStyle",
          "invidiousSubtitles",
          "youtubeAutoplay",
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
          "alwaysusePreferred",
          "youtubeEmbedFrontend",

          "youtubeProtocol",

          "youtubeEmbedExceptions",
          "bypassWatchOnYoutube"
        ],
        (result) => {
          redirects.invidious = dataJson.invidious;
          if (result.youtubeRedirects) redirects = result.youtubeRedirects;

          disable = result.disableYoutube ?? false;
          protocol = result.youtubeProtocol ?? 'normal';
          frontend = result.youtubeFrontend ?? 'invidious';
          youtubeEmbedFrontend = result.youtubeEmbedFrontend ?? 'invidious';

          theme = result.youtubeTheme ?? 'DEFAULT';
          volume = result.youtubeVolume ?? '--';
          autoplay = result.youtubeAutoplay ?? 'DEFAULT';

          invidiousAlwaysProxy = result.invidiousAlwaysProxy ?? 'DEFAULT';
          OnlyEmbeddedVideo = result.OnlyEmbeddedVideo ?? 'both';
          invidiousVideoQuality = result.invidiousVideoQuality ?? 'DEFAULT';
          invidiousPlayerStyle = result.invidiousPlayerStyle ?? 'DEFAULT';
          invidiousSubtitles = result.invidiousSubtitles || '';

          invidiousNormalRedirectsChecks = result.invidiousNormalRedirectsChecks ?? [...redirects.invidious.normal];
          invidiousNormalCustomRedirects = result.invidiousNormalCustomRedirects ?? [];

          invidiousTorRedirectsChecks = result.invidiousTorRedirectsChecks ?? [...redirects.invidious.tor];
          invidiousTorCustomRedirects = result.invidiousTorCustomRedirects ?? [];

          pipedNormalRedirectsChecks = result.pipedNormalRedirectsChecks ?? [...redirects.piped.normal];
          pipedNormalCustomRedirects = result.pipedNormalCustomRedirects ?? [];

          pipedTorRedirectsChecks = result.pipedTorRedirectsChecks ?? [...redirects.piped.tor];
          pipedTorCustomRedirects = result.pipedTorCustomRedirects ?? [];

          persistInvidiousPrefs = result.persistInvidiousPrefs ?? false;

          alwaysusePreferred = result.alwaysusePreferred ?? true;

          bypassWatchOnYoutube = result.bypassWatchOnYoutube ?? true;

          if (result.youtubeEmbedExceptions) exceptions = result.youtubeEmbedExceptions;

          resolve();
        });
    });
  })
}

export default {
  getBypassWatchOnYoutube,
  setBypassWatchOnYoutube,
  initInvidiousCookies,
  initPipedLocalStorage,

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
  isUrlPipedorInvidious,
  addUrlParams,

  getDisable,
  setDisable,

  getProtocol,
  setProtocol,

  setInvidiousAlwaysProxy,
  getInvidiousAlwaysProxy,

  setOnlyEmbeddedVideo,
  getOnlyEmbeddedVideo,

  setInvidiousVideoQuality,
  getInvidiousVideoQuality,

  setTheme,
  getTheme,

  setVolume,
  getVolume,

  setInvidiousPlayerStyle,
  getInvidiousPlayerStyle,

  setInvidiousSubtitles,
  getInvidiousSubtitles,

  setAutoplay,
  getAutoplay,

  getPersistInvidiousPrefs,
  setPersistInvidiousPrefs,

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

  getAlwaysusePreferred,
  setAlwaysusePreferred,

  getExceptions,
  setExceptions,
  isException,

  init,
};

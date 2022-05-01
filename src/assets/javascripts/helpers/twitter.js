window.browser = window.browser || window.chrome;

import { safeURL } from "../../../util.js";
import commonHelper from './common.js'

const targets = [
  /^https?:\/{2}(www\.|mobile\.|)twitter\.com/,
  /^https?:\/{2}(pbs\.|video\.|)twimg\.com/,
  /^https?:\/{2}platform\.twitter\.com\/embed/,
  /^https?:\/{2}t\.co/
];

let redirects = {
  "nitter": {
    "normal": [],
    "tor": []
  },
};
const getRedirects = () => redirects;

function getCustomRedirects() {
  return {
    "nitter": {
      "normal": [...nitterNormalRedirectsChecks, ...nitterNormalCustomRedirects],
      "tor": [...nitterTorRedirectsChecks, ...nitterTorCustomRedirects]
    },
  };
};

function setRedirects(val) {
  redirects.nitter = val;
  browser.storage.local.set({ twitterRedirects: redirects })
  console.log("twitterRedirects:", val)
  for (const item of nitterNormalRedirectsChecks)
    if (!redirects.nitter.normal.includes(item)) {
      var index = nitterNormalRedirectsChecks.indexOf(item);
      if (index !== -1) nitterNormalRedirectsChecks.splice(index, 1);
    }
  setNitterNormalRedirectsChecks(nitterNormalRedirectsChecks);

  for (const item of nitterTorRedirectsChecks)
    if (!redirects.nitter.tor.includes(item)) {
      var index = nitterTorRedirectsChecks.indexOf(item);
      if (index !== -1) nitterTorRedirectsChecks.splice(index, 1);
    }
  setNitterTorRedirectsChecks(nitterTorRedirectsChecks);
}

let nitterNormalRedirectsChecks;
const getNitterNormalRedirectsChecks = () => nitterNormalRedirectsChecks;
function setNitterNormalRedirectsChecks(val) {
  nitterNormalRedirectsChecks = val;
  browser.storage.local.set({ nitterNormalRedirectsChecks })
  console.log("nitterNormalRedirectsChecks: ", val)
}

let nitterNormalCustomRedirects = [];
const getNitterNormalCustomRedirects = () => nitterNormalCustomRedirects;
function setNitterNormalCustomRedirects(val) {
  nitterNormalCustomRedirects = val;
  browser.storage.local.set({ nitterNormalCustomRedirects })
  console.log("nitterNormalCustomRedirects: ", val)
}

let nitterTorRedirectsChecks;
const getNitterTorRedirectsChecks = () => nitterTorRedirectsChecks;
function setNitterTorRedirectsChecks(val) {
  nitterTorRedirectsChecks = val;
  browser.storage.local.set({ nitterTorRedirectsChecks })
  console.log("nitterTorRedirectsChecks: ", val)
}

let nitterTorCustomRedirects = [];
const getNitterTorCustomRedirects = () => nitterTorCustomRedirects;
function setNitterTorCustomRedirects(val) {
  nitterTorCustomRedirects = val;
  browser.storage.local.set({ nitterTorCustomRedirects })
  console.log("nitterTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ disableTwitter: disable })
}

let enableCustomSettings;
const getEnableCustomSettings = () => enableCustomSettings;
function setEnableCustomSettings(val) {
  enableCustomSettings = val;
  browser.storage.local.set({ enableTwitterCustomSettings: enableCustomSettings })
  console.log("enableTwitterCustomSettings: ", enableCustomSettings)
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
  protocol = val;
  browser.storage.local.set({ twitterProtocol: val })
  console.log("twitterProtocol: ", val)
}

let bypassWatchOnTwitter;
const getBypassWatchOnTwitter = () => bypassWatchOnTwitter;
function setBypassWatchOnTwitter(val) {
  bypassWatchOnTwitter = val;
  browser.storage.local.set({ bypassWatchOnTwitter })
  console.log("bypassWatchOnTwitter: ", bypassWatchOnTwitter)
}

let alwaysUsePreferred;

let theme;
const getTheme = () => theme;

let infiniteScroll;
const getInfiniteScroll = () => infiniteScroll;

let stickyProfile;
const getStickyProfile = () => stickyProfile;

let bidiSupport;
const getBidiSupport = () => bidiSupport;

let hideTweetStats;
const getHideTweetStats = () => hideTweetStats;

let hideBanner;
const getHideBanner = () => hideBanner;

let hidePins;
const getHidePins = () => hidePins;

let hideReplies;
const getHideReplies = () => hideReplies;

let squareAvatars;
const getSquareAvatars = () => squareAvatars;

let mp4Playback;
const getMp4Playback = () => mp4Playback;

let hlsPlayback;
const getHlsPlayback = () => hlsPlayback;

let proxyVideos;
const getProxyVideos = () => proxyVideos;

let muteVideos;
const getMuteVideos = () => muteVideos;

let autoplayGifs;
const getAutoplayGifs = () => autoplayGifs;



async function setSettings(val) {
  return new Promise(
    resolve => {
      browser.storage.local.set(val).then(resolve);
    }
  )

}

function redirect(url, initiator) {
  let protocolHost = commonHelper.protocolHost(url);
  let isNitter = [
    ...redirects.nitter.normal,
    ...redirects.nitter.tor
  ].includes(protocolHost);

  let isCheckedNitter = [
    ...nitterNormalRedirectsChecks,
    ...nitterNormalCustomRedirects,
    ...nitterTorRedirectsChecks,
    ...nitterTorCustomRedirects
  ].includes(protocolHost);

  if (alwaysUsePreferred && isNitter && !isCheckedNitter) return switchInstance(url);

  if (disable) return null;

  if (!targets.some(rx => rx.test(url.href))) return null;

  if (url.pathname.split("/").includes("home")) {
    console.log("twitter homepage");
    return null;
  }

  if (
    bypassWatchOnTwitter &&
    initiator &&
    [...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterTorCustomRedirects,
    ...nitterNormalCustomRedirects
    ].includes(initiator.origin)

  ) return 'BYPASSTAB';

  let instancesList;
  if (protocol == 'normal')
    instancesList = [...nitterNormalRedirectsChecks, ...nitterNormalCustomRedirects];
  else if (protocol == 'tor')
    instancesList = [...nitterTorRedirectsChecks, ...nitterTorCustomRedirects];

  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  // https://pbs.twimg.com/profile_images/648888480974508032/66_cUYfj_400x400.jpg
  if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video")
    return `${randomInstance}/pic/${encodeURIComponent(`${url.host}${url.pathname}`)}`;
  else if (url.pathname.split("/").includes("tweets"))
    return `${randomInstance}${url.pathname.replace("/tweets", "")}${url.search}`;
  else if (url.host == 't.co')
    return `${randomInstance}/t.co${url.pathname}`;
  else
    return `${randomInstance}${url.pathname}${url.search}`;
}

function reverse(url) {
  let protocolHost = commonHelper.protocolHost(url);
  if (
    ![...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterNormalCustomRedirects,
    ...nitterTorCustomRedirects].includes(protocolHost)
  ) return;
  return `https://twitter.com${url.pathname}${url.search}`;
}

function switchInstance(url) {
  let protocolHost = commonHelper.protocolHost(url);

  let twitterList = [
    ...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterNormalCustomRedirects,
    ...nitterTorCustomRedirects,
  ];

  if (!twitterList.includes(protocolHost)) return null;

  let instancesList;
  if (protocol == 'normal') instancesList = [...nitterNormalRedirectsChecks, ...nitterNormalCustomRedirects];
  else if (protocol == 'tor') instancesList = [...nitterTorRedirectsChecks, ...nitterTorCustomRedirects];

  console.log("instancesList", instancesList);
  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length === 0) return null;

  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return `${randomInstance}${url.pathname}${url.search}`;
}

function removeXFrameOptions(e) {
  const url = safeURL(e.url);
  let protocolHost = commonHelper.protocolHost(url);
  let twitterList = [
    ...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterNormalCustomRedirects,
    ...nitterTorCustomRedirects,
  ];
  if (!twitterList.includes(protocolHost) || e.type != 'sub_frame') return;
  let isChanged = false;
  for (const i in e.responseHeaders) if (e.responseHeaders[i].name == 'x-frame-options') {
    e.responseHeaders.splice(i, 1);
    isChanged = true;
  }
  if (isChanged) return { responseHeaders: e.responseHeaders };
}

function isNitter(url, type) {
  let protocolHost = commonHelper.protocolHost(url);

  if (type !== "main_frame" && type !== "sub_frame") return false;

  return [
    ...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterNormalCustomRedirects,
    ...nitterTorCustomRedirects,
  ].includes(protocolHost);
}

function initNitterCookies() {
  if (enableCustomSettings) {
    let checkedInstances;
    if (protocol == 'normal') checkedInstances = [...nitterNormalRedirectsChecks, ...nitterNormalCustomRedirects]
    else if (protocol == 'tor') checkedInstances = [...nitterTorRedirectsChecks, ...nitterTorCustomRedirects]

    for (const instanceUrl of checkedInstances) {
      browser.cookies.set({ url: instanceUrl, name: "theme", value: theme })
      browser.cookies.set({ url: instanceUrl, name: "infiniteScroll", value: infiniteScroll ? 'on' : '' })
      browser.cookies.set({ url: instanceUrl, name: "stickyProfile", value: stickyProfile ? 'on' : '' })
      browser.cookies.set({ url: instanceUrl, name: "bidiSupport", value: bidiSupport ? 'on' : '', })
      browser.cookies.set({ url: instanceUrl, name: "hideTweetStats", value: hideTweetStats ? 'on' : '' })
      browser.cookies.set({ url: instanceUrl, name: "hideBanner", value: hideBanner ? 'on' : '' })
      browser.cookies.set({ url: instanceUrl, name: "hidePins", value: hidePins ? 'on' : '', })
      browser.cookies.set({ url: instanceUrl, name: "hideReplies", value: hideReplies ? 'on' : '' })
      browser.cookies.set({ url: instanceUrl, name: "squareAvatars", value: squareAvatars ? 'on' : '' })
      browser.cookies.set({ url: instanceUrl, name: "mp4Playback", value: mp4Playback ? 'on' : '' })
      browser.cookies.set({ url: instanceUrl, name: "hlsPlayback", value: hlsPlayback ? 'on' : '' })
      browser.cookies.set({ url: instanceUrl, name: "proxyVideos", value: proxyVideos ? 'on' : '' })
      browser.cookies.set({ url: instanceUrl, name: "muteVideos", value: muteVideos ? 'on' : '' })
      browser.cookies.set({ url: instanceUrl, name: "autoplayGifs", value: autoplayGifs ? 'on' : '' })
    }
  }
}

async function init() {
  return new Promise(resolve => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
      browser.storage.local.get(
        [
          "disableTwitter",

          "enableTwitterCustomSettings",

          "twitterRedirects",
          "bypassWatchOnTwitter",

          "nitterNormalRedirectsChecks",
          "nitterNormalCustomRedirects",

          "nitterTorRedirectsChecks",
          "nitterTorCustomRedirects",

          "twitterProtocol",
          "alwaysUsePreferred",

          "nitterTheme",
          "nitterInfiniteScroll",
          "nitterStickyProfile",
          "nitterBidiSupport",
          "nitterHideTweetStats",
          "nitterHideBanner",
          "nitterHidePins",
          "nitterHideReplies",
          "nitterSquareAvatars",
          "nitterMp4Playback",
          "nitterHlsPlayback",
          "nitterProxyVideos",
          "nitterMuteVideos",
          "nitterAutoplayGifs",
        ],
        r => {
          disable = r.disableTwitter ?? false;
          enableCustomSettings = r.enableTwitterCustomSettings ?? false;

          protocol = r.twitterProtocol ?? "normal";

          bypassWatchOnTwitter = r.bypassWatchOnTwitter ?? true;

          alwaysUsePreferred = r.alwaysUsePreferred ?? false;

          redirects.nitter = dataJson.nitter;
          if (r.twitterRedirects) redirects = r.twitterRedirects;

          nitterNormalRedirectsChecks = r.nitterNormalRedirectsChecks ?? [...redirects.nitter.normal];
          nitterNormalCustomRedirects = r.nitterNormalCustomRedirects ?? [];

          nitterTorRedirectsChecks = r.nitterTorRedirectsChecks ?? [...redirects.nitter.tor];
          nitterTorCustomRedirects = r.nitterTorCustomRedirects ?? [];

          theme = r.nitterTheme ?? 'Auto';
          infiniteScroll = r.nitterInfiniteScroll ?? false;
          stickyProfile = r.nitterStickyProfile ?? true;
          bidiSupport = r.nitterBidiSupport ?? false;
          hideTweetStats = r.nitterHideTweetStats ?? false;
          hideBanner = r.nitterHideBanner ?? false;
          hidePins = r.nitterHidePins ?? false;
          hideReplies = r.nitterHideReplies ?? false;
          squareAvatars = r.nitterSquareAvatars ?? false;
          mp4Playback = r.nitterMp4Playback ?? true;
          hlsPlayback = r.nitterHlsPlayback ?? false;
          proxyVideos = r.nitterProxyVideos ?? true;
          muteVideos = r.nitterMuteVideos ?? false;
          autoplayGifs = r.nitterAutoplayGifs ?? true;

          resolve();
        }
      );
    });
  });
}

export default {
  getRedirects,
  getCustomRedirects,
  setRedirects,

  getDisable,
  setDisable,

  reverse,

  getEnableCustomSettings,
  setEnableCustomSettings,

  getNitterNormalRedirectsChecks,
  setNitterNormalRedirectsChecks,

  getNitterNormalCustomRedirects,
  setNitterNormalCustomRedirects,

  getNitterTorRedirectsChecks,
  setNitterTorRedirectsChecks,

  getNitterTorCustomRedirects,
  setNitterTorCustomRedirects,

  getBypassWatchOnTwitter,
  setBypassWatchOnTwitter,

  removeXFrameOptions,

  getProtocol,
  setProtocol,

  isNitter,
  initNitterCookies,

  getTheme,
  getInfiniteScroll,
  getStickyProfile,
  getBidiSupport,
  getHideTweetStats,
  getHideBanner,
  getHidePins,
  getHideReplies,
  getSquareAvatars,
  getMp4Playback,
  getHlsPlayback,
  getProxyVideos,
  getMuteVideos,
  getAutoplayGifs,

  setSettings,

  redirect,
  init,
  switchInstance,
};

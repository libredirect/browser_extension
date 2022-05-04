window.browser = window.browser || window.chrome;

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
function setRedirects(val) {
  redirects.nitter = val;
  browser.storage.local.set({ twitterRedirects: redirects })
  console.log("twitterRedirects:", val)
  for (const item of nitterNormalRedirectsChecks)
    if (!redirects.nitter.normal.includes(item)) {
      var index = nitterNormalRedirectsChecks.indexOf(item);
      if (index !== -1) nitterNormalRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ nitterNormalRedirectsChecks })

  for (const item of nitterTorRedirectsChecks)
    if (!redirects.nitter.tor.includes(item)) {
      var index = nitterTorRedirectsChecks.indexOf(item);
      if (index !== -1) nitterTorRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ nitterTorRedirectsChecks })
}

let nitterNormalRedirectsChecks;
let nitterNormalCustomRedirects = [];
let nitterTorRedirectsChecks;
let nitterTorCustomRedirects = [];

let disable; // disableTwitter
let enableCustomSettings; // enableTwitterCustomSettings

let protocol; // twitterProtocol
let bypassWatchOnTwitter; // bypassWatchOnTwitter
let alwaysUsePreferred;

let
  theme,
  infiniteScroll,
  stickyProfile,
  bidiSupport,
  hideTweetStats,
  hideBanner,
  hidePins,
  hideReplies,
  squareAvatars,
  mp4Playback,
  hlsPlayback,
  proxyVideos,
  muteVideos,
  autoplayGifs;


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
  let url = new URL(e.url);
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


async function initDefaults() {
  await fetch('/instances/data.json').then(response => response.text()).then(async data => {
    let dataJson = JSON.parse(data);
    redirects.nitter = dataJson.nitter;
    browser.storage.local.get('cloudflareList', async r => {
      nitterNormalRedirectsChecks = [...redirects.nitter.normal];
      for (const instance of r.cloudflareList) {
        let i = nitterNormalRedirectsChecks.indexOf(instance);
        if (i > -1) nitterNormalRedirectsChecks.splice(i, 1);
      }
      await browser.storage.local.set({
        disableTwitter: false,

        enableTwitterCustomSettings: false,

        twitterRedirects: redirects,
        bypassWatchOnTwitter: true,

        nitterNormalRedirectsChecks: nitterNormalRedirectsChecks,
        nitterNormalCustomRedirects: [],

        nitterTorRedirectsChecks: [...redirects.nitter.tor],
        nitterTorCustomRedirects: [],

        twitterProtocol: "normal",
        alwaysUsePreferred: false,

        nitterTheme: 'Auto',
        nitterInfiniteScroll: false,
        nitterStickyProfile: true,
        nitterBidiSupport: false,
        nitterHideTweetStats: false,
        nitterHideBanner: false,
        nitterHidePins: false,
        nitterHideReplies: false,
        nitterSquareAvatars: false,
        nitterMp4Playback: true,
        nitterHlsPlayback: false,
        nitterProxyVideos: true,
        nitterMuteVideos: false,
        nitterAutoplayGifs: true,
      })
    })
  })
}

async function init() {
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
      disable = r.disableTwitter;
      enableCustomSettings = r.enableTwitterCustomSettings;

      protocol = r.twitterProtocol;

      bypassWatchOnTwitter = r.bypassWatchOnTwitter;

      alwaysUsePreferred = r.alwaysUsePreferred;

      redirects = r.twitterRedirects;

      nitterNormalRedirectsChecks = r.nitterNormalRedirectsChecks;
      nitterNormalCustomRedirects = r.nitterNormalCustomRedirects;

      nitterTorRedirectsChecks = r.nitterTorRedirectsChecks;
      nitterTorCustomRedirects = r.nitterTorCustomRedirects;

      theme = r.nitterTheme;
      infiniteScroll = r.nitterInfiniteScroll;
      stickyProfile = r.nitterStickyProfile;
      bidiSupport = r.nitterBidiSupport;
      hideTweetStats = r.nitterHideTweetStats;
      hideBanner = r.nitterHideBanner;
      hidePins = r.nitterHidePins;
      hideReplies = r.nitterHideReplies;
      squareAvatars = r.nitterSquareAvatars;
      mp4Playback = r.nitterMp4Playback;
      hlsPlayback = r.nitterHlsPlayback;
      proxyVideos = r.nitterProxyVideos;
      muteVideos = r.nitterMuteVideos;
      autoplayGifs = r.nitterAutoplayGifs;
    }
  );
}

export default {
  getRedirects,
  setRedirects,
  reverse,
  removeXFrameOptions,

  isNitter,
  initNitterCookies,

  redirect,
  initDefaults,
  init,
  switchInstance,
};

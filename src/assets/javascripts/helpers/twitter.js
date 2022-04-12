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

  if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video")
    return `${randomInstance}/pic/${encodeURIComponent(url.href)}`;

  else if (url.pathname.split("/").includes("tweets"))
    return `${randomInstance}${url.pathname.replace("/tweets", "")}${url.search}`;
  else if (url.host == 't.co')
    return `${randomInstance}/t.co${url.pathname}`;
  else
    return `${randomInstance}${url.pathname}${url.search}`;
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
  console.log(e.responseHeaders);
  for (const i in e.responseHeaders) if (e.responseHeaders[i].name == 'x-frame-options') {
    isChanged = true;
    e.responseHeaders.splice(i, 1);
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

let theme;
let applyThemeToSites;
function initNitterCookies() {
  let themeValue;
  if (theme == 'light') themeValue = 'Twitter';
  if (theme == 'dark') themeValue = 'Twitter Dark';
  if (applyThemeToSites && themeValue) {
    let allInstances = [...redirects.nitter.normal, ...redirects.nitter.tor, ...nitterNormalCustomRedirects, ...nitterTorCustomRedirects]
    let checkedInstances = [...nitterNormalRedirectsChecks, ...nitterNormalCustomRedirects, ...nitterTorRedirectsChecks, ...nitterTorCustomRedirects]
    for (const instanceUrl of allInstances)
      if (!checkedInstances.includes(instanceUrl))
        browser.cookies.remove({
          url: instanceUrl,
          name: "theme",
        })
    for (const instanceUrl of checkedInstances)
      browser.cookies.set({
        url: instanceUrl,
        name: "theme",
        value: themeValue
      })
  }
}

async function init() {
  return new Promise((resolve) => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
      browser.storage.local.get(
        [
          "disableTwitter",

          "enableTwitterCustomSettings",

          "twitterRedirects",

          "theme",
          "applyThemeToSites",

          "bypassWatchOnTwitter",

          "nitterNormalRedirectsChecks",
          "nitterNormalCustomRedirects",

          "nitterTorRedirectsChecks",
          "nitterTorCustomRedirects",

          "twitterProtocol",

          "alwaysUsePreferred",
        ],
        r => {
          disable = r.disableTwitter ?? false;
          enableCustomSettings = r.enableTwitterCustomSettings ?? false;

          protocol = r.twitterProtocol ?? "normal";

          bypassWatchOnTwitter = r.bypassWatchOnTwitter ?? true;

          alwaysUsePreferred = r.alwaysUsePreferred ?? false;

          theme = r.theme ?? 'DEFAULT';
          applyThemeToSites = r.applyThemeToSites ?? false;

          redirects.nitter = dataJson.nitter;
          if (r.twitterRedirects) redirects = r.twitterRedirects;

          nitterNormalRedirectsChecks = r.nitterNormalRedirectsChecks ?? [...redirects.nitter.normal];
          nitterNormalCustomRedirects = r.nitterNormalCustomRedirects ?? [];

          nitterTorRedirectsChecks = r.nitterTorRedirectsChecks ?? [...redirects.nitter.tor];
          nitterTorCustomRedirects = r.nitterTorCustomRedirects ?? [];

          initNitterCookies();

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

  redirect,
  init,
  switchInstance,
};

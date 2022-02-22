window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
  "pbs.twimg.com",
  "video.twimg.com",
  "platform.twitter.com"
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

let protocol;
const getprotocol = () => protocol;
function setProtocol(val) {
  protocol = val;
  browser.storage.local.set({ nitterProtocol: val })
  console.log("nitterProtocol: ", val)
}

function isTwitter(url, initiator) {
  if (disable) return false;
  if (url.pathname.split("/").includes("home")) return null;
  if (
    commonHelper.isFirefox() &&
    initiator && (
      [
        ...redirects.nitter.normal,
        ...redirects.nitter.tor,
        ...nitterTorCustomRedirects,
        ...nitterNormalCustomRedirects
      ].includes(initiator.origin) || targets.includes(initiator.host))
  ) return false;

  return targets.includes(url.host)
}

function redirect(url) {
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

  else
    return `${randomInstance}${url.pathname}${url.search}`;
}

async function init() {
  return new Promise((resolve) => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
      browser.storage.local.get(
        [
          "disableTwitter",
          "twitterRedirects",
          "nitterNormalRedirectsChecks",
          "nitterNormalCustomRedirects",
          "nitterTorRedirectsChecks",
          "nitterTorCustomRedirects",
          "nitterProtocol",
        ],
        (result) => {
          disable = result.disableTwitter ?? false;

          protocol = result.nitterProtocol ?? "normal";

          redirects.nitter = dataJson.nitter;
          if (result.twitterRedirects) redirects = result.twitterRedirects;

          nitterNormalRedirectsChecks = result.nitterNormalRedirectsChecks ?? [...redirects.nitter.normal];
          nitterNormalCustomRedirects = result.nitterNormalCustomRedirects ?? [];

          nitterTorRedirectsChecks = result.nitterTorRedirectsChecks ?? [...redirects.nitter.tor];
          nitterTorCustomRedirects = result.nitterTorCustomRedirects ?? [];

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

  getNitterNormalRedirectsChecks,
  setNitterNormalRedirectsChecks,

  getNitterNormalCustomRedirects,
  setNitterNormalCustomRedirects,

  getNitterTorRedirectsChecks,
  setNitterTorRedirectsChecks,

  getNitterTorCustomRedirects,
  setNitterTorCustomRedirects,

  getprotocol,
  setProtocol,

  redirect,
  isTwitter,
  init,
};

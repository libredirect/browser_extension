window.browser = window.browser || window.chrome;
import commonHelper from './common.js'

const targets = [
  "instagram.com",
  "www.instagram.com",
  "help.instagram.com",
  "about.instagram.com",
];
let redirects = {
  "bibliogram": {
    "normal": [],
    "tor": []
  }
};
const getRedirects = () => redirects;
const getCustomRedirects = function () {
  return {
    "bibliogram": {
      "normal": [...bibliogramNormalRedirectsChecks, ...bibliogramNormalCustomRedirects]
    },
  };
};
function setRedirects(val) {
  redirects.bibliogram = val;
  browser.storage.local.set({ instagramRedirects: redirects })
  console.log("instagramRedirects: ", val)
  for (const item of bibliogramNormalRedirectsChecks)
    if (!redirects.bibliogram.normal.includes(item)) {
      var index = bibliogramNormalRedirectsChecks.indexOf(item);
      if (index !== -1) bibliogramNormalRedirectsChecks.splice(index, 1);
    }
  setBibliogramNormalRedirectsChecks(bibliogramNormalRedirectsChecks);
}

let bibliogramNormalRedirectsChecks;
const getBibliogramNormalRedirectsChecks = () => bibliogramNormalRedirectsChecks;
function setBibliogramNormalRedirectsChecks(val) {
  bibliogramNormalRedirectsChecks = val;
  browser.storage.local.set({ bibliogramNormalRedirectsChecks })
  console.log("bibliogramNormalRedirectsChecks: ", val)
}

let bibliogramTorRedirectsChecks;
const getBibliogramTorRedirectsChecks = () => bibliogramTorRedirectsChecks;
function setBibliogramTorRedirectsChecks(val) {
  bibliogramTorRedirectsChecks = val;
  browser.storage.local.set({ bibliogramTorRedirectsChecks })
  console.log("bibliogramTorRedirectsChecks: ", val)
}

let bibliogramNormalCustomRedirects = [];
const getBibliogramNormalCustomRedirects = () => bibliogramNormalCustomRedirects;
function setBibliogramNormalCustomRedirects(val) {
  bibliogramNormalCustomRedirects = val;
  browser.storage.local.set({ bibliogramNormalCustomRedirects })
  console.log("bibliogramNormalCustomRedirects: ", val)
}

let bibliogramTorCustomRedirects = [];
const getBibliogramTorCustomRedirects = () => bibliogramTorCustomRedirects;
function setBibliogramTorCustomRedirects(val) {
  bibliogramTorCustomRedirects = val;
  browser.storage.local.set({ bibliogramTorCustomRedirects })
  console.log("bibliogramTorCustomRedirects: ", val)
}

const reservedPaths = [
  "about",
  "explore",
  "support",
  "press",
  "api",
  "privacy",
  "safety",
  "admin",
  "graphql",
  "accounts",
  "help",
  "terms",
  "contact",
  "blog",
  "igtv",
  "u",
  "p",
  "fragment",
  "imageproxy",
  "videoproxy",
  ".well-known",
  "tv",
  "reel",
];

const bypassPaths = /\/(accounts\/|embeds?.js)/;

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ disableInstagram: disable })
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
  protocol = val;
  browser.storage.local.set({ nitterProtocol: val })
  console.log("nitterProtocol: ", val)
}

function isInstagram(url, initiator) {
  if (disable) return false;
  if (
    initiator &&
    ([...redirects.bibliogram.normal, ...bibliogramNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))
  )
    return false; // Do not redirect Bibliogram view on Instagram links
  return targets.includes(url.host)
}

function redirect(url, type) {
  if (type !== "main_frame" || url.pathname.match(bypassPaths))
    return 'CANCEL'; // Do not redirect /accounts, /embeds.js, or anything other than main_frame


  let instancesList;
  if (protocol == 'normal') instancesList = [...bibliogramNormalRedirectsChecks, ...bibliogramNormalCustomRedirects];
  else if (protocol == 'tor') instancesList = [...bibliogramTorRedirectsChecks, ...bibliogramTorCustomRedirects];
  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  if (url.pathname === "/" || reservedPaths.includes(url.pathname.split("/")[1]))
    return `${randomInstance}${url.pathname}${url.search}`;
  else
    return `${randomInstance}/u${url.pathname}${url.search}`; // Likely a user profile, redirect to '/u/...'
}


async function init() {
  return new Promise((resolve) => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
      browser.storage.local.get(
        [
          "disableInstagram",
          "instagramRedirects",

          "bibliogramNormalRedirectsChecks",
          "bibliogramTorRedirectsChecks",

          "bibliogramNormalCustomRedirects",
          "bibliogramTorCustomRedirects",
          "bibliogramProtocol"
        ],
        (result) => {
          disable = result.disableInstagram ?? false;

          redirects.bibliogram = dataJson.bibliogram;

          if (result.instagramRedirects) redirects = result.instagramRedirects

          bibliogramNormalRedirectsChecks = result.bibliogramNormalRedirectsChecks ?? [...redirects.bibliogram.normal];
          bibliogramNormalCustomRedirects = result.bibliogramNormalCustomRedirects ?? [];

          bibliogramTorRedirectsChecks = result.bibliogramTorRedirectsChecks ?? [...redirects.bibliogram.tor];
          bibliogramTorCustomRedirects = result.bibliogramTorCustomRedirects ?? [];

          protocol = result.bibliogramProtocol ?? "normal";

          resolve();
        }
      )
    })
  })
}

export default {
  getRedirects,
  getCustomRedirects,
  setRedirects,

  getDisable,
  setDisable,

  getProtocol,
  setProtocol,

  getBibliogramNormalRedirectsChecks,
  setBibliogramNormalRedirectsChecks,
  getBibliogramTorRedirectsChecks,
  setBibliogramTorRedirectsChecks,

  getBibliogramNormalCustomRedirects,
  setBibliogramNormalCustomRedirects,
  getBibliogramTorCustomRedirects,
  setBibliogramTorCustomRedirects,

  isInstagram,

  redirect,
  init,
};

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
    "normal": [
      "https://bibliogram.art",
      "https://bibliogram.snopyta.org",
      "https://bibliogram.pussthecat.org",
      "https://bibliogram.1d4.us",
      "https://insta.trom.tf",
      "https://bib.riverside.rocks",
      "https://bibliogram.esmailelbob.xyz",
      "https://bib.actionsack.com",
      "https://biblio.alefvanoon.xyz"
    ]
  }
};
const getRedirects = () => redirects;
const getCustomRedirects = function () {
  return {
    "bibliogram": {
      "normal": [...bibliogramRedirectsChecks, ...bibliogramCustomRedirects]
    },
  };
};
function setRedirects(val) {
  redirects.bibliogram = val;
  browser.storage.sync.set({ instagramRedirects: redirects })
  console.log("instagramRedirects: ", val)
  for (const item of bibliogramRedirectsChecks)
    if (!redirects.bibliogram.normal.includes(item)) {
      var index = bibliogramRedirectsChecks.indexOf(item);
      if (index !== -1) bibliogramRedirectsChecks.splice(index, 1);
    }
  setBibliogramRedirectsChecks(bibliogramRedirectsChecks);
}


let bibliogramRedirectsChecks;
const getBibliogramRedirectsChecks = () => bibliogramRedirectsChecks;
function setBibliogramRedirectsChecks(val) {
  bibliogramRedirectsChecks = val;
  browser.storage.sync.set({ bibliogramRedirectsChecks })
  console.log("bibliogramRedirectsChecks: ", val)
}

let bibliogramCustomRedirects = [];
const getBibliogramCustomRedirects = () => bibliogramCustomRedirects;
function setBibliogramCustomRedirects(val) {
  bibliogramCustomRedirects = val;
  browser.storage.sync.set({ bibliogramCustomRedirects })
  console.log("bibliogramCustomRedirects: ", val)
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

let disableInstagram;
const getDisableInstagram = () => disableInstagram;
function setDisableInstagram(val) {
  disableInstagram = val;
  browser.storage.sync.set({ disableInstagram })
}

function redirect(url, initiator, type) {
  if (disableInstagram) return null;

  let instancesList = [...bibliogramRedirectsChecks, ...bibliogramCustomRedirects];
  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  // Do not redirect Bibliogram view on Instagram links
  if (initiator && (instancesList.includes(initiator.origin) || targets.includes(initiator.host)))
    return null;

  // Do not redirect /accounts, /embeds.js, or anything other than main_frame
  if (type !== "main_frame" || url.pathname.match(bypassPaths))
    return 'CANCEL';

  console.log("Hello", url.href)

  if (url.pathname === "/" || reservedPaths.includes(url.pathname.split("/")[1])) {
    console.log("wewe")
    return `${randomInstance}${url.pathname}${url.search}`;
  }
  else {
    console.log("A user profile")
    return `${randomInstance}/u${url.pathname}${url.search}`;
  } // Likely a user profile, redirect to '/u/...'
}

function isInstagram(url) {
  return targets.includes(url.host)
}

async function init() {
  return new Promise((resolve) => {
    browser.storage.sync.get(
      [
        "disableInstagram",
        "instagramRedirects",
        "bibliogramRedirectsChecks",
        "bibliogramCustomRedirects",
      ],
      (result) => {
        disableInstagram = result.disableInstagram ?? false;

        if (result.instagramRedirects) redirects = result.instagramRedirects

        bibliogramRedirectsChecks = result.bibliogramRedirectsChecks ?? [...redirects.bibliogram.normal];

        bibliogramCustomRedirects = result.bibliogramCustomRedirects ?? [];

        resolve();
      }
    )
  })

}

export default {
  getRedirects,
  getCustomRedirects,
  setRedirects,

  getDisableInstagram,
  setDisableInstagram,

  getBibliogramRedirectsChecks,
  setBibliogramRedirectsChecks,

  getBibliogramCustomRedirects,
  setBibliogramCustomRedirects,

  isInstagram,

  redirect,
  init,
};

import commonHelper from './common.js'

const targets = [
  "instagram.com",
  "www.instagram.com",
  "help.instagram.com",
  "about.instagram.com",
];
let redirects = {
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
};
const getRedirects = () => redirects;
function setRedirects(val) {
  redirects = val;
  browser.storage.sync.set({ instagramRedirects: val })
  console.log("instagramRedirects: ", val)
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

let bibliogramInstance;
const getBibliogramInstance = () => bibliogramInstance;
function setBibliogramInstance(val) {
  bibliogramInstance = val;
  browser.storage.sync.set({ bibliogramInstance })
};

function redirect(url, initiator, type) {
  if (disableInstagram)
    return null;

  // Do not redirect Bibliogram view on Instagram links
  if (
    initiator &&
    (initiator.origin === bibliogramInstance || redirects.normal.includes(initiator.origin) || targets.includes(initiator.host))
  )
    return null;

  // Do not redirect /accounts, /embeds.js, or anything other than main_frame
  if (type !== "main_frame" || url.pathname.match(bypassPaths))
    return null;

  let link = commonHelper.getRandomInstance(redirects.normal);
  if (
    url.pathname === "/" ||
    instagramReservedPaths.includes(url.pathname.split("/")[1])
  )
    return `${link}${url.pathname}${url.search}`;
  else
    // Likely a user profile, redirect to '/u/...'
    return `${link}/u${url.pathname}${url.search}`;
}

function isInstagram(url) {
  return targets.includes(url.host)
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableInstagram",
    "bibliogramInstance",
    "instagramRedirects"
  ])
  disableInstagram = result.disableInstagram ?? false;
  bibliogramInstance = result.bibliogramInstance;
  if (result.instagramRedirects)
    redirects = result.instagramRedirects
}

export default {
  getRedirects,
  setRedirects,
  getDisableInstagram,
  setDisableInstagram,
  getBibliogramInstance,
  setBibliogramInstance,
  isInstagram,
  redirect,
  init,
};

const targets = [
  "instagram.com",
  "www.instagram.com",
  "help.instagram.com",
  "about.instagram.com",
];
const redirects = {
  "normal": [
    "https://bibliogram.art",
    "https://bibliogram.snopyta.org",
    "https://bibliogram.pussthecat.org",
    "https://bibliogram.nixnet.services",
    "https://bibliogram.ethibox.fr",
    "https://bibliogram.hamster.dance",
    "https://insta.trom.tf",
    "https://bib.actionsack.com"
  ],
};
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

let disableBibliogram;
const getDisableBibliogram = () => disableBibliogram;
function setDisableBibliogram(val) {
  disableBibliogram = val;
  browser.storage.sync.set({ disableBibliogram })
}

let bibliogramInstance;
const getBibliogramInstance = () => bibliogramInstance;
function setBibliogramInstance(val) {
  bibliogramInstance = val;
  browser.storage.sync.set({ bibliogramInstance })
};


function redirect(url, initiator, type) {
  if (data.disableBibliogram || data.isException(url, initiator))
    return null;

  // Do not redirect Bibliogram view on Instagram links
  if (
    initiator &&
    (
      initiator.origin === data.bibliogramInstance ||
      instagramHelper.redirects.normal.includes(initiator.origin) ||
      instagramHelper.targets.includes(initiator.host)
    )
  )
    return null;

  // Do not redirect /accounts, /embeds.js, or anything other than main_frame
  if (type !== "main_frame" || url.pathname.match(instagramHelper.bypassPaths))
    return null;

  let link = commonHelper.getRandomInstance(instagramHelper.redirects.normal);
  if (
    url.pathname === "/" ||
    data.instagramReservedPaths.includes(url.pathname.split("/")[1])
  )
    return `${link}${url.pathname}${url.search}`;
  else
    // Likely a user profile, redirect to '/u/...'
    return `${link}/u${url.pathname}${url.search}`;
}


export default {
  targets,
  redirects,
  reservedPaths,
  bypassPaths,
  getDisableBibliogram,
  setDisableBibliogram,
  getBibliogramInstance,
  setBibliogramInstance,
  redirect,
};

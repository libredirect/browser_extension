import commonHelper from './common.js'


const targets = [
  /^medium\.com/,
  /.*\.medium\.com/,
  // Other domains of medium blogs, source(s): https://findingtom.com/best-medium-blogs-to-follow/#1-forge
  /towardsdatascience\.com/,
  /uxdesign\.cc/,
  /uxplanet\.org/,
  /betterprogramming\.pub/,
  /aninjusticemag\.com/,
  /betterhumans\.pub/,
  /psiloveyou\.xyz/,
  /entrepreneurshandbook\.co/,
  /blog\.coinbase\.com/
];

let redirects = {
  "normal": [
    "https://scribe.rip",
    "https://scribe.nixnet.services",
    "https://scribe.citizen4.eu",
    "https://scribe.bus-hit.me"
  ]
};
const getRedirects = () => redirects;
function setRedirects(val) {
  redirects = val;
  browser.storage.sync.set({ mediumRedirects: val })
  console.log("mediumRedirects: ", val)
}

let disableMedium;
const getDisableMedium = () => disableMedium;
function setDisableMedium(val) {
  disableMedium = val;
  browser.storage.sync.set({ disableMedium })
}



function redirect(url, initiator) {
  if (disableMedium) return null;

  if (url.pathname == "/") return null;

  if (
    commonHelper.isFirefox() && initiator &&
    (redirects.normal.includes(initiator.origin) || targets.includes(initiator.host))
  ) {
    browser.storage.sync.set({ redirectBypassFlag: true });
    return null;
  }
  return `${commonHelper.getRandomInstance(redirects.normal)}${url.pathname}${url.search}`;
}

function isMedium(url) {
  return targets.some((rx) => rx.test(url.host));
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableMedium",
    "mediumRedirects"
  ])
  disableMedium = result.disableMedium ?? false;
  if (result.mediumRedirects)
    redirects = result.mediumRedirects;
}

export default {
  targets,

  getRedirects,
  setRedirects,

  getDisableMedium,
  setDisableMedium,

  redirect,
  isMedium,
  init,
};

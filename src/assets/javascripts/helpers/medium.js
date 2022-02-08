import commonHelper from './common.js'


const targets = [
  // /(?:.*\.)*(?<!(link\.|cdn\-images\-\d+\.))medium\.com(\/.*)?$/,
  /^medium\.com/,
  /.*\.medium\.com/,
  // // Other domains of medium blogs, source(s): https://findingtom.com/best-medium-blogs-to-follow/#1-forge
  // /towardsdatascience\.com/,
  // /uxdesign\.cc/,
  // /uxplanet\.org/,
  // /betterprogramming\.pub/,
  // /aninjusticemag\.com/,
  // /betterhumans\.pub/,
  // /psiloveyou\.xyz/,
  // /entrepreneurshandbook\.co/,
  // /blog\.coinbase\.com/
];

let redirects = {
  "scribe": {
    "normal": [
      "https://scribe.rip",
      "https://scribe.nixnet.services",
      "https://scribe.citizen4.eu",
      "https://scribe.bus-hit.me"
    ]
  }
};
const getRedirects = () => redirects;
function setRedirects(val) {
  redirects.scribe = val;
  browser.storage.sync.set({ mediumRedirects: redirects })
  console.log("mediumRedirects: ", val)
  for (const item of scribeRedirectsChecks)
    if (!redirects.scribe.normal.includes(item)) {
      var index = scribeRedirectsChecks.indexOf(item);
      if (index !== -1) scribeRedirectsChecks.splice(index, 1);
    }
  setScribeRedirectsChecks(scribeRedirectsChecks);
}

let scribeRedirectsChecks;
const getScribeRedirectsChecks = () => scribeRedirectsChecks;
function setScribeRedirectsChecks(val) {
  scribeRedirectsChecks = val;
  browser.storage.sync.set({ scribeRedirectsChecks })
  console.log("scribeRedirectsChecks: ", val)
}

let scribeCustomRedirects = [];
const getScribeCustomRedirects = () => scribeCustomRedirects;
function setScribeCustomRedirects(val) {
  scribeCustomRedirects = val;
  browser.storage.sync.set({ scribeCustomRedirects })
  console.log("scribeCustomRedirects: ", val)
}

let disableMedium;
const getDisableMedium = () => disableMedium;
function setDisableMedium(val) {
  disableMedium = val;
  browser.storage.sync.set({ disableMedium })
}



function redirect(url, initiator, type) {

  if (disableMedium) return null;

  if (url.pathname == "/") return null;

  if (type != "main_frame" && "sub_frame" && "xmlhttprequest" && "other") return null;


  let instancesList = [...scribeRedirectsChecks, ...scribeCustomRedirects];
  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  if (
    commonHelper.isFirefox() && initiator &&
    (instancesList.includes(initiator.origin) || targets.includes(initiator.host))
  ) {
    browser.storage.sync.set({ redirectBypassFlag: true });
    return null;
  }
  return `${randomInstance}${url.pathname}${url.search}`;
}

function isMedium(url) {
  return targets.some((rx) => rx.test(url.href));
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableMedium",
    "mediumRedirects",
    "scribeRedirectsChecks",
    "scribeCustomRedirects",
  ])
  disableMedium = result.disableMedium ?? false;
  if (result.mediumRedirects)
    redirects = result.mediumRedirects;

  scribeRedirectsChecks = result.scribeRedirectsChecks ?? [...redirects.scribe.normal];
  scribeCustomRedirects = result.scribeCustomRedirects ?? [];
}

export default {
  targets,

  getRedirects,
  setRedirects,

  getDisableMedium,
  setDisableMedium,

  getScribeRedirectsChecks,
  setScribeRedirectsChecks,

  getScribeCustomRedirects,
  setScribeCustomRedirects,

  redirect,
  isMedium,
  init,
};

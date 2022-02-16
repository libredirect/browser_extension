window.browser = window.browser || window.chrome;
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
const getCustomRedirects = function () {
  return {
    "scribe": {
      "normal": [...scribeRedirectsChecks, ...scribeCustomRedirects]
    },
  };
};
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

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.sync.set({ disableMedium: disable })
}

function isMedium(url, initiator) {
  if (disable) return false;
  if (url.pathname == "/") return false;

  if (
    commonHelper.isFirefox() &&
    initiator && ([...redirects.scribe.normal, ...scribeCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))
  ) return false;

  return targets.some((rx) => rx.test(url.host));
}
function redirect(url, type) {

  if (type != "main_frame" && "sub_frame" && "xmlhttprequest" && "other") return null;

  let instancesList = [...scribeRedirectsChecks, ...scribeCustomRedirects];
  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  return `${randomInstance}${url.pathname}${url.search}`;
}

async function init() {
  return new Promise((resolve) => {
    browser.storage.sync.get(
      [
        "disableMedium",
        "mediumRedirects",
        "scribeRedirectsChecks",
        "scribeCustomRedirects",
      ],
      (result) => {
        disable = result.disableMedium ?? false;

        if (result.mediumRedirects) redirects = result.mediumRedirects;

        scribeRedirectsChecks = result.scribeRedirectsChecks ?? [...redirects.scribe.normal];
        scribeCustomRedirects = result.scribeCustomRedirects ?? [];

        resolve();
      }
    )
  })

}

export default {
  targets,

  getRedirects,
  getCustomRedirects,
  setRedirects,

  getDisable,
  setDisable,

  getScribeRedirectsChecks,
  setScribeRedirectsChecks,

  getScribeCustomRedirects,
  setScribeCustomRedirects,

  redirect,
  isMedium,
  init,
};

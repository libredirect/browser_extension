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
      "normal": [...scribeNormalRedirectsChecks, ...scribeNormalCustomRedirects]
    },
  };
};
function setRedirects(val) {
  redirects.scribe = val;
  browser.storage.local.set({ mediumRedirects: redirects })
  console.log("mediumRedirects: ", val)
  for (const item of scribeNormalRedirectsChecks) if (!redirects.scribe.normal.includes(item)) {
    var index = scribeNormalRedirectsChecks.indexOf(item);
    if (index !== -1) scribeNormalRedirectsChecks.splice(index, 1);
  }
  setScribeNormalRedirectsChecks(scribeNormalRedirectsChecks);
}

let scribeNormalRedirectsChecks;
const getScribeNormalRedirectsChecks = () => scribeNormalRedirectsChecks;
function setScribeNormalRedirectsChecks(val) {
  scribeNormalRedirectsChecks = val;
  browser.storage.local.set({ scribeNormalRedirectsChecks })
  console.log("scribeNormalRedirectsChecks: ", val)
}

let scribeNormalCustomRedirects = [];
const getScribeNormalCustomRedirects = () => scribeNormalCustomRedirects;
function setScribeNormalCustomRedirects(val) {
  scribeNormalCustomRedirects = val;
  browser.storage.local.set({ scribeNormalCustomRedirects })
  console.log("scribeNormalCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ disableMedium: disable })
  console.log("disableMedium", disable)
}

function isMedium(url, initiator) {
  if (disable) return false;
  if (url.pathname == "/") return false;

  if (
    commonHelper.isFirefox() &&
    initiator && ([...redirects.scribe.normal, ...scribeNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))
  ) return false;

  return targets.some((rx) => rx.test(url.host));
}
function redirect(url, type) {

  if (type != "main_frame" && "sub_frame" && "xmlhttprequest" && "other") return null;

  let instancesList = [...scribeNormalRedirectsChecks, ...scribeNormalCustomRedirects];
  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  return `${randomInstance}${url.pathname}${url.search}`;
}

async function init() {
  return new Promise((resolve) => {
    browser.storage.local.get(
      [
        "disableMedium",
        "mediumRedirects",
        "scribeNormalRedirectsChecks",
        "scribeNormalCustomRedirects",
      ],
      (result) => {
        disable = result.disableMedium ?? false;

        if (result.mediumRedirects) redirects = result.mediumRedirects;

        scribeNormalRedirectsChecks = result.scribeNormalRedirectsChecks ?? [...redirects.scribe.normal];
        scribeNormalCustomRedirects = result.scribeNormalCustomRedirects ?? [];

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

  getScribeNormalRedirectsChecks,
  setScribeNormalRedirectsChecks,

  getScribeNormalCustomRedirects,
  setScribeNormalCustomRedirects,

  redirect,
  isMedium,
  init,
};

import commonHelper from './common.js'


const targets = [
  // /(.*\.medium\.com)?(?(1)|^medium\.com)/,
  /^medium.com/,
  /.*\.medium.com/,
  // Other domains of medium blogs, source(s): https://findingtom.com/best-medium-blogs-to-follow/#1-forge
  /towardsdatascience.com/,
  /uxdesign.cc/,
  /uxplanet.org/,
  /betterprogramming.pub/,
  /aninjusticemag.com/,
  /betterhumans.pub/,
  /psiloveyou.xyz/,
  /entrepreneurshandbook.co/,
  /blog.coinbase.com/
];

const redirects = {
  "normal": [
    "https://scribe.rip",
    "https://scribe.nixnet.services"
  ]
};

let disableScribe;
const getDisableScribe = () => disableScribe;
function setDisableScribe(val) {
  disableScribe = val;
  browser.storage.sync.set({ disableScribe })
}


let scribeInstance;
const getScribeInstance = () => scribeInstance;
function setScribeInstance(val) {
  scribeInstance = val;
  browser.storage.sync.set({ scribeInstance })
};

async function redirect(url, initiator) {
  await init()
  if (disableScribe) return null;

  if (url.pathname == "/") return null;

  if (
    commonHelper.isFirefox() &&
    initiator &&
    (
      initiator.origin === scribeInstance ||
      redirects.normal.includes(initiator.origin) ||
      targets.includes(initiator.host)
    )
  ) {
    browser.storage.sync.set({ redirectBypassFlag: true });
    return null;
  }
  return `${commonHelper.getRandomInstance(redirects.normal)}${url.pathname}${url.search}`;
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableScribe",
    "scribeInstance",
  ])
  disableScribe = result.disableScribe || false;
  scribeInstance = result.scribeInstance;
}

export default {
  targets,
  redirects,
  getDisableScribe,
  setDisableScribe,
  getScribeInstance,
  setScribeInstance,
  redirect,
  init,
};

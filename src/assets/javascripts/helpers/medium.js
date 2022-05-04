window.browser = window.browser || window.chrome;
import commonHelper from './common.js'


const targets = [
  // /(?:.*\.)*(?<!(link\.|cdn\-images\-\d+\.))medium\.com(\/.*)?$/,
  /^medium\.com/,
  /.*\.medium\.com/,
  // // Other domains of medium blogs, source(s): https://findingtom.com/best-medium-blogs-to-follow/#1-forge

  /^towardsdatascience\.com/,
  /^uxdesign\.cc/,
  /^uxplanet\.org/,
  /^betterprogramming\.pub/,
  /^aninjusticemag\.com/,
  /^betterhumans\.pub/,
  /^psiloveyou\.xyz/,
  /^entrepreneurshandbook\.co/,
  /^blog\.coinbase\.com/,

  /^ levelup\.gitconnected\.com /,
  /^javascript\.plainenglish\.io /,
  /^blog\.bitsrc\.io /,
  /^ itnext\.io /,
  /^codeburst\.io /,
  /^infosecwriteups\.com /,
  /^ blog\.devgenius.io /,
  /^ writingcooperative\.com /,
];

let redirects = {
  "scribe": {
    "normal": [],
    "tor": []
  }
};
const getRedirects = () => redirects;
const getCustomRedirects = function () {
  return {
    "scribe": {
      "normal": [...scribeNormalRedirectsChecks, ...scribeNormalCustomRedirects],
      "tor": [...scribeTorRedirectsChecks, ...scribeTorCustomRedirects]
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
  browser.storage.local.set({ scribeNormalRedirectsChecks })

  for (const item of scribeNormalRedirectsChecks) if (!redirects.scribe.normal.includes(item)) {
    var index = scribeNormalRedirectsChecks.indexOf(item);
    if (index !== -1) scribeNormalRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ scribeNormalRedirectsChecks })

  for (const item of scribeTorRedirectsChecks) if (!redirects.scribe.normal.includes(item)) {
    var index = scribeTorRedirectsChecks.indexOf(item);
    if (index !== -1) scribeTorRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ scribeTorRedirectsChecks })
}

let scribeNormalRedirectsChecks;
let scribeTorRedirectsChecks;
let scribeNormalCustomRedirects = [];
let scribeTorCustomRedirects = [];

let disable;
let protocol;

function redirect(url, type, initiator) {

  if (disable) return;

  if (type != "main_frame" && "sub_frame" && "xmlhttprequest" && "other") return null;

  if (initiator && ([...redirects.scribe.normal, ...scribeNormalCustomRedirects].includes(initiator.origin))) return;

  if (!targets.some(rx => rx.test(url.host))) return;
  console.log('url.pathname', url.pathname);
  if (/^\/($|@[a-zA-Z.]{0,}(\/|)$)/.test(url.pathname)) return;

  let instancesList;
  if (protocol == 'normal') instancesList = [...scribeNormalRedirectsChecks, ...scribeNormalCustomRedirects];
  else if (protocol == 'tor') instancesList = [...scribeTorRedirectsChecks, ...scribeTorCustomRedirects];
  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  return `${randomInstance}${url.pathname}${url.search}`;
}

function switchInstance(url) {
  let protocolHost = commonHelper.protocolHost(url);

  let mediumList = [
    ...redirects.scribe.tor,
    ...redirects.scribe.normal,

    ...scribeNormalCustomRedirects,
    ...scribeTorCustomRedirects,
  ];

  if (!mediumList.includes(protocolHost)) return null;

  let instancesList;
  if (protocol == 'normal') instancesList = [...scribeNormalCustomRedirects, ...scribeNormalRedirectsChecks];
  else if (protocol == 'tor') instancesList = [...scribeTorCustomRedirects, ...scribeTorRedirectsChecks];

  console.log("instancesList", instancesList);
  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length === 0) return null;

  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return `${randomInstance}${url.pathname}${url.search}`;
}

async function initDefaults() {
  fetch('/instances/data.json').then(response => response.text()).then(async data => {
    let dataJson = JSON.parse(data);
    redirects.scribe = dataJson.scribe;
    browser.storage.local.get('cloudflareList', async r => {
      scribeNormalRedirectsChecks = [...redirects.scribe.normal];
      for (const instance of r.cloudflareList) {
        let i = scribeNormalRedirectsChecks.indexOf(instance);
        if (i > -1) scribeNormalRedirectsChecks.splice(i, 1);
      }
      await browser.storage.local.set({
        disableMedium: false,
        mediumRedirects: redirects,

        scribeNormalRedirectsChecks: scribeNormalRedirectsChecks,
        scribeNormalCustomRedirects: [],

        scribeTorRedirectsChecks: [...redirects.scribe.tor],
        scribeTorCustomRedirects: [],

        mediumProtocol: "normal",
      })
    })
  })
}

async function init() {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableMedium",
        "mediumRedirects",
        "scribeNormalRedirectsChecks",
        "scribeNormalCustomRedirects",
        "scribeTorRedirectsChecks",
        "scribeTorCustomRedirects",
        "mediumProtocol"
      ],
      r => {
        disable = r.disableMedium;

        protocol = r.mediumProtocol;


        redirects = r.mediumRedirects;

        scribeNormalRedirectsChecks = r.scribeNormalRedirectsChecks;
        scribeNormalCustomRedirects = r.scribeNormalCustomRedirects;

        scribeTorRedirectsChecks = r.scribeTorRedirectsChecks;
        scribeTorCustomRedirects = r.scribeTorCustomRedirects;

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

  redirect,
  init,
  initDefaults,
  switchInstance,
};

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
  setScribeNormalRedirectsChecks(scribeNormalRedirectsChecks);

  for (const item of scribeNormalRedirectsChecks) if (!redirects.scribe.normal.includes(item)) {
    var index = scribeNormalRedirectsChecks.indexOf(item);
    if (index !== -1) scribeNormalRedirectsChecks.splice(index, 1);
  }
  setScribeNormalRedirectsChecks(scribeNormalRedirectsChecks);

  for (const item of scribeTorRedirectsChecks) if (!redirects.scribe.normal.includes(item)) {
    var index = scribeTorRedirectsChecks.indexOf(item);
    if (index !== -1) scribeTorRedirectsChecks.splice(index, 1);
  }
  setScribeTorRedirectsChecks(scribeTorRedirectsChecks);
}

let scribeNormalRedirectsChecks;
const getScribeNormalRedirectsChecks = () => scribeNormalRedirectsChecks;
function setScribeNormalRedirectsChecks(val) {
  scribeNormalRedirectsChecks = val;
  browser.storage.local.set({ scribeNormalRedirectsChecks })
  console.log("scribeNormalRedirectsChecks: ", val)
}

let scribeTorRedirectsChecks;
const getScribeTorRedirectsChecks = () => scribeTorRedirectsChecks;
function setScribeTorRedirectsChecks(val) {
  scribeTorRedirectsChecks = val;
  browser.storage.local.set({ scribeTorRedirectsChecks })
  console.log("scribeTorRedirectsChecks: ", val)
}

let scribeNormalCustomRedirects = [];
const getScribeNormalCustomRedirects = () => scribeNormalCustomRedirects;
function setScribeNormalCustomRedirects(val) {
  scribeNormalCustomRedirects = val;
  browser.storage.local.set({ scribeNormalCustomRedirects })
  console.log("scribeNormalCustomRedirects: ", val)
}

let scribeTorCustomRedirects = [];
const getScribeTorCustomRedirects = () => scribeTorCustomRedirects;
function setScribeTorCustomRedirects(val) {
  scribeTorCustomRedirects = val;
  browser.storage.local.set({ scribeTorCustomRedirects })
  console.log("scribeTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ disableMedium: disable })
  console.log("disableMedium", disable)
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
  protocol = val;
  browser.storage.local.set({ mediumProtocol: val });
  console.log("mediumProtocol: ", val);
}

function redirect(url, type, initiator) {

  if (disable) return;
  if (url.pathname == "/") return;
  if (url.pathname.startsWith("/tag") || url.pathname.startsWith("/@")) return;

  if (type != "main_frame" && "sub_frame" && "xmlhttprequest" && "other") return null;

  if (initiator && ([...redirects.scribe.normal, ...scribeNormalCustomRedirects].includes(initiator.origin))) return;

  if (!targets.some(rx => rx.test(url.host))) return;

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

async function init() {
  return new Promise(resolve => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
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
          disable = r.disableMedium ?? false;

          protocol = r.mediumProtocol ?? "normal";

          redirects.scribe = dataJson.scribe;
          if (r.mediumRedirects) redirects = r.mediumRedirects;

          scribeNormalRedirectsChecks = r.scribeNormalRedirectsChecks ?? [...redirects.scribe.normal];
          scribeNormalCustomRedirects = r.scribeNormalCustomRedirects ?? [];

          scribeTorRedirectsChecks = r.scribeTorRedirectsChecks ?? [...redirects.scribe.tor];
          scribeTorCustomRedirects = r.scribeTorCustomRedirects ?? [];

          resolve();
        }
      )
    })
  })
}

export default {
  targets,

  getRedirects,
  getCustomRedirects,
  setRedirects,

  getDisable,
  setDisable,

  getProtocol,
  setProtocol,

  getScribeNormalRedirectsChecks,
  setScribeNormalRedirectsChecks,
  getScribeTorRedirectsChecks,
  setScribeTorRedirectsChecks,

  getScribeNormalCustomRedirects,
  setScribeNormalCustomRedirects,
  getScribeTorCustomRedirects,
  setScribeTorCustomRedirects,

  redirect,
  init,
  switchInstance,
};

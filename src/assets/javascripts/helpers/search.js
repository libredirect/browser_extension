window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
  /^https?:\/\/(www\.|maps\.|search\.|)google\.com(\...|)(\/search\?q=..*|\/$)/,
  /^https?:\/\/libredirect\.onion/
  // /^https?:\/\/yandex\.com(\...|)(\/search\/..*|\/$)/,
];
let redirects = {
  "searx": {
    "normal": [],
    "tor": [],
    "i2p": []
  },
  "whoogle": {
    "normal": [],
    "tor": []
  },
};
const getRedirects = () => redirects;
const getCustomRedirects = () => {
  return {
    "searx": {
      "normal": [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects],
      "tor": [...searxTorRedirectsChecks, ...searxTorCustomRedirects],
    },
    "whoogle": {
      "normal": [...whoogleNormalRedirectsChecks, ...whoogleNormalCustomRedirects],
      "normal": [...whoogleTorRedirectsChecks, ...whoogleTorCustomRedirects]
    }
  };
};

function setSearxRedirects(val) {
  redirects.searx = val;
  browser.storage.local.set({ searchRedirects: redirects })
  console.log("searxRedirects:", val)
  for (const item of searxNormalRedirectsChecks) if (!redirects.searx.normal.includes(item)) {
    var index = searxNormalRedirectsChecks.indexOf(item);
    if (index !== -1) searxNormalRedirectsChecks.splice(index, 1);
  }
  setSearxNormalRedirectsChecks(searxNormalRedirectsChecks);

  for (const item of searxTorRedirectsChecks) if (!redirects.searx.tor.includes(item)) {
    var index = searxTorRedirectsChecks.indexOf(item);
    if (index !== -1) searxTorRedirectsChecks.splice(index, 1);
  }
  setSearxTorRedirectsChecks(searxTorRedirectsChecks);
}

function setWhoogleRedirects(val) {
  redirects.whoogle = val;
  browser.storage.local.set({ searchRedirects: redirects })
  console.log("whoogleRedirects:", val)
  for (const item of whoogleNormalRedirectsChecks) if (!redirects.whoogle.normal.includes(item)) {
    var index = whoogleNormalRedirectsChecks.indexOf(item);
    if (index !== -1) whoogleNormalRedirectsChecks.splice(index, 1);
  }
  setWhoogleNormalRedirectsChecks(whoogleNormalRedirectsChecks);

  for (const item of whoogleTorRedirectsChecks) if (!redirects.whoogle.tor.includes(item)) {
    var index = whoogleTorRedirectsChecks.indexOf(item);
    if (index !== -1) whoogleTorRedirectsChecks.splice(index, 1);
  }
  setWhoogleTorRedirectsChecks(whoogleTorRedirectsChecks);
}

let whoogleNormalRedirectsChecks;
const getWhoogleNormalRedirectsChecks = () => whoogleNormalRedirectsChecks;
function setWhoogleNormalRedirectsChecks(val) {
  whoogleNormalRedirectsChecks = val;
  browser.storage.local.set({ whoogleNormalRedirectsChecks })
  console.log("whoogleNormalRedirectsChecks: ", val)
}

let whoogleTorRedirectsChecks;
const getWhoogleTorRedirectsChecks = () => whoogleTorRedirectsChecks;
function setWhoogleTorRedirectsChecks(val) {
  whoogleTorRedirectsChecks = val;
  browser.storage.local.set({ whoogleTorRedirectsChecks })
  console.log("whoogleTorRedirectsChecks: ", val)
}

let whoogleNormalCustomRedirects = [];
const getWhoogleNormalCustomRedirects = () => whoogleNormalCustomRedirects;
function setWhoogleNormalCustomRedirects(val) {
  whoogleNormalCustomRedirects = val;
  browser.storage.local.set({ whoogleNormalCustomRedirects })
  console.log("whoogleNormalCustomRedirects: ", val)
}

let whoogleTorCustomRedirects = [];
const getWhoogleTorCustomRedirects = () => whoogleTorCustomRedirects;
function setWhoogleTorCustomRedirects(val) {
  whoogleTorCustomRedirects = val;
  browser.storage.local.set({ whoogleTorCustomRedirects })
  console.log("whoogleTorCustomRedirects: ", val)
}

let searxNormalRedirectsChecks;
const getSearxNormalRedirectsChecks = () => searxNormalRedirectsChecks;
function setSearxNormalRedirectsChecks(val) {
  searxNormalRedirectsChecks = val;
  browser.storage.local.set({ searxNormalRedirectsChecks })
  console.log("searxNormalRedirectsChecks: ", val)
}

let searxTorRedirectsChecks;
const getSearxTorRedirectsChecks = () => searxTorRedirectsChecks;
function setSearxTorRedirectsChecks(val) {
  searxTorRedirectsChecks = val;
  browser.storage.local.set({ searxTorRedirectsChecks })
  console.log("searxTorRedirectsChecks: ", val)
}

let searxNormalCustomRedirects = [];
const getSearxNormalCustomRedirects = () => searxNormalCustomRedirects;
function setSearxNormalCustomRedirects(val) {
  searxNormalCustomRedirects = val;
  browser.storage.local.set({ searxNormalCustomRedirects })
  console.log("searxNormalCustomRedirects: ", val)
}

let searxTorCustomRedirects = [];
const getSearxTorCustomRedirects = () => searxTorCustomRedirects;
function setSearxTorCustomRedirects(val) {
  searxTorCustomRedirects = val;
  browser.storage.local.set({ searxTorCustomRedirects })
  console.log("searxTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ disableSearch: disable })
  console.log("disableSearch: ", disable)
}

let frontend;
const getFrontend = () => frontend;
function setFrontend(val) {
  frontend = val;
  browser.storage.local.set({ searchFrontend: frontend })
  console.log("searchFrontend: ", frontend)
};

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
  protocol = val;
  browser.storage.local.set({ searchProtocol: val })
  console.log("searchProtocol: ", val)
}

function isSearch(url) {
  if (disable) return false;
  return targets.some((rx) => rx.test(url.href));
}

function redirect(url) {
  console.log(url.href);
  let randomInstance;
  let path;
  if (frontend == 'searx') {
    let instancesList;
    if (protocol == 'normal') instancesList = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...searxTorRedirectsChecks, ...searxTorCustomRedirects];
    if (instancesList.length === 0) return null;
    randomInstance = commonHelper.getRandomInstance(instancesList)
    path = "/";
  }
  if (frontend == 'whoogle') {
    let instancesList
    if (protocol == 'normal') instancesList = [...whoogleNormalRedirectsChecks, ...whoogleNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...whoogleTorRedirectsChecks, ...whoogleTorCustomRedirects];
    if (instancesList.length === 0) return null;
    randomInstance = commonHelper.getRandomInstance(instancesList)
    path = "/search";
  }

  let searchQuery = "";
  url.search.slice(1).split("&").forEach((input) => {
    if (input.startsWith("q=")) searchQuery = input;
  });

  return `${randomInstance}${path}?${searchQuery}`;
}

function changeInstance(url) {
  let protocolHost = `${url.protocol}//${url.host}`;

  let searchList = [
    ...redirects.searx.normal,
    ...redirects.searx.tor,

    ...searxNormalCustomRedirects,
    ...searxTorCustomRedirects,

    ...redirects.whoogle.normal,
    ...redirects.whoogle.tor,

    ...whoogleNormalCustomRedirects,
    ...whoogleTorCustomRedirects,
  ]

  if (!searchList.includes(protocolHost)) return null;

  let instancesList;
  if (frontend == 'searx') {
    if (protocol == 'normal') instancesList = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...searxTorRedirectsChecks, ...searxTorCustomRedirects];
  }
  else if (frontend == 'whoogle') {
    if (protocol == 'normal') instancesList = [...whoogleNormalRedirectsChecks, ...whoogleNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...whoogleTorRedirectsChecks, ...whoogleTorCustomRedirects];
  }

  console.log("instancesList", instancesList);
  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length === 0) return null;

  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return `${randomInstance}${url.pathname}${url.search}`;
}

async function init() {
  return new Promise((resolve) => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
      browser.storage.local.get(
        [
          "disableSearch",
          "searchFrontend",
          "searchRedirects",

          "whoogleNormalRedirectsChecks",
          "whoogleNormalCustomRedirects",

          "whoogleTorRedirectsChecks",
          "whoogleTorCustomRedirects",

          "searxNormalRedirectsChecks",
          "searxNormalCustomRedirects",

          "searxTorRedirectsChecks",
          "searxTorCustomRedirects",

          "searchProtocol",
        ],
        (result) => {
          disable = result.disableSearch ?? false;

          protocol = result.searchProtocol ?? 'normal';

          frontend = result.searchFrontend ?? 'searx';

          redirects.searx = dataJson.searx;
          redirects.whoogle = dataJson.whoogle;
          if (result.searchRedirects) redirects = result.searchRedirects;

          whoogleNormalRedirectsChecks = result.whoogleNormalRedirectsChecks ?? [...redirects.whoogle.normal];
          whoogleNormalCustomRedirects = result.whoogleNormalCustomRedirects ?? [];

          whoogleTorRedirectsChecks = result.whoogleTorRedirectsChecks ?? [...redirects.whoogle.tor];
          whoogleTorCustomRedirects = result.whoogleTorCustomRedirects ?? [];

          searxNormalRedirectsChecks = result.searxNormalRedirectsChecks ?? [...redirects.searx.normal];
          searxNormalCustomRedirects = result.searxNormalCustomRedirects ?? [];

          searxTorRedirectsChecks = result.searxTorRedirectsChecks ?? [...redirects.searx.tor];
          searxTorCustomRedirects = result.searxTorCustomRedirects ?? [];

          resolve();
        }
      );
    });
  });
}

export default {
  isSearch,

  getDisable,
  setDisable,

  getRedirects,
  getCustomRedirects,
  setSearxRedirects,
  setWhoogleRedirects,

  getFrontend,
  setFrontend,

  getWhoogleNormalRedirectsChecks,
  setWhoogleNormalRedirectsChecks,
  getWhoogleNormalCustomRedirects,
  setWhoogleNormalCustomRedirects,

  getWhoogleTorRedirectsChecks,
  setWhoogleTorRedirectsChecks,
  getWhoogleTorCustomRedirects,
  setWhoogleTorCustomRedirects,

  getSearxNormalRedirectsChecks,
  setSearxNormalRedirectsChecks,
  getSearxNormalCustomRedirects,
  setSearxNormalCustomRedirects,

  getSearxTorRedirectsChecks,
  setSearxTorRedirectsChecks,
  getSearxTorCustomRedirects,
  setSearxTorCustomRedirects,

  getProtocol,
  setProtocol,

  redirect,
  init,
  changeInstance,
};

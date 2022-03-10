window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
  /^https?:\/\/(www\.|search\.|)google\.com(\...|)/,
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
  "startpage": {
    "normal": "https://www.startpage.com",
    "tor": null
  }
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

let theme;
let applyThemeToSites;
function initSearxCookies() {
  let themeValue;
  if (theme == 'light') themeValue = 'logicodev';
  if (theme == 'dark') themeValue = 'logicodev-dark';
  if (applyThemeToSites && themeValue) {
    let allInstances = [...redirects.searx.normal, ...redirects.searx.tor, ...searxNormalCustomRedirects, ...searxTorCustomRedirects]
    let checkedInstances = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects, ...searxTorRedirectsChecks, ...searxTorCustomRedirects]
    for (const instanceUrl of allInstances)
      if (!checkedInstances.includes(instanceUrl)) {
        browser.cookies.remove({
          url: instanceUrl,
          name: "oscar-style",
        })
        browser.cookies.remove({
          url: instanceUrl,
          name: "oscar",
        })
      }
    for (const instanceUrl of checkedInstances) {
      browser.cookies.set({
        url: instanceUrl,
        name: "oscar-style",
        value: themeValue
      })
      browser.cookies.set({
        url: instanceUrl,
        name: "theme",
        value: 'oscar'
      })
    }
  }
}

function redirect(url) {
  if (disable) return;
  if (!targets.some((rx) => rx.test(url.href))) return;

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
  else if (frontend == 'whoogle') {
    let instancesList
    if (protocol == 'normal') instancesList = [...whoogleNormalRedirectsChecks, ...whoogleNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...whoogleTorRedirectsChecks, ...whoogleTorCustomRedirects];
    if (instancesList.length === 0) return null;
    randomInstance = commonHelper.getRandomInstance(instancesList)
    path = "/search";
  }
  else if (frontend == 'startpage') {
    randomInstance = redirects.startpage.normal;
    path = "/do/search";
  }
  if (url.pathname == '/') path = '/';

  let searchQuery = "";
  if (url.searchParams.has('q')) searchQuery = `?q=${url.searchParams.get('q')}`;

  return `${randomInstance}${path}${searchQuery}`;
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

          "theme",
          "applyThemeToSites",

          "searchProtocol",
        ],
        r => {
          disable = r.disableSearch ?? false;

          protocol = r.searchProtocol ?? 'normal';

          frontend = r.searchFrontend ?? 'searx';

          theme = r.theme ?? 'DEFAULT';
          applyThemeToSites = r.applyThemeToSites ?? false;

          redirects.searx = dataJson.searx;
          redirects.whoogle = dataJson.whoogle;
          if (r.searchRedirects) redirects = r.searchRedirects;

          whoogleNormalRedirectsChecks = r.whoogleNormalRedirectsChecks ?? [...redirects.whoogle.normal];
          whoogleNormalCustomRedirects = r.whoogleNormalCustomRedirects ?? [];

          whoogleTorRedirectsChecks = r.whoogleTorRedirectsChecks ?? [...redirects.whoogle.tor];
          whoogleTorCustomRedirects = r.whoogleTorCustomRedirects ?? [];

          searxNormalRedirectsChecks = r.searxNormalRedirectsChecks ?? [...redirects.searx.normal];
          searxNormalCustomRedirects = r.searxNormalCustomRedirects ?? [];

          searxTorRedirectsChecks = r.searxTorRedirectsChecks ?? [...redirects.searx.tor];
          searxTorCustomRedirects = r.searxTorCustomRedirects ?? [];

          initSearxCookies()

          resolve();
        }
      );
    });
  });
}

export default {

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

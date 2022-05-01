window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = /^https?:\/{2}(([a-z]{1,}\.){0,})wikipedia\.org/

let redirects = {
  "wikiless": {
    "normal": [],
    "tor": [],
    "i2p": []
  }
};
const getRedirects = () => redirects;
const getCustomRedirects = function () {
  return {
    "wikiless": {
      "normal": [...wikilessNormalRedirectsChecks, ...wikilessNormalCustomRedirects],
      "tor": [...wikilessTorRedirectsChecks, ...wikilessTorCustomRedirects],
      "i2p": [...wikilessI2pRedirectsChecks, ...wikilessI2pCustomRedirects]
    },
  };
};

function setRedirects(val) {
  redirects.wikiless = val;
  browser.storage.local.set({ wikipediaRedirects: redirects })
  console.log("wikipediaRedirects: ", val)
  for (const item of wikilessNormalRedirectsChecks)
    if (!redirects.wikiless.normal.includes(item)) {
      var index = wikilessNormalRedirectsChecks.indexOf(item);
      if (index !== -1) wikilessNormalRedirectsChecks.splice(index, 1);
    }
  setWikilessNormalRedirectsChecks(wikilessNormalRedirectsChecks);

  for (const item of wikilessTorRedirectsChecks)
    if (!redirects.wikiless.tor.includes(item)) {
      var index = wikilessTorRedirectsChecks.indexOf(item);
      if (index !== -1) wikilessTorRedirectsChecks.splice(index, 1);
    }
  setWikilessTorRedirectsChecks(wikilessTorRedirectsChecks);

  for (const item of wikilessI2pRedirectsChecks)
    if (!redirects.wikiless.i2p.includes(item)) {
      var index = wikilessI2pRedirectsChecks.indexOf(item);
      if (index !== -1) wikilessI2pRedirectsChecks.splice(index, 1);
    }
  setWikilessI2pRedirectsChecks(wikilessI2pRedirectsChecks);
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ disableWikipedia: disable })
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
  protocol = val;
  browser.storage.local.set({ wikipediaProtocol: val })
  console.log("wikipediaProtocol: ", val)
}

let wikilessNormalRedirectsChecks;
const getWikilessNormalRedirectsChecks = () => wikilessNormalRedirectsChecks;
function setWikilessNormalRedirectsChecks(val) {
  wikilessNormalRedirectsChecks = val;
  browser.storage.local.set({ wikilessNormalRedirectsChecks })
  console.log("wikilessNormalRedirectsChecks: ", val)
}

let wikilessTorRedirectsChecks;
const getWikilessTorRedirectsChecks = () => wikilessTorRedirectsChecks;
function setWikilessTorRedirectsChecks(val) {
  wikilessTorRedirectsChecks = val;
  browser.storage.local.set({ wikilessTorRedirectsChecks })
  console.log("wikilessTorRedirectsChecks: ", val)
}

let wikilessI2pRedirectsChecks;
const getWikilessI2pRedirectsChecks = () => wikilessI2pRedirectsChecks;
function setWikilessI2pRedirectsChecks(val) {
  wikilessI2pRedirectsChecks = val;
  browser.storage.local.set({ wikilessI2pRedirectsChecks })
  console.log("wikilessI2pRedirectsChecks: ", val)
}

let wikilessNormalCustomRedirects = [];
const getWikilessNormalCustomRedirects = () => wikilessNormalCustomRedirects;
function setWikilessNormalCustomRedirects(val) {
  wikilessNormalCustomRedirects = val;
  browser.storage.local.set({ wikilessNormalCustomRedirects })
  console.log("wikilessNormalCustomRedirects: ", val)
}

let wikilessTorCustomRedirects = [];
const getWikilessTorCustomRedirects = () => wikilessTorCustomRedirects;
function setWikilessTorCustomRedirects(val) {
  wikilessTorCustomRedirects = val;
  browser.storage.local.set({ wikilessTorCustomRedirects })
  console.log("wikilessTorCustomRedirects: ", val)
}

let wikilessI2pCustomRedirects = [];
const getWikilessI2pCustomRedirects = () => wikilessI2pCustomRedirects;
function setWikilessI2pCustomRedirects(val) {
  wikilessI2pCustomRedirects = val;
  browser.storage.local.set({ wikilessI2pCustomRedirects })
  console.log("wikilessI2pCustomRedirects: ", val)
}

let theme;
let applyThemeToSites;
function initWikilessCookies() {
  let themeValue;
  if (theme == 'light') themeValue = 'white';
  if (theme == 'dark') themeValue = 'dark';
  if (applyThemeToSites && themeValue) {

    let checkedInstances;
    if (protocol == 'normal') checkedInstances = [...wikilessNormalRedirectsChecks, ...wikilessNormalCustomRedirects]
    else if (protocol == 'tor') checkedInstances = [...wikilessTorRedirectsChecks, ...wikilessTorCustomRedirects]
    else if (protocol == 'i2p') checkedInstances = [...wikilessI2pRedirectsChecks, ...wikilessI2pCustomRedirects]

    for (const instanceUrl of checkedInstances)
      browser.cookies.set({ url: instanceUrl, name: "theme", value: themeValue })
  }
}

function redirect(url) {
  if (disable) return;
  if (!targets.test(url.href)) return;

  let GETArguments = [];
  if (url.search.length > 0) {
    let search = url.search.substring(1); //get rid of '?'
    let argstrings = search.split("&");
    for (let i = 0; i < argstrings.length; i++) {
      let args = argstrings[i].split("=");
      GETArguments.push([args[0], args[1]]);
    }
  }
  let instancesList;
  if (protocol == 'normal') instancesList = [...wikilessNormalRedirectsChecks, ...wikilessNormalCustomRedirects];
  else if (protocol == 'tor') instancesList = [...wikilessTorRedirectsChecks, ...wikilessTorCustomRedirects];
  else if (protocol == 'i2p') instancesList = [...wikilessI2pRedirectsChecks, ...wikilessI2pCustomRedirects];
  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  let link = `${randomInstance}${url.pathname}`;
  let urlSplit = url.host.split(".");
  if (urlSplit[0] != "wikipedia" && urlSplit[0] != "www") {
    if (urlSplit[0] == "m")
      GETArguments.push(["mobileaction", "toggle_view_mobile"]);
    else
      GETArguments.push(["lang", urlSplit[0]]);
    if (urlSplit[1] == "m")
      GETArguments.push(["mobileaction", "toggle_view_mobile"]);
    // wikiless doesn't have mobile view support yet
  }
  for (let i = 0; i < GETArguments.length; i++)
    link += (i == 0 ? "?" : "&") + GETArguments[i][0] + "=" + GETArguments[i][1];

  return link;

}

function switchInstance(url) {
  let protocolHost = commonHelper.protocolHost(url);

  let wikipediaList = [
    ...redirects.wikiless.normal,
    ...redirects.wikiless.tor,
    ...redirects.wikiless.i2p,

    ...wikilessNormalCustomRedirects,
    ...wikilessTorCustomRedirects,
    ...wikilessI2pCustomRedirects
  ]
  if (!wikipediaList.includes(protocolHost)) return null;

  let instancesList;
  if (protocol == 'normal') instancesList = [...wikilessNormalCustomRedirects, ...wikilessNormalRedirectsChecks];
  else if (protocol == 'tor') instancesList = [...wikilessTorCustomRedirects, ...wikilessTorRedirectsChecks];
  else if (protocol == 'i2p') instancesList = [...wikilessI2pCustomRedirects, ...wikilessI2pRedirectsChecks];

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
          "disableWikipedia",
          "wikipediaRedirects",
          "wikilessNormalRedirectsChecks",
          "wikilessTorRedirectsChecks",
          "wikilessI2pRedirectsChecks",
          "wikilessNormalCustomRedirects",
          "wikilessTorCustomRedirects",
          "wikilessI2pCustomRedirects",
          "wikipediaProtocol",

          "theme",
          "applyThemeToSites",

        ], r => {
          disable = r.disableWikipedia ?? true;

          protocol = r.wikipediaProtocol ?? "normal";

          redirects.wikiless = dataJson.wikiless;
          if (r.wikipediaRedirects) redirects = r.wikipediaRedirects;

          wikilessNormalRedirectsChecks = r.wikilessNormalRedirectsChecks ?? [...redirects.wikiless.normal];
          wikilessNormalCustomRedirects = r.wikilessNormalCustomRedirects ?? [];

          wikilessTorRedirectsChecks = r.wikilessTorRedirectsChecks ?? [...redirects.wikiless.tor];
          wikilessTorCustomRedirects = r.wikilessTorCustomRedirects ?? [];

          wikilessI2pRedirectsChecks = r.wikilessI2pRedirectsChecks ?? [...redirects.wikiless.i2p];
          wikilessI2pCustomRedirects = r.wikilessI2pCustomRedirects ?? [];

          theme = r.theme ?? 'DEFAULT';
          applyThemeToSites = r.applyThemeToSites ?? false;

          initWikilessCookies();

          resolve();
        }
      );
    });
  });
}

export default {
  getRedirects,
  getCustomRedirects,
  setRedirects,

  setDisable,
  getDisable,

  getProtocol,
  setProtocol,

  getWikilessNormalRedirectsChecks,
  setWikilessNormalRedirectsChecks,
  getWikilessTorRedirectsChecks,
  setWikilessTorRedirectsChecks,
  getWikilessI2pRedirectsChecks,
  setWikilessI2pRedirectsChecks,

  getWikilessNormalCustomRedirects,
  setWikilessNormalCustomRedirects,
  getWikilessTorCustomRedirects,
  setWikilessTorCustomRedirects,
  getWikilessI2pCustomRedirects,
  setWikilessI2pCustomRedirects,

  initWikilessCookies,

  redirect,
  init,
  switchInstance,
};

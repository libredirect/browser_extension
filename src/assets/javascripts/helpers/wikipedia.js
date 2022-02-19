window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = /^https?:\/\/.*wikipedia\.org\//

let redirects = {
  "wikiless": {
    "normal": [
      "https://wikiless.org",
      "https://wikiless.alefvanoon.xyz",
      "https://wikiless.sethforprivacy.com",
      "https://wiki.604kph.xyz"
    ],
    "tor": [
      "http://dj2tbh2nqfxyfmvq33cjmhuw7nb6am7thzd3zsjvizeqf374fixbrxyd.onion"
    ]
  }
};
const getRedirects = () => redirects;
const getCustomRedirects = function () {
  return {
    "wikiless": {
      "normal": [...wikilessRedirectsChecks, ...wikilessCustomRedirects]
    },
  };
};
function setRedirects(val) {
  redirects.wikiless = val;
  browser.storage.sync.set({ wikipediaRedirects: redirects })
  console.log("wikipediaRedirects: ", val)
  for (const item of wikilessRedirectsChecks)
    if (!redirects.wikiless.normal.includes(item)) {
      var index = wikilessRedirectsChecks.indexOf(item);
      if (index !== -1) wikilessRedirectsChecks.splice(index, 1);
    }
  setWikilessRedirectsChecks(wikilessRedirectsChecks);
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.sync.set({ disableWikipedia: disable })
}

let wikilessRedirectsChecks;
const getWikilessRedirectsChecks = () => wikilessRedirectsChecks;
function setWikilessRedirectsChecks(val) {
  wikilessRedirectsChecks = val;
  browser.storage.sync.set({ wikilessRedirectsChecks })
  console.log("wikilessRedirectsChecks: ", val)
}

let wikilessCustomRedirects = [];
const getWikilessCustomRedirects = () => wikilessCustomRedirects;
function setWikilessCustomRedirects(val) {
  wikilessCustomRedirects = val;
  browser.storage.sync.set({ wikilessCustomRedirects })
  console.log("wikilessCustomRedirects: ", val)
}

function isWikipedia(url, initiator) {
  if (disable) return false;
  return targets.test(url.href);
}

function redirect(url) {
  let GETArguments = [];
  if (url.search.length > 0) {
    let search = url.search.substring(1); //get rid of '?'
    let argstrings = search.split("&");
    for (let i = 0; i < argstrings.length; i++) {
      let args = argstrings[i].split("=");
      GETArguments.push([args[0], args[1]]);
    }
  }

  let instancesList = [...wikilessRedirectsChecks, ...wikilessCustomRedirects];
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

async function init() {
  return new Promise((resolve) => {
    browser.storage.sync.get(
      [
        "disableWikipedia",
        "wikipediaRedirects",
        "wikilessRedirectsChecks",
        "wikilessCustomRedirects",
      ], (result) => {
        disable = result.disableWikipedia ?? false;

        if (result.wikipediaRedirects) redirects = result.wikipediaRedirects;

        wikilessRedirectsChecks = result.wikilessRedirectsChecks ?? [...redirects.wikiless.normal];
        wikilessCustomRedirects = result.wikilessCustomRedirects ?? [];

        resolve();
      }
    );
  });
}

export default {
  getRedirects,
  getCustomRedirects,
  setRedirects,

  setDisable,
  getDisable,

  getWikilessRedirectsChecks,
  setWikilessRedirectsChecks,

  getWikilessCustomRedirects,
  setWikilessCustomRedirects,

  redirect,
  isWikipedia,
  init,
};

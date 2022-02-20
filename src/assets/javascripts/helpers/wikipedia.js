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
      "normal": [...wikilessNormalRedirectsChecks, ...wikilessNormalCustomRedirects]
    },
  };
};
function setRedirects(val) {
  redirects.wikiless = val;
  browser.storage.sync.set({ wikipediaRedirects: redirects })
  console.log("wikipediaRedirects: ", val)
  for (const item of wikilessNormalRedirectsChecks)
    if (!redirects.wikiless.normal.includes(item)) {
      var index = wikilessNormalRedirectsChecks.indexOf(item);
      if (index !== -1) wikilessNormalRedirectsChecks.splice(index, 1);
    }
  setWikilessNormalRedirectsChecks(wikilessNormalRedirectsChecks);
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.sync.set({ disableWikipedia: disable })
}

let wikilessNormalRedirectsChecks;
const getWikilessNormalRedirectsChecks = () => wikilessNormalRedirectsChecks;
function setWikilessNormalRedirectsChecks(val) {
  wikilessNormalRedirectsChecks = val;
  browser.storage.sync.set({ wikilessNormalRedirectsChecks })
  console.log("wikilessNormalRedirectsChecks: ", val)
}

let wikilessNormalCustomRedirects = [];
const getWikilessNormalCustomRedirects = () => wikilessNormalCustomRedirects;
function setWikilessNormalCustomRedirects(val) {
  wikilessNormalCustomRedirects = val;
  browser.storage.sync.set({ wikilessNormalCustomRedirects })
  console.log("wikilessNormalCustomRedirects: ", val)
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

  let instancesList = [...wikilessNormalRedirectsChecks, ...wikilessNormalCustomRedirects];
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
        "wikilessNormalRedirectsChecks",
        "wikilessNormalCustomRedirects",
      ], (result) => {
        disable = result.disableWikipedia ?? false;

        if (result.wikipediaRedirects) redirects = result.wikipediaRedirects;

        wikilessNormalRedirectsChecks = result.wikilessNormalRedirectsChecks ?? [...redirects.wikiless.normal];
        wikilessNormalCustomRedirects = result.wikilessNormalCustomRedirects ?? [];

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

  getWikilessNormalRedirectsChecks,
  setWikilessNormalRedirectsChecks,

  getWikilessNormalCustomRedirects,
  setWikilessNormalCustomRedirects,

  redirect,
  isWikipedia,
  init,
};

import commonHelper from './common.js'

const targets = /wikipedia.org/;

let redirects = {
  "normal": [
    "https://wikiless.org",
    "https://wikiless.alefvanoon.xyz",
    "https://wikiless.sethforprivacy.com",
    "https://wiki.604kph.xyz"
  ],
  "onion": [
    "http://dj2tbh2nqfxyfmvq33cjmhuw7nb6am7thzd3zsjvizeqf374fixbrxyd.onion"
  ]
};
const getRedirects = () => redirects;
function setRedirects(val) {
  redirects = val;
  browser.storage.sync.set({ wikipediaRedirects: val })
  console.log("wikipediaRedirects: ", val)
}

let disableWikipedia;
const getDisableWikipedia = () => disableWikipedia;
function setDisableWikipedia(val) {
  disableWikipedia = val;
  browser.storage.sync.set({ disableWikipedia })
}

function redirect(url, initiator) {
  if (disableWikipedia) return null;

  let GETArguments = [];
  if (url.search.length > 0) {
    let search = url.search.substring(1); //get rid of '?'
    let argstrings = search.split("&");
    for (let i = 0; i < argstrings.length; i++) {
      let args = argstrings[i].split("=");
      GETArguments.push([args[0], args[1]]);
    }
  }
  let instance = commonHelper.getRandomInstance(redirects.normal)
  let link = `${instance}${url.pathname}`;
  let urlSplit = url.host.split(".");
  if (urlSplit[0] != "wikipedia" && urlSplit[0] != "www") {
    if (urlSplit[0] == "m")
      GETArguments.push(["mobileaction", "toggle_view_mobile"]);
    else GETArguments.push(["lang", urlSplit[0]]);
    if (urlSplit[1] == "m")
      GETArguments.push(["mobileaction", "toggle_view_mobile"]);
    // wikiless doesn't have mobile view support yet
  }
  for (let i = 0; i < GETArguments.length; i++)
    link += (i == 0 ? "?" : "&") + GETArguments[i][0] + "=" + GETArguments[i][1];

  if (
    urlSplit[urlSplit.length - 1] == "org" &&
    urlSplit[urlSplit.length - 2] == "wikipedia"
  )
    //just in case someone wanted to visit wikipedia.org.foo.bar.net
    return link;
  else return null;
}

function isWikipedia(url) {
  return url.host.match(targets);
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableWikipedia",
    "wikipediaRedirects"
  ]);
  disableWikipedia = result.disableWikipedia ?? false;
  if (result.wikipediaRedirects)
    redirects = result.wikipediaRedirects;
}

export default {
  getRedirects,
  setRedirects,

  setDisableWikipedia,
  getDisableWikipedia,

  redirect,
  isWikipedia,
  init,
};

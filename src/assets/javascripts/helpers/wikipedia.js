const targets = /wikipedia.org/;

let redirects = {
  "normal": [
    "https://wikiless.org"
  ]
};

let disableWikipedia;
const getDisableWikipedia = () => disableWikipedia;
function setDisableWikipedia(val) {
  disableWikipedia = val;
  browser.storage.sync.set({ disableWikipedia })
}

let wikipediaInstance;
const getWikipediaInstance = () => wikipediaInstance;
function setWikipediaInstance(val) {
  wikipediaInstance = val;
  browser.storage.sync.set({ wikipediaInstance })
};

async function redirect(url, initiator) {
  await init()
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
  let link = `${wikipediaInstance}${url.pathname}`;
  let urlSplit = url.host.split(".");
  if (urlSplit[0] != "wikipedia" && urlSplit[0] != "www") {
    if (urlSplit[0] == "m")
      GETArguments.push(["mobileaction", "toggle_view_mobile"]);
    else GETArguments.push(["lang", urlSplit[0]]);
    if (urlSplit[1] == "m")
      GETArguments.push(["mobileaction", "toggle_view_mobile"]);
    //wikiless doesn't have mobile view support yet
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

async function init() {
  let result = await browser.storage.sync.get([
    "disableWikipedia",
    "wikipediaInstance",
  ]);
  disableWikipedia = result.disableWikipedia ?? false;
  wikipediaInstance = result.wikipediaInstance;
}

export default {
  targets,
  redirects,
  setDisableWikipedia,
  getDisableWikipedia,
  setWikipediaInstance,
  getWikipediaInstance,
  redirect,
  init,
};

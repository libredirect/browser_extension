"use strict";

import mapsHelper from "../../assets/javascripts/helpers/maps.js";
import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import youtubeHelper from "../../assets/javascripts/helpers/youtube.js";
import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import mediumHelper from "../../assets/javascripts/helpers/medium.js";
import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import searchHelper from "../../assets/javascripts/helpers/search.js";
import googleTranslateHelper from "../../assets/javascripts/helpers/translate.js";
import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import data from "../../assets/javascripts/data.js";
import googleMaps from "../../assets/javascripts/helpers/maps.js";

window.browser = window.browser || window.chrome;

// data.osmInstance = result.osmInstance || data.osmDefault;
// data.simplyTranslateInstance = result.simplyTranslateInstance || data.simplyTranslateDefault;
// data.wikipediaInstance = result.wikipediaInstance || data.wikipediaDefault;
// data.exceptions = result.exceptions
//   ? result.exceptions.map((e) => {
//     return new RegExp(e);
//   })
//   : [];
// data.invidiousSubtitles = result.invidiousSubtitles || "";

googleMaps.init()
searchHelper.init()
googleTranslateHelper.init()
instagramHelper.init()
mediumHelper.init()
redditHelper.init()
twitterHelper.init()
wikipediaHelper.init()
youtubeHelper.init()


browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    const url = new URL(details.url);
    let initiator;
    if (details.originUrl)
      initiator = new URL(details.originUrl);
    else if (details.initiator)
      initiator = new URL(details.initiator);

    var newUrl;

    if (youtubeHelper.targets.includes(url.host)) newUrl = await youtubeHelper.redirect(url, initiator, details.type)

    else if (twitterHelper.targets.includes(url.host)) newUrl = await twitterHelper.redirect(url, initiator);

    else if (instagramHelper.targets.includes(url.host)) newUrl = await instagramHelper.redirect(url, initiator, details.type);

    else if (url.href.match(mapsHelper.targets)) newUrl = await mapsHelper.redirect(url, initiator);

    else if (redditHelper.targets.includes(url.host)) newUrl = await redditHelper.redirect(url, initiator, details.type);

    else if (mediumHelper.targets.some((rx) => rx.test(url.host))) newUrl = await mediumHelper.redirect(url, initiator);

    else if (googleTranslateHelper.targets.includes(url.host)) newUrl = await googleTranslateHelper.redirect(url, initiator);

    else if (searchHelper.targets.some((rx) => rx.test(url.href))) newUrl = await searchHelper.redirect(url, initiator)

    else if (url.host.match(wikipediaHelper.targets)) newUrl = await wikipediaHelper.redirect(url, initiator);

    if (newUrl) {
      console.info("Redirecting", url.href, "=>", newUrl);
      return { redirectUrl: newUrl };
    }
    return null;
  },
  { urls: ["<all_urls>"], },
  ["blocking"]
);

browser.tabs.onUpdated.addListener((tabId, changeInfo, _) => {
  let url;
  try {
    url = new URL(changeInfo.url)
  } catch (_) {
    return;
  }
  var protocolHost = `${url.protocol}//${url.host}`;
  var mightyList = [];
  mightyList.push(
    ...youtubeHelper.redirects.normal,
    ...twitterHelper.redirects.normal,
    ...instagramHelper.redirects.normal,
    ...redditHelper.redirects.libreddit.normal,
    ...redditHelper.redirects.teddit.normal,
    redditHelper.redirects.desktop,
    redditHelper.redirects.mobile,
    ...searchHelper.redirects.searx.normal,
    ...searchHelper.redirects.whoogle.normal,
    ...googleTranslateHelper.redirects.simplyTranslate.normal,
    ...googleTranslateHelper.redirects.lingva.normal,
    ...mediumHelper.redirects.normal,
    ...wikipediaHelper.redirects.normal
  );

  if (mightyList.includes(protocolHost)) browser.pageAction.show(tabId);
});


browser.pageAction.onClicked.addListener((tab) => {
  var tabUrl = new URL(tab.url);
  var protocolHost = `${tabUrl.protocol}//${tabUrl.host}`;
  var newUrl;
  if (youtubeHelper.redirects.normal.includes(protocolHost)) newUrl = 'https://youtube.com';

  if (twitterHelper.redirects.normal.includes(protocolHost)) newUrl = 'https://twitter.com';

  if (instagramHelper.redirects.normal.includes(protocolHost)) newUrl = 'https://instagram.com';


  if (redditHelper.redirects.libreddit.normal.includes(protocolHost) || redditHelper.redirects.teddit.normal.includes(protocolHost)) {
    if (tabUrl.pathname.startsWith('/img')) {
      newUrl = "https://i.redd.it"
      tabUrl.href = tabUrl.href.replace("/img", "")
    }
    else
      newUrl = 'https://reddit.com';
  }

  if (
    searchHelper.redirects.searx.normal.includes(protocolHost) ||
    searchHelper.redirects.whoogle.normal.includes(protocolHost)
  ) newUrl = 'https://google.com';

  if (
    googleTranslateHelper.redirects.simplyTranslate.normal.includes(protocolHost) ||
    googleTranslateHelper.redirects.lingva.normal.includes(protocolHost)
  ) newUrl = 'https://translate.google.com';

  if (mediumHelper.redirects.normal.includes(protocolHost)) newUrl = 'https://medium.com';

  if (wikipediaHelper.redirects.normal.includes(protocolHost)) newUrl = 'https://wikipedia.com';

  if (newUrl) browser.tabs.update({ url: tabUrl.href.replace(protocolHost, newUrl) });
});

browser.runtime.onInstalled.addListener((details) => {
  browser.storage.sync.get(
    [
      "disableSearch",
      "disableSimplyTranslate",
      "disableWikipedia",
      "redditFrontend",
      "searchFrontend",
    ],
    (result) => {

      if (result.disableSearch === undefined) browser.storage.sync.set({ disableSearch: true });

      if (result.disableSimplyTranslate === undefined) browser.storage.sync.set({ disableSimplyTranslate: true });

      if (result.disableWikipedia === undefined) browser.storage.sync.set({ disableWikipedia: true });

      if (result.redditFrontend === undefined) browser.storage.sync.set({ redditFrontend: 'libreddit' })

      if (result.searchFrontend === undefined) {
        data.searchFrontend = 'searx';
        browser.storage.sync.set({ searchFrontend: data.searchFrontend })
      }

    }
  );
  if (details.reason === "update") {
    browser.storage.sync.get(
      ["whitelist", "exceptions", "invidiousInstance", "disableSearch"],
      (result) => {
        if (result.whitelist) {
          let whitelist = result.whitelist.map((e) =>
            e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
          );
          browser.storage.sync.set({
            exceptions: result.exceptions.concat(whitelist),
            whitelist: null,
          });
        }
        if (result.invidiousInstance === "https://invidio.us")
          browser.storage.sync.set({ invidiousInstance: null });
      }
    );
  }
});
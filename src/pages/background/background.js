"use strict";

import youtubeHelper from "../../assets/javascripts/helpers/youtube.js";
import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import searchHelper from "../../assets/javascripts/helpers/search.js";
import translateHelper from "../../assets/javascripts/helpers/translate.js";
import mapsHelper from "../../assets/javascripts/helpers/maps.js";
import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import mediumHelper from "../../assets/javascripts/helpers/medium.js";

window.browser = window.browser || window.chrome;

mapsHelper.init()
searchHelper.init()
translateHelper.init()
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

    else if (translateHelper.targets.includes(url.host)) newUrl = await translateHelper.redirect(url, initiator);

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
    ...translateHelper.redirects.simplyTranslate.normal,
    ...translateHelper.redirects.lingva.normal,
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
    translateHelper.redirects.simplyTranslate.normal.includes(protocolHost) ||
    translateHelper.redirects.lingva.normal.includes(protocolHost)
  ) newUrl = 'https://translate.google.com';

  if (mediumHelper.redirects.normal.includes(protocolHost)) newUrl = 'https://medium.com';

  if (wikipediaHelper.redirects.normal.includes(protocolHost)) newUrl = 'https://wikipedia.com';

  if (newUrl) browser.tabs.update({ url: tabUrl.href.replace(protocolHost, newUrl) });
});
"use strict";

import youtubeHelper from "../../assets/javascripts/helpers/youtube/youtube.js";
import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import searchHelper from "../../assets/javascripts/helpers/search.js";
import translateHelper from "../../assets/javascripts/helpers/translate.js";
import mapsHelper from "../../assets/javascripts/helpers/maps.js";
import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import mediumHelper from "../../assets/javascripts/helpers/medium.js";
import imgurHelper from "../../assets/javascripts/helpers/imgur.js";
import tiktokHelper from "../../assets/javascripts/helpers/tiktok.js";
import exceptionsHelper from "../../assets/javascripts/helpers/exceptions.js";

window.browser = window.browser || window.chrome;

function wholeInit() {
  mapsHelper.init()
  searchHelper.init()
  translateHelper.init()
  instagramHelper.init()
  mediumHelper.init()
  redditHelper.init()
  twitterHelper.init()
  wikipediaHelper.init()
  youtubeHelper.init()
  imgurHelper.init()
  tiktokHelper.init()
  exceptionsHelper.init()
}

wholeInit();

browser.storage.onChanged.addListener(wholeInit);

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    let initiator;
    if (details.originUrl)
      initiator = new URL(details.originUrl);
    else if (details.initiator)
      initiator = new URL(details.initiator);

    var newUrl;

    if (exceptionsHelper.isException(url)) newUrl = null;

    else if (youtubeHelper.isYoutube(url)) newUrl = youtubeHelper.redirect(url, initiator, details.type)

    else if (twitterHelper.isTwitter(url)) newUrl = twitterHelper.redirect(url, initiator);

    else if (instagramHelper.isInstagram(url)) newUrl = instagramHelper.redirect(url, initiator, details.type);

    else if (mapsHelper.isMaps(url)) newUrl = mapsHelper.redirect(url, initiator);

    else if (redditHelper.isReddit(url)) newUrl = redditHelper.redirect(url, initiator, details.type);

    else if (mediumHelper.isMedium(url)) newUrl = mediumHelper.redirect(url, initiator, details.type);

    else if (imgurHelper.isImgur(url)) newUrl = imgurHelper.redirect(url, initiator, details.type);

    else if (tiktokHelper.isTiktok(url)) newUrl = tiktokHelper.redirect(url, initiator, details.type);

    else if (translateHelper.isTranslate(url)) newUrl = translateHelper.redirect(url, initiator);

    else if (searchHelper.isSearch(url)) newUrl = searchHelper.redirect(url, initiator)

    else if (wikipediaHelper.isWikipedia(url)) newUrl = wikipediaHelper.redirect(url, initiator);

    if (newUrl) {
      if (newUrl == 'CANCEL') {
        console.log(`Canceled ${url}`);
        return { cancel: true };
      }
      else {
        console.info("Redirecting", url.href, "=>", newUrl);
        return { redirectUrl: newUrl };
      }
    }
    return null;
  },
  { urls: ["<all_urls>"], },
  ["blocking"]
);

browser.webRequest.onResponseStarted.addListener(
  (responseDetails) => {
    let url = new URL(responseDetails.url);
    let protocolHost = `${url.protocol}//${url.host}`;
    var mightyList = getMightyList();

    if (mightyList.includes(protocolHost)); {
      if (responseDetails.statusCode < 200 || responseDetails.statusCode >= 300) {
        console.log("Instance is corrupted, redirecting", responseDetails.url);
        changeInstance(responseDetails.url);
      }
    }
  },
  { urls: ["<all_urls>"] }
);

function changeInstance(url) {
  var tabUrl = new URL(url);
  var protocolHost = `${tabUrl.protocol}//${tabUrl.host}`;
  var newUrl;

  if (
    youtubeHelper.getCustomRedirects().invidious.normal.includes(protocolHost) ||
    youtubeHelper.getCustomRedirects().piped.normal.includes(protocolHost)
  )
    newUrl = 'https://youtube.com';

  if (twitterHelper.getRedirects().nitter.normal.includes(protocolHost)) newUrl = 'https://twitter.com';

  if (instagramHelper.getRedirects().bibliogram.normal.includes(protocolHost)) newUrl = 'https://instagram.com';

  if (redditHelper.getRedirects().libreddit.normal.includes(protocolHost) || redditHelper.getRedirects().teddit.normal.includes(protocolHost)) {
    if (tabUrl.pathname.startsWith('/img')) {
      newUrl = "https://i.redd.it"
      tabUrl.href = tabUrl.href.replace("/img", "")
    }
    else
      newUrl = 'https://reddit.com';
  }

  if (
    searchHelper.getRedirects().searx.normal.includes(protocolHost) ||
    searchHelper.getRedirects().whoogle.normal.includes(protocolHost)
  ) newUrl = 'https://google.com';

  if (
    translateHelper.getRedirects().simplyTranslate.normal.includes(protocolHost) ||
    translateHelper.getRedirects().lingva.normal.includes(protocolHost)
  ) newUrl = 'https://translate.google.com';

  if (mediumHelper.getRedirects().scribe.normal.includes(protocolHost)) newUrl = 'https://medium.com';

  if (imgurHelper.getRedirects().rimgo.normal.includes(protocolHost)) newUrl = 'https://imgur.com';

  if (wikipediaHelper.getRedirects().wikiless.normal.includes(protocolHost)) newUrl = 'https://wikipedia.com';

  if (newUrl) browser.tabs.update({ url: tabUrl.href.replace(protocolHost, newUrl) });
}

function getMightyList() {
  return [
    ...youtubeHelper.getCustomRedirects().invidious.normal,
    ...youtubeHelper.getCustomRedirects().piped.normal,
    ...twitterHelper.getCustomRedirects().nitter.normal,
    ...instagramHelper.getCustomRedirects().bibliogram.normal,
    ...redditHelper.getCustomRedirects().libreddit.normal,
    ...redditHelper.getCustomRedirects().teddit.normal,
    redditHelper.getCustomRedirects().desktop,
    redditHelper.getCustomRedirects().mobile,
    ...searchHelper.getCustomRedirects().searx.normal,
    ...searchHelper.getCustomRedirects().whoogle.normal,
    ...translateHelper.getCustomRedirects().simplyTranslate.normal,
    ...translateHelper.getCustomRedirects().lingva.normal,
    ...mediumHelper.getCustomRedirects().scribe.normal,
    ...imgurHelper.getCustomRedirects().rimgo.normal,
    ...wikipediaHelper.getCustomRedirects().wikiless.normal
  ];
}

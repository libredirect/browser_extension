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
import youtubeMusicHelper from "../../assets/javascripts/helpers/youtubeMusic.js";

window.browser = window.browser || window.chrome;

async function wholeInit() {
  youtubeHelper.init()
  youtubeMusicHelper.init()
  twitterHelper.init()
  instagramHelper.init()
  mapsHelper.init()
  searchHelper.init()
  translateHelper.init()
  mediumHelper.init()
  redditHelper.init()
  wikipediaHelper.init()
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

    if (exceptionsHelper.isException(url, initiator)) newUrl = null;

    else if (youtubeMusicHelper.isYoutubeMusic(url, initiator)) newUrl = youtubeMusicHelper.redirect(url, details.type)
    else if (youtubeHelper.isYoutube(url, initiator)) newUrl = youtubeHelper.redirect(url, details.type, details)

    else if (twitterHelper.isTwitter(url, initiator)) newUrl = twitterHelper.redirect(url);

    else if (instagramHelper.isInstagram(url, initiator)) newUrl = instagramHelper.redirect(url, details.type);

    else if (mapsHelper.isMaps(url, initiator)) newUrl = mapsHelper.redirect(url);

    else if (redditHelper.isReddit(url, initiator)) newUrl = redditHelper.redirect(url, details.type);

    else if (mediumHelper.isMedium(url, initiator)) newUrl = mediumHelper.redirect(url, details.type);

    else if (imgurHelper.isImgur(url, initiator)) newUrl = imgurHelper.redirect(url, details.type);

    else if (tiktokHelper.isTiktok(url, initiator)) newUrl = tiktokHelper.redirect(url, details.type);

    else if (translateHelper.isTranslate(url, initiator)) newUrl = translateHelper.redirect(url);

    else if (searchHelper.isSearch(url)) newUrl = searchHelper.redirect(url)

    else if (wikipediaHelper.isWikipedia(url, initiator)) newUrl = wikipediaHelper.redirect(url);

    if (youtubeHelper.isPipedorInvidious(newUrl ?? url, details.type)) newUrl = youtubeHelper.addUrlParams(newUrl ?? url);

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
      if (responseDetails.statusCode >= 500 && responseDetails.type === "main_frame") {
        console.log("Instance is corrupted, redirecting", responseDetails.url);
        changeInstance(responseDetails.url);
      }
    }
  },
  { urls: ["<all_urls>"] }
);

browser.tabs.onUpdated.addListener(
  (tabId, changeInfo) => {
    if (changeInfo.url && youtubeHelper.isUrlPipedorInvidious(changeInfo.url))
      youtubeHelper.invidiousInitCookies(tabId);
  });

function changeInstance(url) {
  var tabUrl = new URL(url);
  var protocolHost = `${tabUrl.protocol}//${tabUrl.host}`;
  var newUrl;

  console.log("wewe")
  newUrl = youtubeHelper.changeInstance(url);

  let twitterList = [...twitterHelper.getRedirects().nitter.normal];
  if (twitterList.includes(protocolHost) && twitterList.length > 1) newUrl = 'https://twitter.com';

  let instagramList = [...instagramHelper.getRedirects().bibliogram.normal];
  if (instagramList.includes(protocolHost) && instagramList.length > 1) newUrl = 'https://instagram.com';

  let redditList = [...redditHelper.getRedirects().libreddit.normal, ...redditHelper.getRedirects().teddit.normal]
  if (redditList.includes(protocolHost) && redditList.length > 1) {
    if (tabUrl.pathname.startsWith('/img')) {
      newUrl = "https://i.redd.it"
      tabUrl.href = tabUrl.href.replace("/img", "")
    }
    else
      newUrl = 'https://reddit.com';
  }

  let searchList = [...searchHelper.getRedirects().searx.normal, ...searchHelper.getRedirects().whoogle.normal]
  if (searchList.includes(protocolHost) && searchList.length > 1) newUrl = 'https://google.com';

  let translateList = [...translateHelper.getRedirects().simplyTranslate.normal, ...translateHelper.getRedirects().lingva.normal]
  if (translateList.includes(protocolHost) && translateList.length > 1) newUrl = 'https://translate.google.com';

  let mediumList = [...mediumHelper.getRedirects().scribe.normal]
  if (mediumList.includes(protocolHost) && mediumList.length > 1) newUrl = 'https://medium.com';

  let imgurList = [...imgurHelper.getRedirects().rimgo.normal];
  if (imgurList.includes(protocolHost) && imgurList.length > 1) newUrl = 'https://imgur.com';

  let wikipediaList = [...wikipediaHelper.getRedirects().wikiless.normal]
  if (wikipediaList.includes(protocolHost) && wikipediaList.length > 1) newUrl = 'https://wikipedia.com';

  if (newUrl) browser.tabs.update({ url: tabUrl.href.replace(protocolHost, newUrl) });
}

function getMightyList() {
  return [
    ...youtubeHelper.getCustomRedirects().invidious.normal,
    ...youtubeHelper.getCustomRedirects().piped.normal,

    ...twitterHelper.getCustomRedirects().nitter.normal,

    ...youtubeMusicHelper.getCustomRedirects().beatbump.normal,

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

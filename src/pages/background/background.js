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

let bybassTabs = [];

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    let initiator;
    if (details.originUrl)
      initiator = new URL(details.originUrl);
    else if (details.initiator)
      initiator = new URL(details.initiator);

    var newUrl;

    if (!newUrl) newUrl = youtubeHelper.redirect(url, details, initiator)
    if (youtubeMusicHelper.isYoutubeMusic(url, initiator)) newUrl = youtubeMusicHelper.redirect(url, details.type)

    if (twitterHelper.isTwitter(url, initiator)) newUrl = twitterHelper.redirect(url);

    if (instagramHelper.isInstagram(url, initiator)) newUrl = instagramHelper.redirect(url, details.type);

    if (mapsHelper.isMaps(url, initiator)) newUrl = mapsHelper.redirect(url);

    if (!newUrl) newUrl = redditHelper.redirect(url, details.type, initiator);

    if (mediumHelper.isMedium(url, initiator)) newUrl = mediumHelper.redirect(url, details.type);

    if (imgurHelper.isImgur(url, initiator)) newUrl = imgurHelper.redirect(url, details.type);

    if (tiktokHelper.isTiktok(url, initiator)) newUrl = tiktokHelper.redirect(url, details.type);

    if (translateHelper.isTranslate(url, initiator)) newUrl = translateHelper.redirect(url);

    if (searchHelper.isSearch(url)) newUrl = searchHelper.redirect(url)

    if (wikipediaHelper.isWikipedia(url, initiator)) newUrl = wikipediaHelper.redirect(url);

    if (youtubeHelper.isPipedorInvidious(newUrl ?? url, details.type)) newUrl = youtubeHelper.addUrlParams(newUrl ?? url);

    if (exceptionsHelper.isException(url, initiator)) newUrl = null;

    if (bybassTabs.includes(details.tabId)) newUrl = null;


    if (newUrl) {
      if (newUrl == 'CANCEL') {
        console.log(`Canceled ${url}`);
        return { cancel: true };
      }
      else if (newUrl == 'BYBASSTAB') {
        console.log(`Bybassed ${details.tabId}`);
        bybassTabs.push(details.tabId);
        return null;
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

browser.tabs.onRemoved.addListener((tabId) => {
  let index = bybassTabs.indexOf(tabId);
  if (index > -1) bybassTabs.splice(index, 1);
  console.log("Removed bybassTabs", tabId);
});


browser.tabs.onUpdated.addListener(
  (tabId, changeInfo) => {
    if (changeInfo.url && youtubeHelper.isUrlPipedorInvidious(changeInfo.url, 'invidious'))
      youtubeHelper.invidiousInitCookies(tabId);
  });
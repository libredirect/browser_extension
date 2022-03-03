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
import generalHelper from "../../assets/javascripts/helpers/general.js";
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
  generalHelper.init()

}
wholeInit();

browser.storage.onChanged.addListener(wholeInit);

let BYPASSTABs = [];

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
    if (youtubeHelper.isPipedorInvidious(newUrl ?? url, details.type)) newUrl = youtubeHelper.addUrlParams(newUrl ?? url);
    if (youtubeMusicHelper.isYoutubeMusic(url, initiator)) newUrl = youtubeMusicHelper.redirect(url, details.type)

    if (!newUrl) newUrl = twitterHelper.redirect(url, initiator);

    if (instagramHelper.isInstagram(url, initiator)) newUrl = instagramHelper.redirect(url, details.type);

    if (mapsHelper.isMaps(url, initiator)) newUrl = mapsHelper.redirect(url);

    if (!newUrl) newUrl = redditHelper.redirect(url, details.type, initiator);

    if (mediumHelper.isMedium(url, initiator)) newUrl = mediumHelper.redirect(url, details.type);

    if (imgurHelper.isImgur(url, initiator)) newUrl = imgurHelper.redirect(url, details.type);

    if (tiktokHelper.isTiktok(url, initiator)) newUrl = tiktokHelper.redirect(url, details.type);

    if (translateHelper.isTranslate(url, initiator)) newUrl = translateHelper.redirect(url);

    if (searchHelper.isSearch(url)) newUrl = searchHelper.redirect(url)

    if (wikipediaHelper.isWikipedia(url, initiator)) newUrl = wikipediaHelper.redirect(url);

    if (generalHelper.isException(url, initiator)) newUrl = null;

    if (BYPASSTABs.includes(details.tabId)) newUrl = null;

    if (newUrl) {
      if (newUrl == 'CANCEL') {
        console.log(`Canceled ${url}`);
        return { cancel: true };
      }
      else if (newUrl == 'BYPASSTAB') {
        console.log(`Bybassed ${details.tabId} ${url}`);
        BYPASSTABs.push(details.tabId);
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
  let index = BYPASSTABs.indexOf(tabId);
  if (index > -1) {
    BYPASSTABs.splice(index, 1);
    console.log("Removed BYPASSTABs", tabId);
  }
});


browser.tabs.onUpdated.addListener(
  (tabId, changeInfo, _) => {
    if (changeInfo.url && youtubeHelper.isUrlPipedorInvidious(changeInfo.url, 'piped')) youtubeHelper.initPipedLocalStorage(tabId);
    if (changeInfo.url && youtubeHelper.isUrlPipedorInvidious(changeInfo.url, 'pipedMaterial')) youtubeHelper.initPipedMaterialLocalStorage(tabId);
    // if (changeInfo.url && youtubeHelper.isUrlPipedorInvidious(changeInfo.url, 'invidious')) youtubeHelper.initInvidiousCookies(tabId);
  });
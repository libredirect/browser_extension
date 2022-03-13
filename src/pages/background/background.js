"use strict";

import youtubeHelper from "../../assets/javascripts/helpers/youtube/youtube.js";
import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import searchHelper from "../../assets/javascripts/helpers/search.js";
import translateHelper from "../../assets/javascripts/helpers/translate/translate.js";
import mapsHelper from "../../assets/javascripts/helpers/maps.js";
import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import mediumHelper from "../../assets/javascripts/helpers/medium.js";
import imgurHelper from "../../assets/javascripts/helpers/imgur.js";
import tiktokHelper from "../../assets/javascripts/helpers/tiktok.js";
import pixivHelper from "../../assets/javascripts/helpers/pixiv.js";
import sendTargetsHelper from "../../assets/javascripts/helpers/sendTargets.js";
import generalHelper from "../../assets/javascripts/helpers/general.js";
import youtubeMusicHelper from "../../assets/javascripts/helpers/youtubeMusic.js";

window.browser = window.browser || window.chrome;

async function wholeInit() {
  await youtubeHelper.init()
  await youtubeMusicHelper.init()
  await twitterHelper.init()
  await instagramHelper.init()
  await mapsHelper.init()
  await searchHelper.init()
  await translateHelper.init()
  await mediumHelper.init()
  await redditHelper.init()
  await wikipediaHelper.init()
  await imgurHelper.init()
  await tiktokHelper.init()
  await pixivHelper.init()
  await sendTargetsHelper.init()
  await generalHelper.init()
}
await wholeInit();

browser.storage.onChanged.addListener(wholeInit);

let BYPASSTABs = [];

browser.webRequest.onBeforeRequest.addListener(
  details => {
    // console.log("url", details.url);
    const url = new URL(details.url);
    let initiator;
    if (details.originUrl)
      initiator = new URL(details.originUrl);
    else if (details.initiator)
      initiator = new URL(details.initiator);

    var newUrl;

    if (!newUrl) newUrl = youtubeHelper.redirect(url, details, initiator)
    if (youtubeMusicHelper.isYoutubeMusic(url, initiator)) newUrl = youtubeMusicHelper.redirect(url, details.type)

    if (!newUrl) newUrl = twitterHelper.redirect(url, initiator);

    if (!newUrl) newUrl = instagramHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = mapsHelper.redirect(url, initiator);

    if (!newUrl) newUrl = redditHelper.redirect(url, details.type, initiator);

    if (mediumHelper.isMedium(url, initiator)) newUrl = mediumHelper.redirect(url, details.type);

    if (imgurHelper.isImgur(url, initiator)) newUrl = imgurHelper.redirect(url, details.type);

    if (tiktokHelper.isTiktok(url, initiator)) newUrl = tiktokHelper.redirect(url, details.type);

    if (!newUrl) newUrl = pixivHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = sendTargetsHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = translateHelper.redirect(url);

    if (!newUrl) newUrl = searchHelper.redirect(url)

    if (!newUrl) newUrl = wikipediaHelper.redirect(url);

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

browser.webRequest.onResponseStarted.addListener(
  details => {
    let autoRedirect = generalHelper.getAutoRedirect();

    if (!autoRedirect) return null;

    console.log("statusCode", details.statusCode);
    if (details.type == 'main_frame' && details.statusCode >= 500) {

      const url = new URL(details.url);
      let newUrl;

      newUrl = youtubeHelper.changeInstance(url);
      if (!newUrl) newUrl = twitterHelper.changeInstance(url);

      if (!newUrl) newUrl = instagramHelper.changeInstance(url);

      if (!newUrl) newUrl = redditHelper.changeInstance(url);

      if (!newUrl) newUrl = searchHelper.changeInstance(url);

      if (!newUrl) newUrl = translateHelper.changeInstance(url);

      if (!newUrl) newUrl = mediumHelper.changeInstance(url);

      if (!newUrl) newUrl = imgurHelper.changeInstance(url);

      if (!newUrl) newUrl = wikipediaHelper.changeInstance(url)

      if (newUrl) {
        browser.tabs.update({ url: '/pages/errors/instance_offline.html' });
        setTimeout(() => browser.tabs.update({ url: newUrl }), 2000);
      }
    }
  },
  { urls: ["<all_urls>"], }
)

browser.tabs.onUpdated.addListener(
  (tabId, changeInfo, _) => {
    let url;
    try { url = new URL(changeInfo.url); }
    catch (_) { return }
    if (youtubeHelper.isPipedorInvidious(url, 'main_frame', 'piped')) youtubeHelper.initPipedLocalStorage(tabId);
    if (youtubeHelper.isPipedorInvidious(url, 'main_frame', 'pipedMaterial')) youtubeHelper.initPipedMaterialLocalStorage(tabId);
    if (translateHelper.isTranslateRedirects(url, 'main_frame', 'lingva')) translateHelper.initLingvaLocalStorage(tabId);
    if (instagramHelper.isBibliogram(url)) instagramHelper.initBibliogramCookies(url);
    // if (changeInfo.url && youtubeHelper.isPipedorInvidious(url, 'main_frame', 'pipedMaterial')) youtubeHelper.initPipedMaterialLocalStorage(tabId);
  });
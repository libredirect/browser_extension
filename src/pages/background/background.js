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
import peertubeHelper from "../../assets/javascripts/helpers/peertube.js";
import lbryHelper from "../../assets/javascripts/helpers/lbry.js";
import spotifyHelper from "../../assets/javascripts/helpers/spotify.js";
import generalHelper from "../../assets/javascripts/helpers/general.js";
import youtubeMusicHelper from "../../assets/javascripts/helpers/youtubeMusic.js";

window.browser = window.browser || window.chrome;

async function wholeInit() {
  await youtubeHelper.init();
  await youtubeMusicHelper.init();
  await twitterHelper.init();
  await instagramHelper.init();
  await mapsHelper.init();
  await searchHelper.init();
  await translateHelper.init();
  await mediumHelper.init();
  await redditHelper.init();
  await wikipediaHelper.init();
  await imgurHelper.init();
  await tiktokHelper.init();
  await pixivHelper.init();
  await sendTargetsHelper.init();
  await peertubeHelper.init();
  await lbryHelper.init();
  await spotifyHelper.init();
  await generalHelper.init();
}
await wholeInit();

browser.storage.onChanged.addListener(wholeInit);

let BYPASSTABs = [];

browser.webRequest.onBeforeRequest.addListener(
  details => {
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

    if (!newUrl) newUrl = mediumHelper.redirect(url, details.type, initiator);

    if (imgurHelper.isImgur(url, initiator)) newUrl = imgurHelper.redirect(url, details.type);

    if (tiktokHelper.isTiktok(url, initiator)) newUrl = tiktokHelper.redirect(url, details.type);

    if (!newUrl) newUrl = pixivHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = sendTargetsHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = peertubeHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = lbryHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = spotifyHelper.redirect(url, details.type, initiator);

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
        // let wewe = new URL(newUrl);
        // console.log("wewe", wewe.search);
        // console.log("path", wewe.pathname);
        // console.log("searchParams", wewe.searchParams);
        return { redirectUrl: newUrl };
      }
    }
    return null;
  },
  { urls: ["<all_urls>"], },
  ["blocking"]
);

browser.tabs.onRemoved.addListener(
  tabId => {
    let i = BYPASSTABs.indexOf(tabId);
    if (i > -1) {
      BYPASSTABs.splice(i, 1);
      console.log("Removed BYPASSTABs", tabId);
    }
  }
);

browser.webRequest.onResponseStarted.addListener(
  details => {
    if (!generalHelper.getAutoRedirect()) return null;

    if (details.type == 'main_frame' && (details.statusCode == 503 || details.statusCode == 504)) {
      // if (details.type == 'main_frame' && details.statusCode >= 200) {
      console.log("statusCode", details.statusCode);

      const url = new URL(details.url);
      let newUrl;

      newUrl = youtubeHelper.switchInstance(url);
      if (!newUrl) newUrl = twitterHelper.switchInstance(url);

      if (!newUrl) newUrl = instagramHelper.switchInstance(url);

      if (!newUrl) newUrl = redditHelper.switchInstance(url);

      if (!newUrl) newUrl = searchHelper.switchInstance(url);

      if (!newUrl) newUrl = translateHelper.switchInstance(url);

      if (!newUrl) newUrl = mediumHelper.switchInstance(url);

      if (!newUrl) newUrl = imgurHelper.switchInstance(url);

      if (!newUrl) newUrl = wikipediaHelper.switchInstance(url);

      if (!newUrl) newUrl = peertubeHelper.switchInstance(url);

      if (!newUrl) newUrl = lbryHelper.switchInstance(url);

      if (!newUrl) newUrl = spotifyHelper.switchInstance(url);

      if (newUrl) browser.tabs.update(details.tabId, { url: `/pages/errors/instance_offline.html?url=${encodeURIComponent(newUrl)}` });

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

function changeWholeInstance(url) {
  let newUrl = youtubeHelper.switchInstance(url);

  if (!newUrl) newUrl = twitterHelper.switchInstance(url);

  if (!newUrl) newUrl = instagramHelper.switchInstance(url);

  if (!newUrl) newUrl = redditHelper.switchInstance(url);

  if (!newUrl) newUrl = searchHelper.switchInstance(url);

  if (!newUrl) newUrl = translateHelper.switchInstance(url);

  if (!newUrl) newUrl = mediumHelper.switchInstance(url);

  if (!newUrl) newUrl = sendTargetsHelper.switchInstance(url);

  if (!newUrl) newUrl = peertubeHelper.switchInstance(url);

  if (!newUrl) newUrl = imgurHelper.switchInstance(url);

  if (!newUrl) newUrl = wikipediaHelper.switchInstance(url);

  return newUrl;
}

browser.commands.onCommand.addListener(
  command => {
    if (command === 'switchInstance')
      chrome.tabs.query(
        { active: true, currentWindow: true },
        tabs => {
          let url;
          try { url = new URL(tabs[0].url); }
          catch (_) { return }
          let newUrl = changeWholeInstance(url);
          if (newUrl) browser.tabs.update({ url: newUrl });
        }
      );
  }
)

browser.menus.create({
  id: "settings",
  title: "Settings",
  contexts: ["browser_action"]
});

browser.menus.create({
  id: "switchInstance",
  title: "Switch Instance",
  contexts: ["browser_action"]
});

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == 'switchInstance') {
    let url;
    try { url = new URL(tab.url); }
    catch (_) { return }
    let newUrl = changeWholeInstance(url);
    if (newUrl) browser.tabs.update({ url: newUrl });
  }
  else if (info.menuItemId == 'settings')
    browser.runtime.openOptionsPage()
});
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
import sendTargetsHelper from "../../assets/javascripts/helpers/sendTargets.js";
import peertubeHelper from "../../assets/javascripts/helpers/peertube.js";
import lbryHelper from "../../assets/javascripts/helpers/lbry.js";

import generalHelper from "../../assets/javascripts/helpers/general.js";
import youtubeMusicHelper from "../../assets/javascripts/helpers/youtubeMusic.js";

window.browser = window.browser || window.chrome;

browser.runtime.onInstalled.addListener(async details => {
  if (details.reason == 'install') {
    fetch('/instances/cloudflare.json').then(response => response.text()).then(async data => {
      await browser.storage.local.set({ cloudflareList: JSON.parse(data) })
      youtubeHelper.initDefaults();
      youtubeMusicHelper.initDefaults();
      twitterHelper.initDefaults();
      instagramHelper.initDefaults();
      mapsHelper.initDefaults();
      searchHelper.initDefaults();
      translateHelper.initDefaults();
      mediumHelper.initDefaults();
      redditHelper.initDefaults();
      wikipediaHelper.initDefaults();
      imgurHelper.initDefaults();
      tiktokHelper.initDefaults();
      sendTargetsHelper.initDefaults();
      peertubeHelper.initDefaults();
      lbryHelper.initDefaults();
    })
  }
})

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
  await sendTargetsHelper.init();
  await peertubeHelper.init();
  await lbryHelper.init();
  await generalHelper.init();
}

let incognitoInit = false;
browser.tabs.onCreated.addListener(
  tab => {
    if (!incognitoInit && tab.incognito) {
      browser.tabs.create({
        url: browser.extension.getURL("/pages/background/incognito.html"),
      });
      incognitoInit = true;
    }
  });


let BYPASSTABs = [];

browser.webRequest.onBeforeRequest.addListener(
  async details => {
    await wholeInit();
    const url = new URL(details.url);
    // console.info("url:", url.href, "type:", details.type);
    let initiator;
    if (details.originUrl)
      initiator = new URL(details.originUrl);
    else if (details.initiator)
      initiator = new URL(details.initiator);

    let newUrl;

    if (!newUrl) newUrl = youtubeHelper.redirect(url, details, initiator)
    if (youtubeMusicHelper.isYoutubeMusic(url, initiator)) newUrl = youtubeMusicHelper.redirect(url, details.type)

    if (!newUrl) newUrl = twitterHelper.redirect(url, initiator);

    if (!newUrl) newUrl = instagramHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = await mapsHelper.redirect(url, initiator);

    if (!newUrl) newUrl = redditHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = mediumHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = imgurHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = tiktokHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = sendTargetsHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = peertubeHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = lbryHelper.redirect(url, details.type, initiator);

    if (!newUrl) newUrl = translateHelper.redirect(url);

    if (!newUrl) newUrl = searchHelper.redirect(url)

    if (!newUrl) newUrl = wikipediaHelper.redirect(url);

    if (
      details.frameAncestors && details.frameAncestors.length > 0 &&
      generalHelper.isException(new URL(details.frameAncestors[0].url))
    ) newUrl = null;

    if (generalHelper.isException(url)) newUrl = 'BYPASSTAB';

    if (BYPASSTABs.includes(details.tabId)) newUrl = null;

    if (newUrl) {
      if (newUrl === 'CANCEL') {
        console.log(`Canceled ${url}`);
        return { cancel: true };
      }
      else if (newUrl === 'BYPASSTAB') {
        console.log(`Bybassed ${details.tabId} ${url}`);
        if (!BYPASSTABs.includes(details.tabId)) BYPASSTABs.push(details.tabId);
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

browser.tabs.onRemoved.addListener(
  tabId => {
    let i = BYPASSTABs.indexOf(tabId);
    if (i > -1) {
      BYPASSTABs.splice(i, 1);
      console.log("Removed BYPASSTABs", tabId);
    }
  }
);

browser.webRequest.onHeadersReceived.addListener(
  async e => {
    await wholeInit();
    return twitterHelper.removeXFrameOptions(e);
  },
  { urls: ["<all_urls>"], },
  ["blocking", "responseHeaders"]
);

async function redirectOfflineInstance(url, tabId) {
  await wholeInit();
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

  if (newUrl) {
    if (counter >= 5) {
      browser.tabs.update(tabId, { url: `/pages/errors/instance_offline.html?url=${encodeURIComponent(newUrl)}` });
      counter = 0;
    } else {
      browser.tabs.update(tabId, { url: newUrl });
      counter++;
    }
  }
}
let counter = 0;
browser.webRequest.onResponseStarted.addListener(
  details => {
    if (!generalHelper.getAutoRedirect()) return null;

    console.log('details.statusCode', details.statusCode);
    if (details.type == 'main_frame' && (details.statusCode == 502 || details.statusCode == 503 || details.statusCode == 504)) {
      // if (details.type == 'main_frame' && details.statusCode >= 200) {
      // console.log("statusCode", details.statusCode);
      const url = new URL(details.url);
      redirectOfflineInstance(url, details.tabId);
    }
  },
  { urls: ["<all_urls>"], }
)

browser.webRequest.onErrorOccurred.addListener(
  details => {
    if (!generalHelper.getAutoRedirect()) return;
    if (details.type == 'main_frame') {
      const url = new URL(details.url);
      redirectOfflineInstance(url, details.tabId);
    }
  },
  { urls: ["<all_urls>"], }
)

browser.tabs.onUpdated.addListener(
  async (tabId, changeInfo, _) => {
    await wholeInit();
    let url;
    try { url = new URL(changeInfo.url); }
    catch (_) { return }
    if (youtubeHelper.isPipedorInvidious(url, 'main_frame', 'piped')) youtubeHelper.initPipedLocalStorage(tabId);
    if (youtubeHelper.isPipedorInvidious(url, 'main_frame', 'pipedMaterial')) youtubeHelper.initPipedMaterialLocalStorage(tabId);
    if (translateHelper.isTranslateRedirects(url, 'main_frame', 'lingva')) translateHelper.initLingvaLocalStorage(tabId);
    if (instagramHelper.isBibliogram(url)) instagramHelper.initBibliogramCookies(url);
    // if (changeInfo.url && youtubeHelper.isPipedorInvidious(url, 'main_frame', 'pipedMaterial')) youtubeHelper.initPipedMaterialLocalStorage(tabId);
  }
);

async function changeWholeInstance(url) {
  await wholeInit();
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
      browser.tabs.query(
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

browser.contextMenus.create({
  id: "settings",
  title: browser.i18n.getMessage("Settings"),
  contexts: ["browser_action"]
});

browser.contextMenus.create({
  id: "switchInstance",
  title: chrome.i18n.getMessage("switchInstance"),
  contexts: ["browser_action"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
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

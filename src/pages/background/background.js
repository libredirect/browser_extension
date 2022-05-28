"use strict";

import generalHelper from "../../assets/javascripts/helpers/general.js";
import utils from "../../assets/javascripts/helpers/utils.js";

import youtubeHelper from "../../assets/javascripts/helpers/youtube/youtube.js";
import youtubeMusicHelper from "../../assets/javascripts/helpers/youtubeMusic.js";
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

window.browser = window.browser || window.chrome;

browser.runtime.onInstalled.addListener(
  async details => {
    if (details.reason == 'install') {
      fetch('/instances/blocklist.json').then(response => response.text()).then(async data => {
        await browser.storage.local.set({ cloudflareList: JSON.parse(data) })
        generalHelper.initDefaults();
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
  }
)

youtubeHelper.setInvidiousCookies();
translateHelper.setSimplyTranslateCookies();
twitterHelper.setNitterCookies();
wikipediaHelper.setWikilessCookies();
searchHelper.setSearxCookies();
searchHelper.setSearxngCookies();
redditHelper.setLibredditCookies();
redditHelper.setTedditCookies();
tiktokHelper.setProxiTokCookies();

let incognitoInit = false;
browser.tabs.onCreated.addListener(
  tab => {
    if (!incognitoInit && tab.incognito) {
      browser.tabs.create({
        url: browser.extension.getURL("/pages/background/incognito.html"),
      });
      incognitoInit = true;
    }
  }
);

let BYPASSTABs = [];
browser.webRequest.onBeforeRequest.addListener(
  details => {
    const url = new URL(details.url);
    if (new RegExp(/^chrome-extension:\/{2}.*\/instances\/(blocklist|data).json$/).test(url.href) && details.type == 'xmlhttprequest') return;
    let initiator;
    try {
      if (details.originUrl) initiator = new URL(details.originUrl);
      else if (details.initiator) initiator = new URL(details.initiator);
    }
    catch { return null; }


    let newUrl = youtubeMusicHelper.redirect(url, details.type)
    if (!newUrl) newUrl = youtubeHelper.redirect(url, details, initiator)
    if (!newUrl) newUrl = twitterHelper.redirect(url, initiator);
    if (!newUrl) newUrl = instagramHelper.redirect(url, details.type, initiator);
    if (!newUrl) newUrl = mapsHelper.redirect(url, initiator);
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
      if (newUrl === 'BYPASSTAB') {
        console.log(`Bypassed ${details.tabId} ${url}`);
        if (!BYPASSTABs.includes(details.tabId)) BYPASSTABs.push(details.tabId);
        return null;
      }
      console.info("Redirecting", url.href, "=>", newUrl);
      return { redirectUrl: newUrl };
    }
    return null;
  },
  { urls: ["<all_urls>"], },
  ["blocking"]
);

browser.tabs.onRemoved.addListener(
  tabId => {
    const i = BYPASSTABs.indexOf(tabId);
    if (i > -1) {
      BYPASSTABs.splice(i, 1);
      console.log("Removed BYPASSTABs", tabId);
    }
  }
);

browser.webRequest.onHeadersReceived.addListener(
  async e => {
    let response = twitterHelper.removeXFrameOptions(e)
    if (!response) youtubeHelper.removeXFrameOptions(e)
    return response;
  },
  { urls: ["<all_urls>"], },
  ["blocking", "responseHeaders"]
);

async function redirectOfflineInstance(url, tabId) {
  let newUrl = await youtubeHelper.switchInstance(url);
  if (!newUrl) newUrl = await twitterHelper.switchInstance(url);
  if (!newUrl) newUrl = await instagramHelper.switchInstance(url);
  if (!newUrl) newUrl = await redditHelper.switchInstance(url);
  if (!newUrl) newUrl = await searchHelper.switchInstance(url);
  if (!newUrl) newUrl = await translateHelper.switchInstance(url);
  if (!newUrl) newUrl = await mediumHelper.switchInstance(url);
  if (!newUrl) newUrl = await imgurHelper.switchInstance(url);
  if (!newUrl) newUrl = await wikipediaHelper.switchInstance(url);
  if (!newUrl) newUrl = await peertubeHelper.switchInstance(url);
  if (!newUrl) newUrl = await lbryHelper.switchInstance(url);

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

function isAutoRedirect() {
  return new Promise(resolve => {
    browser.storage.local.get('autoRedirect',
      r => {
        if (r.autoRedirect == true) resolve(true)
        else resolve(false)
      }
    )
  })
}

browser.webRequest.onResponseStarted.addListener(
  async details => {
    if (!await isAutoRedirect()) return null;
    if (details.type == 'main_frame' && details.statusCode >= 500) redirectOfflineInstance(new URL(details.url), details.tabId);
  },
  { urls: ["<all_urls>"], }
)

browser.webRequest.onErrorOccurred.addListener(
  async details => {
    if (!await isAutoRedirect()) return;
    if (details.type == 'main_frame') redirectOfflineInstance(new URL(details.url), details.tabId);
  },
  { urls: ["<all_urls>"], }
)

browser.commands.onCommand.addListener(
  command => {
    if (command === 'switchInstance') utils.switchInstance();
    else if (command == 'copyRaw') utils.copyRaw();
    else if (command == 'unify') utils.unify();
  }
)

browser.contextMenus.create({
  id: "settings",
  title: browser.i18n.getMessage("Settings"),
  contexts: ["browser_action"]
});

browser.contextMenus.create({
  id: "switchInstance",
  title: browser.i18n.getMessage("switchInstance"),
  contexts: ["browser_action"]
});

browser.contextMenus.create({
  id: "copyRaw",
  title: "Copy Raw",
  contexts: ["browser_action"]
});

browser.contextMenus.create({
  id: "unify",
  title: "Unify",
  contexts: ["browser_action"]
});


browser.contextMenus.onClicked.addListener(
  (info) => {
    if (info.menuItemId == 'switchInstance') utils.switchInstance();
    else if (info.menuItemId == 'settings') browser.runtime.openOptionsPage()
    else if (info.menuItemId == 'copyRaw') utils.copyRaw();
    else if (info.menuItemId == 'unify') utils.unify();
  }
);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.function === 'unify') utils.unify(false).then(r => sendResponse({ response: r }))
  return true;
});
"use strict";
window.browser = window.browser || window.chrome;

import commonHelper from "../../assets/javascripts/helpers/common.js";
import youtubeHelper from "../../assets/javascripts/helpers/youtube/youtube.js";
import youtubeMusicHelper from "../../assets/javascripts/helpers/youtubeMusic.js";
import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import mapsHelper from "../../assets/javascripts/helpers/maps.js";
import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import searchHelper from "../../assets/javascripts/helpers/search.js";
import translateHelper from "../../assets/javascripts/helpers/translate/translate.js";
import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import mediumHelper from "../../assets/javascripts/helpers/medium.js";
import imgurHelper from "../../assets/javascripts/helpers/imgur.js";
import tiktokHelper from "../../assets/javascripts/helpers/tiktok.js";
import sendTargetsHelper from "../../assets/javascripts/helpers/sendTargets.js";
import peertubeHelper from "../../assets/javascripts/helpers/peertube.js";
import lbryHelper from "../../assets/javascripts/helpers/lbry.js";
import generalHelper from "../../assets/javascripts/helpers/general.js";

let disableTwitterElement = document.getElementById("disable-nitter");
let disableYoutubeElement = document.getElementById("disable-youtube");
let disableYoutubeMusicElement = document.getElementById("disable-youtubeMusic");
let disableInstagramElement = document.getElementById("disable-bibliogram");
let disableMapsElement = document.getElementById("disable-osm");
let disableRedditElement = document.getElementById("disable-reddit");
let disableSearchElement = document.getElementById("disable-search");
let disableElement = document.getElementById("disable-simplyTranslate");
let disableWikipediaElement = document.getElementById("disable-wikipedia");
let disableMediumElement = document.getElementById("disable-medium");
let disablePeertubeElement = document.getElementById("disable-peertube");
let disableLbryElement = document.getElementById("disable-lbry");
let disableSendTargetsElement = document.getElementById("disable-sendTargets");
let disableImgurElement = document.getElementById("disable-imgur");
let disableTiktokElement = document.getElementById("disable-tiktok");

let copyRawElement = document.getElementById('copy_raw');
let unifyElement = document.getElementById('unify');

browser.storage.local.get(
  [
    "disableTwitter",
    "disableYoutube",
    "disableYoutubeMusic",
    "disableInstagram",
    "disableMaps",
    "disableReddit",
    "disableSearch",
    "translateDisable",
    "disableWikipedia",
    "disableImgur",
    "disableTiktok",
    "disableMedium",
    "disablePeertubeTargets",
    "disableLbryTargets",
    "disableSendTarget",
  ],
  r => {
    disableTwitterElement.checked = !r.disableTwitter;
    disableYoutubeElement.checked = !r.disableYoutube;
    disableYoutubeMusicElement.checked = !r.disableYoutubeMusic;
    disableInstagramElement.checked = !r.disableInstagram;
    disableMapsElement.checked = !r.disableMaps;
    disableRedditElement.checked = !r.disableReddit;
    disableSearchElement.checked = !r.disableSearch;
    disableElement.checked = !r.translateDisable;
    disableWikipediaElement.checked = !r.disableWikipedia;
    disableImgurElement.checked = !r.disableImgur;
    disableTiktokElement.checked = !r.disableTiktok;
    disableMediumElement.checked = !r.disableMedium;
    disablePeertubeElement.checked = !r.disablePeertubeTargets;
    disableLbryElement.checked = !r.disableLbryTargets;
    disableSendTargetsElement.checked = r.disableSendTarget;
  }
)

document.addEventListener("change", () => {
  browser.storage.local.set({
    disableTwitter: !disableTwitterElement.checked,
    disableYoutube: !disableYoutubeElement.checked,
    disableYoutubeMusic: !disableYoutubeMusicElement.checked,
    disableInstagram: !disableInstagramElement.checked,
    disableMaps: !disableMapsElement.checked,
    disableReddit: !disableRedditElement.checked,
    disableSearch: !disableSearchElement.checked,
    translateDisable: !disableElement.checked,
    disableWikipedia: !disableWikipediaElement.checked,
    disableImgur: !disableImgurElement.checked,
    disableTiktok: !disableTiktokElement.checked,
    disableMedium: !disableMediumElement.checked,
    disablePeertubeTargets: !disablePeertubeElement.checked,
    disableLbryTargets: !disableLbryElement.checked,
    disableSendTarget: !disableSendTargetsElement.checked,
  });
})

let changeInstanceElement = document.getElementById("change-instance")
changeInstanceElement.addEventListener("click", switchInstance);
copyRawElement.addEventListener("click", copyRaw);
document.getElementById("more-options").addEventListener("click", () => browser.runtime.openOptionsPage());
unifyElement.addEventListener("click", unify)

function unify() {
  browser.tabs.query(
    { active: true, currentWindow: true },
    async tabs => {
      let currTab = tabs[0]
      if (currTab) {
        let url = new URL(currTab.url);

        let result = await youtubeHelper.initInvidiousCookies(url);
        if (!result) result = await youtubeHelper.initPipedLocalStorage(url, currTab.id);
        if (!result) result = await youtubeHelper.initPipedMaterialLocalStorage(url, currTab.id);

        if (!result) result = await twitterHelper.initNitterCookies(url);

        if (!result) result = await redditHelper.initLibredditCookies(url);
        if (!result) result = await redditHelper.initTedditCookies(url);

        if (!result) result = await searchHelper.initSearxCookies(url);
        if (!result) result = await searchHelper.initSearxngCookies(url);

        if (!result) result = await tiktokHelper.initProxiTokCookies(url);

        if (!result) result = await wikipediaHelper.initWikilessCookies(url);

        if (!result) result = await translateHelper.initSimplyTranslateCookies(url);
        if (!result) result = await translateHelper.initLingvaLocalStorage(url);

        if (result) {
          const textElement = unifyElement.getElementsByTagName('h4')[0]
          const oldHtml = textElement.innerHTML;
          textElement.innerHTML = 'Unified';
          setTimeout(() => textElement.innerHTML = oldHtml, 1000);
        }
      }
    }
  )
}

function switchInstance() {
  browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
    let currTab = tabs[0];
    if (currTab) {
      let url = new URL(currTab.url);
      let newUrl;

      // newUrl = youtubeHelper.switchInstance(url);
      // if (!newUrl) newUrl = twitterHelper.switchInstance(url);
      // if (!newUrl) newUrl = instagramHelper.switchInstance(url);
      if (!newUrl) newUrl = await redditHelper.switchInstance(url);
      // if (!newUrl) newUrl = searchHelper.switchInstance(url);
      // if (!newUrl) newUrl = translateHelper.switchInstance(url);
      // if (!newUrl) newUrl = mediumHelper.switchInstance(url);
      // if (!newUrl) newUrl = sendTargetsHelper.switchInstance(url);
      // if (!newUrl) newUrl = peertubeHelper.switchInstance(url);
      // if (!newUrl) newUrl = lbryHelper.switchInstance(url);
      // if (!newUrl) newUrl = imgurHelper.switchInstance(url);
      // if (!newUrl) newUrl = wikipediaHelper.switchInstance(url);

      if (newUrl) {
        browser.tabs.update({ url: newUrl });
        return true;
      }
    }
  })
  return false;
}

function copyRaw() {
  browser.tabs.query(
    { active: true, currentWindow: true }, tabs => {
      let currTab = tabs[0];
      if (currTab) {
        let url = new URL(currTab.url);
        let newUrl;
        newUrl = youtubeHelper.reverse(url);

        if (!newUrl) newUrl = twitterHelper.reverse(url);
        if (!newUrl) newUrl = instagramHelper.reverse(url);
        if (!newUrl) newUrl = tiktokHelper.reverse(url);
        if (!newUrl) newUrl = imgurHelper.reverse(url);

        if (newUrl) {
          navigator.clipboard.writeText(newUrl);
          const textElement = copyRawElement.getElementsByTagName('h4')[0]
          const oldHtml = textElement.innerHTML;
          textElement.innerHTML = 'Copied';
          setTimeout(() => textElement.innerHTML = oldHtml, 1000);
        }
      }
    }
  )
}

let popupFrontends;
generalHelper.init().then(() => {
  popupFrontends = generalHelper.getPopupFrontends();

  for (const frontend of generalHelper.allPopupFrontends)
    if (!popupFrontends.includes(frontend))
      document.getElementById(frontend).classList.add("hide")
    else
      document.getElementById(frontend).classList.remove("hide")
});
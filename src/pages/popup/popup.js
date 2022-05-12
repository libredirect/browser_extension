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


document.getElementById("more-options").addEventListener("click",
  () => browser.runtime.openOptionsPage()
);

function switchInstance() {
  browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
    let currTab = tabs[0];
    if (currTab) {
      let url = currTab.url;
      let tabUrl
      try { tabUrl = new URL(url); }
      catch (_) { return false; }
      let newUrl;

      // newUrl = youtubeHelper.switchInstance(tabUrl);
      // if (!newUrl) newUrl = twitterHelper.switchInstance(tabUrl);
      // if (!newUrl) newUrl = instagramHelper.switchInstance(tabUrl);
      if (!newUrl) newUrl = await redditHelper.switchInstance(tabUrl);
      // if (!newUrl) newUrl = searchHelper.switchInstance(tabUrl);
      // if (!newUrl) newUrl = translateHelper.switchInstance(tabUrl);
      // if (!newUrl) newUrl = mediumHelper.switchInstance(tabUrl);
      // if (!newUrl) newUrl = sendTargetsHelper.switchInstance(tabUrl);
      // if (!newUrl) newUrl = peertubeHelper.switchInstance(tabUrl);
      // if (!newUrl) newUrl = lbryHelper.switchInstance(tabUrl);
      // if (!newUrl) newUrl = imgurHelper.switchInstance(tabUrl);
      // if (!newUrl) newUrl = wikipediaHelper.switchInstance(tabUrl);

      if (newUrl) {
        browser.tabs.update({ url: newUrl });
        return true;
      }
    }
  })
  return false;
}

function copyRaw() {
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currTab = tabs[0];
    if (currTab) {
      let url = currTab.url;
      let tabUrl
      try { tabUrl = new URL(url); }
      catch (_) { return false; }
      let newUrl;
      newUrl = youtubeHelper.reverse(tabUrl);
      if (!newUrl) newUrl = twitterHelper.reverse(tabUrl);
      if (!newUrl) newUrl = instagramHelper.reverse(tabUrl);
      if (!newUrl) newUrl = tiktokHelper.reverse(tabUrl);
      if (!newUrl) newUrl = imgurHelper.reverse(tabUrl);
      if (newUrl) {
        navigator.clipboard.writeText(newUrl);
        const oldHtml = copyRawElement.innerHTML;
        copyRawElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
        Copied`;
        setTimeout(() => copyRawElement.innerHTML = oldHtml, 1000);
      }
    }
  })
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
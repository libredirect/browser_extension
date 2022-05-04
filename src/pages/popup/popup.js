"use strict";

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
import pixivHelper from "../../assets/javascripts/helpers/pixiv.js";
import spotifyHelper from "../../assets/javascripts/helpers/spotify.js";
import sendTargetsHelper from "../../assets/javascripts/helpers/sendTargets.js";
import peertubeHelper from "../../assets/javascripts/helpers/peertube.js";
import lbryHelper from "../../assets/javascripts/helpers/lbry.js";
import generalHelper from "../../assets/javascripts/helpers/general.js";

import { setHandler, toKebabCase } from "./util.js";

const { runtime, storage, tabs } = window.browser || window.chrome;

const SWITCHES = [
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
  "disablePixiv",
  "disableSpotifyTargets",
  "disableMedium",
  "disablePeertubeTargets",
  "disableLbryTargets",
  "disableSendTarget",
];

const POPUP_EVENTS = [
  {
    id: "more-options",
    type: "click",
    listener: () => runtime.openOptionsPage(),
  },
  {
    id: "change-instance",
    type: "click",
    listener: switchInstance,
  },
  {
    id: "copy_raw",
    type: "click",
    listener: copyRaw,
  }
];

function switchInstance() {
  tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currTab = tabs[0];
    if (currTab) {
      let url = currTab.url;
      let tabUrl
      try { tabUrl = new URL(url); }
      catch (_) { return false; }
      let newUrl;

      newUrl = youtubeHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = twitterHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = instagramHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = redditHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = searchHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = translateHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = mediumHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = sendTargetsHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = peertubeHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = lbryHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = imgurHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = wikipediaHelper.switchInstance(tabUrl);

      if (newUrl) {
        tabs.update({ url: newUrl });
        return true;
      }
    }
  })
  return false;
}

function copyRaw() {
  tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
        const copyRawElement = document.getElementById("copy_raw");
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

const checkInput = (name, checked) => {
  const listener = async ({ target }) => {
    const service = Object.create(null);
    service[name] = target.checked;
    await storage.local.set(service);
  };
  const id = toKebabCase(name);
  const input = setHandler({ id, type: "change", listener });
  if (input) input.checked = !!checked;
};

(async () => {
  const inputs = await storage.local.get(SWITCHES);
  for (const input of Object.entries(inputs)) checkInput(...input);

  for (const event of POPUP_EVENTS) setHandler(event);

  await generalHelper.init();
  const { allPopupFrontends, getPopupFrontends } = generalHelper;
  const popupFrontends = getPopupFrontends();
  for (const frontend of allPopupFrontends) {
    const element = document.getElementById(frontend);
    if (!element) continue;
    const method = popupFrontends.includes(frontend) ? "remove" : "add";
    element.classList[method]("hide");
  }
})();

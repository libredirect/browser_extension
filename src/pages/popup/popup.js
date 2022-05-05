"use strict";

import generalHelper from "../../assets/javascripts/helpers/general.js";

import imgur from "../../assets/javascripts/helpers/imgur.js";
import instagram from "../../assets/javascripts/helpers/instagram.js";
import lbry from "../../assets/javascripts/helpers/lbry.js";
import maps from "../../assets/javascripts/helpers/maps.js";
import medium from "../../assets/javascripts/helpers/medium.js";
import peertube from "../../assets/javascripts/helpers/peertube.js";
import pixiv from "../../assets/javascripts/helpers/pixiv.js";
import reddit from "../../assets/javascripts/helpers/reddit.js";
import search from "../../assets/javascripts/helpers/search.js";
import sendTargets from "../../assets/javascripts/helpers/sendTargets.js";
import spotify from "../../assets/javascripts/helpers/spotify.js";
import tiktok from "../../assets/javascripts/helpers/tiktok.js";
import translate from "../../assets/javascripts/helpers/translate/translate.js";
import twitter from "../../assets/javascripts/helpers/twitter.js";
import wikipedia from "../../assets/javascripts/helpers/wikipedia.js";
import youtube from "../../assets/javascripts/helpers/youtube/youtube.js";
import youtubeMusic from "../../assets/javascripts/helpers/youtubeMusic.js";

import { setHandler, toKebabCase } from "./util.js";

const { runtime, storage, tabs } = window.browser || window.chrome;

const SERVICES = {
  imgur,
  instagram,
  lbry,
  maps,
  medium,
  peertube,
  pixiv,
  reddit,
  search,
  sendTargets,
  spotify,
  tiktok,
  translate,
  twitter,
  wikipedia,
  youtube,
  youtubeMusic,
};

const SUFFIX = "disable-";

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

      newUrl = youtube.switchInstance(tabUrl);

      if (!newUrl) newUrl = twitter.switchInstance(tabUrl);

      if (!newUrl) newUrl = instagram.switchInstance(tabUrl);

      if (!newUrl) newUrl = reddit.switchInstance(tabUrl);

      if (!newUrl) newUrl = search.switchInstance(tabUrl);

      if (!newUrl) newUrl = translate.switchInstance(tabUrl);

      if (!newUrl) newUrl = medium.switchInstance(tabUrl);

      if (!newUrl) newUrl = sendTargets.switchInstance(tabUrl);

      if (!newUrl) newUrl = peertube.switchInstance(tabUrl);

      if (!newUrl) newUrl = lbry.switchInstance(tabUrl);

      if (!newUrl) newUrl = imgur.switchInstance(tabUrl);

      if (!newUrl) newUrl = wikipedia.switchInstance(tabUrl);

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
      newUrl = youtube.reverse(tabUrl);
      if (!newUrl) newUrl = twitter.reverse(tabUrl);
      if (!newUrl) newUrl = instagram.reverse(tabUrl);
      if (!newUrl) newUrl = tiktok.reverse(tabUrl);
      if (!newUrl) newUrl = imgur.reverse(tabUrl);
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
  const id = SUFFIX + toKebabCase(name);
  const input = setHandler({ id, type: "change", listener });
  if (input) input.checked = !!checked;
};

(async () => {
  const serviceKeys = Object.keys(SERVICES);
  const services = await storage.local.get(serviceKeys);
  for (const key of serviceKeys) {
    const value = services[key] ?? true;
    checkInput(key, value);
  }

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

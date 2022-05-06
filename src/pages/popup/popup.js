"use strict";

import generalHelper from "../../assets/javascripts/helpers/general.js";

import imgur from "../../assets/javascripts/helpers/imgur.js";
import instagram from "../../assets/javascripts/helpers/instagram.js";
import lbry from "../../assets/javascripts/helpers/lbry.js";
import medium from "../../assets/javascripts/helpers/medium.js";
import peertube from "../../assets/javascripts/helpers/peertube.js";
import pixiv from "../../assets/javascripts/helpers/pixiv.js";
import privacyMaps from "../../assets/javascripts/helpers/maps.js";
import privacySearch from "../../assets/javascripts/helpers/search.js";
import privacyTranslate from "../../assets/javascripts/helpers/translate/translate.js";
import reddit from "../../assets/javascripts/helpers/reddit.js";
import sendfiles from "../../assets/javascripts/helpers/sendTargets.js";
import spotify from "../../assets/javascripts/helpers/spotify.js";
import tiktok from "../../assets/javascripts/helpers/tiktok.js";
import twitter from "../../assets/javascripts/helpers/twitter.js";
import wikipedia from "../../assets/javascripts/helpers/wikipedia.js";
import youtube from "../../assets/javascripts/helpers/youtube/youtube.js";
import youtubeMusic from "../../assets/javascripts/helpers/youtubeMusic.js";

import { isFunction, safeURL, setHandler, toKebabCase } from "./util.js";

const { runtime, storage, tabs } = window.browser || window.chrome;

const SERVICES = {
  imgur,
  instagram,
  lbry,
  privacyMaps,
  medium,
  peertube,
  pixiv,
  reddit,
  privacySearch,
  sendfiles,
  spotify,
  tiktok,
  privacyTranslate,
  twitter,
  wikipedia,
  youtube,
  youtubeMusic,
};

const switchInstance = async () => {
  const query = { active: true, currentWindow: true };
  const [ currentTab ] = await tabs.query(query);
  if (!currentTab) return false;
  const { url } = currentTab;
  if (!url) return false;
  const chunks = safeURL(url);
  const { host } = chunks;
  if (!host) return false;
  const serviceValue = Object.values(SERVICES);
  for (const { switchInstance } of serviceValue) {
    if (!isFunction(switchInstance)) continue;
    const instanceURL = switchInstance(chunks);
    if (!instanceURL) continue;
    tabs.update({ url: instanceURL });
    return true;
  }
};

const SUCCESS_SVG = `
<svg xmlns="http://www.w3.org/2000/svg"
height="24px"
viewBox="0 0 24 24"
width="24px"
fill="currentColor">
<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
</svg>`;

const copied = () => {
  const element = document.getElementById("copy-raw");
  const childs = element.cloneNode(true);
  element.innerHTML = SUCCESS_SVG + "Copied";
  setTimeout(() => element.replaceWith(childs), 1000);
};

const copyRaw = async () => {
  const query = { active: true, currentWindow: true };
  const [currentTab] = await tabs.query(query);
  if (!currentTab) return false;
  const { url } = currentTab;
  const chunks = safeURL(url);
  const { host } = chunks;
  if (!host) return false;
  const serviceValue = Object.values(SERVICES);
  for (const { reverse } of serviceValue) {
    if (!isFunction(reverse)) continue;
    const instanceURL = reverse(chunks);
    if (!instanceURL) continue;
    navigator.clipboard
      .writeText(instanceURL)
      .then(copied)
      .catch(console.error);
    return true;
  }
};

const SUFFIX = "disable-";

const POPUP_EVENTS = [
  {
    id: "more-options",
    type: "click",
    listener: () => runtime.openOptionsPage(),
  },
  {
    id: "switch-instance",
    type: "click",
    listener: switchInstance,
  },
  {
    id: "copy-raw",
    type: "click",
    listener: copyRaw,
  }
];

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

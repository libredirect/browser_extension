"use strict";

import commonHelper from './common.js'

window.browser = window.browser || window.chrome;

const targets = [
  "m.youtube.com",
  "youtube.com",
  "img.youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "s.ytimg.com",
  "music.youtube.com",
];
/*
    Please remember to also update the manifest.json file
    (content_scripts > matches, 'persist-invidious-prefs.js')
    when updating this list:
  */
let redirects = {
  "invidious": {
    "normal": [
      "https://invidious.snopyta.org",
      "https://invidious.xyz",
      "https://invidious.kavin.rocks",
      "https://tube.connect.cafe",
      "https://invidious.zapashcanon.fr",
      "https://invidiou.site",
      "https://vid.mint.lgbt",
      "https://invidious.site",
      "https://yewtu.be",
      "https://invidious.tube",
      "https://invidious.silkky.cloud",
      "https://invidious.himiko.cloud",
      "https://inv.skyn3t.in",
      "https://tube.incognet.io",
      "https://invidious.tinfoil-hat.net",
      "https://invidious.namazso.eu",
      "https://vid.puffyan.us",
      "https://dev.viewtube.io",
      "https://invidious.048596.xyz",
    ],
    "onion": [
      "http://fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad.onion",
      "http://qklhadlycap4cnod.onion",
      "http://c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid.onion",
      "http://w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd.onion",
    ]
  },
  "piped": {
    "normal": [
      "https://piped.kavin.rocks",
      "https://piped.silkky.cloud",
      "https://piped.tokhmi.xyz",
      "https://piped.mint.lgbt",
    ]
  }
};

const getRedirects = () => redirects;

function setInvidiousRedirects(val) {
  redirects.invidious = val;
  browser.storage.sync.set({ youtubeRedirects: redirects })
  console.log("invidiousRedirects: ", val)
}

function setPipedRedirects(val) {
  redirects.piped = val;
  browser.storage.sync.set({ youtubeRedirects: redirects })
  console.log("pipedRedirects: ", val)
}

let disableYoutube;
const getDisableYoutube = () => disableYoutube;
function setDisableYoutube(val) {
  disableYoutube = val;
  browser.storage.sync.set({ disableYoutube })
  console.log("disableYoutube: ", disableYoutube)
}

let invidiousInstance;
const getInvidiousInstance = () => invidiousInstance;
function setInvidiousInstance(val) {
  invidiousInstance = val;
  browser.storage.sync.set({ invidiousInstance })
  console.log("invidiousInstance: ", invidiousInstance)
}

let invidiousAlwaysProxy;
function setInvidiousAlwaysProxy(val) {
  invidiousAlwaysProxy = val;
  browser.storage.sync.set({ invidiousAlwaysProxy })
  console.log("invidiousAlwaysProxy: ", invidiousAlwaysProxy);
}
const getInvidiousAlwaysProxy = () => invidiousAlwaysProxy;

let invidiousOnlyEmbeddedVideo;
function setInvidiousOnlyEmbeddedVideo(val) {
  invidiousOnlyEmbeddedVideo = val;
  browser.storage.sync.set({ invidiousOnlyEmbeddedVideo })
  console.log("invidiousOnlyEmbeddedVideo: ", invidiousOnlyEmbeddedVideo)
}
const getInvidiousOnlyEmbeddedVideo = () => invidiousOnlyEmbeddedVideo;

let invidiousVideoQuality;
function setInvidiousVideoQuality(val) {
  invidiousVideoQuality = val;
  browser.storage.sync.set({ invidiousVideoQuality })
  console.log("invidiousVideoQuality: ", invidiousVideoQuality)
}
const getInvidiousVideoQuality = () => invidiousVideoQuality;

let invidiousDarkMode;
const getInvidiousDarkMode = () => invidiousDarkMode;
function setInvidiousDarkMode(val) {
  invidiousDarkMode = val;
  browser.storage.sync.set({ invidiousDarkMode })
  console.log("invidiousDarkMode: ", invidiousDarkMode)
}

let invidiousVolume;
const getInvidiousVolume = () => invidiousVolume;
function setInvidiousVolume(val) {
  invidiousVolume = val;
  browser.storage.sync.set({ invidiousVolume })
  console.log("invidiousVolume: ", invidiousVolume)
}

let invidiousPlayerStyle;
const getInvidiousPlayerStyle = () => invidiousPlayerStyle;
function setInvidiousPlayerStyle(val) {
  invidiousPlayerStyle = val;
  browser.storage.sync.set({ invidiousPlayerStyle })
  console.log("invidiousPlayerStyle: ", invidiousPlayerStyle)
}

let invidiousSubtitles;
let getInvidiousSubtitles = () => invidiousSubtitles;
function setInvidiousSubtitles(val) {
  invidiousSubtitles = val;
  browser.storage.sync.set({ invidiousSubtitles })
  console.log("invidiousSubtitles: ", invidiousSubtitles)
}

let invidiousAutoplay;
const getInvidiousAutoplay = () => invidiousAutoplay;
function setInvidiousAutoplay(val) {
  invidiousAutoplay = val;
  browser.storage.sync.set({ invidiousAutoplay })
  console.log("invidiousAutoplay: ", invidiousAutoplay)
}


let frontend;
const getFrontend = () => frontend;
function setFrontend(val) {
  frontend = val;
  browser.storage.sync.set({ youtubeFrontend: val })
  console.log("youtubeFrontend: ", val)
}

let useFreeTube;
function setUseFreeTube(val) {
  useFreeTube = val;
  browser.storage.sync.set({ useFreeTube })
  console.log("useFreeTube: ", useFreeTube)
}
const getUseFreeTube = () => useFreeTube;

let persistInvidiousPrefs;
function setPersistInvidiousPrefs(val) {
  persistInvidiousPrefs = val;
  browser.storage.sync.set({ persistInvidiousPrefs })
  console.log("persistInvidiousPrefs: ", persistInvidiousPrefs)
  if (persistInvidiousPrefs) initInvidiousCookie()
}
const getPersistInvidiousPrefs = () => persistInvidiousPrefs;

function isYoutube(url) {
  return targets.includes(url.host);
}

function getCookie() {
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf("PREFS=") == 0)
      return JSON.parse(
        decodeURIComponent(c.substring("PREFS=".length, c.length))
      );
  }
  return {};
}

function initInvidiousCookie() {
  const prefs = getCookie();
  prefs.local = invidiousAlwaysProxy;
  prefs.quality = invidiousVideoQuality;
  prefs.dark_mode = invidiousDarkMode;
  document.cookie = `PREFS=${encodeURIComponent(JSON.stringify(prefs))}`;
}

async function init() {
  let result = await browser.storage.sync.get(
    [
      "invidiousAlwaysProxy",
      "invidiousVideoQuality",
      "invidiousDarkMode",
      "persistInvidiousPrefs",
      "disableYoutube",
      "invidiousInstance",
      "invidiousAlwaysProxy",
      "invidiousOnlyEmbeddedVideo",
      "invidiousVideoQuality",
      "invidiousDarkMode",
      "invidiousVolume",
      "invidiousPlayerStyle",
      "invidiousSubtitles",
      "invidiousAutoplay",
      "useFreeTube",
      "youtubeRedirects",
      "youtubeFrontend",
    ]);
  disableYoutube = result.disableYoutube ?? false;
  invidiousInstance = result.invidiousInstance;
  invidiousAlwaysProxy = result.invidiousAlwaysProxy ?? true;
  invidiousOnlyEmbeddedVideo = result.invidiousOnlyEmbeddedVideo ?? false;
  invidiousVideoQuality = result.invidiousVideoQuality ?? 'medium';
  invidiousDarkMode = result.invidiousDarkMode ?? true;
  invidiousVolume = result.invidiousVolume ?? 50;
  invidiousPlayerStyle = result.invidiousPlayerStyle ?? 'invidious';
  invidiousSubtitles = result.invidiousSubtitles || '';
  invidiousAutoplay = result.invidiousAutoplay ?? true;
  useFreeTube = result.useFreeTube ?? false;

  if (result.youtubeRedirects)
    redirects = result.youtubeRedirects

  if (result.persistInvidiousPrefs) initInvidiousCookie();

  frontend = result.youtubeFrontend ?? 'piped';
}

function redirect(url, initiator, type) {
  if (disableYoutube)
    return null;

  if (
    initiator &&
    (
      initiator.origin === invidiousInstance ||
      redirects.invidious.normal.includes(initiator.origin) ||
      redirects.piped.normal.includes(initiator.origin) ||
      targets.includes(initiator.host)
    )
  )
    return null;

  if (frontend == 'invidious') {

    if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/)) return null; // Don't redirect YouTube Player API.

    if (url.host.split(".")[0] === "studio") return null; // Avoid redirecting `studio.youtube.com`

    if (invidiousOnlyEmbeddedVideo && type !== "sub_frame") return null;

    if (useFreeTube && type === "main_frame")
      return `freetube://${url}`;

    // Apply settings
    if (invidiousAlwaysProxy) url.searchParams.append("local", true);

    if (invidiousVideoQuality) url.searchParams.append("quality", invidiousVideoQuality);

    if (invidiousDarkMode) url.searchParams.append("dark_mode", invidiousDarkMode);

    if (invidiousVolume) url.searchParams.append("volume", invidiousVolume);

    if (invidiousPlayerStyle) url.searchParams.append("player_style", invidiousPlayerStyle);

    if (invidiousSubtitles) url.searchParams.append("subtitles", invidiousSubtitles);

    if (invidiousAutoplay) url.searchParams.append("autoplay", 1);

    let randomInstance = commonHelper.getRandomInstance(redirects.invidious.normal)

    return `${randomInstance}${url.pathname.replace("/shorts", "")}${url.search}`;

  } else if (frontend == 'piped') {
    let randomInstance = commonHelper.getRandomInstance(redirects.piped.normal);
    if (url.hostname.endsWith("youtube.com") || url.hostname.endsWith("youtube-nocookie.com"))
      return `${randomInstance}${url.pathname}${url.search}`;

    if (url.hostname.endsWith("youtu.be") && url.pathname.length > 1)
      return `${randomInstance}/watch?v=${url.pathname.substring(1)}`;

  }
}


export default {
  getFrontend,
  setFrontend,

  getRedirects,
  setInvidiousRedirects,
  setPipedRedirects,

  redirect,
  isYoutube,

  getDisableYoutube,
  setDisableYoutube,

  setInvidiousInstance,
  getInvidiousInstance,

  setInvidiousAlwaysProxy,
  getInvidiousAlwaysProxy,

  setInvidiousOnlyEmbeddedVideo,
  getInvidiousOnlyEmbeddedVideo,

  setInvidiousVideoQuality,
  getInvidiousVideoQuality,

  setInvidiousDarkMode,
  getInvidiousDarkMode,

  setInvidiousVolume,
  getInvidiousVolume,

  setInvidiousPlayerStyle,
  getInvidiousPlayerStyle,

  setInvidiousSubtitles,
  getInvidiousSubtitles,

  setInvidiousAutoplay,
  getInvidiousAutoplay,

  getUseFreeTube,
  setUseFreeTube,

  getPersistInvidiousPrefs,
  setPersistInvidiousPrefs,

  init,
};

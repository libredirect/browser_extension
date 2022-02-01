"use strict";

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
const redirects = {
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
};

let disableInvidious;
const getDisableInvidious = () => disableInvidious;
function setDisableInvidious(val) {
  disableInvidious = val;
  browser.storage.sync.set({ disableInvidious })
  console.log("disableInvidious: ", disableInvidious)
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
function setInvidiousSubtitles(val) {
  invidiousSubtitles = val;
  browser.storage.sync.set({ invidiousSubtitles })
  console.log("invidiousSubtitles: ", invidiousSubtitles)
}
let getInvidiousSubtitles = () => invidiousSubtitles;

let invidiousAutoplay;
function setInvidiousAutoplay(val) {
  invidiousAutoplay = val;
  browser.storage.sync.set({ invidiousAutoplay })
  console.log("invidiousAutoplay: ", invidiousAutoplay)
}
const getInvidiousAutoplay = () => invidiousAutoplay;

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

function redirect(url, initiator, type) {
  if (disableInvidious || data.isException(url, initiator))
    return null;

  if (
    initiator &&
    (
      initiator.origin === invidiousInstance ||
      youtubeHelper.redirects.normal.includes(initiator.origin) ||
      youtubeHelper.targets.includes(initiator.host)
    )
  )
    return null;

  if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/))
    // Don't redirect YouTube Player API.
    return null;

  if (url.host.split(".")[0] === "studio")
    // Avoid redirecting `studio.youtube.com`
    return null;

  if (invidiousOnlyEmbeddedVideo && type !== "sub_frame")
    return null;

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

  let randomInstance = commonHelper.getRandomInstance(youtubeHelper.redirects.normal)

  return `${randomInstance}${url.pathname.replace("/shorts", "")}${url.search}`;
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
      "disableInvidious",
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
    ]);
  disableInvidious = result.disableInvidious;
  invidiousInstance = result.invidiousInstance;
  invidiousAlwaysProxy = result.invidiousAlwaysProxy;
  invidiousOnlyEmbeddedVideo = result.invidiousOnlyEmbeddedVideo;
  invidiousVideoQuality = result.invidiousVideoQuality;
  invidiousDarkMode = result.invidiousDarkMode;
  invidiousVolume = result.invidiousVolume;
  invidiousPlayerStyle = result.invidiousPlayerStyle;
  invidiousSubtitles = result.invidiousSubtitles;
  invidiousAutoplay = result.invidiousAutoplay;
  useFreeTube = result.useFreeTube;

  if (result.persistInvidiousPrefs) initInvidiousCookie();
}

export default {
  targets,
  redirects,
  redirect,

  getDisableInvidious,
  setDisableInvidious,

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

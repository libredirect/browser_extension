"use strict";

import commonHelper from '../common.js'

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
let redirects = {
  "invidious": {
    "normal": [
      "https://yewtu.be",
      "https://invidious.snopyta.org",
      "https://vid.puffyan.us",
      "https://invidious.kavin.rocks",
      "https://invidio.xamh.de",
      "https://inv.riverside.rocks",
      "https://invidious-us.kavin.rocks",
      "https://invidious.osi.kr",
      "https://inv.cthd.icu",
      "https://yt.artemislena.eu",
      "https://youtube.076.ne.jp",
      "https://invidious.namazso.eu"
    ],
    "onion": [
      "http://c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid.onion",
      "http://w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd.onion",
      "http://kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad.onion",
      "http://grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad.onion",
      "http://hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid.onion",
      "http://osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd.onion",
      "http://u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad.onion"
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

let invidiousTheme;
const getInvidiousTheme = () => invidiousTheme;
function setInvidiousTheme(val) {
  invidiousTheme = val;
  browser.storage.sync.set({ invidiousTheme })
  console.log("invidiousTheme: ", invidiousTheme)
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
}
const getPersistInvidiousPrefs = () => persistInvidiousPrefs;

function isYoutube(url) {
  return targets.includes(url.host);
}

async function init() {
  let result = await browser.storage.sync.get(
    [
      "invidiousAlwaysProxy",
      "invidiousVideoQuality",
      "invidiousTheme",
      "persistInvidiousPrefs",
      "disableYoutube",
      "invidiousInstance",
      "invidiousOnlyEmbeddedVideo",
      "invidiousVolume",
      "invidiousPlayerStyle",
      "invidiousSubtitles",
      "invidiousAutoplay",
      "useFreeTube",
      "youtubeRedirects",
      "youtubeFrontend",
    ]);
  if (result.youtubeRedirects) redirects = result.youtubeRedirects
  frontend = result.youtubeFrontend ?? 'piped';
  disableYoutube = result.disableYoutube ?? false;

  invidiousInstance = result.invidiousInstance;

  invidiousAlwaysProxy = result.invidiousAlwaysProxy ?? true;
  invidiousOnlyEmbeddedVideo = result.invidiousOnlyEmbeddedVideo ?? false;
  invidiousVideoQuality = result.invidiousVideoQuality ?? 'medium';
  invidiousTheme = result.invidiousTheme ?? 'dark';
  invidiousVolume = result.invidiousVolume ?? 50;
  invidiousPlayerStyle = result.invidiousPlayerStyle ?? 'invidious';
  invidiousSubtitles = result.invidiousSubtitles || '';
  invidiousAutoplay = result.invidiousAutoplay ?? true;

  persistInvidiousPrefs = result.persistInvidiousPrefs ?? false;

  useFreeTube = result.useFreeTube ?? false;
}

function invidiousInitCookies(tabId) {
  browser.tabs.executeScript(
    tabId, {
    file: "/assets/javascripts/helpers/youtube/invidious-cookies.js",
    runAt: "document_start"
  });
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

  if (frontend == 'freeTube' && type === "main_frame")
    return `freetube://${url}`;
  else if (frontend == 'invidious') {

    if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/)) return null; // Don't redirect YouTube Player API.

    if (url.host.split(".")[0] === "studio") {
      console.log("no because studio");
      return null;
    }; // Avoid redirecting `studio.youtube.com`

    if (invidiousOnlyEmbeddedVideo && type !== "sub_frame") return null;

    url.searchParams.append("local", invidiousAlwaysProxy);
    url.searchParams.append("quality", invidiousVideoQuality);
    url.searchParams.append("dark_mode", invidiousTheme);
    url.searchParams.append("volume", invidiousVolume);
    url.searchParams.append("player_style", invidiousPlayerStyle);
    url.searchParams.append("subtitles", invidiousSubtitles);
    url.searchParams.append("autoplay", invidiousAutoplay);

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
  invidiousInitCookies,

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

  setInvidiousTheme,
  getInvidiousTheme,

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

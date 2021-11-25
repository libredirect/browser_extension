"use strict";

import commonHelper from "../../assets/javascripts/helpers/common.js";
import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import youtubeHelper from "../../assets/javascripts/helpers/youtube.js";
import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import mapsHelper from "../../assets/javascripts/helpers/google-maps.js";
import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import searchHelper from "../../assets/javascripts/helpers/google-search.js";
import googleTranslateHelper from "../../assets/javascripts/helpers/google-translate.js";
import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import twitter from "../../assets/javascripts/helpers/twitter.js";

window.browser = window.browser || window.chrome;
const nitterInstances = twitterHelper.redirects;
const twitterDomains = twitterHelper.targets;
const youtubeDomains = youtubeHelper.targets;
const invidiousInstances = youtubeHelper.redirects;
const instagramDomains = instagramHelper.targets;
const bibliogramInstances = instagramHelper.redirects;
const instagramReservedPaths = instagramHelper.reservedPaths;
const bibliogramBypassPaths = instagramHelper.bypassPaths;
const osmDefault = mapsHelper.redirects[0];
const googleMapsRegex = mapsHelper.targets;
const mapCentreRegex = mapsHelper.mapCentreRegex;
const dataLatLngRegex = mapsHelper.dataLatLngRegex;
const placeRegex = mapsHelper.placeRegex;
const travelModes = mapsHelper.travelModes;
const layers = mapsHelper.layers;
const redditInstances = redditHelper.redirects;
const redditDomains = redditHelper.targets;
const redditBypassPaths = redditHelper.bypassPaths;
const redditDefault = redditHelper.redirects[0];
const googleSearchRegex = searchHelper.targets;
const searchEngineInstances = searchHelper.redirects;
const simplyTranslateInstances = googleTranslateHelper.redirects;
const simplyTranslateDefault = simplyTranslateInstances[0];
const googleTranslateDomains = googleTranslateHelper.targets;
const wikipediaInstances = wikipediaHelper.redirects;
const wikipediaDefault = wikipediaInstances[0];
const wikipediaRegex = wikipediaHelper.targets;

let disableNitter;
let disableInvidious;
let disableBibliogram;
let disableOsm;
let disableReddit;
let disableSearchEngine;
let disableSimplyTranslate;
let disableWikipedia;
let nitterInstance;
let invidiousInstance;
let bibliogramInstance;
let osmInstance;
let redditInstance;
let searchEngineInstance;
let simplyTranslateInstance;
let wikipediaInstance;
let alwaysProxy;
let onlyEmbeddedVideo;
let videoQuality;
let invidiousRandomPool = [ "" ];
let invidiousDarkMode;
let invidiousVolume;
let invidiousPlayerStyle;
let invidiousSubtitles;
let invidiousAutoplay;
let useFreeTube;
let nitterRandomPool;
let bibliogramRandomPool = [ "" ];
let exceptions;

browser.storage.sync.get(
  [
    "nitterInstance",
    "invidiousInstance",
    "bibliogramInstance",
    "osmInstance",
    "redditInstance",
    "searchEngineInstance",
    "simplyTranslateInstance",
    "wikipediaInstance",
    "disableNitter",
    "disableInvidious",
    "disableBibliogram",
    "disableOsm",
    "disableReddit",
    "disableSearchEngine",
    "disableSimplyTranslate",
    "disableWikipedia",
    "alwaysProxy",
    "onlyEmbeddedVideo",
    "videoQuality",
    "invidiousRandomPool",
    "invidiousDarkMode",
    "invidiousVolume",
    "invidiousPlayerStyle",
    "invidiousSubtitles",
    "invidiousAutoplay",
    "useFreeTube",
    "nitterRandomPool",
    "bibliogramRandomPool",
    "exceptions",
  ],
  (result) => {
    nitterInstance = result.nitterInstance;
    invidiousInstance = result.invidiousInstance;
    bibliogramInstance = result.bibliogramInstance;
    osmInstance = result.osmInstance || osmDefault;
    redditInstance = result.redditInstance || redditDefault;
    searchEngineInstance = result.searchEngineInstance;
    simplyTranslateInstance =
      result.simplyTranslateInstance || simplyTranslateDefault;
    wikipediaInstance = result.wikipediaInstance || wikipediaDefault;
    disableNitter = result.disableNitter;
    disableInvidious = result.disableInvidious;
    disableBibliogram = result.disableBibliogram;
    disableOsm = result.disableOsm;
    disableReddit = result.disableReddit;
    disableSearchEngine = result.disableSearchEngine;
    disableWikipedia = result.disableWikipedia;
    disableSimplyTranslate = result.disableSimplyTranslate;
    alwaysProxy = result.alwaysProxy;
    onlyEmbeddedVideo = result.onlyEmbeddedVideo;
    videoQuality = result.videoQuality;
    invidiousDarkMode = result.invidiousDarkMode;
    exceptions = result.exceptions
      ? result.exceptions.map((e) => {
          return new RegExp(e);
        })
      : [];
    invidiousRandomPool = result.invidiousRandomPool
        ? result.invidiousRandomPool.split(",")
        : [ "" ];
    invidiousVolume = result.invidiousVolume;
    invidiousPlayerStyle = result.invidiousPlayerStyle;
    invidiousSubtitles = result.invidiousSubtitles || "";
    invidiousAutoplay = result.invidiousAutoplay;
    useFreeTube = result.useFreeTube;
    nitterRandomPool = result.nitterRandomPool
      ? result.nitterRandomPool.split(",")
      : [ "" ];
    bibliogramRandomPool = result.bibliogramRandomPool
      ? result.bibliogramRandomPool.split(",")
      : [ "" ];
  }
);

browser.storage.onChanged.addListener((changes) => {
  if ("nitterInstance" in changes) {
    nitterInstance = changes.nitterInstance.newValue;
  }
  if ("invidiousInstance" in changes) {
    invidiousInstance = changes.invidiousInstance.newValue;
  }
  if ("bibliogramInstance" in changes) {
    bibliogramInstance = changes.bibliogramInstance.newValue;
  }
  if ("osmInstance" in changes) {
    osmInstance = changes.osmInstance.newValue || osmDefault;
  }
  if ("simplyTranslateInstance" in changes) {
    simplyTranslateInstance =
      changes.simplyTranslateInstance.newValue || simplyTranslateDefault;
  }
  if ("wikipediaInstance" in changes) {
    wikipediaInstance = changes.wikipediaInstance.newValue || wikipediaDefault;
  }
  if ("redditInstance" in changes) {
    redditInstance = changes.redditInstance.newValue || redditDefault;
  }
  if ("searchEngineInstance" in changes) {
    searchEngineInstance = changes.searchEngineInstance.newValue;
  }
  if ("disableNitter" in changes) {
    disableNitter = changes.disableNitter.newValue;
  }
  if ("disableInvidious" in changes) {
    disableInvidious = changes.disableInvidious.newValue;
  }
  if ("disableBibliogram" in changes) {
    disableBibliogram = changes.disableBibliogram.newValue;
  }
  if ("disableOsm" in changes) {
    disableOsm = changes.disableOsm.newValue;
  }
  if ("disableReddit" in changes) {
    disableReddit = changes.disableReddit.newValue;
  }
  if ("disableSearchEngine" in changes) {
    disableSearchEngine = changes.disableSearchEngine.newValue;
  }
  if ("disableSimplyTranslate" in changes) {
    disableSimplyTranslate = changes.disableSimplyTranslate.newValue;
  }
  if ("disableWikipedia" in changes) {
    disableWikipedia = changes.disableWikipedia.newValue;
  }
  if ("alwaysProxy" in changes) {
    alwaysProxy = changes.alwaysProxy.newValue;
  }
  if ("onlyEmbeddedVideo" in changes) {
    onlyEmbeddedVideo = changes.onlyEmbeddedVideo.newValue;
  }
  if ("videoQuality" in changes) {
    videoQuality = changes.videoQuality.newValue;
  }
  if ("invidiousDarkMode" in changes) {
    invidiousDarkMode = changes.invidiousDarkMode.newValue;
  }
  if ("invidiousVolume" in changes) {
    invidiousVolume = changes.invidiousVolume.newValue;
  }
  if ("invidiousPlayerStyle" in changes) {
    invidiousPlayerStyle = changes.invidiousPlayerStyle.newValue;
  }
  if ("invidiousSubtitles" in changes) {
    invidiousSubtitles = changes.invidiousSubtitles.newValue;
  }
  if ("invidiousAutoplay" in changes) {
    invidiousAutoplay = changes.invidiousAutoplay.newValue;
  }
  if ("useFreeTube" in changes) {
    useFreeTube = changes.useFreeTube.newValue;
  }
  if ("nitterRandomPool" in changes) {
    nitterRandomPool = changes.nitterRandomPool.newValue.split(",");
  }
  if ("invidiousRandomPool" in changes) {
    invidiousRandomPool = changes.invidiousRandomPool.newValue.split(",");
  }
  if ("bibliogramRandomPool" in changes) {
    bibliogramRandomPool = changes.bibliogramRandomPool.newValue.split(",");
  }
  if ("exceptions" in changes) {
    exceptions = changes.exceptions.newValue.map((e) => {
      return new RegExp(e);
    });
  }
});

function isException(url, initiator) {
  return (
    exceptions.some((regex) => regex.test(url.href)) ||
    (initiator && exceptions.some((regex) => regex.test(initiator.href)))
  );
}

function isFirefox() {
  return typeof InstallTrigger !== "undefined";
}

function redirectYouTube(url, initiator, type, force=false) {
  let instances = invidiousInstances();
  instances = commonHelper.filterInstances(instances);
  let pool = (invidiousRandomPool[0] === "" && invidiousRandomPool.length === 1) ? instances : invidiousRandomPool;
  if (force === true) {
    return `${
      invidiousInstance || commonHelper.getRandomInstance(pool)
    }${url.pathname.replace("/shorts", "")}${url.search}`;
  }
  if (disableInvidious || isException(url, initiator)) {
    return null;
  }
  if (
    initiator &&
    (initiator.origin === invidiousInstance ||
      (instances).includes(initiator.origin) ||
      youtubeDomains.includes(initiator.host))
  ) {
    return null;
  }
  if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/)) {
    // Don't redirect YouTube Player API.
    return null;
  }
  if (url.host.split(".")[0] === "studio") {
    // Avoid redirecting `studio.youtube.com`
    return null;
  }
  if (onlyEmbeddedVideo && type !== "sub_frame") {
    return null;
  }
  if (useFreeTube && type === "main_frame") {
    return `freetube://${url}`;
  }
  // Apply settings
  if (alwaysProxy) {
    url.searchParams.append("local", true);
  }
  if (videoQuality) {
    url.searchParams.append("quality", videoQuality);
  }
  if (invidiousDarkMode) {
    url.searchParams.append("dark_mode", invidiousDarkMode);
  }
  if (invidiousVolume) {
    url.searchParams.append("volume", invidiousVolume);
  }
  if (invidiousPlayerStyle) {
    url.searchParams.append("player_style", invidiousPlayerStyle);
  }
  if (invidiousSubtitles) {
    url.searchParams.append("subtitles", invidiousSubtitles);
  }
  if (invidiousAutoplay) {
    url.searchParams.append("autoplay", 1);
  }

  return `${
    invidiousInstance || commonHelper.getRandomInstance(pool)
  }${url.pathname.replace("/shorts", "")}${url.search}`;
}

function redirectTwitter(url, initiator) {
  let pool = (nitterRandomPool[0] === "" && nitterRandomPool.length === 1) ? nitterInstances() : nitterRandomPool;
  if (disableNitter || isException(url, initiator)) {
    return null;
  }
  if (url.pathname.split("/").includes("home")) {
    return null;
  }
  if (
    isFirefox() &&
    initiator &&
    (initiator.origin === nitterInstance ||
      pool.includes(initiator.origin) ||
      twitterDomains.includes(initiator.host))
  ) {
    browser.storage.sync.set({
      redirectBypassFlag: true,
    });
    return null;
  }
  if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video") {
    return `${
      nitterInstance || commonHelper.getRandomInstance(pool)
    }/pic/${encodeURIComponent(url.href)}`;
  } else if (url.pathname.split("/").includes("tweets")) {
    return `${
      nitterInstance || commonHelper.getRandomInstance(pool)
    }${url.pathname.replace("/tweets", "")}${url.search}`;
  } else {
    return `${
      nitterInstance || commonHelper.getRandomInstance(pool)
    }${url.pathname}${url.search}`;
  }
}

function redirectInstagram(url, initiator, type) {
  let instances = bibliogramInstances();
  instances = commonHelper.filterInstances(instances);
  let pool = (bibliogramRandomPool[0] === "" && bibliogramRandomPool.length === 1) ? instances : bibliogramRandomPool;

  if (disableBibliogram || isException(url, initiator)) {
    return null;
  }
  // Do not redirect Bibliogram view on Instagram links
  if (
    initiator &&
    (initiator.origin === bibliogramInstance ||
      instances.includes(initiator.origin) ||
      instagramDomains.includes(initiator.host))
  ) {
    return null;
  }
  // Do not redirect /accounts, /embeds.js, or anything other than main_frame
  if (type !== "main_frame" || url.pathname.match(bibliogramBypassPaths)) {
    return null;
  }
  if (
    url.pathname === "/" ||
    instagramReservedPaths.includes(url.pathname.split("/")[1])
  ) {
    return `${
      bibliogramInstance || commonHelper.getRandomInstance(pool)
    }${url.pathname}${url.search}`;
  } else {
    // Likely a user profile, redirect to '/u/...'
    return `${
      bibliogramInstance || commonHelper.getRandomInstance(pool)
    }/u${url.pathname}${url.search}`;
  }
}

function redirectGoogleMaps(url, initiator) {
  if (disableOsm || isException(url, initiator)) {
    return null;
  }
  if (initiator.host === "earth.google.com") {
    return null;
  }
  let redirect;
  let mapCentre = "";
  let params = "";
  // Set map centre if present
  if (url.pathname.match(mapCentreRegex)) {
    const [, lat, lon, zoom] = url.pathname.match(mapCentreRegex);
    mapCentre = `#map=${zoom}/${lat}/${lon}`;
  } else if (url.search.includes("center=")) {
    const [lat, lon] = url.searchParams.get("center").split(",");
    mapCentre = `#map=${url.searchParams.get("zoom") || "17"}/${lat}/${lon}`;
    // Set default zoom if mapCentre not present
  } else {
    params = "&zoom=17";
  }
  // Set map layer
  params = `${params}&layers=${
    layers[url.searchParams.get("layer")] || layers["none"]
  }`;
  // Handle Google Maps Embed API
  if (url.pathname.split("/").includes("embed")) {
    let query = "";
    if (url.searchParams.has("q")) {
      query = url.searchParams.get("q");
    } else if (url.searchParams.has("query")) {
      query = url.searchParams.has("query");
    } else if (url.searchParams.has("pb")) {
      try {
        query = url.searchParams.get("pb").split(/!2s(.*?)!/)[1];
      } catch (error) {
        console.error(error);
        // Unable to find map marker in URL.
      }
    }
    let marker, bbox;
    mapsHelper.addressToLatLng(query, (coords, boundingbox) => {
      marker = coords;
      bbox = boundingbox;
    });
    redirect = `${osmInstance}/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
    // Handle Google Maps Directions
  } else if (url.pathname.split("/").includes("dir")) {
    const travelMode =
      travelModes[url.searchParams.get("travelmode")] || travelModes["driving"];
    let origin;
    mapsHelper.addressToLatLng(url.searchParams.get("origin"), (coords) => {
      origin = coords;
    });
    let destination;
    mapsHelper.addressToLatLng(
      url.searchParams.get("destination"),
      (coords) => {
        destination = coords;
      }
    );
    redirect = `${osmInstance}/directions?engine=${travelMode}&route=${origin}%3B${destination}${mapCentre}${params}`;
    // Get marker from data attribute
  } else if (
    url.pathname.includes("data=") &&
    url.pathname.match(dataLatLngRegex)
  ) {
    const [mlat, mlon] = url.pathname.match(dataLatLngRegex);
    redirect = `${osmInstance}/?mlat=${mlat.replace(
      "!3d",
      ""
    )}&mlon=${mlon.replace("!4d", "")}${mapCentre}${params}`;
    // Get marker from ll param
  } else if (url.searchParams.has("ll")) {
    const [mlat, mlon] = url.searchParams.get("ll").split(",");
    redirect = `${osmInstance}/?mlat=${mlat}&mlon=${mlon}${mapCentre}${params}`;
    // Get marker from viewpoint param.
  } else if (url.searchParams.has("viewpoint")) {
    const [mlat, mlon] = url.searchParams.get("viewpoint").split(",");
    redirect = `${osmInstance}/?mlat=${mlat}&mlon=${mlon}${mapCentre}${params}`;
    // Use query as search if present.
  } else {
    let query;
    if (url.searchParams.has("q")) {
      query = url.searchParams.get("q");
    } else if (url.searchParams.has("query")) {
      query = url.searchParams.get("query");
    } else if (url.pathname.match(placeRegex)) {
      query = url.pathname.match(placeRegex)[1];
    }
    redirect = `${osmInstance}/${query ? "search?query=" + query : ""}${
      mapCentre || "#"
    }${params}`;
  }

  return redirect;
}

function redirectReddit(url, initiator, type) {
  if (disableReddit || isException(url, initiator)) {
    return null;
  }
  // Do not redirect when already on the selected view
  if (
    (initiator && initiator.origin === redditInstance) ||
    url.origin === redditInstance
  ) {
    return null;
  }
  // Do not redirect exclusions nor anything other than main_frame
  if (type !== "main_frame" || url.pathname.match(redditBypassPaths)) {
    return null;
  }
  if (url.host === "i.redd.it") {
    if (redditInstance.includes("libredd")) {
      return `${redditInstance}/img${url.pathname}${url.search}`;
    } else if (redditInstance.includes("teddit")) {
      // As of 2021-04-09, redirects for teddit images are nontrivial:
      // - navigating to the image before ever navigating to its page causes
      //   404 error (probably needs fix on teddit project)
      // - some image links on teddit are very different
      // Therefore, don't support redirecting image links for teddit.
      return null;
    } else {
      return null;
    }
  } else if (url.host === "redd.it") {
    if (
      redditInstance.includes("teddit") &&
      !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)
    ) {
      // As of 2021-04-22, redirects for teddit redd.it/foo links don't work.
      // It appears that adding "/comments" as a prefix works, so manually add
      // that prefix if it is missing.  Even though redd.it/comments/foo links
      // don't seem to work or exist, guard against affecting those kinds of
      // paths.
      //
      // Note the difference between redd.it/comments/foo (doesn't work) and
      // teddit.net/comments/foo (works).
      return `${redditInstance}/comments${url.pathname}${url.search}`;
    }
  }
  return `${redditInstance}${url.pathname}${url.search}`;
}

function redirectSearchEngine(url, initiator) {
  if (disableSearchEngine || isException(url, initiator)) {
    return null;
  }

  const searchEngine =
    searchEngineInstance ||
    commonHelper.getRandomInstance(searchEngineInstances);
  let search = "";
  url.search
    .slice(1)
    .split("&")
    .forEach(function (input) {
      if (input.startsWith("q=")) search = input;
    });
  return `${searchEngine.link}${searchEngine.q}?${search}`;
}

function redirectGoogleTranslate(url, initiator) {
  if (disableSimplyTranslate || isException(url, initiator)) {
    return null;
  }

  return `${simplyTranslateInstance}/${url.search}`;
}

function redirectWikipedia(url, initiator) {
  if (disableWikipedia || isException(url, initiator)) {
    return null;
  }
  let GETArguments = [];
  if (url.search.length > 0) {
    let search = url.search.substring(1); //get rid of '?'
    let argstrings = search.split("&");
    for (let i = 0; i < argstrings.length; i++) {
      let args = argstrings[i].split("=");
      GETArguments.push([args[0], args[1]]);
    }
  }
  let link = `${wikipediaInstance}${url.pathname}`;
  let urlSplit = url.host.split(".");
  if (urlSplit[0] != "wikipedia" && urlSplit[0] != "www") {
    if (urlSplit[0] == "m")
      GETArguments.push(["mobileaction", "toggle_view_mobile"]);
    else GETArguments.push(["lang", urlSplit[0]]);
    if (urlSplit[1] == "m")
      GETArguments.push(["mobileaction", "toggle_view_mobile"]);
    //wikiless doesn't have mobile view support yet
  }
  for (let i = 0; i < GETArguments.length; i++) {
    link +=
      (i == 0 ? "?" : "&") + GETArguments[i][0] + "=" + GETArguments[i][1];
  }
  if (
    urlSplit[urlSplit.length - 1] == "org" &&
    urlSplit[urlSplit.length - 2] == "wikipedia"
  )
    //just in case someone wanted to visit wikipedia.org.foo.bar.net
    return link;
  else return null;
}

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    let initiator;
    if (details.originUrl) {
      initiator = new URL(details.originUrl);
    } else if (details.initiator) {
      initiator = new URL(details.initiator);
    }
    let redirect;
    if (youtubeDomains.includes(url.host)) {
      redirect = {
        redirectUrl: redirectYouTube(url, initiator, details.type),
      };
    } else if (twitterDomains.includes(url.host)) {
      redirect = {
        redirectUrl: redirectTwitter(url, initiator),
      };
    } else if (instagramDomains.includes(url.host)) {
      redirect = {
        redirectUrl: redirectInstagram(url, initiator, details.type),
      };
    } else if (url.href.match(googleMapsRegex)) {
      redirect = {
        redirectUrl: redirectGoogleMaps(url, initiator),
      };
    } else if (redditDomains.includes(url.host)) {
      redirect = {
        redirectUrl: redirectReddit(url, initiator, details.type),
      };
    } else if (url.href.match(googleSearchRegex)) {
      redirect = {
        redirectUrl: redirectSearchEngine(url, initiator),
      };
    } else if (googleTranslateDomains.includes(url.host)) {
      redirect = {
        redirectUrl: redirectGoogleTranslate(url, initiator),
      };
    } else if (url.host.match(wikipediaRegex)) {
      redirect = {
        redirectUrl: redirectWikipedia(url, initiator),
      };
    }
    if (redirect && redirect.redirectUrl) {
      console.info(
        "Redirecting",
        `"${url.href}"`,
        "=>",
        `"${redirect.redirectUrl}"`
      );
      console.info("Details", details);
    }
    return redirect;
  },
  {
    urls: ["<all_urls>"],
  },
  ["blocking"]
);

browser.runtime.onInstalled.addListener((details) => {
  browser.storage.sync.get(
    ["disableSearchEngine", "disableSimplyTranslate", "disableWikipedia"],
    (result) => {
      if (result.disableSearchEngine === undefined) {
        browser.storage.sync.set({
          disableSearchEngine: true,
        });
      }
      if (result.disableSimplyTranslate === undefined) {
        browser.storage.sync.set({
          disableSimplyTranslate: true,
        });
      }
      if (result.disableWikipedia === undefined) {
        browser.storage.sync.set({
          disableWikipedia: true,
        });
      }
    }
  );
  if (details.reason === "update") {
    browser.storage.sync.get(
      ["whitelist", "exceptions", "invidiousInstance", "disableSearchEngine"],
      (result) => {
        if (result.whitelist) {
          let whitelist = result.whitelist.map((e) =>
            e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
          );
          browser.storage.sync.set({
            exceptions: result.exceptions.concat(whitelist),
            whitelist: null,
          });
        }
        if (result.invidiousInstance === "https://invidio.us") {
          browser.storage.sync.set({
            invidiousInstance: null,
          });
        }
      }
    );
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => 
{
  if (changeInfo.url) {
    let domain = changeInfo.url;
    let site_name = domain.substring(domain.indexOf("//")+2);
    domain = domain.substring(0, site_name.indexOf("/")+domain.length-site_name.length);
    let inv_pool = (invidiousRandomPool[0] === "" && invidiousRandomPool.length === 1) ? invidiousInstances(true) : invidiousRandomPool;
    if (twitterDomains.includes(site_name.slice(0,-1))) {
      browser.tabs.executeScript({file:"/assets/javascripts/remove-twitter-sw.js"});
    }
    else if (inv_pool.includes(domain)) {
        browser.tabs.executeScript({file:"/assets/javascripts/persist-invidious-prefs.js"});
      }
  }
});
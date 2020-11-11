"use strict";

const youtubeDomains = [
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
const nitterInstances = [
  "https://nitter.net",
  "https://nitter.snopyta.org",
  "https://nitter.42l.fr",
  "https://nitter.nixnet.services",
  "https://nitter.13ad.de",
  "https://nitter.pussthecat.org",
  "https://nitter.mastodont.cat",
  "https://nitter.dark.fail",
  "https://nitter.tedomum.net",
  "https://nitter.cattube.org",
  "https://nitter.fdn.fr",
  "https://nitter.1d4.us",
  "https://nitter.kavin.rocks",
  "https://tweet.lambda.dance",
  "https://nitter.cc",
  "https://nitter.weaponizedhumiliation.com",
  "https://nitter.vxempire.xyz",
  "http://3nzoldnxplag42gqjs23xvghtzf6t6yzssrtytnntc6ppc7xxuoneoad.onion",
  "http://nitter.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd.onion",
  "http://nitterlgj3n5fgwesu3vxc5h67ruku33nqaoeoocae2mvlzhsu6k7fqd.onion",
  "http://npf37k3mtzwxreiw52ccs5ay4e6qt2fkcs2ndieurdyn2cuzzsfyfvid.onion",
];
const twitterDomains = [
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
  "pbs.twimg.com",
  "video.twimg.com",
];
const invidiousInstances = [
  "https://invidious.snopyta.org",
  "https://invidious.xyz",
  "https://invidious.kavin.rocks",
  "https://tube.connect.cafe",
  "https://invidious.zapashcanon.fr",
  "https://invidiou.site",
  "https://vid.mint.lgbt",
  "https://invidious.site",
  "http://fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad.onion",
  "http://qklhadlycap4cnod.onion",
  "http://c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid.onion",
  "http://w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd.onion",
];
const instagramDomains = [
  "instagram.com",
  "www.instagram.com",
  "help.instagram.com",
  "about.instagram.com",
];
const instagramReservedPaths = [
  "about",
  "explore",
  "support",
  "press",
  "api",
  "privacy",
  "safety",
  "admin",
  "graphql",
  "accounts",
  "help",
  "terms",
  "contact",
  "blog",
  "igtv",
  "u",
  "p",
  "fragment",
  "imageproxy",
  "videoproxy",
  ".well-known",
  "tv",
  "reel",
];
const bibliogramBypassPaths = /\/(accounts\/|embeds?.js)/;
const bibliogramInstances = [
  "https://bibliogram.art",
  "https://bibliogram.snopyta.org",
  "https://bibliogram.pussthecat.org",
  "https://bibliogram.nixnet.services",
  "https://bg.endl.site",
  "https://bibliogram.13ad.de",
  "https://bibliogram.pixelfed.uno",
  "https://bibliogram.ethibox.fr",
  "https://bibliogram.hamster.dance",
  "https://bibliogram.kavin.rocks",
  "https://bibliogram.ggc-project.de",
];
const osmDefault = "https://openstreetmap.org";
const redditDomains = [
  "www.reddit.com",
  "np.reddit.com",
  "new.reddit.com",
  "amp.reddit.com",
];
const redditBypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/;
const oldRedditViews = [
  "https://old.reddit.com", // desktop
  "https://i.reddit.com", // mobile
];
const oldRedditDefaultView = oldRedditViews[0];
const googleMapsRegex = /https?:\/\/(((www|maps)\.)?(google\.).*(\/maps)|maps\.(google\.).*)/;
const mapCentreRegex = /@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/;
const dataLatLngRegex = /(!3d|!4d)(-?[0-9]{1,10}.[0-9]{1,10})/g;
const placeRegex = /\/place\/(.*)\//;
const travelModes = {
  driving: "fossgis_osrm_car",
  walking: "fossgis_osrm_foot",
  bicycling: "fossgis_osrm_bike",
  transit: "fossgis_osrm_car", // not implemented on OSM, default to car.
};
const layers = {
  none: "S",
  transit: "T",
  traffic: "S", // not implemented on OSM, default to standard.
  bicycling: "C",
};
const googleSearchRegex = /https?:\/\/(((www|maps)\.)?(google\.).*(\/search)|search\.(google\.).*)/;
const privateSearchEngine = [
  { link: "https://duckduckgo.com", q: "/" },
  { link: "https://startpage.com", q: "/search/" },
  { link: "https://www.qwant.com", q: "/" },
  { link: "https://www.mojeek.com", q: "/search" },
];

let disableNitter;
let disableInvidious;
let disableBibliogram;
let disableOsm;
let disableOldReddit;
let disableSearchEngine;
let nitterInstance;
let invidiousInstance;
let bibliogramInstance;
let osmInstance;
let oldRedditView;
let alwaysProxy;
let onlyEmbeddedVideo;
let videoQuality;
let invidiousDarkMode;
let invidiousVolume;
let invidiousPlayerStyle;
let invidiousSubtitles;
let invidiousAutoplay;
let useFreeTube;
let nitterRandomPool;
let invidiousRandomPool;
let bibliogramRandomPool;
let exceptions;

window.browser = window.browser || window.chrome;

function filterInstances(instances) {
  return instances.filter((instance) => !instance.includes(".onion"));
}

browser.storage.sync.get(
  [
    "nitterInstance",
    "invidiousInstance",
    "bibliogramInstance",
    "osmInstance",
    "oldRedditView",
    "disableNitter",
    "disableInvidious",
    "disableBibliogram",
    "disableOsm",
    "disableOldReddit",
    "disableSearchEngine",
    "alwaysProxy",
    "onlyEmbeddedVideo",
    "videoQuality",
    "invidiousDarkMode",
    "invidiousVolume",
    "invidiousPlayerStyle",
    "invidiousSubtitles",
    "invidiousAutoplay",
    "useFreeTube",
    "nitterRandomPool",
    "invidiousRandomPool",
    "bibliogramRandomPool",
    "exceptions",
  ],
  (result) => {
    disableNitter = result.disableNitter;
    disableInvidious = result.disableInvidious;
    disableBibliogram = result.disableBibliogram;
    disableOsm = result.disableOsm;
    disableOldReddit = result.disableOldReddit;
    disableSearchEngine = result.disableSearchEngine;
    nitterInstance = result.nitterInstance;
    invidiousInstance = result.invidiousInstance;
    bibliogramInstance = result.bibliogramInstance;
    osmInstance = result.osmInstance || osmDefault;
    oldRedditView = result.oldRedditView || oldRedditDefaultView;
    alwaysProxy = result.alwaysProxy;
    onlyEmbeddedVideo = result.onlyEmbeddedVideo;
    videoQuality = result.videoQuality;
    invidiousDarkMode = result.invidiousDarkMode;
    exceptions = result.exceptions
      ? result.exceptions.map((e) => {
          return new RegExp(e);
        })
      : [];
    invidiousVolume = result.invidiousVolume;
    invidiousPlayerStyle = result.invidiousPlayerStyle;
    invidiousSubtitles = result.invidiousSubtitles || "";
    invidiousAutoplay = result.invidiousAutoplay;
    useFreeTube = result.useFreeTube;
    nitterRandomPool = result.nitterRandomPool
      ? result.nitterRandomPool.split(",")
      : filterInstances(nitterInstances);
    invidiousRandomPool = result.invidiousRandomPool
      ? result.invidiousRandomPool.split(",")
      : filterInstances(invidiousInstances);
    bibliogramRandomPool = result.bibliogramRandomPool
      ? result.bibliogramRandomPool.split(",")
      : filterInstances(bibliogramInstances);
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
  if ("oldRedditView" in changes) {
    oldRedditView = changes.oldRedditView.newValue || oldRedditDefaultView;
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
  if ("disableOldReddit" in changes) {
    disableOldReddit = changes.disableOldReddit.newValue;
  }
  if ("disableSearchEngine" in changes) {
    disableSearchEngine = changes.disableSearchEngine.newValue;
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

function getRandomInstance(instanceList) {
  return instanceList[~~(instanceList.length * Math.random())];
}

function addressToLatLng(address, callback) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        const json = JSON.parse(xmlhttp.responseText)[0];
        if (json) {
          callback(
            `${json.lat}%2C${json.lon}`,
            `${json.boundingbox[2]},${json.boundingbox[1]},${json.boundingbox[3]},${json.boundingbox[0]}`
          );
        }
      } else {
        console.info("Error: Status is " + xmlhttp.status);
      }
    }
  };
  xmlhttp.open(
    "GET",
    `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`,
    false
  );
  xmlhttp.send();
}

function isException(url, initiator) {
  return (
    exceptions.some((regex) => regex.test(url.href)) ||
    (initiator && exceptions.some((regex) => regex.test(initiator.href)))
  );
}

function isFirefox() {
  return typeof InstallTrigger !== "undefined";
}

function redirectYouTube(url, initiator, type) {
  if (disableInvidious || isException(url, initiator)) {
    return null;
  }
  if (
    initiator &&
    (initiator.origin === invidiousInstance ||
      invidiousInstances.includes(initiator.origin) ||
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
  url.searchParams.append("autoplay", invidiousAutoplay ? 1 : 0);

  return `${
    invidiousInstance || getRandomInstance(invidiousRandomPool)
  }${url.pathname.replace("/shorts", "")}${url.search}`;
}

function redirectTwitter(url, initiator) {
  if (disableNitter || isException(url, initiator)) {
    return null;
  }
  if (url.pathname.includes("/home")) {
    return null;
  }
  if (
    isFirefox() &&
    initiator &&
    (initiator.origin === nitterInstance ||
      nitterInstances.includes(initiator.origin) ||
      twitterDomains.includes(initiator.host))
  ) {
    browser.storage.sync.set({
      redirectBypassFlag: true,
    });
    return null;
  }
  if (url.host.split(".")[0] === "pbs") {
    return `${
      nitterInstance || getRandomInstance(nitterRandomPool)
    }/pic/${encodeURIComponent(url.href)}`;
  } else if (url.host.split(".")[0] === "video") {
    return `${
      nitterInstance || getRandomInstance(nitterRandomPool)
    }/gif/${encodeURIComponent(url.href)}`;
  } else if (url.pathname.includes("tweets")) {
    return `${
      nitterInstance || getRandomInstance(nitterRandomPool)
    }${url.pathname.replace("/tweets", "")}${url.search}`;
  } else {
    return `${nitterInstance || getRandomInstance(nitterRandomPool)}${
      url.pathname
    }${url.search}`;
  }
}

function redirectInstagram(url, initiator, type) {
  if (disableBibliogram || isException(url, initiator)) {
    return null;
  }
  // Do not redirect Bibliogram view on Instagram links
  if (
    initiator &&
    (initiator.origin === bibliogramInstance ||
      bibliogramInstances.includes(initiator.origin) ||
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
    return `${bibliogramInstance || getRandomInstance(bibliogramRandomPool)}${
      url.pathname
    }${url.search}`;
  } else {
    // Likely a user profile, redirect to '/u/...'
    return `${bibliogramInstance || getRandomInstance(bibliogramRandomPool)}/u${
      url.pathname
    }${url.search}`;
  }
}

function redirectGoogleMaps(url, initiator) {
  if (disableOsm || isException(url, initiator)) {
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
  if (url.pathname.includes("/embed")) {
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
    addressToLatLng(query, (coords, boundingbox) => {
      marker = coords;
      bbox = boundingbox;
    });
    redirect = `${osmInstance}/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
    // Handle Google Maps Directions
  } else if (url.pathname.includes("/dir")) {
    const travelMode =
      travelModes[url.searchParams.get("travelmode")] || travelModes["driving"];
    let origin;
    addressToLatLng(url.searchParams.get("origin"), (coords) => {
      origin = coords;
    });
    let destination;
    addressToLatLng(url.searchParams.get("destination"), (coords) => {
      destination = coords;
    });
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
  if (disableOldReddit || isException(url, initiator)) {
    return null;
  }
  // Do not redirect when already on the selected view
  if (
    (initiator && initiator.origin === oldRedditView) ||
    url.origin === oldRedditView
  ) {
    return null;
  }
  // Do not redirect exclusions nor anything other than main_frame
  if (type !== "main_frame" || url.pathname.match(redditBypassPaths)) {
    return null;
  }
  return `${oldRedditView}${url.pathname}${url.search}`;
}

function redirectSearchEngine(url, initiator) {
  if (disableSearchEngine || isException(url, initiator)) {
    return null;
  }
  if (url.pathname.includes("/home")) {
    return null;
  }
  if (url.pathname.includes("search")) {
    searchEngine =
      searchEngineInstance || getRandomInstance(privateSearchEngine);
    search = "";
    url.search
      .slice(1)
      .split("&")
      .forEach(function (input) {
        if (input.startsWith("q=")) search = input;
      });
    console.log("search: ", search);
    return `${searchEngine.link}${searchEngine.q}?${search}`;
  }
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
    } else if (
      redditDomains.includes(url.host) ||
      oldRedditViews.includes(url.origin)
    ) {
      redirect = {
        redirectUrl: redirectReddit(url, initiator, details.type),
      };
    } else if (url.href.match(googleSearchRegex)) {
      redirect = {
        redirectUrl: redirectSearchEngine(url, initiator),
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
  if (details.reason === "update") {
    browser.storage.sync.get(
      ["whitelist", "exceptions", "invidiousInstance"],
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

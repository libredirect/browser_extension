"use strict";

const nitterInstances = [
  "https://nitter.net",
  "https://nitter.snopyta.org",
  "https://nitter.42l.fr",
  "https://nitter.nixnet.services",
  "https://nitter.13ad.de",
  "https://nitter.pussthecat.org",
  "https://nitter.mastodont.cat",
  "https://nitter",
  "https://nitter.tedomum.net",
  "https://nitter.cattube.org",
  "https://nitter.fdn.fr",
  "https://nitter.1d4.us",
  "https://nitter.kavin.rocks",
];

let disableNitter;
let nitterInstance;
let redirectBypassFlag;
let exceptions;

window.browser = window.browser || window.chrome;

function getRandomInstance() {
  return nitterInstances[~~(nitterInstances.length * Math.random())];
}

function isNotException(url) {
  return !exceptions.some((regex) => regex.test(url.href));
}

function shouldRedirect(url) {
  return (
    !redirectBypassFlag &&
    isNotException(url) &&
    !disableNitter &&
    url.host !== nitterInstance &&
    !url.pathname.includes("/home")
  );
}

function redirectTwitter(url) {
  if (url.host.split(".")[0] === "pbs") {
    return `${nitterInstance}/pic/${encodeURIComponent(url.href)}`;
  } else if (url.host.split(".")[0] === "video") {
    return `${nitterInstance}/gif/${encodeURIComponent(url.href)}`;
  } else {
    return `${nitterInstance}${url.pathname}${url.search}`;
  }
}

browser.storage.sync.get(
  [
    "nitterInstance",
    "disableNitter",
    "removeTwitterSW",
    "redirectBypassFlag",
    "exceptions",
  ],
  (result) => {
    redirectBypassFlag = result.redirectBypassFlag;
    browser.storage.sync.set({
      redirectBypassFlag: false,
    });
    if (!result.removeTwitterSW) {
      disableNitter = result.disableNitter;
      nitterInstance = result.nitterInstance || getRandomInstance();
      exceptions = result.exceptions
        ? result.exceptions.map((e) => {
            return new RegExp(e);
          })
        : [];
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          if (registration.scope === "https://twitter.com/") {
            registration.unregister();
            console.log("Unregistered Twitter SW", registration);
          }
        }
      });
      const url = new URL(window.location);
      if (shouldRedirect(url)) {
        const redirect = redirectTwitter(url);
        console.info("Redirecting", `"${url.href}"`, "=>", `"${redirect}"`);
        window.location = redirect;
      }
    }
  }
);

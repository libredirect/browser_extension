"use strict";

let disableTwitter;
let nitterInstance;
let redirectBypassFlag;
let exceptions;

window.browser = window.browser || window.chrome;

Promise.all([
  import(browser.runtime.getURL("src/assets/javascripts/helpers/common.js")),
  import(browser.runtime.getURL("src/assets/javascripts/helpers/twitter.js")),
]).then(
  (helpers) => {
    let commonHelper;
    let twitterHelper;
    [commonHelper, twitterHelper] = helpers;

    function shouldRedirect(url) {
      return (
        !redirectBypassFlag &&
        !disableTwitter &&
        url.host !== nitterInstance &&
        !url.pathname.includes("/home")
      );
    }

    function redirectTwitter(url) {
      if (url.host.split(".")[0] === "pbs")
        return `${nitterInstance}/pic/${encodeURIComponent(url.href)}`;
      else if (url.host.split(".")[0] === "video")
        return `${nitterInstance}/gif/${encodeURIComponent(url.href)}`;
      else
        return `${nitterInstance}${url.pathname}${url.search}`;
    }

    browser.storage.sync.get(
      [
        "nitterInstance",
        "disableTwitter",
        "removeTwitterSW",
        "redirectBypassFlag",
        "exceptions",
      ],
      (result) => {
        redirectBypassFlag = result.redirectBypassFlag;
        browser.storage.sync.set({ redirectBypassFlag: false });
        if (!result.removeTwitterSW) {
          disableTwitter = result.disableTwitter;
          nitterInstance = result.nitterInstance ?? commonHelper.default.getRandomInstance(twitterHelper.default.redirects);
          exceptions = result.exceptions ? result.exceptions.map((e) => new RegExp(e)) : [];
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
  },
  (error) => {
    console.error(error);
  }
);

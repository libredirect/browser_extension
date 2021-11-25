"use strict";

browser.storage.sync.get(
  [
    "nitterInstances",
    "nitterInstance",
    "disableNitter",
    "removeTwitterSW",
    "redirectBypassFlag",
    "exceptions",
  ],
  (result) => {
    let nitterInstances;
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

    nitterInstances = result.nitterInstances
      ? result.nitterInstances.split(",")
      : [];
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

// Keeping this here until https://bugzilla.mozilla.org/show_bug.cgi?id=1536094 is fixed...
//
//"use strict";
//
//let disableNitter;
//let nitterInstance;
//let redirectBypassFlag;
//let exceptions;
//
//window.browser = window.browser || window.chrome;
//
//Promise.all([
//  import(browser.extension.getURL("src/assets/javascripts/helpers/common.js")),
//  import(browser.extension.getURL("src/assets/javascripts/helpers/twitter.js")),
//]).then(
//  (helpers) => {
//    let commonHelper;
//    let twitterHelper;
//    [commonHelper, twitterHelper] = helpers;
//
//    function isNotException(url) {
//      return !exceptions.some((regex) => regex.test(url.href));
//    }
//
//    function shouldRedirect(url) {
//      return (
//        !redirectBypassFlag &&
//        isNotException(url) &&
//        !disableNitter &&
//        url.host !== nitterInstance &&
//        !url.pathname.includes("/home")
//      );
//    }
//
//    function redirectTwitter(url) {
//      if (url.host.split(".")[0] === "pbs") {
//        return `${nitterInstance}/pic/${encodeURIComponent(url.href)}`;
//      } else if (url.host.split(".")[0] === "video") {
//        return `${nitterInstance}/gif/${encodeURIComponent(url.href)}`;
//      } else {
//        return `${nitterInstance}${url.pathname}${url.search}`;
//      }
//    }
//
//    browser.storage.sync.get(
//      [
//        "nitterInstance",
//        "disableNitter",
//        "removeTwitterSW",
//        "redirectBypassFlag",
//        "exceptions",
//      ],
//      (result) => {
//        redirectBypassFlag = result.redirectBypassFlag;
//        browser.storage.sync.set({
//          redirectBypassFlag: false,
//        });
//        if (!result.removeTwitterSW) {
//          disableNitter = result.disableNitter;
//          nitterInstance =
//            result.nitterInstance ||
//            commonHelper.default.getRandomInstance(
//              twitterHelper.default.redirects
//            );
//          exceptions = result.exceptions
//            ? result.exceptions.map((e) => {
//                return new RegExp(e);
//              })
//            : [];
//          navigator.serviceWorker.getRegistrations().then((registrations) => {
//            for (let registration of registrations) {
//              if (registration.scope === "https://twitter.com/") {
//                registration.unregister();
//                console.log("Unregistered Twitter SW", registration);
//              }
//            }
//          });
//          const url = new URL(window.location);
//          if (shouldRedirect(url)) {
//            const redirect = redirectTwitter(url);
//            console.info("Redirecting", `"${url.href}"`, "=>", `"${redirect}"`);
//            window.location = redirect;
//          }
//        }
//      }
//    );
//  },
//  (error) => {
//    console.error(error);
//  }
//);

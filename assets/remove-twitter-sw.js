'use strict';

const nitterDefault = 'https://nitter.net';

let disableNitter;
let nitterInstance;
let redirectBypassFlag;
let whitelist;

window.browser = window.browser || window.chrome;

function isNotWhitelisted(url) {
  return !whitelist.some(regex => (regex.test(url.href)));
}

function shouldRedirect(url) {
  return !redirectBypassFlag &&
    isNotWhitelisted(url) &&
    !disableNitter &&
    url.host !== nitterInstance &&
    !url.pathname.includes('/home');
}

function redirectTwitter(url) {
  if (url.host.split('.')[0] === 'pbs') {
    return `${nitterInstance}/pic/${encodeURIComponent(url.href)}`;
  } else if (url.host.split('.')[0] === 'video') {
    return `${nitterInstance}/gif/${encodeURIComponent(url.href)}`;
  } else {
    return `${nitterInstance}${url.pathname}${url.search}`;
  };
}

browser.storage.sync.get(
  ['nitterInstance', 'disableNitter', 'removeTwitterSW', 'redirectBypassFlag'],
  (result) => {
    redirectBypassFlag = result.redirectBypassFlag;
    browser.storage.sync.set({
      redirectBypassFlag: false
    });
    if (!result.removeTwitterSW) {
      disableNitter = result.disableNitter;
      nitterInstance = result.nitterInstance || nitterDefault;
      whitelist = result.whitelist ? result.whitelist.map(e => {
        return new RegExp(e.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
      }) : [];
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          if (registration.scope === 'https://twitter.com/') {
            registration.unregister();
            console.log('Unregistered Twitter SW', registration);
          }
        }
      });
      const url = new URL(window.location);
      if (shouldRedirect()) {
        const redirect = redirectTwitter(url);
        console.info(
          'Redirecting', `"${url.href}"`, '=>', `"${redirect}"`
        );
        window.location = redirect;
      }
    }
  }
);

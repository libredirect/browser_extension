'use strict';

const nitterDefault = 'https://nitter.net';

let disableNitter;
let nitterInstance;
let redirectBypassFlag;
let exceptions;

window.browser = window.browser || window.chrome;

function isNotException(url) {
  return !exceptions.some(regex => (regex.test(url.href)));
}

function shouldRedirect(url) {
  return !redirectBypassFlag &&
    isNotException(url) &&
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
  [
    'nitterInstance',
    'disableNitter',
    'removeTwitterSW',
    'redirectBypassFlag',
    'exceptions'
  ],
  (result) => {
    redirectBypassFlag = result.redirectBypassFlag;
    browser.storage.sync.set({
      redirectBypassFlag: false
    });
    if (!result.removeTwitterSW) {
      disableNitter = result.disableNitter;
      nitterInstance = result.nitterInstance || nitterDefault;
      exceptions = result.exceptions ? result.exceptions.map(e => {
        return new RegExp(e);
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

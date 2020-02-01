'use strict';

const nitterDefault = 'https://nitter.net';
const twitterRegex = /((www|mobile)\.)?twitter\.com/;
const invidiousDefault = 'https://invidio.us';
const youtubeRegex = /((www|m)\.)?youtube(-nocookie)?\.com/;
const bibliogramDefault = 'https://bibliogram.art';
const instagramRegex = /((www|about|help)\.)?instagram\.com/;
const instagramPathsRegex = /(\/a|\/admin|\/api|\/favicon.ico|\/static|\/imageproxy|\/p|\/u|\/developer|\/about|\/legal|\/explore|\/director)/;

let nitterInstance;
let invidiousInstance;
let bibliogramInstance;
let disableNitter;
let disableInvidious;
let disableBibliogram;

chrome.storage.sync.get(
  [
    'nitterInstance',
    'invidiousInstance',
    'bibliogramInstance',
    'disableNitter',
    'disableInvidious',
    'disableBibliogram'
  ],
  result => {
    disableNitter = result.disableNitter;
    disableInvidious = result.disableInvidious;
    disableBibliogram = result.disableBibliogram;
    nitterInstance = result.nitterInstance || nitterDefault;
    invidiousInstance = result.invidiousInstance || invidiousDefault;
    bibliogramInstance = result.bibliogramInstance || bibliogramDefault;
  }
);

chrome.storage.onChanged.addListener(changes => {
  if ('nitterInstance' in changes) {
    nitterInstance = changes.nitterInstance.newValue || nitterDefault;
  }
  if ('invidiousInstance' in changes) {
    invidiousInstance = changes.invidiousInstance.newValue || invidiousDefault;
  }
  if ('bibliogramInstance' in changes) {
    bibliogramInstance = changes.bibliogramInstance.newValue || bibliogramDefault;
  }
  if ('disableNitter' in changes) {
    disableNitter = changes.disableNitter.newValue;
  }
  if ('disableInvidious' in changes) {
    disableInvidious = changes.disableInvidious.newValue;
  }
  if ('disableBibliogram' in changes) {
    disableBibliogram = changes.disableBibliogram.newValue;
  }
});

function redirectBibliogram(url) {
  if (url.pathname === '/' || url.pathname.match(instagramPathsRegex)) {
    return bibliogramInstance + url.pathname;
  } else {
    // Redirect user profile requests to '/u/...'
    return `${bibliogramInstance}/u${url.pathname}`;
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const url = new URL(details.url);
    let redirect;
    if (url.host.match(youtubeRegex)) {
      if (!disableInvidious) {
        redirect = {
          redirectUrl: invidiousInstance + url.pathname
        };
      }
    } else if (url.host.match(twitterRegex)) {
      if (!disableNitter) {
        redirect = {
          redirectUrl: nitterInstance + url.pathname
        };
      }
    } else if (url.host.match(instagramRegex)) {
      if (!disableBibliogram) {
        redirect = {
          redirectUrl: redirectBibliogram(url)
        };
      }
    }
    if (redirect) {
      console.log(
        'Redirecting', `"${url.host}"`, '=>', `"${redirect.redirectUrl}"`
      );
      console.log('Details', details);
    }
    return redirect;
  },
  {
    urls: ["<all_urls>"],
    types: ['main_frame', 'sub_frame',]
  },
  ['blocking']
);

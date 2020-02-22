'use strict';

const invidiousDefault = 'https://invidio.us';
const youtubeRegex = /((www|m)\.)?youtube|ytimg(-nocookie)?\.com/;
const nitterDefault = 'https://nitter.net';
const twitterRegex = /((www|mobile)\.)?twitter\.com/;
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
    'disableBibliogram',
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

function redirectYouTube(url) {
  if (url.host.split('.')[0] === 'studio') {
    // Avoid redirecting `studio.youtube.com`
    return null;
  } else if (url.pathname.match(/iframe_api/)) {
    // Redirect requests for YouTube Player API to local files instead
    return chrome.runtime.getURL('assets/iframe_api.js');
  } else if (url.pathname.match(/www-widgetapi/)) {
    // Redirect requests for YouTube Player API to local files instead
    return chrome.runtime.getURL('assets/www-widgetapi.js');
  } else {
    // Proxy video through the server
    url.searchParams.append('local', true);
    return `${invidiousInstance}${url.pathname}${url.search}`;
  }
}

function redirectTwitter(url) {
  if (url.host.split('.')[0] === 'tweetdeck') {
    // Avoid redirecting `tweetdeck.twitter.com`
    return null;
  } else {
    return `${nitterInstance}${url.pathname}${url.search}`;
  }
}

function redirectInstagram(url) {
  if (url.pathname === '/' || url.pathname.match(instagramPathsRegex)) {
    return `${bibliogramInstance}${url.pathname}${url.search}`;
  } else {
    // Redirect user profile requests to '/u/...'
    return `${bibliogramInstance}/u${url.pathname}${url.search}`;
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const url = new URL(details.url);
    let redirect;
    if (url.host.match(youtubeRegex)) {
      if (!disableInvidious) {
        redirect = {
          redirectUrl: redirectYouTube(url)
        };
      }
    } else if (url.host.match(twitterRegex)) {
      if (!disableNitter) {
        redirect = {
          redirectUrl: redirectTwitter(url)
        };
      }
    } else if (url.host.match(instagramRegex)) {
      if (!disableBibliogram) {
        redirect = {
          redirectUrl: redirectInstagram(url)
        };
      }
    }
    if (redirect && redirect.redirectUrl) {
      console.log(
        'Redirecting', `"${url.href}"`, '=>', `"${redirect.redirectUrl}"`
      );
      console.log('Details', details);
    }
    return redirect;
  },
  {
    urls: ["<all_urls>"],
    types: [
      "main_frame",
      "sub_frame",
      "script"
    ]
  },
  ['blocking']
);

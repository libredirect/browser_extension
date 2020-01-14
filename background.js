'use strict';

const nitterDefault = 'https://nitter.net';
const invidiousDefault = 'https://invidio.us';
const youtubeRegex = /((www|m)\.)?youtube(-nocookie)?\.com/;
const twitterRegex = /((www|mobile)\.)?twitter\.com/;
const pathRegex = /^https?:\/\/[^\/]+([\S\s]*)/;

let nitterInstance;
let invidiousInstance;
let disableNitter;
let disableInvidious;

chrome.storage.sync.get(
  ['disableNitter', 'disableInvidious', 'nitterInstance', 'invidiousInstance'],
  result => {
    disableNitter = result.disableNitter;
    disableInvidious = result.disableInvidious;
    nitterInstance = result.nitterInstance || nitterDefault;
    invidiousInstance = result.invidiousInstance || invidiousDefault;
  }
);

chrome.storage.onChanged.addListener(changes => {
  if ('nitterInstance' in changes) {
    nitterInstance = changes.nitterInstance.newValue || nitterDefault;
  }
  if ('invidiousInstance' in changes) {
    invidiousInstance = changes.invidiousInstance.newValue || invidiousDefault;
  }
  if ('disableNitter' in changes) {
    disableNitter = changes.disableNitter.newValue;
  }
  if ('disableInvidious' in changes) {
    disableInvidious = changes.disableInvidious.newValue;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    let redirect;
    if (details.url.match(youtubeRegex)) {
      if (!disableInvidious) {
        redirect = {
          redirectUrl: invidiousInstance + details.url.match(pathRegex)[1]
        };
      }
    } else if (details.url.match(twitterRegex)) {
      if (!disableNitter) {
        redirect = {
          redirectUrl: nitterInstance + details.url.match(pathRegex)[1]
        };
      }
    }
    if (redirect) {
      console.log('Redirecting', `"${details.url}"`, '=>', `"${redirect.redirectUrl}"`);
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

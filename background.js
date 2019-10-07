'use strict';

const nitterDefault = 'https://nitter.net';
const invidiousDefault = 'https://invidio.us';
const youtubeRegex = /((www|m)\.)?youtube(-nocookie)?\.com/;
const pathRegex = /^https?:\/\/[^\/]+([\S\s]*)/;

let nitterInstance;
let invidiousInstance;
let disableNitter;
let disableInvidious;

chrome.storage.sync.get(
  ['disableNitter', 'disableInvidious', 'nitterInstance', 'invidiousInstance'],
  (result) => {
    disableNitter = result.disableNitter;
    disableInvidious = result.disableInvidious;
    nitterInstance = result.nitterInstance || nitterDefault;
    invidiousInstance = result.invidiousInstance || invidiousDefault;
  }
);

chrome.storage.onChanged.addListener(function (changes) {
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
  function (details) {
    if (details.url.match(youtubeRegex)) {
      if (!disableInvidious) {
        return {
          redirectUrl:
            invidiousInstance + details.url.match(pathRegex)[1]
        };
      }
    } else {
      if (!disableNitter) {
        return {
          redirectUrl:
            nitterInstance + details.url.match(pathRegex)[1]
        };
      }
    }
  },
  {
    urls: [
      "*://twitter.com/*",
      "*://www.twitter.com/*",
      "*://mobile.twitter.com/*",
      "*://youtube.com/*",
      "*://www.youtube.com/*",
      "*://youtube-nocookie.com/*",
      "*://www.youtube-nocookie.com/*",
      "*://m.youtube.com/"
    ],
    types: [
      "main_frame",
      "sub_frame",
      "stylesheet",
      "script",
      "image",
      "object",
      "xmlhttprequest",
      "other"
    ]
  },
  ["blocking"]
);

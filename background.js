const nitter = "https://nitter.net";
const invidious = "https://invidio.us";
const youtubeRegex = /((www|m)\.)?youtube(-nocookie)?\.com/

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.match(youtubeRegex)) {
      return {
        redirectUrl:
          invidious + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]
      };
    } else {
      return {
        redirectUrl:
          nitter + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]
      };
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

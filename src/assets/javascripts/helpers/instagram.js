const targets = [
  "instagram.com",
  "www.instagram.com",
  "help.instagram.com",
  "about.instagram.com",
];

const apiEndpoint = 'https://bibliogram.art/api/instances';
const checkTimeout = 900000; // 15 minutes
let lastCheck = 0;
let currentTime = 0;
let _instances = [];

// Synchronous XHR request
// Don't murder me, I'd happily do it async, but Chrome has no support for that.
//
// The function below will be eventually called from a webRequest.onBeforeRequest listener
// (background.js). Chrome's API won't let me wait for a promise to resolve in that listener, so
// the compromise I'm making is send a synchronous request.
//
// If you have a better idea, do share.

const redirects = () => {
  currentTime = Date.now();

  if ((currentTime - lastCheck) > checkTimeout) {
    let request = new XMLHttpRequest();
    request.open('GET', apiEndpoint, false);
    request.send(null);

    if (request.status === 200) {
      _instances = JSON.parse(request.responseText).data
                      .map(r => r.address)
      lastCheck = currentTime;
    }
  }
  // cache the instances, so options.js has access to them without calling this function and wasting time with XHR:
  browser.storage.sync.set({"bibliogramInstances": _instances.join(",")});
  return _instances;
};

const reservedPaths = [
  "about",
  "explore",
  "support",
  "press",
  "api",
  "privacy",
  "safety",
  "admin",
  "graphql",
  "accounts",
  "help",
  "terms",
  "contact",
  "blog",
  "igtv",
  "u",
  "p",
  "fragment",
  "imageproxy",
  "videoproxy",
  ".well-known",
  "tv",
  "reel",
];
const bypassPaths = /\/(accounts\/|embeds?.js)/;

export default {
  targets,
  redirects,
  reservedPaths,
  bypassPaths,
};

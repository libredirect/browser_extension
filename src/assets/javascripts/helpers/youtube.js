const targets = [
  "m.youtube.com",
  "youtube.com",
  "img.youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "s.ytimg.com",
  "music.youtube.com",
];

const apiEndpoint = 'https://api.invidious.io/instances.json?pretty=1';
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

const redirects = (skipRequest=false) => {
  if (skipRequest) {
    return _instances;
  }

  currentTime = Date.now();
  if ((currentTime - lastCheck) > checkTimeout) {
    let request = new XMLHttpRequest();
    request.open('GET', apiEndpoint, false);
    request.send(null);

    if (request.status === 200) {
      _instances = JSON.parse(request.responseText)
                      .filter(r => r[1].type === "onion" ||
                          (r[1].monitor != null && r[1].monitor.statusClass === "success"))
                      .map(r => r[1].type === "https" ? "https://"+r[0] : "http://"+r[0]);
      lastCheck = currentTime;          
    }
  }
  // cache the instances, so options.js has access to them without calling this function:
  browser.storage.sync.set({"invidiousInstances": _instances.join(",")});
  return _instances;
};

export default {
  targets,
  redirects,
};
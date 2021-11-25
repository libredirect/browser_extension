const targets = [
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
  "pbs.twimg.com",
  "video.twimg.com",
];

const apiEndpoint = 'https://raw.githubusercontent.com/xnaas/nitter-instances/master/history/summary.json';
const checkTimeout = 900000; // 15 minutes
const uptimeTreshold = 66;   // instance must have been up for at least 66% of the last day
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
      _instances = JSON.parse(request.responseText)
                      .filter(r => r.status === "up" 
                            && parseFloat(r.uptimeDay) >= uptimeTreshold)
                      .map(r => r.url);
      lastCheck = currentTime;          
    }
  }
  // cache the instances, so options.js and remove-twitter-sw.js has access to them without calling this function:
  browser.storage.sync.set({"nitterInstances": _instances.join(",")});

  return _instances;
};

export default {
  targets,
  redirects,
};
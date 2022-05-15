window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
  /^https?:\/{2}(www\.|mobile\.|)twitter\.com/,
  /^https?:\/{2}(pbs\.|video\.|)twimg\.com/,
  /^https?:\/{2}platform\.twitter\.com\/embed/,
  /^https?:\/{2}t\.co/
];

let redirects = {
  "nitter": {
    "normal": [],
    "tor": []
  },
};

const getRedirects = () => redirects;
function setRedirects(val) {
  redirects.nitter = val;
  browser.storage.local.set({ twitterRedirects: redirects })
  console.log("twitterRedirects:", val)
  for (const item of nitterNormalRedirectsChecks)
    if (!redirects.nitter.normal.includes(item)) {
      var index = nitterNormalRedirectsChecks.indexOf(item);
      if (index !== -1) nitterNormalRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ nitterNormalRedirectsChecks })

  for (const item of nitterTorRedirectsChecks)
    if (!redirects.nitter.tor.includes(item)) {
      var index = nitterTorRedirectsChecks.indexOf(item);
      if (index !== -1) nitterTorRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ nitterTorRedirectsChecks })
}

let nitterNormalRedirectsChecks;
let nitterNormalCustomRedirects = [];
let nitterTorRedirectsChecks;
let nitterTorCustomRedirects = [];

let disable; // disableTwitter
let protocol; // twitterProtocol

function redirect(url, initiator) {
  if (disable) return;
  if (!targets.some(rx => rx.test(url.href))) return;
  if (url.pathname.split("/").includes("home")) return;

  if (
    initiator &&
    [...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterTorCustomRedirects,
    ...nitterNormalCustomRedirects
    ].includes(initiator.origin)

  ) return 'BYPASSTAB';

  let instancesList;
  if (protocol == 'normal')
    instancesList = [...nitterNormalRedirectsChecks, ...nitterNormalCustomRedirects];
  else if (protocol == 'tor')
    instancesList = [...nitterTorRedirectsChecks, ...nitterTorCustomRedirects];

  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  // https://pbs.twimg.com/profile_images/648888480974508032/66_cUYfj_400x400.jpg
  if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video")
    return `${randomInstance}/pic/${encodeURIComponent(`${url.host}${url.pathname}`)}`;
  else if (url.pathname.split("/").includes("tweets"))
    return `${randomInstance}${url.pathname.replace("/tweets", "")}${url.search}`;
  else if (url.host == 't.co')
    return `${randomInstance}/t.co${url.pathname}`;
  else
    return `${randomInstance}${url.pathname}${url.search}`;
}

function reverse(url) {
  let protocolHost = commonHelper.protocolHost(url);
  if (
    ![...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterNormalCustomRedirects,
    ...nitterTorCustomRedirects].includes(protocolHost)
  ) return;
  return `https://twitter.com${url.pathname}${url.search}`;
}

function switchInstance(url) {
  let protocolHost = commonHelper.protocolHost(url);

  let twitterList = [
    ...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterNormalCustomRedirects,
    ...nitterTorCustomRedirects,
  ];

  if (!twitterList.includes(protocolHost)) return null;

  let instancesList;
  if (protocol == 'normal') instancesList = [...nitterNormalRedirectsChecks, ...nitterNormalCustomRedirects];
  else if (protocol == 'tor') instancesList = [...nitterTorRedirectsChecks, ...nitterTorCustomRedirects];

  console.log("instancesList", instancesList);
  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length === 0) return null;

  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return `${randomInstance}${url.pathname}${url.search}`;
}

function removeXFrameOptions(e) {
  let url = new URL(e.url);
  let protocolHost = commonHelper.protocolHost(url);
  let twitterList = [
    ...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterNormalCustomRedirects,
    ...nitterTorCustomRedirects,
  ];
  if (!twitterList.includes(protocolHost) || e.type != 'sub_frame') return;
  let isChanged = false;
  for (const i in e.responseHeaders) if (e.responseHeaders[i].name == 'x-frame-options') {
    e.responseHeaders.splice(i, 1);
    isChanged = true;
  }
  if (isChanged) return { responseHeaders: e.responseHeaders };
}

function isNitter(url, type) {
  if (type !== "main_frame" && type !== "sub_frame") return false;

  let protocolHost = commonHelper.protocolHost(url);
  return [
    ...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterNormalCustomRedirects,
    ...nitterTorCustomRedirects,
  ].includes(protocolHost);
}

async function initNitterCookies(from) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "twitterProtocol",
        "nitterNormalRedirectsChecks",
        "nitterNormalCustomRedirects",
        "nitterTorRedirectsChecks",
        "nitterTorCustomRedirects",
      ],
      r => {
        let protocolHost = commonHelper.protocolHost(from);
        if (![
          ...r.nitterNormalRedirectsChecks,
          ...r.nitterTorRedirectsChecks,
          ...r.nitterNormalCustomRedirects,
          ...r.nitterTorCustomRedirects,
        ].includes(protocolHost)) resolve();

        let checkedInstances;
        if (r.twitterProtocol == 'normal') checkedInstances = [...r.nitterNormalRedirectsChecks, ...r.nitterNormalCustomRedirects]
        else if (r.twitterProtocol == 'tor') checkedInstances = [...r.nitterTorRedirectsChecks, ...r.nitterTorCustomRedirects]

        for (const to of checkedInstances) {
          commonHelper.copyCookie('nitter', from, to, 'theme');
          commonHelper.copyCookie('nitter', from, to, 'infiniteScroll');
          commonHelper.copyCookie('nitter', from, to, 'stickyProfile');
          commonHelper.copyCookie('nitter', from, to, 'bidiSupport');
          commonHelper.copyCookie('nitter', from, to, 'hideTweetStats');
          commonHelper.copyCookie('nitter', from, to, 'hideBanner');
          commonHelper.copyCookie('nitter', from, to, 'hidePins');
          commonHelper.copyCookie('nitter', from, to, 'hideReplies');
          commonHelper.copyCookie('nitter', from, to, 'squareAvatars');
          commonHelper.copyCookie('nitter', from, to, 'mp4Playback');
          commonHelper.copyCookie('nitter', from, to, 'hlsPlayback');
          commonHelper.copyCookie('nitter', from, to, 'proxyVideos');
          commonHelper.copyCookie('nitter', from, to, 'muteVideos');
          commonHelper.copyCookie('nitter', from, to, 'autoplayGifs');
        }
        resolve(true);
      })
  })
}

function initDefaults() {
  fetch('/instances/data.json').then(response => response.text()).then(data => {
    let dataJson = JSON.parse(data);
    redirects.nitter = dataJson.nitter;
    browser.storage.local.get('cloudflareList', r => {
      nitterNormalRedirectsChecks = [...redirects.nitter.normal];
      for (const instance of r.cloudflareList) {
        let i = nitterNormalRedirectsChecks.indexOf(instance);
        if (i > -1) nitterNormalRedirectsChecks.splice(i, 1);
      }
      browser.storage.local.set({
        disableTwitter: false,
        twitterRedirects: redirects,
        twitterProtocol: "normal",

        nitterNormalRedirectsChecks: nitterNormalRedirectsChecks,
        nitterNormalCustomRedirects: [],

        nitterTorRedirectsChecks: [...redirects.nitter.tor],
        nitterTorCustomRedirects: [],
      })
    })
  })
}

async function init() {
  browser.storage.local.get(
    [
      "disableTwitter",
      "twitterRedirects",
      "twitterProtocol",

      "nitterNormalRedirectsChecks",
      "nitterNormalCustomRedirects",

      "nitterTorRedirectsChecks",
      "nitterTorCustomRedirects",
    ],
    r => {
      disable = r.disableTwitter;
      protocol = r.twitterProtocol;
      redirects = r.twitterRedirects;

      nitterNormalRedirectsChecks = r.nitterNormalRedirectsChecks;
      nitterNormalCustomRedirects = r.nitterNormalCustomRedirects;

      nitterTorRedirectsChecks = r.nitterTorRedirectsChecks;
      nitterTorCustomRedirects = r.nitterTorCustomRedirects;
    }
  );
}

export default {
  getRedirects,
  setRedirects,
  reverse,
  removeXFrameOptions,

  isNitter,
  initNitterCookies,

  redirect,
  initDefaults,
  init,
  switchInstance,
};

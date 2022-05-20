window.browser = window.browser || window.chrome;

import utils from './utils.js'

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

function setRedirects(val) {
  browser.storage.local.get('cloudflareList', r => {
    redirects.nitter = val;
    nitterNormalRedirectsChecks = [...redirects.nitter.normal];
    for (const instance of r.cloudflareList) {
      let i = nitterNormalRedirectsChecks.indexOf(instance);
      if (i > -1) nitterNormalRedirectsChecks.splice(i, 1);
    }
    browser.storage.local.set({
      twitterRedirects: redirects,
      nitterNormalRedirectsChecks,
      nitterTorRedirectsChecks: [...redirects.nitter.tor]
    })
  })
}

let nitterNormalRedirectsChecks;

async function redirect(url, initiator) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableTwitter",
        "twitterProtocol",

        "twitterRedirects",

        "nitterNormalRedirectsChecks",
        "nitterNormalCustomRedirects",

        "nitterTorRedirectsChecks",
        "nitterTorCustomRedirects",
      ],
      r => {
        if (r.disableTwitter) { resolve(); return; }
        if (!targets.some(rx => rx.test(url.href))) { resolve(); return; }
        if (url.pathname.split("/").includes("home")) { resolve(); return; }

        if (
          initiator &&
          [...r.twitterRedirects.nitter.normal,
          ...r.twitterRedirects.nitter.tor,
          ...r.nitterTorCustomRedirects,
          ...r.nitterNormalCustomRedirects
          ].includes(initiator.origin)
        ) { resolve('BYPASSTAB'); return; }

        let instancesList;
        if (r.twitterProtocol == 'normal') instancesList = [...r.nitterNormalRedirectsChecks, ...r.nitterNormalCustomRedirects];
        else if (r.twitterProtocol == 'tor') instancesList = [...r.nitterTorRedirectsChecks, ...r.nitterTorCustomRedirects];
        if (instancesList.length === 0) { resolve(); return; }

        let randomInstance = utils.getRandomInstance(instancesList)
        console.log('randomInstance', randomInstance);
        // https://pbs.twimg.com/profile_images/648888480974508032/66_cUYfj_400x400.jpg
        if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video")
          resolve(`${randomInstance}/pic/${encodeURIComponent(`${url.host}${url.pathname}`)}`);
        else if (url.pathname.split("/").includes("tweets"))
          resolve(`${randomInstance}${url.pathname.replace("/tweets", "")}${url.search}`);
        else if (url.host == 't.co')
          resolve(`${randomInstance}/t.co${url.pathname}`);
        else
          resolve(`${randomInstance}${url.pathname}${url.search}`);
      }
    )
  })
}

function reverse(url) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "twitterRedirects",
        "nitterNormalCustomRedirects",
        "nitterTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(url);
        if (
          ![
            ...r.twitterRedirects.nitter.normal,
            ...r.twitterRedirects.nitter.tor,
            ...r.nitterNormalCustomRedirects,
            ...r.nitterTorCustomRedirects
          ].includes(protocolHost)
        ) { resolve(); return; }
        resolve(`https://twitter.com${url.pathname}${url.search}`);
      }
    )
  })
}

function switchInstance(url) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "twitterRedirects",
        "twitterProtocol",

        "nitterNormalRedirectsChecks",
        "nitterNormalCustomRedirects",

        "nitterTorRedirectsChecks",
        "nitterTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(url);
        if (![
          ...r.twitterRedirects.nitter.normal,
          ...r.twitterRedirects.nitter.tor,
          ...r.nitterNormalCustomRedirects,
          ...r.nitterTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }

        let instancesList;
        if (r.twitterProtocol == 'normal') instancesList = [...r.nitterNormalRedirectsChecks, ...r.nitterNormalCustomRedirects];
        else if (r.twitterProtocol == 'tor') instancesList = [...r.nitterTorRedirectsChecks, ...r.nitterTorCustomRedirects];

        let index = instancesList.indexOf(protocolHost);
        if (index > -1) instancesList.splice(index, 1);
        if (instancesList.length === 0) { resolve(); return; }

        let randomInstance = utils.getRandomInstance(instancesList);
        resolve(`${randomInstance}${url.pathname}${url.search}`);
      })
  })
}

function removeXFrameOptions(e) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "twitterRedirects",
        "twitterProtocol",

        "nitterNormalRedirectsChecks",
        "nitterNormalCustomRedirects",

        "nitterTorRedirectsChecks",
        "nitterTorCustomRedirects",
      ],
      r => {
        let url = new URL(e.url);
        let protocolHost = utils.protocolHost(url);
        if (
          ![
            ...r.twitterRedirects.nitter.normal,
            ...r.twitterRedirects.nitter.tor,
            ...r.nitterNormalCustomRedirects,
            ...r.nitterTorCustomRedirects,
          ].includes(protocolHost) ||
          e.type != 'sub_frame'
        ) { resolve(); return; }
        let isChanged = false;
        for (const i in e.responseHeaders) if (e.responseHeaders[i].name == 'x-frame-options') {
          e.responseHeaders.splice(i, 1);
          isChanged = true;
        }
        if (isChanged) resolve({ responseHeaders: e.responseHeaders });
      }
    )
  })
}

function initNitterCookies(from) {
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
        let protocolHost = utils.protocolHost(from);
        if (
          ![
            ...r.nitterNormalRedirectsChecks,
            ...r.nitterTorRedirectsChecks,
            ...r.nitterNormalCustomRedirects,
            ...r.nitterTorCustomRedirects,
          ].includes(protocolHost)
        ) { resolve(); return; }

        let checkedInstances;
        if (r.twitterProtocol == 'normal') checkedInstances = [...r.nitterNormalRedirectsChecks, ...r.nitterNormalCustomRedirects]
        else if (r.twitterProtocol == 'tor') checkedInstances = [...r.nitterTorRedirectsChecks, ...r.nitterTorCustomRedirects]

        for (const to of checkedInstances) {
          utils.copyCookie('nitter', from, to, 'theme');
          utils.copyCookie('nitter', from, to, 'infiniteScroll');
          utils.copyCookie('nitter', from, to, 'stickyProfile');
          utils.copyCookie('nitter', from, to, 'bidiSupport');
          utils.copyCookie('nitter', from, to, 'hideTweetStats');
          utils.copyCookie('nitter', from, to, 'hideBanner');
          utils.copyCookie('nitter', from, to, 'hidePins');
          utils.copyCookie('nitter', from, to, 'hideReplies');
          utils.copyCookie('nitter', from, to, 'squareAvatars');
          utils.copyCookie('nitter', from, to, 'mp4Playback');
          utils.copyCookie('nitter', from, to, 'hlsPlayback');
          utils.copyCookie('nitter', from, to, 'proxyVideos');
          utils.copyCookie('nitter', from, to, 'muteVideos');
          utils.copyCookie('nitter', from, to, 'autoplayGifs');
        }
        resolve(true);
      })
  })
}

function setNitterCookies() {
  browser.storage.local.get(
    [
      "twitterProtocol",
      "disableTwitter",
      "youtubeFrontend",
      "nitterNormalRedirectsChecks",
      "nitterNormalCustomRedirects",
      "nitterTorRedirectsChecks",
      "nitterTorCustomRedirects",
    ],
    r => {
      if (r.disableYoutube || r.youtubeFrontend != 'nitter' || r.twitterProtocol === undefined) return;
      let checkedInstances;
      if (r.youtubeProtocol == 'normal') checkedInstances = [...r.nitterNormalRedirectsChecks, ...r.nitterNormalCustomRedirects]
      else if (r.youtubeProtocol == 'tor') checkedInstances = [...r.nitterTorRedirectsChecks, ...r.nitterTorCustomRedirects]
      for (const to of checkedInstances) {
        utils.getCookiesFromStorage('nitter', to, 'theme');
        utils.getCookiesFromStorage('nitter', to, 'infiniteScroll');
        utils.getCookiesFromStorage('nitter', to, 'stickyProfile');
        utils.getCookiesFromStorage('nitter', to, 'bidiSupport');
        utils.getCookiesFromStorage('nitter', to, 'hideTweetStats');
        utils.getCookiesFromStorage('nitter', to, 'hideBanner');
        utils.getCookiesFromStorage('nitter', to, 'hidePins');
        utils.getCookiesFromStorage('nitter', to, 'hideReplies');
        utils.getCookiesFromStorage('nitter', to, 'squareAvatars');
        utils.getCookiesFromStorage('nitter', to, 'mp4Playback');
        utils.getCookiesFromStorage('nitter', to, 'hlsPlayback');
        utils.getCookiesFromStorage('nitter', to, 'proxyVideos');
        utils.getCookiesFromStorage('nitter', to, 'muteVideos');
        utils.getCookiesFromStorage('nitter', to, 'autoplayGifs');
      }
    }
  )
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

        nitterNormalRedirectsChecks,
        nitterNormalCustomRedirects: [],

        nitterTorRedirectsChecks: [...redirects.nitter.tor],
        nitterTorCustomRedirects: [],
      })
    })
  })
}

export default {
  setRedirects,

  redirect,
  switchInstance,
  reverse,
  removeXFrameOptions,

  initNitterCookies,
  setNitterCookies,

  initDefaults,
};

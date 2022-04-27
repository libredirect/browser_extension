window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
  /^https?:\/{2}(www\.|old\.|np\.|new\.|amp\.|)reddit\.com/,
  /^https?:\/{2}(i\.|preview\.)redd\.it/,
];
let redirects = {
  "libreddit": {
    "normal": [],
    "tor": []
  },
  "teddit": {
    "normal": [],
    "tor": []
  },
  "desktop": "https://old.reddit.com", // desktop
};
const getRedirects = () => redirects;
const getCustomRedirects = function () {
  return {
    "libreddit": {
      "normal": [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects],
      "tor": [...libredditTorRedirectsChecks, ...libredditTorCustomRedirects]
    },
    "teddit": {
      "normal": [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects],
      "tor": [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects]
    }
  };
};

function setLibredditRedirects(val) {
  redirects.libreddit = val;
  browser.storage.local.set({ redditRedirects: redirects })
  console.log("libredditRedirects:", val)
  for (const item of libredditNormalRedirectsChecks)
    if (!redirects.libreddit.normal.includes(item)) {
      var index = libredditNormalRedirectsChecks.indexOf(item);
      if (index !== -1) libredditNormalRedirectsChecks.splice(index, 1);
    }
  setLibredditNormalRedirectsChecks(libredditNormalRedirectsChecks);

  for (const item of libredditTorRedirectsChecks)
    if (!redirects.libreddit.normal.includes(item)) {
      var index = libredditTorRedirectsChecks.indexOf(item);
      if (index !== -1) libredditTorRedirectsChecks.splice(index, 1);
    }
  setLibredditTorRedirectsChecks(libredditTorRedirectsChecks);
}

function setTedditRedirects(val) {
  redirects.teddit = val;
  browser.storage.local.set({ redditRedirects: redirects })
  console.log("tedditRedirects:", val)
  for (const item of tedditNormalRedirectsChecks)
    if (!redirects.teddit.normal.includes(item)) {
      var index = tedditNormalRedirectsChecks.indexOf(item);
      if (index !== -1) tedditNormalRedirectsChecks.splice(index, 1);
    }
  setTedditNormalRedirectsChecks(tedditNormalRedirectsChecks);

  for (const item of tedditTorRedirectsChecks)
    if (!redirects.teddit.normal.includes(item)) {
      var index = tedditTorRedirectsChecks.indexOf(item);
      if (index !== -1) tedditTorRedirectsChecks.splice(index, 1);
    }
  setTedditTorRedirectsChecks(tedditTorRedirectsChecks);
}

let libredditNormalRedirectsChecks;
const getLibredditNormalRedirectsChecks = () => libredditNormalRedirectsChecks;
function setLibredditNormalRedirectsChecks(val) {
  libredditNormalRedirectsChecks = val;
  browser.storage.local.set({ libredditNormalRedirectsChecks })
  console.log("libredditNormalRedirectsChecks: ", val)
}

let libredditTorRedirectsChecks;
const getLibredditTorRedirectsChecks = () => libredditTorRedirectsChecks;
function setLibredditTorRedirectsChecks(val) {
  libredditTorRedirectsChecks = val;
  browser.storage.local.set({ libredditTorRedirectsChecks })
  console.log("libredditTorRedirectsChecks: ", val)
}

let libredditNormalCustomRedirects = [];
const getLibredditNormalCustomRedirects = () => libredditNormalCustomRedirects;
function setLibredditNormalCustomRedirects(val) {
  libredditNormalCustomRedirects = val;
  browser.storage.local.set({ libredditNormalCustomRedirects })
  console.log("libredditNormalCustomRedirects: ", val)
}

let libredditTorCustomRedirects = [];
const getLibredditTorCustomRedirects = () => libredditTorCustomRedirects;
function setLibredditTorCustomRedirects(val) {
  libredditTorCustomRedirects = val;
  browser.storage.local.set({ libredditTorCustomRedirects })
  console.log("libredditTorCustomRedirects: ", val)
}

let tedditNormalRedirectsChecks;
const getTedditNormalRedirectsChecks = () => tedditNormalRedirectsChecks;
function setTedditNormalRedirectsChecks(val) {
  tedditNormalRedirectsChecks = val;
  browser.storage.local.set({ tedditNormalRedirectsChecks })
  console.log("tedditNormalRedirectsChecks: ", val)
}

let tedditTorRedirectsChecks;
const getTedditTorRedirectsChecks = () => tedditTorRedirectsChecks;
function setTedditTorRedirectsChecks(val) {
  tedditTorRedirectsChecks = val;
  browser.storage.local.set({ tedditTorRedirectsChecks })
  console.log("tedditTorRedirectsChecks: ", val)
}

let tedditNormalCustomRedirects = [];
const getTedditNormalCustomRedirects = () => tedditNormalCustomRedirects;
function setTedditNormalCustomRedirects(val) {
  tedditNormalCustomRedirects = val;
  browser.storage.local.set({ tedditNormalCustomRedirects })
  console.log("tedditNormalCustomRedirects: ", val)
}

let tedditTorCustomRedirects = [];
const getTedditTorCustomRedirects = () => tedditTorCustomRedirects;
function setTedditTorCustomRedirects(val) {
  tedditTorCustomRedirects = val;
  browser.storage.local.set({ tedditTorCustomRedirects })
  console.log("tedditTorCustomRedirects: ", val)
}

const bypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/;

let disableReddit;
const getDisableReddit = () => disableReddit;
function setDisableReddit(val) {
  disableReddit = val;
  browser.storage.local.set({ disableReddit })
}

let frontend;
let protocol;
let bypassWatchOnReddit;

let enableCustom;

let theme;
let front_page;
let layout;
let wide;
let post_sort;
let comment_sort;
let show_nsfw;
let autoplay_videos;
let use_hls;
let hide_hls_notification;

function initLibredditCookies() {
  if (enableCustom) {
    let checkedInstances = [
      ...libredditNormalRedirectsChecks,
      ...libredditNormalCustomRedirects,
      ...libredditTorRedirectsChecks,
      ...libredditTorCustomRedirects
    ]

    for (const instance of checkedInstances) {
      browser.cookies.set({ url: instance, name: "theme", value: theme })
      browser.cookies.set({ url: instance, name: "front_page", value: front_page })
      browser.cookies.set({ url: instance, name: "layout", value: layout })
      browser.cookies.set({ url: instance, name: "wide", value: wide ? 'on' : 'off' })
      browser.cookies.set({ url: instance, name: "post_sort", value: post_sort })
      browser.cookies.set({ url: instance, name: "comment_sort", value: comment_sort })
      browser.cookies.set({ url: instance, name: "show_nsfw", value: show_nsfw ? 'on' : 'off' })
      browser.cookies.set({ url: instance, name: "autoplay_videos", value: autoplay_videos ? 'on' : 'off' })
      browser.cookies.set({ url: instance, name: "use_hls", value: use_hls ? 'on' : 'off' })
      browser.cookies.set({ url: instance, name: "hide_hls_notification", value: hide_hls_notification ? 'on' : 'off' })
    }
  }
}
function initTedditCookies() {
  if (enableCustom) {
    let checkedInstances = [
      ...tedditNormalRedirectsChecks,
      ...tedditNormalCustomRedirects,
      ...tedditTorRedirectsChecks,
      ...tedditTorCustomRedirects
    ]
    for (const instanceUrl of checkedInstances)
      browser.cookies.set({
        url: instanceUrl,
        name: "theme",
        value: theme == 'dark' ? 'dark' : 'white'
      })
  }
}

let alwaysUsePreferred;

function redirect(url, type, initiator) {
  // https://libreddit.exonip.de/vid/1mq8d0ma3yk81/720.mp4
  // https://libreddit.exonip.de/img/4v3t1vgvrzk81.png

  // https://teddit.net/vids/1mq8d0ma3yk81.mp4
  // https://teddit.net/pics/w:null_4v3t1vgvrzk81.png


  // redd.it/t5379n
  // https://v.redd.it/z08avb339n801/DASH_1_2_M
  // https://i.redd.it/bfkhs659tzk81.jpg

  if (disableReddit) return null;

  let protocolHost = commonHelper.protocolHost(url);

  let isTeddit = [
    ...redirects.teddit.normal,
    ...redirects.teddit.tor
  ].includes(protocolHost);

  let isCheckedTeddit = [
    ...tedditNormalRedirectsChecks,
    ...tedditNormalCustomRedirects,
    ...tedditTorRedirectsChecks,
    ...tedditTorCustomRedirects,
  ].includes(protocolHost);

  let isLibreddit = [
    ...redirects.libreddit.normal,
    ...redirects.libreddit.tor
  ].includes(protocolHost);

  let isCheckedLibreddit = [
    ...libredditNormalRedirectsChecks,
    ...libredditNormalCustomRedirects,
    ...libredditTorRedirectsChecks,
    ...libredditTorCustomRedirects,
  ].includes(protocolHost)

  if (
    alwaysUsePreferred && frontend == 'teddit' &&
    (isTeddit || isLibreddit) && !isCheckedTeddit
  ) return switchInstance(url);

  if (
    alwaysUsePreferred && frontend == 'libreddit' &&
    (isTeddit || isLibreddit) && !isCheckedLibreddit
  ) return switchInstance(url);

  if (!targets.some(rx => rx.test(url.href))) return null;

  if (
    bypassWatchOnReddit &&
    initiator &&
    [...redirects.libreddit.normal,
    ...redirects.libreddit.tor,
    ...libredditNormalCustomRedirects,
    ...libredditTorCustomRedirects,
    ...redirects.teddit.normal,
    ...redirects.teddit.tor,
    ...tedditNormalCustomRedirects,
    ...tedditTorCustomRedirects,
    ].includes(initiator.origin)
  ) return 'BYPASSTAB';

  if (type !== "main_frame" || url.pathname.match(bypassPaths)) return null;

  if (frontend == 'old' && url.host !== "i.redd.it") {
    if (url.host == 'old.reddit.com') return;
    return `${redirects.desktop}${url.pathname}${url.search}`;
  }

  let libredditInstancesList;
  let tedditInstancesList;
  if (protocol == 'normal') {
    libredditInstancesList = [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects];
    tedditInstancesList = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects];
  } else if (protocol == 'tor') {
    libredditInstancesList = [...libredditTorRedirectsChecks, ...libredditTorCustomRedirects];
    tedditInstancesList = [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects];
  }

  if (url.host === "i.redd.it") {
    if (frontend == 'teddit') {
      if (tedditInstancesList.length === 0) return null;
      let tedditRandomInstance = commonHelper.getRandomInstance(tedditInstancesList);
      return `${tedditRandomInstance}/pics/w:null_${url.pathname.substring(1)}${url.search}`;
    }
    if (frontend == 'libreddit') {
      if (libredditInstancesList.length === 0) return null;
      let libredditRandomInstance = commonHelper.getRandomInstance(libredditInstancesList);
      return `${libredditRandomInstance}/img${url.pathname}${url.search}`;
    }
  }
  else if (url.host === "redd.it") {
    if (frontend == 'libreddit' && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) {
      if (libredditInstancesList.length === 0) return null;
      let libredditRandomInstance = commonHelper.getRandomInstance(libredditInstancesList);
      // https://redd.it/foo => https://libredd.it/comments/foo
      return `${libredditRandomInstance}/comments${url.pathname}${url.search}`;
    }
    if (frontend == 'teddit' && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) {
      if (tedditInstancesList.length === 0) return null;
      let tedditRandomInstance = commonHelper.getRandomInstance(tedditInstancesList);
      // https://redd.it/foo => https://teddit.net/comments/foo
      return `${tedditRandomInstance}/comments${url.pathname}${url.search}`;
    }
  }
  else if (url.host === 'preview.redd.it') {
    if (frontend == 'teddit') {
      return null;
    }
    if (frontend == 'libreddit') {
      if (libredditInstancesList.length === 0) return null;
      let libredditRandomInstance = commonHelper.getRandomInstance(libredditInstancesList);
      return `${libredditRandomInstance}/preview/pre${url.pathname}${url.search}`;
    }
  }

  if (frontend == 'libreddit') {
    if (libredditInstancesList.length === 0) return null;
    let libredditRandomInstance = commonHelper.getRandomInstance(libredditInstancesList);
    return `${libredditRandomInstance}${url.pathname}${url.search}`;
  }
  if (frontend == 'teddit') {
    if (tedditInstancesList.length === 0) return null;
    let tedditRandomInstance = commonHelper.getRandomInstance(tedditInstancesList);
    return `${tedditRandomInstance}${url.pathname}${url.search}`;
  }
}

function reverse(url) {
  let protocolHost = commonHelper.protocolHost(url);
  if (
    ![...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterNormalCustomRedirects,
    ...nitterTorCustomRedirects].includes(protocolHost)
  ) return;
  if (url.pathname.includes('/pics/w:null_'))
    return `https://reddit.com${url.pathname}${url.search}`;
}

function switchInstance(url) {
  let protocolHost = commonHelper.protocolHost(url);

  let isTeddit = [
    ...redirects.teddit.normal,
    ...redirects.teddit.tor
  ].includes(protocolHost);

  let isLibreddit = [
    ...redirects.libreddit.normal,
    ...redirects.libreddit.tor
  ].includes(protocolHost);

  let redditList = [
    ...redirects.libreddit.normal,
    ...redirects.libreddit.tor,

    ...libredditNormalCustomRedirects,
    ...libredditTorCustomRedirects,

    ...redirects.teddit.normal,
    ...redirects.teddit.tor,

    ...tedditNormalCustomRedirects,
    ...tedditTorCustomRedirects,
  ]

  if (!redditList.includes(protocolHost)) return null;

  let instancesList;
  if (frontend == 'libreddit') {
    if (protocol == 'normal') instancesList = [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...libredditTorRedirectsChecks, ...libredditTorCustomRedirects];
    if (isTeddit) url.pathname = url.pathname.replace("/pics/w:null_", "/img/");
  }
  else if (frontend == 'teddit') {
    if (protocol == 'normal') instancesList = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects];
    if (isLibreddit) url.pathname = url.pathname.replace("/img/", "/pics/w:null_");
  }

  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);
  if (instancesList.length === 0) return null;

  let randomInstance = commonHelper.getRandomInstance(instancesList);

  return `${randomInstance}${url.pathname}${url.search}`;
}

async function initDefaults() {
  return new Promise(async resolve => {
    fetch('/instances/data.json').then(response => response.text()).then(async data => {
      let dataJson = JSON.parse(data);
      redirects.teddit = dataJson.teddit;
      redirects.libreddit = dataJson.libreddit;
      await browser.storage.local.set({
        disableReddit: false,
        redditProtocol: 'normal',
        redditFrontend: 'libreddit',

        bypassWatchOnReddit: true,
        alwaysUsePreferred: false,

        redditRedirects: {
          'libreddit': redirects.libreddit,
          'teddit': redirects.teddit,
        },

        libredditNormalRedirectsChecks: [...redirects.libreddit.normal],
        libredditNormalCustomRedirects: [],

        libredditTorRedirectsChecks: [...redirects.libreddit.tor],
        libredditTorCustomRedirects: [],

        tedditNormalRedirectsChecks: [...redirects.teddit.normal],
        tedditNormalCustomRedirects: [],

        tedditTorRedirectsChecks: [...redirects.teddit.tor],
        tedditTorCustomRedirects: [],

        enableLibredditCustomSettings: false,

        redditTheme: 'system',
        redditFrontPage: 'default',
        redditLayout: 'card',
        redditWide: false,
        redditPostSort: 'hot',
        redditCommentSort: 'confidence',
        redditShowNsfw: false,
        redditUseHls: false,
        redditHideHlsNotification: false,
      });
      resolve();
    });
  })
}

async function init() {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableReddit",
        "redditFrontend",
        "redditRedirects",

        "libredditNormalRedirectsChecks",
        "libredditNormalCustomRedirects",
        "libredditTorRedirectsChecks",
        "libredditTorCustomRedirects",

        "tedditNormalRedirectsChecks",
        "tedditNormalCustomRedirects",
        "tedditTorRedirectsChecks",
        "tedditTorCustomRedirects",


        "redditProtocol",
        "bypassWatchOnReddit",

        "alwaysUsePreferred",

        "enableLibredditCustomSettings",

        "redditTheme",
        "redditFrontPage",
        "redditLayout",
        "redditWide",
        "redditPostSort",
        "redditCommentSort",
        "redditShowNsfw",
        "redditAutoplayVideos",
        "redditUseHls",
        "redditHideHlsNotification",
      ], r => {
        disableReddit = r.disableReddit;
        protocol = r.redditProtocol;
        frontend = r.redditFrontend;

        bypassWatchOnReddit = r.bypassWatchOnReddit;
        alwaysUsePreferred = r.alwaysUsePreferred;

        redirects = r.redditRedirects;

        libredditNormalRedirectsChecks = r.libredditNormalRedirectsChecks;
        libredditNormalCustomRedirects = r.libredditNormalCustomRedirects;

        libredditTorRedirectsChecks = r.libredditTorRedirectsChecks;
        libredditTorCustomRedirects = r.libredditTorCustomRedirects;

        tedditNormalRedirectsChecks = r.tedditNormalRedirectsChecks;
        tedditNormalCustomRedirects = r.tedditNormalCustomRedirects;

        tedditTorRedirectsChecks = r.tedditTorRedirectsChecks;
        tedditTorCustomRedirects = r.tedditTorCustomRedirects;

        enableCustom = r.enableLibredditCustomSettings;

        theme = r.redditTheme;
        front_page = r.redditFrontPage;
        layout = r.redditLayout;
        wide = r.redditWide;
        post_sort = r.redditPostSort;
        comment_sort = r.redditCommentSort;
        show_nsfw = r.redditShowNsfw;
        autoplay_videos = r.redditAutoplayVideos;
        use_hls = r.redditUseHls;
        hide_hls_notification = r.redditHideHlsNotification;

        resolve();
      }
    );
  });
}

export default {
  targets,
  getRedirects,
  getCustomRedirects,
  setTedditRedirects,
  setLibredditRedirects,

  getDisableReddit,
  setDisableReddit,

  initLibredditCookies,
  initTedditCookies,

  getLibredditNormalRedirectsChecks,
  setLibredditNormalRedirectsChecks,
  getLibredditTorRedirectsChecks,
  setLibredditTorRedirectsChecks,

  getLibredditNormalCustomRedirects,
  setLibredditNormalCustomRedirects,
  getLibredditTorCustomRedirects,
  setLibredditTorCustomRedirects,

  getTedditNormalRedirectsChecks,
  setTedditNormalRedirectsChecks,
  getTedditTorRedirectsChecks,
  setTedditTorRedirectsChecks,

  getTedditNormalCustomRedirects,
  setTedditNormalCustomRedirects,
  getTedditTorCustomRedirects,
  setTedditTorCustomRedirects,

  initLibredditCookies,

  redirect,
  init,
  initDefaults,
  switchInstance,
};

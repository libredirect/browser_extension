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
  browser.storage.local.set({ libredditNormalRedirectsChecks })

  for (const item of libredditTorRedirectsChecks)
    if (!redirects.libreddit.normal.includes(item)) {
      var index = libredditTorRedirectsChecks.indexOf(item);
      if (index !== -1) libredditTorRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ libredditTorRedirectsChecks })
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
  browser.storage.local.set({ tedditNormalRedirectsChecks })

  for (const item of tedditTorRedirectsChecks)
    if (!redirects.teddit.normal.includes(item)) {
      var index = tedditTorRedirectsChecks.indexOf(item);
      if (index !== -1) tedditTorRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ tedditTorRedirectsChecks })
}

let libredditNormalRedirectsChecks;
let libredditTorRedirectsChecks;
let libredditNormalCustomRedirects = [];
let libredditTorCustomRedirects = [];

let tedditNormalRedirectsChecks;
let tedditTorRedirectsChecks;
let tedditNormalCustomRedirects = [];
let tedditTorCustomRedirects = [];

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

function initLibredditCookies(targetUrl) {
  browser.storage.local.get(
    [
      "redditProtocol",
      "libredditNormalRedirectsChecks",
      "libredditNormalCustomRedirects",
      "libredditTorRedirectsChecks",
      "libredditTorCustomRedirects",
    ],
    r => {
      let checkedInstances;
      if (r.redditProtocol == 'normal') checkedInstances = [...r.libredditNormalRedirectsChecks, ...r.libredditNormalCustomRedirects];
      else if (r.redditProtocol == 'tor') checkedInstances = [...r.libredditTorRedirectsChecks, ...r.libredditTorCustomRedirects];

      for (const instance of checkedInstances) {
        commonHelper.copyCookie(targetUrl, instance, "theme");
        commonHelper.copyCookie(targetUrl, instance, "front_page");
        commonHelper.copyCookie(targetUrl, instance, "layout");
        commonHelper.copyCookie(targetUrl, instance, "wide");
        commonHelper.copyCookie(targetUrl, instance, "post_sort");
        commonHelper.copyCookie(targetUrl, instance, "comment_sort");
        commonHelper.copyCookie(targetUrl, instance, "show_nsfw");
        commonHelper.copyCookie(targetUrl, instance, "autoplay_videos");
        commonHelper.copyCookie(targetUrl, instance, "use_hls");
        commonHelper.copyCookie(targetUrl, instance, "hide_hls_notification");
      }
    }
  )
}

function initTedditCookies() {
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

async function switchInstance(url) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "redditRedirects",
        "redditFrontend",
        "redditProtocol",

        "libredditNormalRedirectsChecks",
        "libredditNormalCustomRedirects",
        "libredditTorRedirectsChecks",
        "libredditTorCustomRedirects",

        "tedditNormalRedirectsChecks",
        "tedditNormalCustomRedirects",
        "tedditTorRedirectsChecks",
        "tedditTorCustomRedirects",
      ],
      r => {
        let protocolHost = commonHelper.protocolHost(url);
        let isTeddit = [
          ...r.redditRedirects.teddit.normal,
          ...r.redditRedirects.teddit.tor
        ].includes(protocolHost);

        let isLibreddit = [
          ...r.redditRedirects.libreddit.normal,
          ...r.redditRedirects.libreddit.tor
        ].includes(protocolHost);

        let redditList = [
          ...r.redditRedirects.libreddit.normal,
          ...r.redditRedirects.libreddit.tor,

          ...r.libredditNormalCustomRedirects,
          ...r.libredditTorCustomRedirects,

          ...r.redditRedirects.teddit.normal,
          ...r.redditRedirects.teddit.tor,

          ...r.tedditNormalCustomRedirects,
          ...r.tedditTorCustomRedirects,
        ]

        if (!redditList.includes(protocolHost)) return null;

        console.log('redditFrontend', r.redditFrontend)
        let instancesList;
        if (r.redditFrontend == 'libreddit') {
          if (r.redditProtocol == 'normal') instancesList = [...r.libredditNormalRedirectsChecks, ...r.libredditNormalCustomRedirects];
          else if (r.redditProtocol == 'tor') instancesList = [...r.libredditTorRedirectsChecks, ...r.libredditTorCustomRedirects];
          if (isTeddit) url.pathname = url.pathname.replace("/pics/w:null_", "/img/");
        }
        else if (r.redditFrontend == 'teddit') {
          if (r.redditProtocol == 'normal') instancesList = [...r.tedditNormalRedirectsChecks, ...r.tedditNormalCustomRedirects];
          else if (r.redditProtocol == 'tor') instancesList = [...r.tedditTorRedirectsChecks, ...r.tedditTorCustomRedirects];
          if (isLibreddit) url.pathname = url.pathname.replace("/img/", "/pics/w:null_");
        }

        let index = instancesList.indexOf(protocolHost);
        if (index > -1) instancesList.splice(index, 1);
        if (instancesList.length === 0) return;

        let randomInstance = commonHelper.getRandomInstance(instancesList);

        resolve(`${randomInstance}${url.pathname}${url.search}`)
      }
    )
  })

}

async function initDefaults() {
  fetch('/instances/data.json').then(response => response.text()).then(async data => {
    let dataJson = JSON.parse(data);
    redirects.teddit = dataJson.teddit;
    redirects.libreddit = dataJson.libreddit;
    browser.storage.local.get('cloudflareList', async r => {
      libredditNormalRedirectsChecks = [...redirects.libreddit.normal];
      tedditNormalRedirectsChecks = [...redirects.teddit.normal]
      for (const instance of r.cloudflareList) {
        let i;

        i = libredditNormalRedirectsChecks.indexOf(instance);
        if (i > -1) libredditNormalRedirectsChecks.splice(i, 1);

        i = tedditNormalRedirectsChecks.indexOf(instance);
        if (i > -1) tedditNormalRedirectsChecks.splice(i, 1);
      }
      await browser.storage.local.set({
        disableReddit: false,
        redditProtocol: 'normal',
        redditFrontend: 'libreddit',

        bypassWatchOnReddit: true,
        alwaysUsePreferred: false,

        redditRedirects: redirects,

        libredditNormalRedirectsChecks: libredditNormalRedirectsChecks,
        libredditNormalCustomRedirects: [],

        libredditTorRedirectsChecks: [...redirects.libreddit.tor],
        libredditTorCustomRedirects: [],

        tedditNormalRedirectsChecks: tedditNormalRedirectsChecks,
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
    });
  });
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

  initLibredditCookies,

  redirect,
  init,
  initDefaults,
  switchInstance,
};

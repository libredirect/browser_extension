window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
  /^https?:\/\/(www\.|old\.|np\.|new\.|amp\.|)reddit\.com/,
  /^https?:\/\/(i\.|preview\.)redd\.it/,
];
let redirects = {
  // modern UI
  "libreddit": {
    "normal": [
      "https://libredd.it",
      "https://libreddit.spike.codes",
      "https://libreddit.dothq.co",
      "https://libreddit.kavin.rocks",
      "https://libreddit.bcow.xyz",
      "https://libreddit.40two.app",
      "https://reddit.invak.id",
      "https://reddit.phii.me",
      "https://lr.riverside.rocks",
      "https://libreddit.silkky.cloud",
      "https://libreddit.database.red",
      "https://libreddit.exonip.de",
      "https://libreddit.domain.glass",
    ],
    "tor": [
      "http://spjmllawtheisznfs7uryhxumin26ssv2draj7oope3ok3wuhy43eoyd.onion",
      "http://fwhhsbrbltmrct5hshrnqlqygqvcgmnek3cnka55zj4y7nuus5muwyyd.onion",
      "http://dflv6yjt7il3n3tggf4qhcmkzbti2ppytqx3o7pjrzwgntutpewscyid.onion",
      "http://kphht2jcflojtqte4b4kyx7p2ahagv4debjj32nre67dxz7y57seqwyd.onion",
    ]
  },
  // old UI
  "teddit": {
    "normal": [],
    "tor": []
  },
  "desktop": "https://old.reddit.com", // desktop
  "mobile": "https://i.reddit.com", // mobile
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
const getFrontend = () => frontend;
function setFrontend(val) {
  frontend = val;
  browser.storage.local.set({ redditFrontend: frontend })
};

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
  protocol = val;
  browser.storage.local.set({ redditProtocol: val })
  console.log("redditProtocol: ", val)
}

let bypassWatchOnReddit;
const getBypassWatchOnReddit = () => bypassWatchOnReddit;
function setBypassWatchOnReddit(val) {
  bypassWatchOnReddit = val;
  browser.storage.local.set({ bypassWatchOnReddit })
  console.log("bypassWatchOnReddit: ", bypassWatchOnReddit)
}

let theme;
let applyThemeToSites;
function initLibredditCookies() {
  if (applyThemeToSites && theme != 'DEFAULT') {
    let allInstances = [...redirects.libreddit.normal, ...redirects.libreddit.tor, ...libredditNormalCustomRedirects, ...libredditTorCustomRedirects]
    let checkedInstances = [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects, ...libredditTorRedirectsChecks, ...libredditTorCustomRedirects]
    for (const instanceUrl of allInstances)
      if (!checkedInstances.includes(instanceUrl))
        browser.cookies.remove({
          url: instanceUrl,
          name: "theme",
        })
    for (const instanceUrl of checkedInstances)
      browser.cookies.set({
        url: instanceUrl,
        name: "theme",
        value: theme
      })
  }
}
function initTedditCookies() {
  let themeValue;
  if (theme == 'light') themeValue = 'white';
  if (theme == 'dark') themeValue = 'dark';
  if (applyThemeToSites && themeValue) {
    let allInstances = [...redirects.teddit.normal, ...redirects.teddit.tor, ...tedditNormalCustomRedirects, ...tedditTorCustomRedirects]
    let checkedInstances = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects, ...tedditTorRedirectsChecks, ...tedditTorCustomRedirects]
    for (const instanceUrl of allInstances)
      if (!checkedInstances.includes(instanceUrl))
        browser.cookies.remove({
          url: instanceUrl,
          name: "theme",
        })
    for (const instanceUrl of checkedInstances)
      browser.cookies.set({
        url: instanceUrl,
        name: "theme",
        value: themeValue
      })
  }
}

let alwaysUsePreferred;

// https://libreddit.exonip.de/vid/1mq8d0ma3yk81/720.mp4
// https://libreddit.exonip.de/img/4v3t1vgvrzk81.png

// https://teddit.net/vids/1mq8d0ma3yk81.mp4
// https://teddit.net/pics/w:null_4v3t1vgvrzk81.png


// redd.it/t5379n
// https://v.redd.it/z08avb339n801/DASH_1_2_M
// https://i.redd.it/bfkhs659tzk81.jpg


function redirect(url, type, initiator) {
  if (disableReddit) return null;

  let protocolHost = `${url.protocol}//${url.host}`;

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
  ) return changeInstance(url);

  if (
    alwaysUsePreferred && frontend == 'libreddit' &&
    (isTeddit || isLibreddit) && !isCheckedLibreddit
  ) return changeInstance(url);

  if (!targets.some((rx) => rx.test(url.href))) return null;

  if (
    bypassWatchOnReddit &&
    initiator &&
    (
      [...redirects.libreddit.normal,
      ...redirects.libreddit.tor,
      ...libredditNormalCustomRedirects,
      ...libredditTorCustomRedirects,
      ...redirects.teddit.normal,
      ...redirects.teddit.tor,
      ...tedditNormalCustomRedirects,
      ...tedditTorCustomRedirects,
      ].includes(initiator.origin)
    )
  ) return 'BYPASSTAB';

  if (type !== "main_frame" || url.pathname.match(bypassPaths)) return null;

  if (frontend == 'old' && url.host !== "i.redd.it")
    return `${redirects.desktop}${url.pathname}${url.search}`;

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

function changeInstance(url) {
  let protocolHost = `${url.protocol}//${url.host}`;

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

async function init() {
  return new Promise((resolve) => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
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

          "theme",
          "applyThemeToSites",

          "redditProtocol",
          "bypassWatchOnReddit",

          "alwaysUsePreferred",
        ], r => {
          disableReddit = r.disableReddit ?? false;
          protocol = r.redditProtocol ?? 'normal';
          frontend = r.redditFrontend ?? 'libreddit';

          bypassWatchOnReddit = r.bypassWatchOnReddit ?? true;

          alwaysUsePreferred = r.alwaysUsePreferred ?? false;

          redirects.teddit = dataJson.teddit;
          if (r.redditRedirects) redirects = r.redditRedirects;

          if (r.redditRedirects) redirects = r.redditRedirects;

          theme = r.theme ?? 'DEFAULT';
          applyThemeToSites = r.applyThemeToSites ?? false;

          libredditNormalRedirectsChecks = r.libredditNormalRedirectsChecks ?? [...redirects.libreddit.normal];
          libredditNormalCustomRedirects = r.libredditNormalCustomRedirects ?? [];

          libredditTorRedirectsChecks = r.libredditTorRedirectsChecks ?? [...redirects.libreddit.tor];
          libredditTorCustomRedirects = r.libredditTorCustomRedirects ?? [];

          tedditNormalRedirectsChecks = r.tedditNormalRedirectsChecks ?? [...redirects.teddit.normal];
          tedditNormalCustomRedirects = r.tedditNormalCustomRedirects ?? [];

          tedditTorRedirectsChecks = r.tedditTorRedirectsChecks ?? [...redirects.teddit.tor];
          tedditTorCustomRedirects = r.tedditTorCustomRedirects ?? [];

          initLibredditCookies();
          initTedditCookies();

          resolve();
        }
      );
    });
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

  getFrontend,
  setFrontend,

  getProtocol,
  setProtocol,

  getBypassWatchOnReddit,
  setBypassWatchOnReddit,

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
  changeInstance,
};

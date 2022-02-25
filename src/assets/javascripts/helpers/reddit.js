window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
  "reddit.com",
  "www.reddit.com",
  "np.reddit.com",
  "new.reddit.com",
  "amp.reddit.com",
  "i.redd.it",
  "redd.it",
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

function isReddit(url, initiator) {
  if (
    initiator &&
    (
      [...redirects.libreddit.normal, ...libredditNormalCustomRedirects].includes(initiator.origin) ||
      [...redirects.teddit.normal, ...tedditNormalCustomRedirects].includes(initiator.origin) ||
      targets.includes(initiator.host)
    )
  ) return false;
  return targets.includes(url.host)
}

function redirect(url, type) {
  if (disableReddit) return null;

  if (type !== "main_frame" || url.pathname.match(bypassPaths)) return null;

  if (frontend == 'old') return `${redirects.desktop}${url.pathname}${url.search}`;

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
    if (libredditInstancesList.length === 0) return null;
    let libredditRandomInstance = commonHelper.getRandomInstance(libredditInstancesList);
    // As of 2021-04-09, redirects for teddit images are nontrivial:
    // - navigating to the image before ever navigating to its page causes
    //   404 error (probably needs fix on teddit project)
    // - some image links on teddit are very different
    // Therefore, don't support redirecting image links for teddit.
    return `${libredditRandomInstance}/img${url.pathname}${url.search}`;
  }
  else if (url.host === "redd.it") {
    if (frontend == 'libreddit') {
      if (libredditInstancesList.length === 0) return null;
      let libredditRandomInstance = commonHelper.getRandomInstance(libredditInstancesList);
      return `${libredditRandomInstance}${url.pathname}${url.search}`;
    }
    if (frontend == 'teddit' && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) {
      if (tedditInstancesList.length === 0) return null;
      let tedditRandomInstance = commonHelper.getRandomInstance(tedditInstancesList);
      // As of 2021-04-22, redirects for teddit redd.it/foo links don't work.
      // It appears that adding "/comments" as a prefix works, so manually add
      // that prefix if it is missing. Even though redd.it/comments/foo links
      // don't seem to work or exist, guard against affecting those kinds of
      // paths.
      // Note the difference between redd.it/comments/foo (doesn't work) and
      // teddit.net/comments/foo (works).
      return `${tedditRandomInstance}/comments${url.pathname}${url.search}`;
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
  }
  else if (frontend == 'teddit') {
    if (protocol == 'normal') instancesList = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects];
  }

  console.log("instancesList", instancesList);
  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length === 0) return null;

  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return randomInstance;
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

          "redditProtocol",
        ], (result) => {
          disableReddit = result.disableReddit ?? false;
          protocol = result.redditProtocol ?? 'normal';
          frontend = result.redditFrontend ?? 'libreddit';

          redirects.teddit = dataJson.teddit;
          if (result.redditRedirects) redirects = result.redditRedirects;

          if (result.redditRedirects) redirects = result.redditRedirects;

          libredditNormalRedirectsChecks = result.libredditNormalRedirectsChecks ?? [...redirects.libreddit.normal];
          libredditNormalCustomRedirects = result.libredditNormalCustomRedirects ?? [];

          libredditTorRedirectsChecks = result.libredditTorRedirectsChecks ?? [...redirects.libreddit.tor];
          libredditTorCustomRedirects = result.libredditTorCustomRedirects ?? [];

          tedditNormalRedirectsChecks = result.tedditNormalRedirectsChecks ?? [...redirects.teddit.normal];
          tedditNormalCustomRedirects = result.tedditNormalCustomRedirects ?? [];

          tedditTorRedirectsChecks = result.tedditTorRedirectsChecks ?? [...redirects.teddit.tor];
          tedditTorCustomRedirects = result.tedditTorCustomRedirects ?? [];

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

  redirect,
  isReddit,
  init,
  changeInstance,
};

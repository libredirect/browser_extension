import commonHelper from './common.js'

const targets = [
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
      "https://libreddit.kavin.rocks",
      "https://libreddit.insanity.wtf",
      "https://libreddit.dothq.co",
      "https://libreddit.silkky.cloud",
      "https://libreddit.himiko.cloud",
      "https://reddit.artemislena.eu",
      "https://reddit.git-bruh.duckdns.org",
    ]
  },
  // old UI
  "teddit": {
    "normal": [
      "https://teddit.net",
      "https://teddit.ggc-project.de",
      "https://teddit.kavin.rocks",
      "https://teddit.zaggy.nl",
      "https://teddit.namazso.eu",
      "https://teddit.nautolan.racing",
      "https://teddit.tinfoil-hat.net",
      "https://teddit.domain.glass",
      "https://snoo.ioens.is",
      "https://teddit.httpjames.space",
      "https://teddit.alefvanoon.xyz",
      "https://incogsnoo.com",
      "https://teddit.pussthecat.org",
      "https://reddit.lol",
      "https://teddit.sethforprivacy.com",
      "https://teddit.totaldarkness.net",
      "https://teddit.adminforge.de",
      "https://teddit.bus-hit.me"
    ],
  },
  "desktop": "https://old.reddit.com", // desktop
  "mobile": "https://i.reddit.com", // mobile
};
const bypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/;

let disableReddit;
const getDisableReddit = () => disableReddit;
function setDisableReddit(val) {
  disableReddit = val;
  browser.storage.sync.set({ disableReddit })
}
let redditInstance;
const getRedditInstance = () => redditInstance;
function setRedditInstance(val) {
  redditInstance = val;
  browser.storage.sync.set({ redditInstance })
};

let redditFrontend;
const getRedditFrontend = () => redditFrontend;
function setRedditFrontend(val) {
  redditFrontend = val;
  browser.storage.sync.set({ redditFrontend })
};


async function redirect(url, initiator, type) {
  await init()
  if (disableReddit)
    return null;

  // Do not redirect when already on the selected view
  if ((initiator && initiator.origin === redditInstance) || url.origin === redditInstance)
    return null;


  // Do not redirect exclusions nor anything other than main_frame
  if (type !== "main_frame" || url.pathname.match(bypassPaths))
    return null;

  let libredditLink = commonHelper.getRandomInstance(redirects.libreddit.normal);
  let tedditLink = commonHelper.getRandomInstance(redirects.teddit.normal);

  if (url.host === "i.redd.it")
    // As of 2021-04-09, redirects for teddit images are nontrivial:
    // - navigating to the image before ever navigating to its page causes
    //   404 error (probably needs fix on teddit project)
    // - some image links on teddit are very different
    // Therefore, don't support redirecting image links for teddit.
    return `${libredditLink}/img${url.pathname}${url.search}`;
  else if (url.host === "redd.it") {
    if (redditFrontend == 'libreddit') return `${libredditLink}${url.pathname}${url.search}`;
    if (redditFrontend == 'teddit' && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/))
      // As of 2021-04-22, redirects for teddit redd.it/foo links don't work.
      // It appears that adding "/comments" as a prefix works, so manually add
      // that prefix if it is missing. Even though redd.it/comments/foo links
      // don't seem to work or exist, guard against affecting those kinds of
      // paths.
      // Note the difference between redd.it/comments/foo (doesn't work) and
      // teddit.net/comments/foo (works).
      return `${tedditLink}/comments${url.pathname}${url.search}`;
  }
  if (redditFrontend == 'libreddit') return `${libredditLink}${url.pathname}${url.search}`;
  if (redditFrontend == 'teddit') return `${tedditLink}${url.pathname}${url.search}`;
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableReddit",
    "redditInstance",
    "redditFrontend",
  ])
  disableReddit = result.disableReddit || false;
  redditInstance = result.redditInstance;
  redditFrontend = result.redditFrontend || 'libreddit';
}

export default {
  targets,
  redirects,
  bypassPaths,
  getDisableReddit,
  setDisableReddit,
  getRedditInstance,
  setRedditInstance,
  getRedditFrontend,
  setRedditFrontend,
  redirect,
  init,
};

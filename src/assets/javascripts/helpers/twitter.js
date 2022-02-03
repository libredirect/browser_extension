import commonHelper from './common.js'

/*
    Please remember to also update the src/manifest.json file 
    (content_scripts > matches, 'remove-twitter-sw.js') 
    when updating this list:
  */
const targets = [
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
  "pbs.twimg.com",
  "video.twimg.com",
];
/*
    Please remember to also update the 
    src/assets/javascripts/remove-twitter-sw.js file 
    (const nitterInstances) when updating this list:
  */
let redirects = {
  "normal": [
    "https://nitter.net",
    "https://nitter.snopyta.org",
    "https://nitter.42l.fr",
    "https://nitter.nixnet.services",
    "https://nitter.pussthecat.org",
    "https://nitter.dark.fail",
    "https://nitter.tedomum.net",
    "https://nitter.cattube.org",
    "https://nitter.fdn.fr",
    "https://nitter.1d4.us",
    "https://nitter.kavin.rocks",
    "https://tweet.lambda.dance",
    "https://nitter.cc",
    "https://nitter.vxempire.xyz",
    "https://nitter.unixfox.eu",
    "https://bird.trom.tf",
  ],
  "onion": [
    "http://3nzoldnxplag42gqjs23xvghtzf6t6yzssrtytnntc6ppc7xxuoneoad.onion",
    "http://nitter.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd.onion",
    "http://nitterlgj3n5fgwesu3vxc5h67ruku33nqaoeoocae2mvlzhsu6k7fqd.onion",
    "http://npf37k3mtzwxreiw52ccs5ay4e6qt2fkcs2ndieurdyn2cuzzsfyfvid.onion",
  ]
};

let disableTwitter;
const getDisableTwitter = () => disableTwitter;
function setDisableTwitter(val) {
  disableTwitter = val;
  browser.storage.sync.set({ disableTwitter })
}

let nitterInstance;
const getNitterInstance = () => nitterInstance;
function setNitterInstance(val) {
  nitterInstance = val;
  browser.storage.sync.set({ nitterInstance })
}


async function redirect(url, initiator) {
  await init();
  if (disableTwitter)
    return null;

  if (url.pathname.split("/").includes("home")) {
    return null;
  }
  if (
    commonHelper.isFirefox() &&
    initiator &&
    (
      initiator.origin === nitterInstance ||
      redirects.normal.includes(initiator.origin) ||
      targets.includes(initiator.host)
    )
  ) {
    browser.storage.sync.set({ redirectBypassFlag: true });
    return null;
  }
  let link = commonHelper.getRandomInstance(redirects.normal)
  if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video")
    return `${link}/pic/${encodeURIComponent(url.href)}`;

  else if (url.pathname.split("/").includes("tweets"))
    return `${link}${url.pathname.replace("/tweets", "")}${url.search}`;

  else
    return `${link}${url.pathname}${url.search}`;

}

async function init() {
  let result = await browser.storage.sync.get([
    "disableTwitter",
    "nitterInstance"
  ]);
  disableTwitter = result.disableTwitter || false;
  nitterInstance = result.nitterInstance;
}

export default {
  targets,
  redirects,
  getDisableTwitter,
  setDisableTwitter,
  getNitterInstance,
  setNitterInstance,
  redirect,
  init,
};

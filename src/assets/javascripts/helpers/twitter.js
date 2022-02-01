import data from "../data.js";
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
const redirects = {
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

let disableNitter;
const getDisableNitter = () => disableNitter;
function setDisableNitter(val) {
  disableNitter = val;
  browser.storage.sync.set({ disableNitter })
}

let nitterInstance;
const getNitterInstance = () => nitterInstance;
function setNitterInstance(val) {
  nitterInstance = val;
  browser.storage.sync.set({ nitterInstance })
}


function redirect(url, initiator) {
  if (disableNitter || data.isException(url, initiator))
    return null;

  if (url.pathname.split("/").includes("home")) {
    return null;
  }
  if (
    data.isFirefox() &&
    initiator &&
    (
      initiator.origin === nitterInstance ||
      twitterHelper.redirects.normal.includes(initiator.origin) ||
      twitterHelper.targets.includes(initiator.host)
    )
  ) {
    browser.storage.sync.set({ redirectBypassFlag: true });
    return null;
  }
  let link = commonHelper.getRandomInstance(twitterHelper.redirects.normal)
  if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video")
    return `${link}/pic/${encodeURIComponent(url.href)}`;

  else if (url.pathname.split("/").includes("tweets"))
    return `${link}${url.pathname.replace("/tweets", "")}${url.search}`;

  else
    return `${link}${url.pathname}${url.search}`;

}


export default {
  targets,
  redirects,
  getDisableNitter,
  setDisableNitter,
  getNitterInstance,
  setNitterInstance,
  redirect,
};

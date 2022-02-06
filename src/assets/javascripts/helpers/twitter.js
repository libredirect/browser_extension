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

let redirects = {
  "nitter": {
    "normal": [
      "https://nitter.net",
      "https://nitter.42l.fr",
      "https://nitter.pussthecat.org",
      "https://nitter.nixnet.services",
      "https://nitter.fdn.fr",
      "https://nitter.1d4.us",
      "https://nitter.kavin.rocks",
      "https://nitter.unixfox.eu",
      "https://nitter.domain.glass",
      "https://nitter.eu",
      "https://nitter.namazso.eu",
      "https://nitter.actionsack.com",
      "https://birdsite.xanny.family",
      "https://nitter.hu",
      "https://twitr.gq",
      "https://nitter.moomoo.me",
      "https://nittereu.moomoo.me",
      "https://bird.trom.tf",
      "https://nitter.it",
      "https://twitter.censors.us",
      "https://nitter.grimneko.de",
      "https://nitter.alefvanoon.xyz",
      "https://n.hyperborea.cloud",
      "https://nitter.ca",
      "https://twitter.076.ne.jp",
      "https://nitter.mstdn.social",
      "https://nitter.fly.dev",
      "https://notabird.site",
      "https://nitter.weiler.rocks",
      "https://nitter.silkky.cloud",
      "https://nitter.sethforprivacy.com",
      "https://nttr.stream",
      "https://nitter.cutelab.space",
      "https://nitter.nl",
      "https://nitter.mint.lgbt",
      "https://nitter.tokhmi.xyz",
      "https://nitter.bus-hit.me",
      "https://fuckthesacklers.network",
      "https://nitter.govt.land",
      "https://nitter.datatunnel.xyz",
      "https://nitter.esmailelbob.xyz"
    ],
    "onion": [
      "http://3nzoldnxplag42gqjs23xvghtzf6t6yzssrtytnntc6ppc7xxuoneoad.onion",
      "http://nitter.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd.onion",
      "http://nitter7bryz3jv7e3uekphigvmoyoem4al3fynerxkj22dmoxoq553qd.onion",
      "http://npf37k3mtzwxreiw52ccs5ay4e6qt2fkcs2ndieurdyn2cuzzsfyfvid.onion",
      "http://nitter.v6vgyqpa7yefkorazmg5d5fimstmvm2vtbirt6676mt7qmllrcnwycqd.onion",
      "http://i23nv6w3juvzlw32xzoxcqzktegd4i4fu3nmnc2ewv4ggiu4ledwklad.onion",
      "http://26oq3gioiwcmfojub37nz5gzbkdiqp7fue5kvye7d4txv4ny6fb4wwid.onion",
      "http://vfaomgh4jxphpbdfizkm5gbtjahmei234giqj4facbwhrfjtcldauqad.onion",
      "http://iwgu3cv7ywf3gssed5iqtavmrlszgsxazkmwwnt4h2kdait75thdyrqd.onion",
      "http://erpnncl5nhyji3c32dcfmztujtl3xaddqb457jsbkulq24zqq7ifdgad.onion",
      "http://ckzuw5misyahmg7j5t5xwwuj3bwy62jfolxyux4brfflramzsvvd3syd.onion",
      "http://jebqj47jgxleaiosfcxfibx2xdahjettuydlxbg64azd4khsxv6kawid.onion",
      "http://nttr2iupbb6fazdpr2rgbooon2tzbbsvvkagkgkwohhodjzj43stxhad.onion",
      "http://nitraeju2mipeziu2wtcrqsxg7h62v5y4eqgwi75uprynkj74gevvuqd.onion",
      "http://nitter.lqs5fjmajyp7rvp4qvyubwofzi6d4imua7vs237rkc4m5qogitqwrgyd.onion"
    ]
  }
};
const getRedirects = () => redirects;
function setRedirects(val) {
  redirects.nitter = val;
  browser.storage.sync.set({ twitterRedirects: redirects })
  console.log("twitterRedirects:", val)
}

let nitterRedirectsChecks;
const getNitterRedirectsChecks = () => nitterRedirectsChecks;
function setNitterRedirectsChecks(val) {
  nitterRedirectsChecks = val;
  browser.storage.sync.set({ nitterRedirectsChecks })
  console.log("nitterRedirectsChecks: ", val)
}

let nitterCustomRedirects = [];
const getNitterCustomRedirects = () => nitterCustomRedirects;
function setNitterCustomRedirects(val) {
  nitterCustomRedirects = val;
  browser.storage.sync.set({ nitterCustomRedirects })
  console.log("nitterCustomRedirects: ", val)
}

let disableTwitter;
const getDisableTwitter = () => disableTwitter;
function setDisableTwitter(val) {
  disableTwitter = val;
  browser.storage.sync.set({ disableTwitter })
}


function redirect(url, initiator) {
  if (disableTwitter)
    return null;

  if (url.pathname.split("/").includes("home")) {
    return null;
  }

  let instancesList = [...nitterRedirectsChecks, ...nitterCustomRedirects];
  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  if (
    commonHelper.isFirefox() &&
    initiator &&
    (instancesList.includes(initiator.origin) || targets.includes(initiator.host))
  ) {
    browser.storage.sync.set({ redirectBypassFlag: true });
    return null;
  }
  if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video")
    return `${randomInstance}/pic/${encodeURIComponent(url.href)}`;

  else if (url.pathname.split("/").includes("tweets"))
    return `${randomInstance}${url.pathname.replace("/tweets", "")}${url.search}`;

  else
    return `${randomInstance}${url.pathname}${url.search}`;

}

function isTwitter(url) {
  return targets.includes(url.host)
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableTwitter",
    "twitterRedirects",
    "nitterRedirectsChecks",
    "nitterCustomRedirects",
  ]);
  disableTwitter = result.disableTwitter ?? false;
  if (result.twitterRedirects)
    redirects = result.twitterRedirects;

  nitterRedirectsChecks = result.nitterRedirectsChecks ?? [...redirects.nitter.normal];
  nitterCustomRedirects = result.nitterCustomRedirects ?? [];
}

export default {
  getRedirects,
  setRedirects,

  getDisableTwitter,
  setDisableTwitter,

  getNitterRedirectsChecks,
  setNitterRedirectsChecks,

  getNitterCustomRedirects,
  setNitterCustomRedirects,

  redirect,
  isTwitter,
  init,
};

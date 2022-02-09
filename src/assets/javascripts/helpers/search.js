import commonHelper from './common.js'

const targets = [
  /https?:\/\/(www\.|maps\.|search\.|)google\.com(\/search\?q=..*|\/$|)/,
];
let redirects = {
  "searx": {
    "normal": [
      "https://a.searx.space",
      "https://anon.sx",
      "https://beezboo.com",
      "https://darmarit.org/searx",
      "https://dynabyte.ca",
      "https://engo.mint.lgbt",

    ],
    "onion": [
      "http://3afisqjw2rxm6z7mmstyt5rx75qfqrgxnkzftknbp2vhipr2nrmrjdyd.onion",
      "http://searxbgetrkiwxhdwi6svpgh7eotopqyxhbqiokrwzg7dcte44t36kyd.onion",
      "http://suche.xyzco456vwisukfg.onion",
      "http://w5rl6wsd7mzj4bdkbuqvzidet5osdsm5jhg2f7nvfidakfq5exda5wid.onion",
      "http://4n53nafyi77iplnbrpmxnp3x4exbswwxigujaxy3b37fvr7bvlopxeyd.onion",
      "http://z34ambyi6makk6ta7ksog2sljly2ctt2sa3apekb7wkllk72sxecdtad.onion",
      "http://search.4bkxscubgtxwvhpe.onion",
      "http://juy4e6eicawzdrz7.onion",
      "http://z5vawdol25vrmorm4yydmohsd4u6rdoj2sylvoi3e3nqvxkvpqul7bqd.onion",
      "http://zbuc3bbzbfdqqo2x46repx2ddajbha6fpsjeeptjhhhhzji3zopxdqyd.onion",
      "http://f4qfqajszpx5b7itzxt6mb7kj4ktpgbdq7lq6xaiqyqx6a7de3epptad.onion",
      "http://searx.cwuzdtzlubq5uual.onion",
      "http://rq2w52kyrif3xpfihkgjnhqm3a5aqhoikpv72z3drpjglfzc2wr5z4yd.onion",
      "http://searx3aolosaf3urwnhpynlhuokqsgz47si4pzz5hvb7uuzyjncl2tid.onion",
      "http://searx.bsbvtqi5oq2cqzn32zt4cr2f2z2rwots3dq7gmdcnlyqoxko2wx6reqd.onion"
    ],
    "i2p": [
      "http://ransack.i2p",
      "http://mqamk4cfykdvhw5kjez2gnvse56gmnqxn7vkvvbuor4k4j2lbbnq.b32.i2p"
    ]
  },
  "whoogle": {
    "normal": [
      "https://s.alefvanoon.xyz",
      "https://search.albony.xyz",
      "https://search.garudalinux.org",
      "https://search.sethforprivacy.com",
      "https://whoogle.fossho.st",
      "https://whooglesearch.net",
      "https://www.whooglesearch.ml",
      "https://whoogle.dcs0.hu"
    ]
  },
};
const getRedirects = () => redirects;

function setSearxRedirects(val) {
  redirects.searx = val;
  browser.storage.sync.set({ searchRedirects: redirects })
  console.log("searxRedirects:", val)
  for (const item of searxRedirectsChecks) {
    console.log(item)
    if (!redirects.searx.normal.includes(item)) {
      var index = searxRedirectsChecks.indexOf(item);
      if (index !== -1) searxRedirectsChecks.splice(index, 1);
      console.log(`Deleted ${item}`);
    }
  }
  setSearxRedirectsChecks(searxRedirectsChecks);
}
let whoogleRedirectsChecks;
const getWhoogleRedirectsChecks = () => whoogleRedirectsChecks;
function setWhoogleRedirectsChecks(val) {
  whoogleRedirectsChecks = val;
  browser.storage.sync.set({ whoogleRedirectsChecks })
  console.log("whoogleRedirectsChecks: ", val)
  for (const item of whoogleRedirectsChecks)
    if (!redirects.whoogle.normal.includes(item)) {
      var index = whoogleRedirectsChecks.indexOf(item);
      if (index !== -1) whoogleRedirectsChecks.splice(index, 1);
    }
  setWhoogleRedirectsChecks(whoogleRedirectsChecks);
}

let whoogleCustomRedirects = [];
const getWhoogleCustomRedirects = () => whoogleCustomRedirects;
function setWhoogleCustomRedirects(val) {
  whoogleCustomRedirects = val;
  browser.storage.sync.set({ whoogleCustomRedirects })
  console.log("whoogleCustomRedirects: ", val)
}

let searxRedirectsChecks;
const getSearxRedirectsChecks = () => searxRedirectsChecks;
function setSearxRedirectsChecks(val) {
  searxRedirectsChecks = val;
  browser.storage.sync.set({ searxRedirectsChecks })
  console.log("searxRedirectsChecks: ", val)
}

let searxCustomRedirects = [];
const getSearxCustomRedirects = () => searxCustomRedirects;
function setSearxCustomRedirects(val) {
  searxCustomRedirects = val;
  browser.storage.sync.set({ searxCustomRedirects })
  console.log("searxCustomRedirects: ", val)
}

function setWhoogleRedirects(val) {
  redirects.whoogle = val;
  browser.storage.sync.set({ searchRedirects: redirects })
  console.log("whoogleRedirects:", val)
}

let disableSearch;
const getDisableSearch = () => disableSearch;
function setDisableSearch(val) {
  disableSearch = val;
  browser.storage.sync.set({ disableSearch })
  console.log("disableSearch: ", disableSearch)
}

let searchFrontend;
const getSearchFrontend = () => searchFrontend;
function setSearchFrontend(val) {
  searchFrontend = val;
  browser.storage.sync.set({ searchFrontend })
  console.log("searchFrontend: ", searchFrontend)
};

function redirect(url, initiator) {
  if (disableSearch)
    return null;

  let randomInstance;
  let path;
  if (searchFrontend == 'searx') {
    let instancesList = [...searxRedirectsChecks, ...searxCustomRedirects];
    if (instancesList.length === 0) return null;
    randomInstance = commonHelper.getRandomInstance(instancesList)
    path = "/"
  }
  if (searchFrontend == 'whoogle') {
    let instancesList = [...whoogleRedirectsChecks, ...whoogleCustomRedirects];
    if (instancesList.length === 0) return null;
    randomInstance = commonHelper.getRandomInstance(instancesList)
    path = "/search"
  }

  let searchQuery = "";
  url.search.slice(1).split("&").forEach(function (input) {
    if (input.startsWith("q=")) searchQuery = input;
  });
  return `${randomInstance}${path}?${searchQuery}`;
}

function isSearch(url) {
  return targets.some((rx) => rx.test(url.href));
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableSearch",
    "searchFrontend",
    "searchRedirects",
    "whoogleRedirectsChecks",
    "whoogleCustomRedirects",
    "searxRedirectsChecks",
    "searxCustomRedirects",
  ])
  disableSearch = result.disableSearch ?? false;
  searchFrontend = result.searchFrontend ?? 'searx';
  if (result.searchRedirects)
    redirects = result.searchRedirects;


  whoogleRedirectsChecks = result.whoogleRedirectsChecks ?? [...redirects.whoogle.normal];
  whoogleCustomRedirects = result.whoogleCustomRedirects ?? [];

  searxRedirectsChecks = result.searxRedirectsChecks ?? [...redirects.searx.normal];


  searxCustomRedirects = result.searxCustomRedirects ?? [];
}

export default {
  targets,
  isSearch,

  getRedirects,
  setSearxRedirects,
  setWhoogleRedirects,

  getDisableSearch,
  setDisableSearch,

  getSearchFrontend,
  setSearchFrontend,

  getWhoogleRedirectsChecks,
  setWhoogleRedirectsChecks,

  getWhoogleCustomRedirects,
  setWhoogleCustomRedirects,

  getSearxRedirectsChecks,
  setSearxRedirectsChecks,

  getSearxCustomRedirects,
  setSearxCustomRedirects,

  redirect,
  init,
};

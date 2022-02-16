window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
  /https?:\/\/(www\.|maps\.|search\.|)google\.com(\/search\?q=..*|\/$)/,
];
let redirects = {
  "searx": {
    "normal": [
      "https://anon.sx",
      "https://darmarit.org/searx",
      "https://dynabyte.ca",
      "https://engo.mint.lgbt",
      "https://jsearch.pw",
      "https://metasearch.nl",
      "https://nibblehole.com",
      "https://northboot.xyz",
      "https://paulgo.io",
      "https://procurx.pt",
      "https://s.zhaocloud.net",
      "https://search.antonkling.se",
      "https://search.asynchronousexchange.com",
      "https://search.biboumail.fr",
      "https://search.bus-hit.me",
      "https://search.disroot.org",
      "https://search.ethibox.fr",
      "https://search.jpope.org",
      "https://search.mdosch.de",
      "https://search.neet.works",
      "https://search.ononoki.org",
      "https://search.snopyta.org",
      "https://search.st8.at",
      "https://search.stinpriza.org",
      "https://search.trom.tf",
      "https://search.zdechov.net",
      "https://searx-private-search.de",
      "https://searx.bar",
      "https://searx.be",
      "https://searx.bissisoft.com",
      "https://searx.divided-by-zero.eu",
      "https://searx.dresden.network",
      "https://searx.esmailelbob.xyz",
      "https://searx.everdot.org",
      "https://searx.fmac.xyz",
      "https://searx.fossencdi.org",
      "https://searx.gnous.eu",
      "https://searx.gnu.style",
      "https://searx.hardwired.link",
      "https://searx.hummel-web.at",
      "https://searx.lavatech.top",
      "https://searx.mastodontech.de",
      "https://searx.mha.fi",
      "https://searx.mxchange.org",
      "https://searx.nakhan.net",
      "https://searx.netzspielplatz.de",
      "https://searx.nevrlands.de",
      "https://searx.ninja",
      "https://searx.nixnet.services",
      "https://searx.openhoofd.nl",
      "https://searx.operationtulip.com",
      "https://searx.org",
      "https://searx.prvcy.eu",
      "https://searx.pwoss.org",
      "https://searx.rasp.fr",
      "https://searx.roughs.ru",
      "https://searx.ru",
      "https://searx.run",
      "https://searx.sadblog.xyz",
      "https://searx.semipvt.com",
      "https://searx.slash-dev.de",
      "https://searx.solusar.de",
      "https://searx.sp-codes.de",
      "https://searx.stuehieyr.com",
      "https://searx.theanonymouse.xyz",
      "https://searx.thegreenwebfoundation.org",
      "https://searx.tiekoetter.com",
      "https://searx.tk",
      "https://searx.tux.land",
      "https://searx.tuxcloud.net",
      "https://searx.tyil.nl",
      "https://searx.vitanetworks.link",
      "https://searx.webheberg.info",
      "https://searx.xkek.net",
      "https://searx.xyz",
      "https://searx.zackptg5.com",
      "https://searx.zapashcanon.fr",
      "https://searx.zecircle.xyz",
      "https://serx.cf",
      "https://spot.ecloud.global",
      "https://suche.dasnetzundich.de",
      "https://suche.uferwerk.org",
      "https://swag.pw",
      "https://sx.catgirl.cloud",
      "https://sx.fedi.tech",
      "https://timdor.noip.me/searx",
      "https://trovu.komun.org",
      "https://www.gruble.de",
      "https://www.webrats.xyz",
      "https://xeek.com",
      "https://searx.roflcopter.fr",
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
const getCustomRedirects = function () {
  return {
    "searx": {
      "normal": [...searxRedirectsChecks, ...searxCustomRedirects]
    },
    "whoogle": {
      "normal": [...whoogleRedirectsChecks, ...whoogleCustomRedirects]
    }
  };
};

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

function setWhoogleRedirects(val) {
  redirects.whoogle = val;
  browser.storage.sync.set({ searchRedirects: redirects })
  console.log("whoogleRedirects:", val)
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

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.sync.set({ disableSearch: disable })
  console.log("disableSearch: ", disable)
}

let frontend;
const getFrontend = () => frontend;
function setFrontend(val) {
  frontend = val;
  browser.storage.sync.set({ searchFrontend: frontend })
  console.log("searchFrontend: ", frontend)
};

function isSearch(url, initiator) {
  if (disable) return false;
  return targets.some((rx) => rx.test(url.href));
}

function redirect(url) {
  let randomInstance;
  let path;
  if (frontend == 'searx') {
    let instancesList = [...searxRedirectsChecks, ...searxCustomRedirects];
    if (instancesList.length === 0) return null;
    randomInstance = commonHelper.getRandomInstance(instancesList)
    path = "/";
  }
  if (frontend == 'whoogle') {
    let instancesList = [...whoogleRedirectsChecks, ...whoogleCustomRedirects];
    if (instancesList.length === 0) return null;
    randomInstance = commonHelper.getRandomInstance(instancesList)
    path = "/search";
  }

  let searchQuery = "";
  url.search.slice(1).split("&").forEach((input) => {
    if (input.startsWith("q=")) searchQuery = input;
  });

  return `${randomInstance}${path}?${searchQuery}`;
}


async function init() {
  return new Promise((resolve) => {
    browser.storage.sync.get(
      [
        "disableSearch",
        "searchFrontend",
        "searchRedirects",
        "whoogleRedirectsChecks",
        "whoogleCustomRedirects",
        "searxRedirectsChecks",
        "searxCustomRedirects",
      ],
      (result) => {
        disable = result.disableSearch ?? false;
        
        frontend = result.searchFrontend ?? 'searx';

        if (result.searchRedirects) redirects = result.searchRedirects;

        whoogleRedirectsChecks = result.whoogleRedirectsChecks ?? [...redirects.whoogle.normal];
        whoogleCustomRedirects = result.whoogleCustomRedirects ?? [];

        searxRedirectsChecks = result.searxRedirectsChecks ?? [...redirects.searx.normal];
        searxCustomRedirects = result.searxCustomRedirects ?? [];

        resolve();
      }
    );
  });
}

export default {
  isSearch,

  getDisable,
  setDisable,

  getRedirects,
  getCustomRedirects,
  setSearxRedirects,
  setWhoogleRedirects,

  getFrontend,
  setFrontend,

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

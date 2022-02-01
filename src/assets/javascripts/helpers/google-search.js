const targets = [
  /https:\/\/google\.com/,
  /https:\/\/.*\.google\.com/,
  /https?:\/\/(((www|maps)\.)?(google\.).*(\/search)|search\.(google\.).*)/
];
const redirects = {
  "searx": {
    "normal": [
      "https://a.searx.space",
      "https://anon.sx",
      "https://beezboo.com",
      "https://darmarit.org",
      "https://dynabyte.ca",
      "https://engo.mint.lgbt",
      "https://jsearch.pw",
      "https://metasearch.nl",
      "https://nibblehole.com",
      "https://northboot.xyz",
      "https://paulgo.io",
      "https://procurx.pt",
      "https://putin.agency",
      "https://quickso.eu.org",
      "https://s.zhaocloud.net",
      "https://search.076.ne.jp",
      "https://search.activemail.de",
      "https://search.anonymize.com",
      "https://search.antonkling.se",
      "https://search.asynchronousexchange.com",
      "https://search.biboumail.fr",
      "https://search.blou.xyz",
      "https://search.bluelock.org",
      "https://search.bus-hit.me",
      "https://search.disroot.org",
      "https://search.ethibox.fr",
      "https://search.jigsaw-security.com",
      "https://search.jpope.org",
      "https://search.mdosch.de",
      "https://search.ononoki.org",
      "https://search.snopyta.org",
      "https://search.st8.at",
      "https://search.stinpriza.org",
      "https://search.trom.tf",
      "https://search.zdechov.net",
      "https://searx.bar",
      "https://searx.be",
      "https://searx.bissisoft.com",
      "https://searx.divided-by-zero.eu",
      "https://searx.dresden.network",
      "https://searx.esmailelbob.xyz",
      "https://searx.everdot.org",
      "https://searx.feneas.org",
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
      "https://searx.s1gm4.eu",
      "https://searx.sadblog.xyz",
      "https://searx.semipvt.com",
      "https://searx.slash-dev.de",
      "https://searx.solusar.de",
      "https://searx.sp-codes.de",
      "https://searx.stuehieyr.com",
      "https://searx.sunless.cloud",
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
      "https://searxzh.cn",
      "https://seeks.hsbp.org",
      "https://serx.cf",
      "https://spot.ecloud.global",
      "https://suche.dasnetzundich.de",
      "https://suche.uferwerk.org",
      "https://swag.pw",
      "https://sx.catgirl.cloud",
      "https://sx.fedi.tech",
      "https://timdor.noip.me",
      "https://trovu.komun.org",
      "https://www.gruble.de",
      "https://www.perfectpixel.de",
      "https://www.searxs.eu",
      "https://www.webrats.xyz",
      "https://xeek.com",
      "searx.roflcopter.fr"
    ],
    "onion": [
      "https://3afisqjw2rxm6z7mmstyt5rx75qfqrgxnkzftknbp2vhipr2nrmrjdyd.onion",
      "https://searxbgetrkiwxhdwi6svpgh7eotopqyxhbqiokrwzg7dcte44t36kyd.onion",
      "https://suche.xyzco456vwisukfg.onion",
      "https://w5rl6wsd7mzj4bdkbuqvzidet5osdsm5jhg2f7nvfidakfq5exda5wid.onion",
      "https://4n53nafyi77iplnbrpmxnp3x4exbswwxigujaxy3b37fvr7bvlopxeyd.onion",
      "https://z34ambyi6makk6ta7ksog2sljly2ctt2sa3apekb7wkllk72sxecdtad.onion",
      "https://search.4bkxscubgtxwvhpe.onion",
      "https://juy4e6eicawzdrz7.onion",
      "https://z5vawdol25vrmorm4yydmohsd4u6rdoj2sylvoi3e3nqvxkvpqul7bqd.onion",
      "https://zbuc3bbzbfdqqo2x46repx2ddajbha6fpsjeeptjhhhhzji3zopxdqyd.onion",
      "https://f4qfqajszpx5b7itzxt6mb7kj4ktpgbdq7lq6xaiqyqx6a7de3epptad.onion",
      "https://searx.cwuzdtzlubq5uual.onion",
      "https://rq2w52kyrif3xpfihkgjnhqm3a5aqhoikpv72z3drpjglfzc2wr5z4yd.onion",
      "https://searx3aolosaf3urwnhpynlhuokqsgz47si4pzz5hvb7uuzyjncl2tid.onion",
      "https://searx.bsbvtqi5oq2cqzn32zt4cr2f2z2rwots3dq7gmdcnlyqoxko2wx6reqd.onion",
    ],
    "i2p": [
      "https://ransack.i2p",
      "https://mqamk4cfykdvhw5kjez2gnvse56gmnqxn7vkvvbuor4k4j2lbbnq.b32.i2p",
    ]
  },
  "whoogle": {
    "normal": [
      "https://s.alefvanoon.xyz",
      "https://search.albony.xyz",
      "https://search.exonip.de",
      "https://search.garudalinux.org",
      "https://search.sethforprivacy.com",
      "https://whoogle.fossho.st",
      "https://whooglesearch.net",
      "https://www.whooglesearch.ml",
      "https://whoogle.dcs0.hu",
    ]
  }
};


let disableSearch;
const getDisableSearch = () => disableSearch;
function setDisableSearch(val) {
  disableSearch = val;
  browser.storage.sync.set({ disableSearch })
}

let searchInstance;
const getSearchInstance = () => searchInstance;
function setSearchInstance(val) {
  searchInstance = val;
  browser.storage.sync.set({ searchInstance })
};

let searchFrontend;
const getSearchFrontend = () => searchFrontend;
function setSearchFrontend(val) {
  searchFrontend = val;
  browser.storage.sync.set({ searchFrontend })
};

function redirect(url, initiator) {
  console.info("searchFrontend:", searchFrontend)
  if (disableSearch || data.isException(url, initiator)) {
    return null;
  }

  let instance;
  let path;
  if (searchFrontend == 'searx') {
    instance = commonHelper.getRandomInstance(searchHelper.redirects.searx.normal);
    path = "/"
  }
  if (searchFrontend == 'whoogle') {
    instance = commonHelper.getRandomInstance(searchHelper.redirects.whoogle.normal);
    path = "/search"
  }

  let searchQuery = "";
  url.search.slice(1).split("&").forEach(function (input) {
    if (input.startsWith("q=")) searchQuery = input;
  });
  return `${instance}${path}?${searchQuery}`;
}

export default {
  targets,
  redirects,
  getDisableSearch,
  setDisableSearch,
  getSearchInstance,
  setSearchInstance,
  getSearchFrontend,
  setSearchFrontend,
  redirect,
};

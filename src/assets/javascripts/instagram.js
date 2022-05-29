window.browser = window.browser || window.chrome;
import utils from './utils.js'

const targets = [
  "instagram.com",
  "www.instagram.com",
];
let redirects = {
  "bibliogram": {
    "normal": [],
    "tor": []
  }
};
function setRedirects(val) {
  browser.storage.local.get('cloudflareList', async r => {
    redirects.bibliogram = val;
    bibliogramNormalRedirectsChecks = [...redirects.bibliogram.normal];
    for (const instance of r.cloudflareList) {
      const a = bibliogramNormalRedirectsChecks.indexOf(instance);
      if (a > -1) bibliogramNormalRedirectsChecks.splice(a, 1);
    }
    browser.storage.local.set({
      instagramRedirects: redirects,
      bibliogramNormalRedirectsChecks
    })
  })
}

let
  disableInstagram,
  instagramProtocol,
  instagramRedirects,
  bibliogramNormalRedirectsChecks,
  bibliogramTorRedirectsChecks,
  bibliogramNormalCustomRedirects,
  bibliogramTorCustomRedirects;

function init() {
  return new Promise(async resolve => {
    browser.storage.local.get(
      [
        "disableInstagram",
        "instagramProtocol",
        "instagramRedirects",
        "bibliogramNormalRedirectsChecks",
        "bibliogramTorRedirectsChecks",
        "bibliogramNormalCustomRedirects",
        "bibliogramTorCustomRedirects",
      ],
      r => {
        disableInstagram = r.disableInstagram;
        instagramProtocol = r.instagramProtocol;
        instagramRedirects = r.instagramRedirects;
        bibliogramNormalRedirectsChecks = r.bibliogramNormalRedirectsChecks;
        bibliogramTorRedirectsChecks = r.bibliogramTorRedirectsChecks;
        bibliogramNormalCustomRedirects = r.bibliogramNormalCustomRedirects;
        bibliogramTorCustomRedirects = r.bibliogramTorCustomRedirects;
        resolve();
      }
    )
  })
}

init();
browser.storage.onChanged.addListener(init)

function all() {
  return [
    ...instagramRedirects.bibliogram.normal,
    ...instagramRedirects.bibliogram.tor,
    ...bibliogramNormalCustomRedirects,
    ...bibliogramTorCustomRedirects,
  ]
}

function redirect(url, type, initiator) {
  if (disableInstagram) return;
  if (initiator && all().includes(initiator.origin)) return 'BYPASSTAB';
  if (!targets.includes(url.host)) return;
  if (!["main_frame", "sub_frame", "xmlhttprequest", "other", "image", "media"].includes(type)) return;

  const bypassPaths = [/about/, /explore/, /support/, /press/, /api/, /privacy/, /safety/, /admin/, /\/(accounts\/|embeds?.js)/];
  if (bypassPaths.some(rx => rx.test(url.pathname))) return;

  let instancesList;
  if (instagramProtocol == 'normal') instancesList = [...bibliogramNormalRedirectsChecks, ...bibliogramNormalCustomRedirects];
  else if (instagramProtocol == 'tor') instancesList = [...bibliogramTorRedirectsChecks, ...bibliogramTorCustomRedirects];
  if (instancesList.length === 0) return;
  let randomInstance = utils.getRandomInstance(instancesList)

  const reservedPaths = ["u", "p", "privacy",];
  if (url.pathname === "/" || reservedPaths.includes(url.pathname.split("/")[1]))
    return `${randomInstance}${url.pathname}${url.search}`;
  if (url.pathname.startsWith("/reel") || url.pathname.startsWith("/tv"))
    return `${randomInstance}/p${url.pathname.replace(/\/reel|\/tv/i, '')}${url.search}`;
  else
    return `${randomInstance}/u${url.pathname}${url.search}`; // Likely a user profile, redirect to '/u/...'
}

function reverse(url) {
  return new Promise(async resolve => {
    await init();
    const protocolHost = utils.protocolHost(url);
    if (!all().includes(protocolHost)) { resolve(); return; }

    if (url.pathname.startsWith('/p')) resolve(`https://instagram.com${url.pathname.replace('/p', '')}${url.search}`);
    if (url.pathname.startsWith('/u')) resolve(`https://instagram.com${url.pathname.replace('/u', '')}${url.search}`);
    resolve(`https://instagram.com${url.pathname}${url.search}`);
  })
}

function switchInstance(url) {
  return new Promise(async resolve => {
    await init();
    let protocolHost = utils.protocolHost(url);
    if (!all().includes(protocolHost)) { resolve(); return; }

    let instancesList;
    if (instagramProtocol == 'normal') instancesList = [...bibliogramNormalCustomRedirects, ...bibliogramNormalRedirectsChecks];
    else if (instagramProtocol == 'tor') instancesList = [...bibliogramTorCustomRedirects, ...bibliogramTorRedirectsChecks];

    const i = instancesList.indexOf(protocolHost);
    if (i > -1) instancesList.splice(i, 1);
    if (instancesList.length === 0) { resolve(); return; }

    const randomInstance = utils.getRandomInstance(instancesList);
    resolve(`${randomInstance}${url.pathname}${url.search}`);
  })
}

function initDefaults() {
  return new Promise(resolve => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
      redirects.bibliogram = dataJson.bibliogram;
      browser.storage.local.get('cloudflareList', r => {
        bibliogramNormalRedirectsChecks = [...redirects.bibliogram.normal];
        for (const instance of r.cloudflareList) {
          const i = bibliogramNormalRedirectsChecks.indexOf(instance);
          if (i > -1) bibliogramNormalRedirectsChecks.splice(i, 1);
        }
        browser.storage.local.set({
          disableInstagram: false,
          instagramRedirects: redirects,

          bibliogramNormalRedirectsChecks: bibliogramNormalRedirectsChecks,
          bibliogramTorRedirectsChecks: [],

          bibliogramNormalCustomRedirects: [...redirects.bibliogram.tor],
          bibliogramTorCustomRedirects: [],
          instagramProtocol: "normal",
        })
        resolve();
      }
      )
    })
  })
}

export default {
  setRedirects,
  reverse,
  redirect,
  initDefaults,
  switchInstance,
};

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
  redirects.bibliogram = val;
  browser.storage.local.set({ instagramRedirects: redirects })
  console.log("instagramRedirects: ", val)
  for (const item of bibliogramNormalRedirectsChecks)
    if (!redirects.bibliogram.normal.includes(item)) {
      var index = bibliogramNormalRedirectsChecks.indexOf(item);
      if (index !== -1) bibliogramNormalRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ bibliogramNormalRedirectsChecks });
}

let bibliogramNormalRedirectsChecks;

function redirect(url, type, initiator) {
  return new Promise(resolve => {
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
        if (r.disableInstagram) { resolve(); return; }
        if (
          initiator &&
          ([
            ...r.instagramRedirects.bibliogram.normal,
            ...r.instagramRedirects.bibliogram.tor,
            ...r.bibliogramNormalCustomRedirects,
            ...r.bibliogramTorCustomRedirects,
          ].includes(initiator.origin) || targets.includes(initiator.host))
        ) { resolve('BYPASSTAB'); return; }

        if (!targets.includes(url.host)) { resolve(); return; }
        if (!["main_frame", "sub_frame", "xmlhttprequest", "other", "image", "media"].includes(type)) { resolve(); return; }

        const bypassPaths = [/about/, /explore/, /support/, /press/, /api/, /privacy/, /safety/, /admin/, /\/(accounts\/|embeds?.js)/];
        if (bypassPaths.some(rx => rx.test(url.pathname))) { resolve(); return; }

        let instancesList;
        if (r.instagramProtocol == 'normal') instancesList = [...r.bibliogramNormalRedirectsChecks, ...r.bibliogramNormalCustomRedirects];
        else if (r.instagramProtocol == 'tor') instancesList = [...r.bibliogramTorRedirectsChecks, ...r.bibliogramTorCustomRedirects];
        if (instancesList.length === 0) { resolve(); return; }
        let randomInstance = utils.getRandomInstance(instancesList)

        const reservedPaths = ["u", "p", "privacy",];
        if (url.pathname === "/" || reservedPaths.includes(url.pathname.split("/")[1]))
          resolve(`${randomInstance}${url.pathname}${url.search}`);
        if (url.pathname.startsWith("/reel") || url.pathname.startsWith("/tv"))
          resolve(`${randomInstance}/p${url.pathname.replace(/\/reel|\/tv/i, '')}${url.search}`);
        else
          resolve(`${randomInstance}/u${url.pathname}${url.search}`); // Likely a user profile, redirect to '/u/...'
      }
    )
  })
}
function reverse(url) {
  browser.storage.local.get(
    [
      "instagramRedirects",
      "bibliogramNormalCustomRedirects",
      "bibliogramTorCustomRedirects",
    ],
    r => {
      let protocolHost = utils.protocolHost(url);
      if (
        ![
          ...r.instagramRedirects.bibliogram.normal,
          ...r.instagramRedirects.bibliogram.tor,
          ...r.bibliogramNormalCustomRedirects,
          ...r.bibliogramTorCustomRedirects
        ].includes(protocolHost)
      ) return;

      if (url.pathname.startsWith('/p'))
        return `https://instagram.com${url.pathname.replace('/p', '')}${url.search}`;

      if (url.pathname.startsWith('/u'))
        return `https://instagram.com${url.pathname.replace('/u', '')}${url.search}`;

      return `https://instagram.com${url.pathname}${url.search}`;
    }
  )
}

function switchInstance(url) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "instagramRedirects",
        "instagramProtocol",

        "bibliogramNormalRedirectsChecks",
        "bibliogramTorRedirectsChecks",

        "bibliogramNormalCustomRedirects",
        "bibliogramTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(url);

        if (![
          ...r.instagramRedirects.bibliogram.normal,
          ...r.instagramRedirects.bibliogram.tor,
          ...r.bibliogramNormalCustomRedirects,
          ...r.bibliogramTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }

        let instancesList;
        if (r.instagramProtocol == 'normal') instancesList = [...r.bibliogramNormalCustomRedirects, ...r.bibliogramNormalRedirectsChecks];
        else if (r.instagramProtocol == 'tor') instancesList = [...r.bibliogramTorCustomRedirects, ...r.bibliogramTorRedirectsChecks];

        let index = instancesList.indexOf(protocolHost);
        if (index > -1) instancesList.splice(index, 1);
        if (instancesList.length === 0) { resolve(); return; }

        let randomInstance = utils.getRandomInstance(instancesList);
        resolve(`${randomInstance}${url.pathname}${url.search}`);
      }
    )
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
          let i = bibliogramNormalRedirectsChecks.indexOf(instance);
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

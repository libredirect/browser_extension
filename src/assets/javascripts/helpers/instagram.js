window.browser = window.browser || window.chrome;
import commonHelper from './common.js'

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
const getRedirects = () => redirects;
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
let bibliogramTorRedirectsChecks;
let bibliogramNormalCustomRedirects = [];
let bibliogramTorCustomRedirects = [];

const reservedPaths = [
  "u",
  "p",
  "privacy",
];

const bypassPaths = [
  /about/,
  /explore/,
  /support/,
  /press/,
  /api/,
  /privacy/,
  /safety/,
  /admin/,
  /\/(accounts\/|embeds?.js)/
];

let disable; //disableInstagram
let protocol; //instagramProtocol

function redirect(url, type, initiator) {
  if (disable) return;
  if (
    initiator &&
    ([...redirects.bibliogram.normal, ...bibliogramNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))
  ) return;

  if (!targets.includes(url.host)) return;

  if (![
    "main_frame",
    "sub_frame",
    "xmlhttprequest",
    "other",
    "image",
    "media",
  ].includes(type)) return null;

  if (bypassPaths.some(rx => rx.test(url.pathname))) return;

  let instancesList;
  if (protocol == 'normal') instancesList = [...bibliogramNormalRedirectsChecks, ...bibliogramNormalCustomRedirects];
  else if (protocol == 'tor') instancesList = [...bibliogramTorRedirectsChecks, ...bibliogramTorCustomRedirects];
  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  if (url.pathname === "/" || reservedPaths.includes(url.pathname.split("/")[1]))
    return `${randomInstance}${url.pathname}${url.search}`;
  if (url.pathname.startsWith("/reel") || url.pathname.startsWith("/tv"))
    return `${randomInstance}/p${url.pathname.replace(/\/reel|\/tv/i, '')}${url.search}`;
  else
    return `${randomInstance}/u${url.pathname}${url.search}`; // Likely a user profile, redirect to '/u/...'
}

async function reverse(url) {
  browser.storage.local.get(
    [
      "instagramRedirects",
      "bibliogramNormalCustomRedirects",
      "bibliogramTorCustomRedirects",
    ],
    r => {
      let protocolHost = commonHelper.protocolHost(url);
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
  let protocolHost = commonHelper.protocolHost(url);

  let instagramList = [
    ...redirects.bibliogram.normal,
    ...redirects.bibliogram.tor,
    ...bibliogramNormalCustomRedirects,
    ...bibliogramTorCustomRedirects,
  ];

  if (!instagramList.includes(protocolHost)) return null;

  let instancesList;
  if (protocol == 'normal') instancesList = [...bibliogramNormalCustomRedirects, ...bibliogramNormalRedirectsChecks];
  else if (protocol == 'tor') instancesList = [...bibliogramTorCustomRedirects, ...bibliogramTorRedirectsChecks];

  console.log("instancesList", instancesList);
  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length === 0) return null;

  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return `${randomInstance}${url.pathname}${url.search}`;
}

function isBibliogram(url) {
  let protocolHost = commonHelper.protocolHost(url);
  return [
    ...redirects.bibliogram.normal,
    ...redirects.bibliogram.tor,
    ...bibliogramNormalCustomRedirects,
    ...bibliogramTorCustomRedirects,
  ].includes(protocolHost);
}

let instancesCookies;
let theme;
function initBibliogramCookies(url) {
  let protocolHost = commonHelper.protocolHost(url);
  browser.cookies.get(
    { url: protocolHost, name: "settings" },
    cookie => {
      if (!cookie || !instancesCookies.includes(protocolHost)) {
        console.log(`initing cookie for ${protocolHost}`);
        let request = new XMLHttpRequest();
        request.open("POST", `${protocolHost}/settings/return?referrer=%2F`);

        let themeValue;
        if (theme == 'light') themeValue = "classic";
        if (theme == 'dark') themeValue = "pussthecat.org-v2"

        if (themeValue) {
          let data = `csrf=x&theme=${themeValue}`;
          request.send(data);
          if (!instancesCookies.includes(protocolHost)) instancesCookies.push(protocolHost);
          browser.storage.local.set({ instancesCookies })
        }
      }
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

          theme: 'DEFAULT',

          instancesCookies: [],

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

async function init() {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableInstagram",
        "instagramRedirects",

        "theme",

        "instancesCookies",

        "bibliogramNormalRedirectsChecks",
        "bibliogramTorRedirectsChecks",

        "bibliogramNormalCustomRedirects",
        "bibliogramTorCustomRedirects",
        "instagramProtocol"
      ],
      r => {
        disable = r.disableInstagram;
        if (r.instagramRedirects) redirects = r.instagramRedirects

        theme = r.theme;

        instancesCookies = r.instancesCookies;

        bibliogramNormalRedirectsChecks = r.bibliogramNormalRedirectsChecks;
        bibliogramNormalCustomRedirects = r.bibliogramNormalCustomRedirects;

        bibliogramTorRedirectsChecks = r.bibliogramTorRedirectsChecks;
        bibliogramTorCustomRedirects = r.bibliogramTorCustomRedirects;

        protocol = r.instagramProtocol;

        resolve();
      }
    )
  })
}

export default {
  getRedirects,
  setRedirects,

  reverse,

  isBibliogram,
  initBibliogramCookies,

  redirect,
  init,
  initDefaults,
  switchInstance,
};

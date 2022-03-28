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
const getCustomRedirects = function () {
  return {
    "bibliogram": {
      "normal": [...bibliogramNormalRedirectsChecks, ...bibliogramNormalCustomRedirects]
    },
  };
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
  setBibliogramNormalRedirectsChecks(bibliogramNormalRedirectsChecks);
}

let bibliogramNormalRedirectsChecks;
const getBibliogramNormalRedirectsChecks = () => bibliogramNormalRedirectsChecks;
function setBibliogramNormalRedirectsChecks(val) {
  bibliogramNormalRedirectsChecks = val;
  browser.storage.local.set({ bibliogramNormalRedirectsChecks })
  console.log("bibliogramNormalRedirectsChecks: ", val)
}

let bibliogramTorRedirectsChecks;
const getBibliogramTorRedirectsChecks = () => bibliogramTorRedirectsChecks;
function setBibliogramTorRedirectsChecks(val) {
  bibliogramTorRedirectsChecks = val;
  browser.storage.local.set({ bibliogramTorRedirectsChecks })
  console.log("bibliogramTorRedirectsChecks: ", val)
}

let bibliogramNormalCustomRedirects = [];
const getBibliogramNormalCustomRedirects = () => bibliogramNormalCustomRedirects;
function setBibliogramNormalCustomRedirects(val) {
  bibliogramNormalCustomRedirects = val;
  browser.storage.local.set({ bibliogramNormalCustomRedirects })
  console.log("bibliogramNormalCustomRedirects: ", val)
}

let bibliogramTorCustomRedirects = [];
const getBibliogramTorCustomRedirects = () => bibliogramTorCustomRedirects;
function setBibliogramTorCustomRedirects(val) {
  bibliogramTorCustomRedirects = val;
  browser.storage.local.set({ bibliogramTorCustomRedirects })
  console.log("bibliogramTorCustomRedirects: ", val)
}

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

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ disableInstagram: disable })
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
  protocol = val;
  browser.storage.local.set({ nitterProtocol: val })
  console.log("nitterProtocol: ", val)
}

function redirect(url, type, initiator) {
  if (disable) return;
  if (
    initiator &&
    ([...redirects.bibliogram.normal, ...bibliogramNormalCustomRedirects].includes(initiator.origin) || targets.includes(initiator.host))
  ) return;

  if (!targets.includes(url.host)) return;

  if (type !== "main_frame" || bypassPaths.some(rx => rx.test(url.pathname))) return;

  let instancesList;
  if (protocol == 'normal') instancesList = [...bibliogramNormalRedirectsChecks, ...bibliogramNormalCustomRedirects];
  else if (protocol == 'tor') instancesList = [...bibliogramTorRedirectsChecks, ...bibliogramTorCustomRedirects];
  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList)

  if (url.pathname === "/" || reservedPaths.includes(url.pathname.split("/")[1]))
    return `${randomInstance}${url.pathname}${url.search}`;
  if (url.pathname.startsWith("/reel") || url.pathname.startsWith("/tv"))
    return `${randomInstance}/p${url.pathname}${url.search}`;
  else
    return `${randomInstance}/u${url.pathname}${url.search}`; // Likely a user profile, redirect to '/u/...'
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
let applyThemeToSites;
function initBibliogramCookies(url) {
  let protocolHost = commonHelper.protocolHost(url);
  browser.cookies.get(
    {
      url: protocolHost,
      name: "settings"
    },
    cookie => {
      if (!cookie || !instancesCookies.includes(protocolHost)) {
        console.log(`initing cookie for ${protocolHost}`);
        let request = new XMLHttpRequest();
        request.open("POST", `${protocolHost}/settings/return?referrer=%2F`);

        if (applyThemeToSites) {
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
      } else {
        console.log("cookie url", protocolHost);
        console.log("instancesCookies", instancesCookies);
      };
    })

}

async function init() {
  return new Promise((resolve) => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
      browser.storage.local.get(
        [
          "disableInstagram",
          "instagramRedirects",

          "theme",
          "applyThemeToSites",

          "instancesCookies",

          "bibliogramNormalRedirectsChecks",
          "bibliogramTorRedirectsChecks",

          "bibliogramNormalCustomRedirects",
          "bibliogramTorCustomRedirects",
          "instagramProtocol"
        ],
        r => {
          disable = r.disableInstagram ?? false;

          redirects.bibliogram = dataJson.bibliogram;

          if (r.instagramRedirects) redirects = r.instagramRedirects

          theme = r.theme ?? 'DEFAULT';
          applyThemeToSites = r.applyThemeToSites ?? false;

          instancesCookies = r.instancesCookies ?? [];

          bibliogramNormalRedirectsChecks = r.bibliogramNormalRedirectsChecks ?? [...redirects.bibliogram.normal];
          bibliogramNormalCustomRedirects = r.bibliogramNormalCustomRedirects ?? [];

          bibliogramTorRedirectsChecks = r.bibliogramTorRedirectsChecks ?? [...redirects.bibliogram.tor];
          bibliogramTorCustomRedirects = r.bibliogramTorCustomRedirects ?? [];

          protocol = r.instagramProtocol ?? "normal";

          resolve();
        }
      )
    })
  })
}

export default {
  getRedirects,
  getCustomRedirects,
  setRedirects,

  getDisable,
  setDisable,

  getProtocol,
  setProtocol,

  isBibliogram,
  initBibliogramCookies,

  getBibliogramNormalRedirectsChecks,
  setBibliogramNormalRedirectsChecks,
  getBibliogramTorRedirectsChecks,
  setBibliogramTorRedirectsChecks,

  getBibliogramNormalCustomRedirects,
  setBibliogramNormalCustomRedirects,
  getBibliogramTorCustomRedirects,
  setBibliogramTorCustomRedirects,

  redirect,
  init,
  switchInstance,
};

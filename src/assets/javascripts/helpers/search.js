window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
  /^https?:\/{2}(www\.|search\.|)google(\.[a-z]{2,3}){1,2}(\/search(\?.*|$)|\/$)/,
  /^https?:\/{2}(www\.|www2\.|)bing\.com/,

  /^https?:\/{2}yandex(\.[a-z]{2,3}){1,2}/,

  /^https?:\/{2}libredirect\.invalid/,
];
let redirects = {
  "searx": {
    "normal": [],
    "tor": [],
    "i2p": []
  },
  "searxng": {
    "normal": [],
    "tor": [],
    "i2p": []
  },
  "whoogle": {
    "normal": [],
    "tor": [],
    "i2p": []
  }
};

function setSearxRedirects(val) {
  redirects.searx = val;
  browser.storage.local.set({ searchRedirects: redirects })
  console.log("searxRedirects:", val)
  for (const item of searxNormalRedirectsChecks) if (!redirects.searx.normal.includes(item)) {
    var index = searxNormalRedirectsChecks.indexOf(item);
    if (index !== -1) searxNormalRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ searxNormalRedirectsChecks });

  for (const item of searxTorRedirectsChecks) if (!redirects.searx.tor.includes(item)) {
    var index = searxTorRedirectsChecks.indexOf(item);
    if (index !== -1) searxTorRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ searxTorRedirectsChecks })

  for (const item of searxI2pRedirectsChecks) if (!redirects.searx.i2p.includes(item)) {
    var index = searxI2pRedirectsChecks.indexOf(item);
    if (index !== -1) searxI2pRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ searxI2pRedirectsChecks });
}

function setSearxngRedirects(val) {
  redirects.searxng = val;
  browser.storage.local.set({ searchRedirects: redirects })
  console.log("searxngRedirects:", val)
  for (const item of searxngNormalRedirectsChecks) if (!redirects.searxng.normal.includes(item)) {
    var index = searxngNormalRedirectsChecks.indexOf(item);
    if (index !== -1) searxngNormalRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ searxngNormalRedirectsChecks })

  for (const item of searxngTorRedirectsChecks) if (!redirects.searxng.tor.includes(item)) {
    var index = searxngTorRedirectsChecks.indexOf(item);
    if (index !== -1) searxngTorRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ searxngTorRedirectsChecks });

  for (const item of searxngI2pRedirectsChecks) if (!redirects.searxng.i2p.includes(item)) {
    var index = searxngI2pRedirectsChecks.indexOf(item);
    if (index !== -1) searxngI2pRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ searxngI2pRedirectsChecks })
}

function setWhoogleRedirects(val) {
  redirects.whoogle = val;
  browser.storage.local.set({ searchRedirects: redirects })
  console.log("whoogleRedirects:", val)
  for (const item of whoogleNormalRedirectsChecks) if (!redirects.whoogle.normal.includes(item)) {
    var index = whoogleNormalRedirectsChecks.indexOf(item);
    if (index !== -1) whoogleNormalRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ whoogleNormalRedirectsChecks })

  for (const item of whoogleTorRedirectsChecks) if (!redirects.whoogle.tor.includes(item)) {
    var index = whoogleTorRedirectsChecks.indexOf(item);
    if (index !== -1) whoogleTorRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ whoogleTorRedirectsChecks })

  for (const item of whoogleI2pRedirectsChecks) if (!redirects.whoogle.i2p.includes(item)) {
    var index = whoogleI2pRedirectsChecks.indexOf(item);
    if (index !== -1) whoogleI2pRedirectsChecks.splice(index, 1);
  }
  browser.storage.local.set({ whoogleI2pRedirectsChecks })
}

let
  searxNormalRedirectsChecks,
  searxI2pRedirectsChecks,
  searxTorRedirectsChecks,

  searxNormalCustomRedirects,
  searxTorCustomRedirects,
  searxI2pCustomRedirects,

  searxngNormalRedirectsChecks,
  searxngI2pRedirectsChecks,
  searxngTorRedirectsChecks,

  searxngNormalCustomRedirects,
  searxngTorCustomRedirects,
  searxngI2pCustomRedirects,

  whoogleNormalRedirectsChecks,
  whoogleI2pRedirectsChecks,
  whoogleTorRedirectsChecks,

  whoogleNormalCustomRedirects,
  whoogleTorCustomRedirects,
  whoogleI2pCustomRedirects;

let disable, // disableSearch
  frontend, // searchFrontend
  protocol; // searchProtocol

function initSearxCookies(from) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "searchProtocol",
        "searxNormalRedirectsChecks",
        "searxNormalCustomRedirects",
        "searxTorRedirectsChecks",
        "searxTorCustomRedirects",
        "searxI2pRedirectsChecks",
        "searxI2pCustomRedirects",
      ],
      r => {
        let protocolHost = commonHelper.protocolHost(from);
        if (![
          ...r.searxNormalRedirectsChecks,
          ...r.searxNormalCustomRedirects,
          ...r.searxTorRedirectsChecks,
          ...r.searxTorCustomRedirects,
          ...r.searxI2pRedirectsChecks,
          ...r.searxI2pCustomRedirects,
        ].includes(protocolHost)) resolve();

        let checkedInstances;
        if (protocol == 'normal') checkedInstances = [...r.searxNormalRedirectsChecks, ...r.searxNormalCustomRedirects];
        else if (protocol == 'tor') checkedInstances = [...r.searxTorRedirectsChecks, ...r.searxTorCustomRedirects];
        else if (protocol == 'i2p') checkedInstances = [...r.searxI2pRedirectsChecks, ...r.searxI2pCustomRedirects];
        for (const to of checkedInstances) {
          commonHelper.copyCookie('searx', from, to, 'advanced_search');
          commonHelper.copyCookie('searx', from, to, 'autocomplete');
          commonHelper.copyCookie('searx', from, to, 'categories');
          commonHelper.copyCookie('searx', from, to, 'disabled_engines');
          commonHelper.copyCookie('searx', from, to, 'disabled_plugins');
          commonHelper.copyCookie('searx', from, to, 'doi_resolver');
          commonHelper.copyCookie('searx', from, to, 'enabled_engines');
          commonHelper.copyCookie('searx', from, to, 'enabled_plugins');
          commonHelper.copyCookie('searx', from, to, 'image_proxy');
          commonHelper.copyCookie('searx', from, to, 'language');
          commonHelper.copyCookie('searx', from, to, 'locale');
          commonHelper.copyCookie('searx', from, to, 'method');
          commonHelper.copyCookie('searx', from, to, 'oscar-style');
          commonHelper.copyCookie('searx', from, to, 'results_on_new_tab');
          commonHelper.copyCookie('searx', from, to, 'safesearch');
          commonHelper.copyCookie('searx', from, to, 'theme');
          commonHelper.copyCookie('searx', from, to, 'tokens');
        }
        resolve(true);
      }
    )
  })
}

function initSearxngCookies(from) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "searchProtocol",
        "searxngNormalRedirectsChecks",
        "searxngNormalCustomRedirects",
        "searxngTorRedirectsChecks",
        "searxngTorCustomRedirects",
        "searxngI2pRedirectsChecks",
        "searxngI2pCustomRedirects",
      ],
      r => {
        let protocolHost = commonHelper.protocolHost(from);
        if (![
          ...r.searxngNormalRedirectsChecks,
          ...r.searxngNormalCustomRedirects,
          ...r.searxngTorRedirectsChecks,
          ...r.searxngTorCustomRedirects,
          ...r.searxngI2pRedirectsChecks,
          ...r.searxngI2pCustomRedirects,
        ].includes(protocolHost)) resolve();

        let checkedInstances;
        if (r.searchProtocol == 'normal') checkedInstances = [...r.searxngNormalRedirectsChecks, ...r.searxngNormalCustomRedirects];
        else if (r.searchProtocol == 'tor') checkedInstances = [...r.searxngTorRedirectsChecks, ...r.searxngTorCustomRedirects];
        else if (r.searchProtocol == 'i2p') checkedInstances = [...r.searxngI2pRedirectsChecks, ...r.searxngI2pCustomRedirects];
        for (const to of checkedInstances) {
          commonHelper.copyCookie('searxng', from, to, 'autocomplete');
          commonHelper.copyCookie('searxng', from, to, 'categories');
          commonHelper.copyCookie('searxng', from, to, 'disabled_engines');
          commonHelper.copyCookie('searxng', from, to, 'disabled_plugins');
          commonHelper.copyCookie('searxng', from, to, 'doi_resolver');
          commonHelper.copyCookie('searxng', from, to, 'enabled_plugins');
          commonHelper.copyCookie('searxng', from, to, 'enabled_engines');
          commonHelper.copyCookie('searxng', from, to, 'image_proxy');
          commonHelper.copyCookie('searxng', from, to, 'infinite_scroll');
          commonHelper.copyCookie('searxng', from, to, 'language');
          commonHelper.copyCookie('searxng', from, to, 'locale');
          commonHelper.copyCookie('searxng', from, to, 'maintab');
          commonHelper.copyCookie('searxng', from, to, 'method');
          commonHelper.copyCookie('searxng', from, to, 'query_in_title');
          commonHelper.copyCookie('searxng', from, to, 'results_on_new_tab');
          commonHelper.copyCookie('searxng', from, to, 'safesearch');
          commonHelper.copyCookie('searxng', from, to, 'simple_style');
          commonHelper.copyCookie('searxng', from, to, 'theme');
          commonHelper.copyCookie('searxng', from, to, 'tokens');
        }
        resolve(true);
      }
    )
  })
}

function redirect(url) {
  if (disable) return;
  if (!targets.some(rx => rx.test(url.href))) return;
  if (url.searchParams.has('tbm')) return;
  if (url.hostname.includes('google') && !url.searchParams.has('q') && url.pathname != '/') return;
  let randomInstance;
  let path;
  if (frontend == 'searx') {
    let instancesList;
    if (protocol == 'normal') instancesList = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...searxTorRedirectsChecks, ...searxTorCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...searxI2pRedirectsChecks, ...searxI2pCustomRedirects];
    if (instancesList.length === 0) return null;
    randomInstance = commonHelper.getRandomInstance(instancesList)
    path = "/";
  }
  else if (frontend == 'searxng') {
    let instancesList;
    if (protocol == 'normal') instancesList = [...searxngNormalRedirectsChecks, ...searxngNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...searxngTorRedirectsChecks, ...searxngTorCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...searxngI2pRedirectsChecks, ...searxngI2pCustomRedirects];
    if (instancesList.length === 0) return null;
    randomInstance = commonHelper.getRandomInstance(instancesList)
    path = "/";
  }
  else if (frontend == 'whoogle') {
    let instancesList;
    if (protocol == 'normal') instancesList = [...whoogleNormalRedirectsChecks, ...whoogleNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...whoogleTorRedirectsChecks, ...whoogleTorCustomRedirects];
    if (protocol == 'i2p') instancesList = [...whoogleI2pRedirectsChecks, ...whoogleI2pCustomRedirects];
    if (instancesList.length === 0) return null;
    randomInstance = commonHelper.getRandomInstance(instancesList)
    path = "/search";
  }

  if (
    ((url.hostname.includes('google') || url.hostname.includes('bing')) && !url.searchParams.has('q')) ||
    (url.hostname.includes('yandex') && !url.searchParams.has('text'))
  ) path = '/';

  let searchQuery = "";

  if (
    (
      url.hostname.includes('google') ||
      url.hostname.includes('bing') ||
      url.hostname.includes('libredirect.invalid')
    ) &&
    url.searchParams.has('q')
  ) searchQuery = `?q=${url.searchParams.get('q')}`;
  if (url.hostname.includes('yandex') && url.searchParams.has('text')) searchQuery = `?q=${url.searchParams.get('text')}`;

  return `${randomInstance}${path}${searchQuery}`;
}

function switchInstance(url) {
  let protocolHost = commonHelper.protocolHost(url);

  let searchList = [
    ...redirects.searx.normal,
    ...redirects.searx.tor,
    ...redirects.searx.i2p,

    ...searxNormalCustomRedirects,
    ...searxTorCustomRedirects,
    ...searxI2pCustomRedirects,

    ...redirects.searx.normal,
    ...redirects.searxng.tor,
    ...redirects.searxng.i2p,

    ...searxngNormalCustomRedirects,
    ...searxngTorCustomRedirects,
    ...searxngI2pCustomRedirects,

    ...redirects.whoogle.normal,
    ...redirects.whoogle.tor,
    ...redirects.whoogle.i2p,

    ...whoogleNormalCustomRedirects,
    ...whoogleTorCustomRedirects,
    ...whoogleI2pCustomRedirects,
  ]

  if (!searchList.includes(protocolHost)) return null;

  let instancesList;
  if (frontend == 'searx') {
    if (protocol == 'normal') instancesList = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...searxTorRedirectsChecks, ...searxTorCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...searxI2pRedirectsChecks, ...searxI2pCustomRedirects];
  }
  else if (frontend == 'searxng') {
    if (protocol == 'normal') instancesList = [...searxngNormalRedirectsChecks, ...searxngNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...searxngTorRedirectsChecks, ...searxngTorCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...searxngI2pRedirectsChecks, ...searxngI2pCustomRedirects];
  }
  else if (frontend == 'whoogle') {
    if (protocol == 'normal') instancesList = [...whoogleNormalRedirectsChecks, ...whoogleNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...whoogleTorRedirectsChecks, ...whoogleTorCustomRedirects];
    else if (protocol == 'i2p') instancesList = [...whoogleI2pRedirectsChecks, ...whoogleI2pCustomRedirects];
  }

  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length === 0) return null;

  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return `${randomInstance}${url.pathname}${url.search}`;
}

async function initDefaults() {
  await fetch('/instances/data.json').then(response => response.text()).then(async data => {
    let dataJson = JSON.parse(data);
    redirects.searx = dataJson.searx;
    redirects.searxng = dataJson.searxng;
    redirects.whoogle = dataJson.whoogle;

    browser.storage.local.get('cloudflareList', async r => {
      whoogleNormalRedirectsChecks = [...redirects.whoogle.normal];
      searxNormalRedirectsChecks = [...redirects.searx.normal];
      searxngNormalRedirectsChecks = [...redirects.searxng.normal];
      for (const instance of r.cloudflareList) {
        let i;

        i = whoogleNormalRedirectsChecks.indexOf(instance);
        if (i > -1) whoogleNormalRedirectsChecks.splice(i, 1);

        i = searxNormalRedirectsChecks.indexOf(instance);
        if (i > -1) searxNormalRedirectsChecks.splice(i, 1);

        i = searxngNormalRedirectsChecks.indexOf(instance);
        if (i > -1) searxngNormalRedirectsChecks.splice(i, 1);
      }
      await browser.storage.local.set({
        disableSearch: false,
        searchFrontend: 'searxng',
        searchRedirects: redirects,
        searxngCustomSettings: false,
        searchProtocol: 'normal',

        whoogleNormalRedirectsChecks: whoogleNormalRedirectsChecks,
        whoogleNormalCustomRedirects: [],

        whoogleTorRedirectsChecks: [...redirects.whoogle.tor],
        whoogleTorCustomRedirects: [],

        whoogleI2pRedirectsChecks: [...redirects.whoogle.i2p],
        whoogleI2pCustomRedirects: [],

        searxNormalRedirectsChecks: searxNormalRedirectsChecks,
        searxNormalCustomRedirects: [],

        searxTorRedirectsChecks: [...redirects.searx.tor],
        searxTorCustomRedirects: [],

        searxI2pRedirectsChecks: [...redirects.searx.i2p],
        searxI2pCustomRedirects: [],

        searxngNormalRedirectsChecks: searxngNormalRedirectsChecks,
        searxngNormalCustomRedirects: [],

        searxngTorRedirectsChecks: [...redirects.searxng.tor],
        searxngTorCustomRedirects: [],

        searxngI2pRedirectsChecks: [...redirects.searxng.i2p],
        searxngI2pCustomRedirects: [],
      })
    })
  })
}

async function init() {
  browser.storage.local.get(
    [
      "disableSearch",
      "searchFrontend",
      "searchRedirects",
      "searchProtocol",

      "whoogleNormalRedirectsChecks",
      "whoogleNormalCustomRedirects",

      "whoogleTorRedirectsChecks",
      "whoogleTorCustomRedirects",

      "whoogleI2pRedirectsChecks",
      "whoogleI2pCustomRedirects",

      "searxNormalRedirectsChecks",
      "searxNormalCustomRedirects",

      "searxTorRedirectsChecks",
      "searxTorCustomRedirects",

      "searxI2pRedirectsChecks",
      "searxI2pCustomRedirects",

      "searxngNormalRedirectsChecks",
      "searxngNormalCustomRedirects",

      "searxngTorRedirectsChecks",
      "searxngTorCustomRedirects",

      "searxngI2pRedirectsChecks",
      "searxngI2pCustomRedirects",
    ],
    r => {
      disable = r.disableSearch;
      protocol = r.searchProtocol;
      frontend = r.searchFrontend;
      redirects = r.searchRedirects;

      whoogleNormalRedirectsChecks = r.whoogleNormalRedirectsChecks;
      whoogleNormalCustomRedirects = r.whoogleNormalCustomRedirects;

      whoogleTorRedirectsChecks = r.whoogleTorRedirectsChecks;
      whoogleTorCustomRedirects = r.whoogleTorCustomRedirects;

      whoogleI2pRedirectsChecks = r.whoogleI2pRedirectsChecks;
      whoogleI2pCustomRedirects = r.whoogleI2pCustomRedirects;

      searxNormalRedirectsChecks = r.searxNormalRedirectsChecks;
      searxNormalCustomRedirects = r.searxNormalCustomRedirects;

      searxTorRedirectsChecks = r.searxTorRedirectsChecks;
      searxTorCustomRedirects = r.searxTorCustomRedirects;

      searxI2pRedirectsChecks = r.searxI2pRedirectsChecks;
      searxI2pCustomRedirects = r.searxI2pCustomRedirects;

      searxngNormalRedirectsChecks = r.searxngNormalRedirectsChecks;
      searxngNormalCustomRedirects = r.searxngNormalCustomRedirects;

      searxngTorRedirectsChecks = r.searxngTorRedirectsChecks;
      searxngTorCustomRedirects = r.searxngTorCustomRedirects;

      searxngI2pRedirectsChecks = r.searxngI2pRedirectsChecks;
      searxngI2pCustomRedirects = r.searxngI2pCustomRedirects;
    }
  );
}

export default {
  setSearxRedirects,
  setSearxngRedirects,
  setWhoogleRedirects,

  initSearxCookies,
  initSearxngCookies,

  redirect,
  initDefaults,
  init,
  switchInstance,
};

window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = [
  /^https?:\/{2}(www\.|search\.|)google(\.[a-z]{2,3}){1,2}(\/search(\?.*|$)|\/$)/,
  /^https?:\/{2}(www\.|www2\.|)bing\.com/,
  /^https?:\/{2}yandex(\.[a-z]{2,3}){1,2}/,
  /^https?:\/{2}search\.libredirect\.invalid/,
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

function setRedirects(val) {
  browser.storage.local.get('cloudflareList', r => {
    redirects = val;
    searxNormalRedirectsChecks = [...redirects.searx.normal];
    searxngNormalRedirectsChecks = [...redirects.searxng.normal];
    whoogleNormalRedirectsChecks = [...redirects.whoogle.normal];
    for (const instance of r.cloudflareList) {
      const a = searxNormalRedirectsChecks.indexOf(instance);
      if (a > -1) searxNormalRedirectsChecks.splice(a, 1);

      const b = searxngNormalRedirectsChecks.indexOf(instance);
      if (b > -1) searxngNormalRedirectsChecks.splice(b, 1);

      const c = whoogleNormalRedirectsChecks.indexOf(instance);
      if (c > -1) whoogleNormalRedirectsChecks.splice(c, 1);
    }
    browser.storage.local.set({
      searchRedirects: redirects,
      searxNormalRedirectsChecks,
      searxngNormalRedirectsChecks,
      whoogleNormalRedirectsChecks,
    });
  })
}

let
  disableSearch,
  searchFrontend,
  searchRedirects,
  searchProtocol,
  whoogleNormalRedirectsChecks,
  whoogleNormalCustomRedirects,
  whoogleTorRedirectsChecks,
  whoogleTorCustomRedirects,
  whoogleI2pRedirectsChecks,
  whoogleI2pCustomRedirects,
  searxNormalRedirectsChecks,
  searxNormalCustomRedirects,
  searxTorRedirectsChecks,
  searxTorCustomRedirects,
  searxI2pRedirectsChecks,
  searxI2pCustomRedirects,
  searxngNormalRedirectsChecks,
  searxngNormalCustomRedirects,
  searxngTorRedirectsChecks,
  searxngTorCustomRedirects,
  searxngI2pRedirectsChecks,
  searxngI2pCustomRedirects;

function init() {
  return new Promise(async resolve => {
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
        disableSearch = r.disableSearch;
        searchFrontend = r.searchFrontend;
        searchRedirects = r.searchRedirects;
        searchProtocol = r.searchProtocol;
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
        resolve();
      }
    )
  })
}

init();
browser.storage.onChanged.addListener(init)

function initSearxCookies(test, from) {
  return new Promise(async resolve => {
    await init();
    let protocolHost = utils.protocolHost(from);
    if (![
      ...searxNormalRedirectsChecks,
      ...searxNormalCustomRedirects,
      ...searxTorRedirectsChecks,
      ...searxTorCustomRedirects,
      ...searxI2pRedirectsChecks,
      ...searxI2pCustomRedirects,
    ].includes(protocolHost)) { resolve(); return; }

    if (!test) {
      let checkedInstances;
      if (searchProtocol == 'normal') checkedInstances = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects];
      else if (searchProtocol == 'tor') checkedInstances = [...searxTorRedirectsChecks, ...searxTorCustomRedirects];
      else if (searchProtocol == 'i2p') checkedInstances = [...searxI2pRedirectsChecks, ...searxI2pCustomRedirects];
      await utils.copyCookie('searx', from, checkedInstances, 'advanced_search');
      await utils.copyCookie('searx', from, checkedInstances, 'autocomplete');
      await utils.copyCookie('searx', from, checkedInstances, 'categories');
      await utils.copyCookie('searx', from, checkedInstances, 'disabled_engines');
      await utils.copyCookie('searx', from, checkedInstances, 'disabled_plugins');
      await utils.copyCookie('searx', from, checkedInstances, 'doi_resolver');
      await utils.copyCookie('searx', from, checkedInstances, 'enabled_engines');
      await utils.copyCookie('searx', from, checkedInstances, 'enabled_plugins');
      await utils.copyCookie('searx', from, checkedInstances, 'image_proxy');
      await utils.copyCookie('searx', from, checkedInstances, 'language');
      await utils.copyCookie('searx', from, checkedInstances, 'locale');
      await utils.copyCookie('searx', from, checkedInstances, 'method');
      await utils.copyCookie('searx', from, checkedInstances, 'oscar-style');
      await utils.copyCookie('searx', from, checkedInstances, 'results_on_new_tab');
      await utils.copyCookie('searx', from, checkedInstances, 'safesearch');
      await utils.copyCookie('searx', from, checkedInstances, 'theme');
      await utils.copyCookie('searx', from, checkedInstances, 'tokens');
    }
    resolve(true);
  })
}

function setSearxCookies() {
  return new Promise(async resolve => {
    await init();
    if (disableSearch || searchFrontend != 'searx') { resolve(); return; }
    let checkedInstances;
    if (searchProtocol == 'normal') checkedInstances = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects]
    else if (searchProtocol == 'tor') checkedInstances = [...searxTorRedirectsChecks, ...searxTorCustomRedirects]
    for (const to of checkedInstances) {
      utils.getCookiesFromStorage('searx', to, 'advanced_search');
      utils.getCookiesFromStorage('searx', to, 'autocomplete');
      utils.getCookiesFromStorage('searx', to, 'categories');
      utils.getCookiesFromStorage('searx', to, 'disabled_engines');
      utils.getCookiesFromStorage('searx', to, 'disabled_plugins');
      utils.getCookiesFromStorage('searx', to, 'doi_resolver');
      utils.getCookiesFromStorage('searx', to, 'enabled_engines');
      utils.getCookiesFromStorage('searx', to, 'enabled_plugins');
      utils.getCookiesFromStorage('searx', to, 'image_proxy');
      utils.getCookiesFromStorage('searx', to, 'language');
      utils.getCookiesFromStorage('searx', to, 'locale');
      utils.getCookiesFromStorage('searx', to, 'method');
      utils.getCookiesFromStorage('searx', to, 'oscar-style');
      utils.getCookiesFromStorage('searx', to, 'results_on_new_tab');
      utils.getCookiesFromStorage('searx', to, 'safesearch');
      utils.getCookiesFromStorage('searx', to, 'theme');
      utils.getCookiesFromStorage('searx', to, 'tokens');
    }
    resolve();
  })
}

function initSearxngCookies(test, from) {
  return new Promise(async resolve => {
    await init();
    let protocolHost = utils.protocolHost(from);
    if (![
      ...searxngNormalRedirectsChecks,
      ...searxngNormalCustomRedirects,
      ...searxngTorRedirectsChecks,
      ...searxngTorCustomRedirects,
      ...searxngI2pRedirectsChecks,
      ...searxngI2pCustomRedirects,
    ].includes(protocolHost)) { resolve(); return; }

    if (!test) {
      let checkedInstances;
      if (searchProtocol == 'normal') checkedInstances = [...searxngNormalRedirectsChecks, ...searxngNormalCustomRedirects];
      else if (searchProtocol == 'tor') checkedInstances = [...searxngTorRedirectsChecks, ...searxngTorCustomRedirects];
      else if (searchProtocol == 'i2p') checkedInstances = [...searxngI2pRedirectsChecks, ...searxngI2pCustomRedirects];
      await utils.copyCookie('searxng', from, checkedInstances, 'autocomplete');
      await utils.copyCookie('searxng', from, checkedInstances, 'categories');
      await utils.copyCookie('searxng', from, checkedInstances, 'disabled_engines');
      await utils.copyCookie('searxng', from, checkedInstances, 'disabled_plugins');
      await utils.copyCookie('searxng', from, checkedInstances, 'doi_resolver');
      await utils.copyCookie('searxng', from, checkedInstances, 'enabled_plugins');
      await utils.copyCookie('searxng', from, checkedInstances, 'enabled_engines');
      await utils.copyCookie('searxng', from, checkedInstances, 'image_proxy');
      await utils.copyCookie('searxng', from, checkedInstances, 'infinite_scroll');
      await utils.copyCookie('searxng', from, checkedInstances, 'language');
      await utils.copyCookie('searxng', from, checkedInstances, 'locale');
      await utils.copyCookie('searxng', from, checkedInstances, 'maintab');
      await utils.copyCookie('searxng', from, checkedInstances, 'method');
      await utils.copyCookie('searxng', from, checkedInstances, 'query_in_title');
      await utils.copyCookie('searxng', from, checkedInstances, 'results_on_new_tab');
      await utils.copyCookie('searxng', from, checkedInstances, 'safesearch');
      await utils.copyCookie('searxng', from, checkedInstances, 'simple_style');
      await utils.copyCookie('searxng', from, checkedInstances, 'theme');
      await utils.copyCookie('searxng', from, checkedInstances, 'tokens');
    }
    resolve(true);
  })
}

function setSearxngCookies() {
  return new Promise(async resolve => {
    await init();
    if (disableSearch || searchFrontend != 'searxng', searchProtocol === undefined) { resolve(); return; }
    let checkedInstances;
    if (searchProtocol == 'normal') checkedInstances = [...searxngNormalRedirectsChecks, ...searxngNormalCustomRedirects]
    else if (searchProtocol == 'tor') checkedInstances = [...searxngTorRedirectsChecks, ...searxngTorCustomRedirects]
    for (const to of checkedInstances) {
      utils.getCookiesFromStorage('searxng', to, 'autocomplete');
      utils.getCookiesFromStorage('searxng', to, 'categories');
      utils.getCookiesFromStorage('searxng', to, 'disabled_engines');
      utils.getCookiesFromStorage('searxng', to, 'disabled_plugins');
      utils.getCookiesFromStorage('searxng', to, 'doi_resolver');
      utils.getCookiesFromStorage('searxng', to, 'enabled_plugins');
      utils.getCookiesFromStorage('searxng', to, 'enabled_engines');
      utils.getCookiesFromStorage('searxng', to, 'image_proxy');
      utils.getCookiesFromStorage('searxng', to, 'infinite_scroll');
      utils.getCookiesFromStorage('searxng', to, 'language');
      utils.getCookiesFromStorage('searxng', to, 'locale');
      utils.getCookiesFromStorage('searxng', to, 'maintab');
      utils.getCookiesFromStorage('searxng', to, 'method');
      utils.getCookiesFromStorage('searxng', to, 'query_in_title');
      utils.getCookiesFromStorage('searxng', to, 'results_on_new_tab');
      utils.getCookiesFromStorage('searxng', to, 'safesearch');
      utils.getCookiesFromStorage('searxng', to, 'simple_style');
      utils.getCookiesFromStorage('searxng', to, 'theme');
      utils.getCookiesFromStorage('searxng', to, 'tokens');
    }
    resolve();
  })
}


function redirect(url) {
  if (disableSearch) return;
  if (!targets.some(rx => rx.test(url.href))) return;
  if (url.searchParams.has('tbm')) return;
  if (url.hostname.includes('google') && !url.searchParams.has('q') && url.pathname != '/') return;
  let randomInstance;
  let path;
  if (searchFrontend == 'searx') {
    let instancesList;
    if (searchProtocol == 'normal') instancesList = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects];
    else if (searchProtocol == 'tor') instancesList = [...searxTorRedirectsChecks, ...searxTorCustomRedirects];
    else if (searchProtocol == 'i2p') instancesList = [...searxI2pRedirectsChecks, ...searxI2pCustomRedirects];
    if (instancesList.length === 0) return;
    randomInstance = utils.getRandomInstance(instancesList)
    path = "/";
  }
  else if (searchFrontend == 'searxng') {
    let instancesList;
    if (searchProtocol == 'normal') instancesList = [...searxngNormalRedirectsChecks, ...searxngNormalCustomRedirects];
    else if (searchProtocol == 'tor') instancesList = [...searxngTorRedirectsChecks, ...searxngTorCustomRedirects];
    else if (searchProtocol == 'i2p') instancesList = [...searxngI2pRedirectsChecks, ...searxngI2pCustomRedirects];
    if (instancesList.length === 0) return;
    randomInstance = utils.getRandomInstance(instancesList)
    path = "/";
  }
  else if (searchFrontend == 'whoogle') {
    let instancesList;
    if (searchProtocol == 'normal') instancesList = [...whoogleNormalRedirectsChecks, ...whoogleNormalCustomRedirects];
    if (searchProtocol == 'tor') instancesList = [...whoogleTorRedirectsChecks, ...whoogleTorCustomRedirects];
    if (searchProtocol == 'i2p') instancesList = [...whoogleI2pRedirectsChecks, ...whoogleI2pCustomRedirects];
    if (instancesList.length === 0) return;
    randomInstance = utils.getRandomInstance(instancesList)
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
      url.hostname.includes('search.libredirect.invalid')
    ) &&
    url.searchParams.has('q')
  ) searchQuery = `?q=${url.searchParams.get('q')}`;
  if (url.hostname.includes('yandex') && url.searchParams.has('text')) searchQuery = `?q=${url.searchParams.get('text')}`;

  return `${randomInstance}${path}${searchQuery}`;
}

function switchInstance(url) {
  return new Promise(async resolve => {
    await init();
    let protocolHost = utils.protocolHost(url);
    if (![
      ...searchRedirects.searx.normal,
      ...searchRedirects.searx.tor,
      ...searchRedirects.searx.i2p,

      ...searchRedirects.searxng.normal,
      ...searchRedirects.searxng.tor,
      ...searchRedirects.searxng.i2p,

      ...searchRedirects.whoogle.normal,
      ...searchRedirects.whoogle.tor,
      ...searchRedirects.whoogle.i2p,

      ...searxNormalCustomRedirects,
      ...searxTorCustomRedirects,
      ...searxI2pCustomRedirects,

      ...searxngNormalCustomRedirects,
      ...searxngTorCustomRedirects,
      ...searxngI2pCustomRedirects,

      ...whoogleNormalCustomRedirects,
      ...whoogleTorCustomRedirects,
      ...whoogleI2pCustomRedirects,
    ].includes(protocolHost)) { resolve(); return; }

    let instancesList;
    if (searchProtocol == 'normal') {
      if (searchFrontend == 'searx') instancesList = [...searxNormalRedirectsChecks, ...searxNormalCustomRedirects];
      else if (searchFrontend == 'searxng') instancesList = [...searxngNormalRedirectsChecks, ...searxngNormalCustomRedirects];
      else if (searchFrontend == 'whoogle') instancesList = [...whoogleNormalRedirectsChecks, ...whoogleNormalCustomRedirects];
    }
    else if (searchProtocol == 'tor') {
      if (searchFrontend == 'searx') instancesList = [...searxTorRedirectsChecks, ...searxTorCustomRedirects];
      else if (searchFrontend == 'searxng') instancesList = [...searxngTorRedirectsChecks, ...searxngTorCustomRedirects];
      else if (searchFrontend == 'whoogle') instancesList = [...whoogleTorRedirectsChecks, ...whoogleTorCustomRedirects];
    }
    else if (searchProtocol == 'i2p') {
      if (searchFrontend == 'searx') instancesList = [...searxI2pRedirectsChecks, ...searxI2pCustomRedirects];
      else if (searchFrontend == 'searxng') instancesList = [...searxngI2pRedirectsChecks, ...searxngI2pCustomRedirects];
      else if (searchFrontend == 'whoogle') instancesList = [...whoogleI2pRedirectsChecks, ...whoogleI2pCustomRedirects];
    }

    const i = instancesList.indexOf(protocolHost);
    if (i > -1) instancesList.splice(i, 1);
    if (instancesList.length === 0) { resolve(); return; }

    const randomInstance = utils.getRandomInstance(instancesList);
    resolve(`${randomInstance}${url.pathname}${url.search}`);
  })
}

function initDefaults() {
  return new Promise(async resolve => {
    fetch('/instances/data.json').then(response => response.text()).then(async data => {
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
        resolve();
      })
    })
  })
}

export default {
  setRedirects,
  initSearxCookies,
  setSearxCookies,
  initSearxngCookies,
  setSearxngCookies,
  redirect,
  initDefaults,
  switchInstance,
};

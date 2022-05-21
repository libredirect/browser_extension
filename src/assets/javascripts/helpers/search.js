window.browser = window.browser || window.chrome;

import utils from './utils.js'

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

  searxngNormalRedirectsChecks,
  searxngI2pRedirectsChecks,
  searxngTorRedirectsChecks,

  whoogleNormalRedirectsChecks,
  whoogleI2pRedirectsChecks,
  whoogleTorRedirectsChecks;

function initSearxCookies(test, from) {
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
        let protocolHost = utils.protocolHost(from);
        if (![
          ...r.searxNormalRedirectsChecks,
          ...r.searxNormalCustomRedirects,
          ...r.searxTorRedirectsChecks,
          ...r.searxTorCustomRedirects,
          ...r.searxI2pRedirectsChecks,
          ...r.searxI2pCustomRedirects,
        ].includes(protocolHost)) return;

        if (!test) {
          let checkedInstances;
          if (r.searchProtocol == 'normal') checkedInstances = [...r.searxNormalRedirectsChecks, ...r.searxNormalCustomRedirects];
          else if (r.searchProtocol == 'tor') checkedInstances = [...r.searxTorRedirectsChecks, ...r.searxTorCustomRedirects];
          else if (r.searchProtocol == 'i2p') checkedInstances = [...r.searxI2pRedirectsChecks, ...r.searxI2pCustomRedirects];
          for (const to of checkedInstances) {
            utils.copyCookie('searx', from, to, 'advanced_search');
            utils.copyCookie('searx', from, to, 'autocomplete');
            utils.copyCookie('searx', from, to, 'categories');
            utils.copyCookie('searx', from, to, 'disabled_engines');
            utils.copyCookie('searx', from, to, 'disabled_plugins');
            utils.copyCookie('searx', from, to, 'doi_resolver');
            utils.copyCookie('searx', from, to, 'enabled_engines');
            utils.copyCookie('searx', from, to, 'enabled_plugins');
            utils.copyCookie('searx', from, to, 'image_proxy');
            utils.copyCookie('searx', from, to, 'language');
            utils.copyCookie('searx', from, to, 'locale');
            utils.copyCookie('searx', from, to, 'method');
            utils.copyCookie('searx', from, to, 'oscar-style');
            utils.copyCookie('searx', from, to, 'results_on_new_tab');
            utils.copyCookie('searx', from, to, 'safesearch');
            utils.copyCookie('searx', from, to, 'theme');
            utils.copyCookie('searx', from, to, 'tokens');
          }
        }
        resolve(true);
      }
    )
  })
}

function setSearxCookies() {
  browser.storage.local.get(
    [
      "disableSearch",
      "searchProtocol",
      "searchFrontend",
      "searxNormalRedirectsChecks",
      "searxNormalCustomRedirects",
      "searxTorRedirectsChecks",
      "searxTorCustomRedirects",
    ],
    r => {
      if (r.disableSearch || r.searchFrontend != 'searx', r.searchProtocol === undefined) return;
      let checkedInstances;
      if (r.searchProtocol == 'normal') checkedInstances = [...r.searxNormalRedirectsChecks, ...r.searxNormalCustomRedirects]
      else if (r.searchProtocol == 'tor') checkedInstances = [...r.searxTorRedirectsChecks, ...r.searxTorCustomRedirects]
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
    }
  )
}

function initSearxngCookies(test, from) {
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
        let protocolHost = utils.protocolHost(from);
        if (![
          ...r.searxngNormalRedirectsChecks,
          ...r.searxngNormalCustomRedirects,
          ...r.searxngTorRedirectsChecks,
          ...r.searxngTorCustomRedirects,
          ...r.searxngI2pRedirectsChecks,
          ...r.searxngI2pCustomRedirects,
        ].includes(protocolHost)) return;

        if (!test) {
          let checkedInstances;
          if (r.searchProtocol == 'normal') checkedInstances = [...r.searxngNormalRedirectsChecks, ...r.searxngNormalCustomRedirects];
          else if (r.searchProtocol == 'tor') checkedInstances = [...r.searxngTorRedirectsChecks, ...r.searxngTorCustomRedirects];
          else if (r.searchProtocol == 'i2p') checkedInstances = [...r.searxngI2pRedirectsChecks, ...r.searxngI2pCustomRedirects];
          for (const to of checkedInstances) {
            utils.copyCookie('searxng', from, to, 'autocomplete');
            utils.copyCookie('searxng', from, to, 'categories');
            utils.copyCookie('searxng', from, to, 'disabled_engines');
            utils.copyCookie('searxng', from, to, 'disabled_plugins');
            utils.copyCookie('searxng', from, to, 'doi_resolver');
            utils.copyCookie('searxng', from, to, 'enabled_plugins');
            utils.copyCookie('searxng', from, to, 'enabled_engines');
            utils.copyCookie('searxng', from, to, 'image_proxy');
            utils.copyCookie('searxng', from, to, 'infinite_scroll');
            utils.copyCookie('searxng', from, to, 'language');
            utils.copyCookie('searxng', from, to, 'locale');
            utils.copyCookie('searxng', from, to, 'maintab');
            utils.copyCookie('searxng', from, to, 'method');
            utils.copyCookie('searxng', from, to, 'query_in_title');
            utils.copyCookie('searxng', from, to, 'results_on_new_tab');
            utils.copyCookie('searxng', from, to, 'safesearch');
            utils.copyCookie('searxng', from, to, 'simple_style');
            utils.copyCookie('searxng', from, to, 'theme');
            utils.copyCookie('searxng', from, to, 'tokens');
          }
        }
        resolve(true);
      }
    )
  })
}

function setSearxngCookies() {
  browser.storage.local.get(
    [
      "searchProtocol",
      "disableSearch",
      "searchFrontend",
      "searxngNormalRedirectsChecks",
      "searxngNormalCustomRedirects",
      "searxngTorRedirectsChecks",
      "searxngTorCustomRedirects",
    ],
    r => {
      if (r.disableSearch || r.searchFrontend != 'searxng', r.searchProtocol === undefined) return;
      let checkedInstances;
      if (r.searchProtocol == 'normal') checkedInstances = [...r.searxngNormalRedirectsChecks, ...r.searxngNormalCustomRedirects]
      else if (r.searchProtocol == 'tor') checkedInstances = [...r.searxngTorRedirectsChecks, ...r.searxngTorCustomRedirects]
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
    }
  )
}

function redirect(url) {
  return new Promise(resolve => {
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
        if (r.disableSearch) { resolve(); return; }
        if (!targets.some(rx => rx.test(url.href))) { resolve(); return; }
        if (url.searchParams.has('tbm')) { resolve(); return; }
        if (url.hostname.includes('google') && !url.searchParams.has('q') && url.pathname != '/') { resolve(); return; }
        let randomInstance;
        let path;
        if (r.searchFrontend == 'searx') {
          let instancesList;
          if (r.searchProtocol == 'normal') instancesList = [...r.searxNormalRedirectsChecks, ...r.searxNormalCustomRedirects];
          else if (r.searchProtocol == 'tor') instancesList = [...r.searxTorRedirectsChecks, ...r.searxTorCustomRedirects];
          else if (r.searchProtocol == 'i2p') instancesList = [...r.searxI2pRedirectsChecks, ...r.searxI2pCustomRedirects];
          if (instancesList.length === 0) { resolve(); return; }
          randomInstance = utils.getRandomInstance(instancesList)
          path = "/";
        }
        else if (r.searchFrontend == 'searxng') {
          let instancesList;
          if (r.searchProtocol == 'normal') instancesList = [...r.searxngNormalRedirectsChecks, ...r.searxngNormalCustomRedirects];
          else if (r.searchProtocol == 'tor') instancesList = [...r.searxngTorRedirectsChecks, ...r.searxngTorCustomRedirects];
          else if (r.searchProtocol == 'i2p') instancesList = [...r.searxngI2pRedirectsChecks, ...r.searxngI2pCustomRedirects];
          if (instancesList.length === 0) { resolve(); return; }
          randomInstance = utils.getRandomInstance(instancesList)
          path = "/";
        }
        else if (r.searchFrontend == 'whoogle') {
          let instancesList;
          if (r.searchProtocol == 'normal') instancesList = [...r.whoogleNormalRedirectsChecks, ...r.whoogleNormalCustomRedirects];
          if (r.searchProtocol == 'tor') instancesList = [...r.whoogleTorRedirectsChecks, ...r.whoogleTorCustomRedirects];
          if (r.searchProtocol == 'i2p') instancesList = [...r.whoogleI2pRedirectsChecks, ...r.whoogleI2pCustomRedirects];
          if (instancesList.length === 0) { resolve(); return; }
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
            url.hostname.includes('libredirect.invalid')
          ) &&
          url.searchParams.has('q')
        ) searchQuery = `?q=${url.searchParams.get('q')}`;
        if (url.hostname.includes('yandex') && url.searchParams.has('text')) searchQuery = `?q=${url.searchParams.get('text')}`;

        resolve(`${randomInstance}${path}${searchQuery}`);
      })
  })
}

async function switchInstance(url) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
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
        let protocolHost = utils.protocolHost(url);
        if (![
          ...r.searchRedirects.searx.normal,
          ...r.searchRedirects.searx.tor,
          ...r.searchRedirects.searx.i2p,

          ...r.searchRedirects.searxng.normal,
          ...r.searchRedirects.searxng.tor,
          ...r.searchRedirects.searxng.i2p,

          ...r.searchRedirects.whoogle.normal,
          ...r.searchRedirects.whoogle.tor,
          ...r.searchRedirects.whoogle.i2p,

          ...r.searxNormalCustomRedirects,
          ...r.searxTorCustomRedirects,
          ...r.searxI2pCustomRedirects,

          ...r.searxngNormalCustomRedirects,
          ...r.searxngTorCustomRedirects,
          ...r.searxngI2pCustomRedirects,

          ...r.whoogleNormalCustomRedirects,
          ...r.whoogleTorCustomRedirects,
          ...r.whoogleI2pCustomRedirects,
        ].includes(protocolHost)) {

          resolve();
        }

        let instancesList;
        if (r.searchProtocol == 'normal') {
          if (r.searchFrontend == 'searx') instancesList = [...r.searxNormalRedirectsChecks, ...r.searxNormalCustomRedirects];
          else if (r.searchFrontend == 'searxng') instancesList = [...r.searxngNormalRedirectsChecks, ...r.searxngNormalCustomRedirects];
          else if (r.searchFrontend == 'whoogle') instancesList = [...r.whoogleNormalRedirectsChecks, ...r.whoogleNormalCustomRedirects];
        }
        else if (r.searchProtocol == 'tor') {
          if (r.searchFrontend == 'searx') instancesList = [...r.searxTorRedirectsChecks, ...r.searxTorCustomRedirects];
          else if (r.searchFrontend == 'searxng') instancesList = [...r.searxngTorRedirectsChecks, ...r.searxngTorCustomRedirects];
          else if (r.searchFrontend == 'whoogle') instancesList = [...r.whoogleTorRedirectsChecks, ...r.whoogleTorCustomRedirects];
        }
        else if (r.searchProtocol == 'i2p') {
          if (r.searchFrontend == 'searx') instancesList = [...r.searxI2pRedirectsChecks, ...r.searxI2pCustomRedirects];
          else if (r.searchFrontend == 'searxng') instancesList = [...r.searxngI2pRedirectsChecks, ...r.searxngI2pCustomRedirects];
          else if (r.searchFrontend == 'whoogle') instancesList = [...r.whoogleI2pRedirectsChecks, ...r.whoogleI2pCustomRedirects];
        }

        let index = instancesList.indexOf(protocolHost);
        if (index > -1) instancesList.splice(index, 1);
        if (instancesList.length === 0) resolve();

        let randomInstance = utils.getRandomInstance(instancesList);
        resolve(`${randomInstance}${url.pathname}${url.search}`);
      })
  })
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

export default {
  setSearxRedirects,
  setSearxngRedirects,
  setWhoogleRedirects,

  initSearxCookies,
  setSearxCookies,

  initSearxngCookies,
  setSearxngCookies,

  redirect,
  initDefaults,
  switchInstance,
};

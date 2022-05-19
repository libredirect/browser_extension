window.browser = window.browser || window.chrome;

import commonHelper from '../common.js'

const targets = [
  /^https?:\/{2}translate\.google(\.[a-z]{2,3}){1,2}\//,
];

let redirects = {
  "simplyTranslate": {
    "normal": [],
    "tor": []
  },
  "lingva": {
    "normal": [],
    "tor": []
  }
};

const getRedirects = () => redirects;

function setSimplyTranslateRedirects(val) {
  redirects.simplyTranslate = val;
  browser.storage.local.set({ translateRedirects: redirects })
  console.log("simplyTranslateRedirects:", val)
  for (const item of simplyTranslateNormalRedirectsChecks)
    if (!redirects.simplyTranslate.normal.includes(item)) {
      var index = simplyTranslateNormalRedirectsChecks.indexOf(item);
      if (index !== -1) simplyTranslateNormalRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ simplyTranslateNormalRedirectsChecks })

  for (const item of simplyTranslateTorRedirectsChecks)
    if (!redirects.simplyTranslate.normal.includes(item)) {
      var index = simplyTranslateTorRedirectsChecks.indexOf(item);
      if (index !== -1) simplyTranslateTorRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ simplyTranslateTorRedirectsChecks })
}

function setLingvaRedirects(val) {
  redirects.lingva = val;
  browser.storage.local.set({ translateRedirects: redirects })
  console.log("lingvaRedirects:", val)
  for (const item of lingvaNormalRedirectsChecks)
    if (!redirects.lingva.normal.includes(item)) {
      var index = lingvaNormalRedirectsChecks.indexOf(item);
      if (index !== -1) lingvaNormalRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ lingvaNormalRedirectsChecks })

  for (const item of lingvaTorRedirectsChecks)
    if (!redirects.lingva.normal.includes(item)) {
      var index = lingvaTorRedirectsChecks.indexOf(item);
      if (index !== -1) lingvaTorRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ lingvaTorRedirectsChecks })
}

let
  simplyTranslateNormalRedirectsChecks,
  simplyTranslateTorRedirectsChecks,
  simplyTranslateNormalCustomRedirects,
  simplyTranslateTorCustomRedirects,
  lingvaNormalRedirectsChecks,
  lingvaTorRedirectsChecks,
  lingvaNormalCustomRedirects,
  lingvaTorCustomRedirects;

let
  disable, // translateDisable
  frontend, // translateFrontend
  protocol; // translateProtocol

function isTranslateRedirects(url, type, frontend) {
  let protocolHost = commonHelper.protocolHost(url);

  if (type !== "main_frame") return;

  if (frontend == 'simplyTranslate')
    return [
      ...redirects.simplyTranslate.normal,
      ...redirects.simplyTranslate.tor,
      ...simplyTranslateNormalCustomRedirects,
      ...simplyTranslateTorCustomRedirects,
    ].includes(protocolHost);

  if (frontend == 'lingva')
    return [
      ...redirects.lingva.normal,
      ...redirects.lingva.tor,
      ...lingvaNormalCustomRedirects,
      ...lingvaTorCustomRedirects,
    ].includes(protocolHost);

  return [
    ...redirects.simplyTranslate.normal,
    ...redirects.simplyTranslate.tor,
    ...simplyTranslateNormalCustomRedirects,
    ...simplyTranslateTorCustomRedirects,

    ...redirects.lingva.normal,
    ...redirects.lingva.tor,
    ...lingvaNormalCustomRedirects,
    ...lingvaTorCustomRedirects,
  ].includes(protocolHost);
}

function initLingvaLocalStorage(url, tabId) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "lingvaNormalRedirectsChecks",
        "lingvaNormalCustomRedirects",
        "lingvaTorRedirectsChecks",
        "lingvaTorCustomRedirects",
      ],
      r => {
        let protocolHost = commonHelper.protocolHost(url);
        if (![
          ...r.lingvaNormalRedirectsChecks,
          ...r.lingvaTorRedirectsChecks,
          ...r.lingvaNormalCustomRedirects,
          ...r.lingvaTorCustomRedirects,
        ].includes(protocolHost)) return;
        browser.tabs.executeScript(
          tabId,
          {
            file: "/assets/javascripts/helpers/translate/get_lingva_preferences.js",
            runAt: "document_start"
          }
        );
        resolve(true);
      }
    )
  })
}

async function setLingvaLocalStorage(url, tabId) {
  browser.storage.local.get(
    [
      "disableYoutube",
      "youtubeFrontend",
      "lingvaNormalRedirectsChecks",
      "lingvaNormalCustomRedirects",
      "lingvaTorRedirectsChecks",
      "lingvaTorCustomRedirects",
    ],
    r => {
      if (r.disableYoutube || r.youtubeFrontend != 'lingva') return;
      let protocolHost = commonHelper.protocolHost(url);
      if (![
        ...r.lingvaNormalRedirectsChecks,
        ...r.lingvaTorRedirectsChecks,
        ...r.lingvaNormalCustomRedirects,
        ...r.lingvaTorCustomRedirects,
      ].includes(protocolHost)) return;
      browser.tabs.executeScript(
        tabId,
        {
          file: "/assets/javascripts/helpers/youtube/set_lingva_preferences.js",
          runAt: "document_start"
        }
      );
      return true;
    })
}

function initSimplyTranslateCookies(from) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "translateProtocol",
        "simplyTranslateNormalRedirectsChecks",
        "simplyTranslateNormalCustomRedirects",
        "simplyTranslateTorRedirectsChecks",
        "simplyTranslateTorCustomRedirects",
        "simplyTranslateI2pRedirectsChecks",
        "simplyTranslateI2pCustomRedirects",
      ],
      r => {
        let protocolHost = commonHelper.protocolHost(from);
        if (![
          ...r.simplyTranslateNormalRedirectsChecks,
          ...r.simplyTranslateNormalCustomRedirects,
          ...r.simplyTranslateTorRedirectsChecks,
          ...r.simplyTranslateTorCustomRedirects,
          ...r.simplyTranslateI2pRedirectsChecks,
          ...r.simplyTranslateI2pCustomRedirects,
        ].includes(protocolHost)) resolve();

        let checkedInstances;
        if (r.translateProtocol == 'normal') checkedInstances = [...r.simplyTranslateNormalRedirectsChecks, ...r.simplyTranslateNormalCustomRedirects]
        else if (r.translateProtocol == 'tor') checkedInstances = [...r.simplyTranslateTorRedirectsChecks, ...r.simplyTranslateTorCustomRedirects]
        else if (r.translateProtocol == 'i2p') checkedInstances = [...r.simplyTranslateI2pRedirectsChecks, ...r.simplyTranslateI2pCustomRedirects]
        for (const to of checkedInstances) {
          commonHelper.copyCookie('simplyTranslate', from, to, 'from_lang');
          commonHelper.copyCookie('simplyTranslate', from, to, 'to_lang');
          commonHelper.copyCookie('simplyTranslate', from, to, 'tts_enabled');
          commonHelper.copyCookie('simplyTranslate', from, to, 'use_text_fields');
        }
        resolve(true);
      }
    )
  })
}

function setSimplyTranslateCookies() {
  browser.storage.local.get(
    [
      "translateProtocol",
      "translateDisable",
      "translateFrontend",
      "simplyTranslateNormalRedirectsChecks",
      "simplyTranslateNormalCustomRedirects",
      "simplyTranslateTorRedirectsChecks",
      "simplyTranslateTorCustomRedirects",
    ],
    r => {
      if (r.translateDisable || r.translateFrontend != 'simplyTranslate' || r.translateProtocol === undefined) return;
      let checkedInstances;
      if (r.translateProtocol == 'normal') checkedInstances = [...r.simplyTranslateNormalRedirectsChecks, ...r.simplyTranslateNormalCustomRedirects]
      else if (r.translateProtocol == 'tor') checkedInstances = [...r.simplyTranslateTorRedirectsChecks, ...r.simplyTranslateTorCustomRedirects]
      for (const to of checkedInstances) {
        commonHelper.getCookiesFromStorage('simplyTranslate', to, 'from_lang');
        commonHelper.getCookiesFromStorage('simplyTranslate', to, 'to_lang');
        commonHelper.getCookiesFromStorage('simplyTranslate', to, 'tts_enabled');
        commonHelper.getCookiesFromStorage('simplyTranslate', to, 'use_text_fields');
      }
    }
  )
}

function redirect(url) {
  if (disable) return;
  if (!targets.some(rx => rx.test(url.href))) return;

  if (frontend == 'simplyTranslate') {
    let instancesList;
    if (protocol == 'normal') instancesList = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects];
    if (instancesList.length === 0) return;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    return `${randomInstance}/${url.search}`;
  }
  else if (frontend == 'lingva') {
    let params_arr = url.search.split('&');
    params_arr[0] = params_arr[0].substring(1);
    let myMap = {};
    for (let i = 0; i < params_arr.length; i++) {
      let pair = params_arr[i].split('=');
      myMap[pair[0]] = pair[1];
    }
    let instancesList;
    if (protocol == 'normal') instancesList = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects];
    if (instancesList.length === 0) return;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    if (myMap.sl && myMap.tl && myMap.text)
      return `${randomInstance}/${myMap.sl}/${myMap.tl}/${myMap.text}`;

    return randomInstance;
  }
}

function switchInstance(url) {
  let protocolHost = commonHelper.protocolHost(url);

  let translateList = [
    ...redirects.simplyTranslate.normal,
    ...redirects.simplyTranslate.tor,

    ...simplyTranslateNormalCustomRedirects,
    ...simplyTranslateTorCustomRedirects,

    ...redirects.lingva.normal,
    ...redirects.lingva.tor,

    ...lingvaNormalCustomRedirects,
    ...lingvaTorCustomRedirects,
  ]

  if (!translateList.includes(protocolHost)) return null;

  let instancesList;
  if (frontend == 'simplyTranslate') {
    if (protocol == 'normal') instancesList = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects];
  }
  else if (frontend == 'lingva') {
    if (protocol == 'normal') instancesList = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects];
  }

  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);
  if (instancesList.length === 0) return null;

  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return `${randomInstance}${url.pathname}${url.search}`;
}

async function initDefaults() {
  fetch('/instances/data.json').then(response => response.text()).then(async data => {
    let dataJson = JSON.parse(data);
    redirects.simplyTranslate = dataJson.simplyTranslate;
    redirects.lingva = dataJson.lingva;
    browser.storage.local.get('cloudflareList', async r => {
      simplyTranslateNormalRedirectsChecks = [...redirects.simplyTranslate.normal];
      lingvaNormalRedirectsChecks = [...redirects.lingva.normal]
      for (const instance of r.cloudflareList) {
        let i;

        i = simplyTranslateNormalRedirectsChecks.indexOf(instance);
        if (i > -1) simplyTranslateNormalRedirectsChecks.splice(i, 1);

        i = lingvaNormalRedirectsChecks.indexOf(instance);
        if (i > -1) lingvaNormalRedirectsChecks.splice(i, 1);
      }
      await browser.storage.local.set({
        translateDisable: false,
        translateFrontend: "simplyTranslate",
        translateProtocol: 'normal',
        translateRedirects: redirects,

        simplyTranslateNormalRedirectsChecks: simplyTranslateNormalRedirectsChecks,
        simplyTranslateNormalCustomRedirects: [],
        simplyTranslateTorRedirectsChecks: [...redirects.simplyTranslate.tor],
        simplyTranslateTorCustomRedirects: [],

        lingvaNormalRedirectsChecks: lingvaNormalRedirectsChecks,
        lingvaNormalCustomRedirects: [],
        lingvaTorRedirectsChecks: [...redirects.lingva.tor],
        lingvaTorCustomRedirects: [],
      })
    })
  })
}

async function init() {
  browser.storage.local.get(
    [
      "translateDisable",
      "translateFrontend",
      "translateProtocol",
      "translateRedirects",

      "simplyTranslateNormalRedirectsChecks",
      "simplyTranslateNormalCustomRedirects",
      "simplyTranslateTorRedirectsChecks",
      "simplyTranslateTorCustomRedirects",

      "lingvaNormalRedirectsChecks",
      "lingvaNormalCustomRedirects",
      "lingvaTorRedirectsChecks",
      "lingvaTorCustomRedirects",
    ],
    r => {
      disable = r.translateDisable;
      frontend = r.translateFrontend;
      protocol = r.translateProtocol;
      redirects = r.translateRedirects;

      simplyTranslateNormalRedirectsChecks = r.simplyTranslateNormalRedirectsChecks;
      simplyTranslateNormalCustomRedirects = r.simplyTranslateNormalCustomRedirects;

      simplyTranslateTorRedirectsChecks = r.simplyTranslateTorRedirectsChecks;
      simplyTranslateTorCustomRedirects = r.simplyTranslateTorCustomRedirects;

      lingvaNormalRedirectsChecks = r.lingvaNormalRedirectsChecks;
      lingvaNormalCustomRedirects = r.lingvaNormalCustomRedirects;

      lingvaTorRedirectsChecks = r.lingvaTorRedirectsChecks;
      lingvaTorCustomRedirects = r.lingvaTorCustomRedirects;
    });
}

export default {
  getRedirects,

  isTranslateRedirects,
  initSimplyTranslateCookies,
  setSimplyTranslateCookies,
  initLingvaLocalStorage,
  setLingvaLocalStorage,

  setSimplyTranslateRedirects,
  setLingvaRedirects,

  redirect,
  initDefaults,
  init,
  switchInstance,
};

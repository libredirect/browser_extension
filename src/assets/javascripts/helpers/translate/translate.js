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

let simplyTranslateNormalRedirectsChecks;
let simplyTranslateTorRedirectsChecks;
let simplyTranslateNormalCustomRedirects = [];
let simplyTranslateTorCustomRedirects = [];

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

let lingvaNormalRedirectsChecks;
let lingvaTorRedirectsChecks;
let lingvaNormalCustomRedirects = [];
let lingvaTorCustomRedirects = [];


let disable; // translateDisable
let frontend; // translateFrontend
let protocol; // translateProtocol

let from; // translateFrom
let to; // translateTo


let simplyTranslateEngine;

function isTranslateRedirects(url, type, frontend) {
  let protocolHost = commonHelper.protocolHost(url);

  if (type !== "main_frame") return false;

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

function initLingvaLocalStorage(tabId) {
  browser.tabs.executeScript(
    tabId,
    {
      file: "/assets/javascripts/helpers/translate/lingva-preferences.js",
      runAt: "document_start"
    }
  );
}

function redirect(url) {
  if (disable) return;
  if (!targets.some(rx => rx.test(url.href))) return;

  let params_arr = url.search.split('&');
  params_arr[0] = params_arr[0].substring(1);
  let myMap = {};
  for (let i = 0; i < params_arr.length; i++) {
    let pair = params_arr[i].split('=');
    myMap[pair[0]] = pair[1];
  }
  if (frontend == 'simplyTranslate') {
    let instancesList;
    if (protocol == 'normal') instancesList = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    if (myMap.sl && myMap.tl && myMap.text)
      return `${randomInstance}/${url.search}`;
    else {
      if (from != "DEFAULT") url.searchParams.append("sl", from);
      if (to != "DEFAULT") url.searchParams.append("tl", to);
      if (simplyTranslateEngine != "DEFAULT") url.searchParams.append("engine", simplyTranslateEngine);
      return `${randomInstance}/${url.search}`
    }
  }
  else if (frontend == 'lingva') {
    let instancesList;
    if (protocol == 'normal') instancesList = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects];
    if (protocol == 'tor') instancesList = [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    if (myMap.sl && myMap.tl && myMap.text)
      return `${randomInstance}/${myMap.sl}/${myMap.tl}/${myMap.text}`;
    else
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

  console.log("instancesList", instancesList);
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
    await browser.storage.local.set({
      translateDisable: false,
      translateFrontend: "simplyTranslate",
      translateProtocol: 'normal',
      translateRedirects: redirects,

      simplyTranslateNormalRedirectsChecks: [...redirects.simplyTranslate.normal],
      simplyTranslateNormalCustomRedirects: [],
      simplyTranslateTorRedirectsChecks: [...redirects.simplyTranslate.tor],
      simplyTranslateTorCustomRedirects: [],

      lingvaNormalRedirectsChecks: [...redirects.lingva.normal],
      lingvaNormalCustomRedirects: [],
      lingvaTorRedirectsChecks: [...redirects.lingva.tor],
      lingvaTorCustomRedirects: [],

      translateFrom: "auto",
      translateTo: 'en',
      simplyTranslateEngine: 'google',
    })
  })
}

async function init() {
  fetch('/instances/data.json').then(response => response.text()).then(data => {
    let dataJson = JSON.parse(data);
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

        "translateFrom",
        "translateTo",
        "simplyTranslateEngine",
      ],
      result => {
        disable = result.translateDisable;
        frontend = result.translateFrontend;
        protocol = result.translateProtocol;

        from = result.translateFrom;
        to = result.translateTo;
        simplyTranslateEngine = result.simplyTranslateEngine;

        redirects = result.translateRedirects;

        simplyTranslateNormalRedirectsChecks = result.simplyTranslateNormalRedirectsChecks;
        simplyTranslateNormalCustomRedirects = result.simplyTranslateNormalCustomRedirects;

        simplyTranslateTorRedirectsChecks = result.simplyTranslateTorRedirectsChecks;
        simplyTranslateTorCustomRedirects = result.simplyTranslateTorCustomRedirects;

        lingvaNormalRedirectsChecks = result.lingvaNormalRedirectsChecks;
        lingvaNormalCustomRedirects = result.lingvaNormalCustomRedirects;

        lingvaTorRedirectsChecks = result.lingvaTorRedirectsChecks;
        lingvaTorCustomRedirects = result.lingvaTorCustomRedirects;
      });
  });
}

export default {
  getRedirects,

  isTranslateRedirects,
  initLingvaLocalStorage,

  setSimplyTranslateRedirects,
  setLingvaRedirects,

  redirect,
  initDefaults,
  init,
  switchInstance,
};

window.browser = window.browser || window.chrome;

import commonHelper from '../common.js'

const targets = [
  "translate.google.com",
  "translate.google.no"
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
const getCustomRedirects = function () {
  return {
    "simplyTranslate": {
      "normal": [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects],
      "tor": [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects]
    },
    "lingva": {
      "normal": [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects],
      "tor": [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects]
    }
  };
};

function setSimplyTranslateRedirects(val) {
  redirects.simplyTranslate = val;
  browser.storage.local.set({ translateRedirects: redirects })
  console.log("simplyTranslateRedirects:", val)
  for (const item of simplyTranslateNormalRedirectsChecks)
    if (!redirects.simplyTranslate.normal.includes(item)) {
      var index = simplyTranslateNormalRedirectsChecks.indexOf(item);
      if (index !== -1) simplyTranslateNormalRedirectsChecks.splice(index, 1);
    }
  setSimplyTranslateNormalRedirectsChecks(simplyTranslateNormalRedirectsChecks);

  for (const item of simplyTranslateTorRedirectsChecks)
    if (!redirects.simplyTranslate.normal.includes(item)) {
      var index = simplyTranslateTorRedirectsChecks.indexOf(item);
      if (index !== -1) simplyTranslateTorRedirectsChecks.splice(index, 1);
    }
  setSimplyTranslateTorRedirectsChecks(simplyTranslateTorRedirectsChecks);
}

let simplyTranslateNormalRedirectsChecks;
const getSimplyTranslateNormalRedirectsChecks = () => simplyTranslateNormalRedirectsChecks;
function setSimplyTranslateNormalRedirectsChecks(val) {
  simplyTranslateNormalRedirectsChecks = val;
  browser.storage.local.set({ simplyTranslateNormalRedirectsChecks })
  console.log("simplyTranslateNormalRedirectsChecks: ", val)
}

let simplyTranslateTorRedirectsChecks;
const getSimplyTranslateTorRedirectsChecks = () => simplyTranslateTorRedirectsChecks;
function setSimplyTranslateTorRedirectsChecks(val) {
  simplyTranslateTorRedirectsChecks = val;
  browser.storage.local.set({ simplyTranslateTorRedirectsChecks })
  console.log("simplyTranslateTorRedirectsChecks: ", val)
}

let simplyTranslateNormalCustomRedirects = [];
const getSimplyTranslateNormalCustomRedirects = () => simplyTranslateNormalCustomRedirects;
function setSimplyTranslateNormalCustomRedirects(val) {
  simplyTranslateNormalCustomRedirects = val;
  browser.storage.local.set({ simplyTranslateNormalCustomRedirects })
  console.log("simplyTranslateNormalCustomRedirects: ", val)
}

let simplyTranslateTorCustomRedirects = [];
const getSimplyTranslateTorCustomRedirects = () => simplyTranslateTorCustomRedirects;
function setSimplyTranslateTorCustomRedirects(val) {
  simplyTranslateTorCustomRedirects = val;
  browser.storage.local.set({ simplyTranslateTorCustomRedirects })
  console.log("simplyTranslateTorCustomRedirects: ", val)
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
  setLingvaNormalRedirectsChecks(lingvaNormalRedirectsChecks);

  for (const item of lingvaTorRedirectsChecks)
    if (!redirects.lingva.normal.includes(item)) {
      var index = lingvaTorRedirectsChecks.indexOf(item);
      if (index !== -1) lingvaTorRedirectsChecks.splice(index, 1);
    }
  setLingvaTorRedirectsChecks(lingvaTorRedirectsChecks);
}

let lingvaNormalRedirectsChecks;
const getLingvaNormalRedirectsChecks = () => lingvaNormalRedirectsChecks;
function setLingvaNormalRedirectsChecks(val) {
  lingvaNormalRedirectsChecks = val;
  browser.storage.local.set({ lingvaNormalRedirectsChecks })
  console.log("lingvaNormalRedirectsChecks: ", val)
}

let lingvaTorRedirectsChecks;
const getLingvaTorRedirectsChecks = () => lingvaTorRedirectsChecks;
function setLingvaTorRedirectsChecks(val) {
  lingvaTorRedirectsChecks = val;
  browser.storage.local.set({ lingvaTorRedirectsChecks })
  console.log("lingvaTorRedirectsChecks: ", val)
}

let lingvaNormalCustomRedirects = [];
const getLingvaNormalCustomRedirects = () => lingvaNormalCustomRedirects;
function setLingvaNormalCustomRedirects(val) {
  lingvaNormalCustomRedirects = val;
  browser.storage.local.set({ lingvaNormalCustomRedirects })
  console.log("lingvaNormalCustomRedirects: ", val)
}

let lingvaTorCustomRedirects = [];
const getLingvaTorCustomRedirects = () => lingvaTorCustomRedirects;
function setLingvaTorCustomRedirects(val) {
  lingvaTorCustomRedirects = val;
  browser.storage.local.set({ lingvaTorCustomRedirects })
  console.log("lingvaTorCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ translateDisable: disable })
  console.log("disable: ", disable)
}

let frontend;
const getFrontend = () => frontend;
function setFrontend(val) {
  frontend = val;
  browser.storage.local.set({ translateFrontend: frontend })
  console.log("translateFrontend: ", frontend)
}

let protocol;
const getProtocol = () => protocol;
function setProtocol(val) {
  protocol = val;
  browser.storage.local.set({ translateProtocol: val })
  console.log("translateProtocol: ", val)
}

let from;
const getFrom = () => from;
function setFrom(val) {
  from = val;
  browser.storage.local.set({ translateFrom: from })
  console.log("from: ", from)
}

let to;
const getTo = () => to;
function setTo(val) {
  to = val;
  browser.storage.local.set({ translateTo: to })
  console.log("to: ", to)
}

let simplyTranslateEngine;
const getSimplyTranslateEngine = () => simplyTranslateEngine;
function setSimplyTranslateEngine(val) {
  simplyTranslateEngine = val;
  browser.storage.local.set({ simplyTranslateEngine: val })
  console.log("simplyTranslateEngine: ", val)
}

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
  if (!targets.includes(url.host)) return

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

async function init() {
  return new Promise((resolve) => {
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
        (result) => {
          disable = result.translateDisable ?? false;
          frontend = result.translateFrontend ?? "simplyTranslate";
          protocol = result.translateProtocol ?? 'normal';

          from = result.translateFrom ?? "auto";
          to = result.translateTo ?? 'en';
          simplyTranslateEngine = result.simplyTranslateEngine ?? 'google';

          redirects.simplyTranslate = dataJson.simplyTranslate;
          redirects.lingva = dataJson.lingva;
          if (result.translateRedirects) redirects = result.translateRedirects;

          simplyTranslateNormalRedirectsChecks = result.simplyTranslateNormalRedirectsChecks ?? [...redirects.simplyTranslate.normal];
          simplyTranslateNormalCustomRedirects = result.simplyTranslateNormalCustomRedirects ?? [];

          simplyTranslateTorRedirectsChecks = result.simplyTranslateTorRedirectsChecks ?? [...redirects.simplyTranslate.tor];
          simplyTranslateTorCustomRedirects = result.simplyTranslateTorCustomRedirects ?? [];

          lingvaNormalRedirectsChecks = result.lingvaNormalRedirectsChecks ?? [...redirects.lingva.normal];
          lingvaNormalCustomRedirects = result.lingvaNormalCustomRedirects ?? [];

          lingvaTorRedirectsChecks = result.lingvaTorRedirectsChecks ?? [...redirects.lingva.tor];
          lingvaTorCustomRedirects = result.lingvaTorCustomRedirects ?? [];

          resolve();
        });
    });
  });
}

export default {
  getRedirects,
  getCustomRedirects,
  setSimplyTranslateRedirects,
  setLingvaRedirects,

  getDisable,
  setDisable,

  getFrontend,
  setFrontend,

  getProtocol,
  setProtocol,

  getFrom,
  setFrom,
  getTo,
  setTo,

  getSimplyTranslateEngine,
  setSimplyTranslateEngine,

  getSimplyTranslateNormalRedirectsChecks,
  setSimplyTranslateNormalRedirectsChecks,
  getSimplyTranslateTorRedirectsChecks,
  setSimplyTranslateTorRedirectsChecks,

  getSimplyTranslateNormalCustomRedirects,
  setSimplyTranslateNormalCustomRedirects,
  getSimplyTranslateTorCustomRedirects,
  setSimplyTranslateTorCustomRedirects,

  getLingvaNormalRedirectsChecks,
  setLingvaNormalRedirectsChecks,
  getLingvaTorRedirectsChecks,
  setLingvaTorRedirectsChecks,

  getLingvaNormalCustomRedirects,
  setLingvaNormalCustomRedirects,
  getLingvaTorCustomRedirects,
  setLingvaTorCustomRedirects,

  isTranslateRedirects,
  initLingvaLocalStorage,

  redirect,
  init,
  switchInstance,
};

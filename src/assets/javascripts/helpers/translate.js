window.browser = window.browser || window.chrome;

import commonHelper from './common.js'

const targets = [
  "translate.google.com",
  "translate.google.no"
];

let redirects = {
  "simplyTranslate": {
    "normal": [
      "https://simplytranslate.org",
      "https://st.alefvanoon.xyz",
      "https://translate.josias.dev",
      "https://translate.namazso.eu",
      "https://translate.riverside.rocks",
      "https://manerakai.asuscomm.com:447",
      "https://translate.bus-hit.me",
      "https://simplytranslate.pussthecat.org",
      "https://translate.northboot.xyz"
    ],
    "onion": [
      "http://fyng2tsmzmvxmojzbbwmfnsn2lrcyftf4cw6rk5j2v2huliazud3fjid.onion",
      "http://xxtbwyb5z5bdvy2f6l2yquu5qilgkjeewno4qfknvb3lkg3nmoklitid.onion"
    ]
  },

  "lingva": {
    "normal": [
      "https://lingva.ml",
      "https://translate.alefvanoon.xyz",
      "https://translate.igna.rocks",
      "https://lingva.pussthecat.org",
      "https://translate.datatunnel.xyz",
    ]
  }

};

const getRedirects = () => redirects;
const getCustomRedirects = function () {
  return {
    "simplyTranslate": {
      "normal": [...simplyTranslateRedirectsChecks, ...simplyTranslateCustomRedirects]
    },
    "lingva": {
      "normal": [...lingvaRedirectsChecks, ...lingvaCustomRedirects]
    }
  };
};

function setSimplyTranslateRedirects(val) {
  redirects.simplyTranslate = val;
  browser.storage.sync.set({ translateRedirects: redirects })
  console.log("simplyTranslateRedirects:", val)
  for (const item of simplyTranslateRedirectsChecks)
    if (!redirects.simplyTranslate.normal.includes(item)) {
      var index = simplyTranslateRedirectsChecks.indexOf(item);
      if (index !== -1) simplyTranslateRedirectsChecks.splice(index, 1);
    }
  setSimplyTranslateRedirectsChecks(simplyTranslateRedirectsChecks);
}

let simplyTranslateRedirectsChecks;
const getSimplyTranslateRedirectsChecks = () => simplyTranslateRedirectsChecks;
function setSimplyTranslateRedirectsChecks(val) {
  simplyTranslateRedirectsChecks = val;
  browser.storage.sync.set({ simplyTranslateRedirectsChecks })
  console.log("simplyTranslateRedirectsChecks: ", val)
}

let simplyTranslateCustomRedirects = [];
const getSimplyTranslateCustomRedirects = () => simplyTranslateCustomRedirects;
function setSimplyTranslateCustomRedirects(val) {
  simplyTranslateCustomRedirects = val;
  browser.storage.sync.set({ simplyTranslateCustomRedirects })
  console.log("simplyTranslateCustomRedirects: ", val)
}

function setLingvaRedirects(val) {
  redirects.lingva = val;
  browser.storage.sync.set({ translateRedirects: redirects })
  console.log("lingvaRedirects:", val)
  for (const item of lingvaRedirectsChecks)
    if (!redirects.lingva.normal.includes(item)) {
      var index = lingvaRedirectsChecks.indexOf(item);
      if (index !== -1) lingvaRedirectsChecks.splice(index, 1);
    }
  setLingvaRedirectsChecks(lingvaRedirectsChecks);
}

let lingvaRedirectsChecks;
const getLingvaRedirectsChecks = () => lingvaRedirectsChecks;
function setLingvaRedirectsChecks(val) {
  lingvaRedirectsChecks = val;
  browser.storage.sync.set({ lingvaRedirectsChecks })
  console.log("lingvaRedirectsChecks: ", val)
}

let lingvaCustomRedirects = [];
const getLingvaCustomRedirects = () => lingvaCustomRedirects;
function setLingvaCustomRedirects(val) {
  lingvaCustomRedirects = val;
  browser.storage.sync.set({ lingvaCustomRedirects })
  console.log("lingvaCustomRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.sync.set({ translateDisable: disable })
  console.log("disable: ", disable)
}

let frontend;
const getFrontend = () => frontend;
function setFrontend(val) {
  frontend = val;
  browser.storage.sync.set({ translateFrontend: frontend })
  console.log("translateFrontend: ", frontend)
}

let from;
const getFrom = () => from;
function setFrom(val) {
  from = val;
  browser.storage.sync.set({ translateFrom: from })
  console.log("from: ", from)
}

let to;
const getTo = () => to;
function setTo(val) {
  to = val;
  browser.storage.sync.set({ translateTo: to })
  console.log("to: ", to)
}

function isTranslate(url, initiator) {
  if (disable) return false;
  return targets.includes(url.host)
}

function redirect(url) {
  let params_arr = url.search.split('&');
  params_arr[0] = params_arr[0].substring(1);
  let myMap = {};
  for (let i = 0; i < params_arr.length; i++) {
    let pair = params_arr[i].split('=');
    myMap[pair[0]] = pair[1];
  }
  if (frontend == 'simplyTranslate') {
    let instancesList = [...simplyTranslateRedirectsChecks, ...simplyTranslateCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    if (myMap.sl && myMap.tl && myMap.text)
      return `${randomInstance}/${url.search}`;
    else
      return `${randomInstance}/?sl=${from}&tl=${to}`
  }
  else if (frontend == 'lingva') {
    let instancesList = [...lingvaRedirectsChecks, ...lingvaCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    if (myMap.sl && myMap.tl && myMap.text)
      return `${randomInstance}/${myMap.sl}/${myMap.tl}/${myMap.text}`;
    else
      return randomInstance;
  }
}

async function init() {
  return new Promise((resolve) => {
    browser.storage.sync.get(
      [
        "translateDisable",
        "translateFrontend",
        "translateRedirects",
        "simplyTranslateRedirectsChecks",
        "simplyTranslateCustomRedirects",
        "lingvaRedirectsChecks",
        "lingvaCustomRedirects",
        "translateFrom",
        "translateTo",
      ],
      (result) => {
        disable = result.translateDisable ?? false;
        frontend = result.translateFrontend ?? "simplyTranslate";

        from = result.translateFrom ?? "auto";
        to = result.translateTo ?? 'en';

        if (result.translateRedirects) redirects = result.translateRedirects

        simplyTranslateRedirectsChecks = result.simplyTranslateRedirectsChecks ?? [...redirects.simplyTranslate.normal];
        simplyTranslateCustomRedirects = result.simplyTranslateCustomRedirects ?? [];

        lingvaRedirectsChecks = result.lingvaRedirectsChecks ?? [...redirects.lingva.normal];
        lingvaCustomRedirects = result.lingvaCustomRedirects ?? [];

        resolve();
      });
  });

}

export default {
  getRedirects,
  getCustomRedirects,
  setSimplyTranslateRedirects,
  setLingvaRedirects,

  isTranslate,

  getDisable,
  setDisable,

  getFrontend,
  setFrontend,

  getFrom,
  setFrom,
  getTo,
  setTo,

  getSimplyTranslateRedirectsChecks,
  setSimplyTranslateRedirectsChecks,

  getSimplyTranslateCustomRedirects,
  setSimplyTranslateCustomRedirects,

  getLingvaRedirectsChecks,
  setLingvaRedirectsChecks,

  getLingvaCustomRedirects,
  setLingvaCustomRedirects,

  redirect,
  init,
};

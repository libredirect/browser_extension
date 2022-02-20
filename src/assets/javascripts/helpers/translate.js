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
    "tor": [
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
      "normal": [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects]
    },
    "lingva": {
      "normal": [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects]
    }
  };
};

function setSimplyTranslateRedirects(val) {
  redirects.simplyTranslate = val;
  browser.storage.sync.set({ translateRedirects: redirects })
  console.log("simplyTranslateRedirects:", val)
  for (const item of simplyTranslateNormalRedirectsChecks)
    if (!redirects.simplyTranslate.normal.includes(item)) {
      var index = simplyTranslateNormalRedirectsChecks.indexOf(item);
      if (index !== -1) simplyTranslateNormalRedirectsChecks.splice(index, 1);
    }
  setSimplyTranslateNormalRedirectsChecks(simplyTranslateNormalRedirectsChecks);
}

let simplyTranslateNormalRedirectsChecks;
const getSimplyTranslateNormalRedirectsChecks = () => simplyTranslateNormalRedirectsChecks;
function setSimplyTranslateNormalRedirectsChecks(val) {
  simplyTranslateNormalRedirectsChecks = val;
  browser.storage.sync.set({ simplyTranslateNormalRedirectsChecks })
  console.log("simplyTranslateNormalRedirectsChecks: ", val)
}

let simplyTranslateNormalCustomRedirects = [];
const getSimplyTranslateNormalCustomRedirects = () => simplyTranslateNormalCustomRedirects;
function setSimplyTranslateNormalCustomRedirects(val) {
  simplyTranslateNormalCustomRedirects = val;
  browser.storage.sync.set({ simplyTranslateNormalCustomRedirects })
  console.log("simplyTranslateNormalCustomRedirects: ", val)
}

function setLingvaRedirects(val) {
  redirects.lingva = val;
  browser.storage.sync.set({ translateRedirects: redirects })
  console.log("lingvaRedirects:", val)
  for (const item of lingvaNormalRedirectsChecks)
    if (!redirects.lingva.normal.includes(item)) {
      var index = lingvaNormalRedirectsChecks.indexOf(item);
      if (index !== -1) lingvaNormalRedirectsChecks.splice(index, 1);
    }
  setLingvaNormalRedirectsChecks(lingvaNormalRedirectsChecks);
}

let lingvaNormalRedirectsChecks;
const getLingvaNormalRedirectsChecks = () => lingvaNormalRedirectsChecks;
function setLingvaNormalRedirectsChecks(val) {
  lingvaNormalRedirectsChecks = val;
  browser.storage.sync.set({ lingvaNormalRedirectsChecks })
  console.log("lingvaNormalRedirectsChecks: ", val)
}

let lingvaNormalCustomRedirects = [];
const getLingvaNormalCustomRedirects = () => lingvaNormalCustomRedirects;
function setLingvaNormalCustomRedirects(val) {
  lingvaNormalCustomRedirects = val;
  browser.storage.sync.set({ lingvaNormalCustomRedirects })
  console.log("lingvaNormalCustomRedirects: ", val)
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
    let instancesList = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    if (myMap.sl && myMap.tl && myMap.text)
      return `${randomInstance}/${url.search}`;
    else
      return `${randomInstance}/?sl=${from}&tl=${to}`
  }
  else if (frontend == 'lingva') {
    let instancesList = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects];
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
        "simplyTranslateNormalRedirectsChecks",
        "simplyTranslateNormalCustomRedirects",
        "lingvaNormalRedirectsChecks",
        "lingvaNormalCustomRedirects",
        "translateFrom",
        "translateTo",
      ],
      (result) => {
        disable = result.translateDisable ?? false;
        frontend = result.translateFrontend ?? "simplyTranslate";

        from = result.translateFrom ?? "auto";
        to = result.translateTo ?? 'en';

        if (result.translateRedirects) redirects = result.translateRedirects

        simplyTranslateNormalRedirectsChecks = result.simplyTranslateNormalRedirectsChecks ?? [...redirects.simplyTranslate.normal];
        simplyTranslateNormalCustomRedirects = result.simplyTranslateNormalCustomRedirects ?? [];

        lingvaNormalRedirectsChecks = result.lingvaNormalRedirectsChecks ?? [...redirects.lingva.normal];
        lingvaNormalCustomRedirects = result.lingvaNormalCustomRedirects ?? [];

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

  getSimplyTranslateNormalRedirectsChecks,
  setSimplyTranslateNormalRedirectsChecks,

  getSimplyTranslateNormalCustomRedirects,
  setSimplyTranslateNormalCustomRedirects,

  getLingvaNormalRedirectsChecks,
  setLingvaNormalRedirectsChecks,

  getLingvaNormalCustomRedirects,
  setLingvaNormalCustomRedirects,

  redirect,
  init,
};

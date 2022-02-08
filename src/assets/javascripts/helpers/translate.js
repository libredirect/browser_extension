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


let disableTranslate;
const getDisableTranslate = () => disableTranslate;
function setDisableTranslate(val) {
  disableTranslate = val;
  browser.storage.sync.set({ disableTranslate })
  console.log("disableTranslate: ", disableTranslate)
}

let translateFrontend;
const getFrontend = () => translateFrontend;
function setFrontend(val) {
  translateFrontend = val;
  browser.storage.sync.set({ translateFrontend })
  console.log("Translate frontend: ", val)
}

function redirect(url, initiator) {
  if (disableTranslate) {
    console.log("SimplyTranslate disabled")
    return null
  };

  if (translateFrontend == 'simplyTranslate') {

    let instancesList = [...simplyTranslateRedirectsChecks, ...simplyTranslateCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    return `${randomInstance}/${url.search}`;
  }
  else if (translateFrontend == 'lingva') {
    let params_arr = url.search.split('&');
    params_arr[0] = params_arr[0].substring(1);
    let myMap = {};
    for (let i = 0; i < params_arr.length; i++) {
      let pair = params_arr[i].split('=');
      myMap[pair[0]] = pair[1];
    }
    let instancesList = [...lingvaRedirectsChecks, ...lingvaCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList)

    if (myMap.sl && myMap.tl && myMap.text)
      return `${randomInstance}/${myMap.sl}/${myMap.tl}/${myMap.text}`;
    else
      return randomInstance;
  }

}

function isTranslate(url) {
  return targets.includes(url.host)
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableTranslate",
    "translateFrontend",
    "translateRedirects",
    "simplyTranslateRedirectsChecks",
    "simplyTranslateCustomRedirects",
    "lingvaRedirectsChecks",
    "lingvaCustomRedirects",
  ]);
  disableTranslate = result.disableTranslate ?? false;
  translateFrontend = result.translateFrontend ?? "simplyTranslate";
  if (result.translateRedirects)
    redirects = result.translateRedirects

  simplyTranslateRedirectsChecks = result.simplyTranslateRedirectsChecks ?? [...redirects.simplyTranslate.normal];
  simplyTranslateCustomRedirects = result.simplyTranslateCustomRedirects ?? [];

  lingvaRedirectsChecks = result.lingvaRedirectsChecks ?? [...redirects.lingva.normal];
  lingvaCustomRedirects = result.lingvaCustomRedirects ?? [];
}

export default {
  getRedirects,
  setSimplyTranslateRedirects,
  setLingvaRedirects,

  isTranslate,

  getDisableTranslate,
  setDisableTranslate,

  getFrontend,
  setFrontend,

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

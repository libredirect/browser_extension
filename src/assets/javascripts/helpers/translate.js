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
}

function setLingvaRedirects(val) {
  redirects.lingva = val;
  browser.storage.sync.set({ translateRedirects: redirects })
  console.log("lingvaRedirects:", val)
}

let disableTranslate;
const getDisableTranslate = () => disableTranslate;
function setDisableTranslate(val) {
  disableTranslate = val;
  browser.storage.sync.set({ disableTranslate })
  console.log("disableTranslate: ", disableTranslate)
}

let simplyTranslateInstance;
const getSimplyTranslateInstance = () => simplyTranslateInstance;
function setSimplyTranslateInstance(val) {
  simplyTranslateInstance = val;
  browser.storage.sync.set({ simplyTranslateInstance })
};

let translateFrontend;
const getFrontend = () => translateFrontend;
function setFrontend(val) {
  translateFrontend = val;
  browser.storage.sync.set({ translateFrontend })
  console.log("Translate frontend: ", frontend)
}

function redirect(url, initiator) {
  if (disableTranslate) {
    console.log("SImplyTranslte disabled")
    return null
  };

  let link;
  if (translateFrontend == 'simplyTransalte') {
    link = commonHelper.getRandomInstance(redirects.simplyTranslate.normal);
    console.log(`${link}/${url.search}`);
    return `${link}/${url.search}`;
  }
  else if (translateFrontend == 'lingva') {
    let params_arr = url.search.split('&');
    params_arr[0] = params_arr[0].substring(1);
    let myMap = new Map();
    for (let i = 0; i < params_arr.length; i++) {
      let pair = params_arr[i].split('=');
      myMap.set(pair[0], pair[1]);
    }
    link = commonHelper.getRandomInstance(redirects.lingva.normal);
    if (myMap.get("sl") && myMap.get("tl") && myMap.get("text"))
      return `${link}/${myMap.get("sl")}/${myMap.get("tl")}/${myMap.get("text")}`;
    else
      return link;
  }

}

function isTranslate(url) {
  return targets.includes(url.host)
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableTranslate",
    "simplyTranslateInstance",
    "translateFrontend",
    "translateRedirects"
  ]);
  disableTranslate = result.disableTranslate ?? false;
  simplyTranslateInstance = result.simplyTranslateInstance;
  translateFrontend = result.translateFrontend ?? "simplyTransalte";
  if (result.translateRedirects)
    redirects = result.translateRedirects
}

export default {
  getRedirects,
  setSimplyTranslateRedirects,
  setLingvaRedirects,
  
  isTranslate,
  
  getDisableTranslate,
  setDisableTranslate,
  
  getSimplyTranslateInstance,
  setSimplyTranslateInstance,
  
  getFrontend,
  setFrontend,
  
  redirect,
  init,
};

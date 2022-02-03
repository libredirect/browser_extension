import commonHelper from './common.js'

const targets = [
  "translate.google.com",
  "translate.google.no"
];

const redirects = {
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

async function redirect(url, initiator) {
  await init()
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


async function init() {
  let result = await browser.storage.sync.get([
    "disableTranslate",
    "simplyTranslateInstance",
    "translateFrontend"
  ]);
  disableTranslate = result.disableTranslate || false;
  simplyTranslateInstance = result.simplyTranslateInstance;
  translateFrontend = result.translateFrontend || "simplyTransalte";
}

export default {
  targets,
  redirects,
  getDisableTranslate,
  setDisableTranslate,
  getSimplyTranslateInstance,
  setSimplyTranslateInstance,
  getFrontend,
  setFrontend,
  redirect,
  init,
};

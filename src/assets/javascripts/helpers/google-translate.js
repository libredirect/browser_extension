const targets = [
  "translate.google.com",
  "translate.google.no"
];

const redirects = {
  "normal": [
    "https://translate.metalune.xyz",
    "https://simplytranslate.org",
    "https://st.alefvanoon.xyz",
    "https://translate.josias.dev",
    "https://translate.namazso.eu",
    "https://translate.riverside.rocks",
    "https://manerakai.asuscomm.com:447",
    "https://translate.bus-hit.me"
  ]
};

let disableSimplyTranslate;
const getDisableSimplyTranslate = () => disableSimplyTranslate;
function setDisableSimplyTranslate(val) {
  disableSimplyTranslate = val;
  browser.storage.sync.set({ disableSimplyTranslate })
  console.log("disableSimplyTranslate: ", disableSimplyTranslate)
}

let simplyTranslateInstance;
const getSimplyTranslateInstance = () => simplyTranslateInstance;
function setSimplyTranslateInstance(val) {
  simplyTranslateInstance = val;
  browser.storage.sync.set({ simplyTranslateInstance })
};

async function redirect(url, initiator) {
  await init()
  if (disableSimplyTranslate)
    return null;
  return `${simplyTranslateInstance}/${url.search}`;
}

async function init() {
  let result = await browser.storage.sync.get([
    "disableSimplyTranslate",
    "simplyTranslateInstance",
  ]);
  disableSimplyTranslate = result.disableSimplyTranslate || false;
  simplyTranslateInstance = result.simplyTranslateInstance;
}

export default {
  targets,
  redirects,
  getDisableSimplyTranslate,
  setDisableSimplyTranslate,
  getSimplyTranslateInstance,
  setSimplyTranslateInstance,
  redirect,
  init,
};







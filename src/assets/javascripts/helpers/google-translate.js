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
}

let simplyTranslateInstance;
const getSimplyTranslateInstance = () => simplyTranslateInstance;
function setSimplyTranslateInstance(val) {
  simplyTranslateInstance = val;
  browser.storage.sync.set({ simplyTranslateInstance })
};

function redirectGoogleTranslate(url, initiator) {
  if (disableSimplyTranslate || isException(url, initiator)) return null;

  return `${simplyTranslateInstance}/${url.search}`;
}

export default {
  targets,
  redirects,
  getDisableSimplyTranslate,
  setDisableSimplyTranslate,
  getSimplyTranslateInstance,
  setSimplyTranslateInstance,
  redirectGoogleTranslate,
};







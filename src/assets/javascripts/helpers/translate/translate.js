window.browser = window.browser || window.chrome;

import utils from '../utils.js'

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

function setRedirects(val) {
  browser.storage.local.get('cloudflareList', async r => {
    redirects = val;
    simplyTranslateNormalRedirectsChecks = [...redirects.simplyTranslate.normal];
    lingvaNormalRedirectsChecks = [...redirects.lingva.normal]
    for (const instance of r.cloudflareList) {
      let i;
      i = simplyTranslateNormalRedirectsChecks.indexOf(instance);
      if (i > -1) simplyTranslateNormalRedirectsChecks.splice(i, 1);

      i = lingvaNormalRedirectsChecks.indexOf(instance);
      if (i > -1) lingvaNormalRedirectsChecks.splice(i, 1);
    }
    browser.storage.local.set({
      translateRedirects: redirects,
      simplyTranslateNormalRedirectsChecks,
      simplyTranslateTorRedirectsChecks: redirects.simplyTranslate.tor,
      lingvaNormalRedirectsChecks,
      lingvaTorRedirectsChecks: redirects.lingva.tor,
    })
  })
}

let
  simplyTranslateNormalRedirectsChecks,
  lingvaNormalRedirectsChecks;

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
        let protocolHost = utils.protocolHost(url);
        if (![
          ...r.lingvaNormalRedirectsChecks,
          ...r.lingvaTorRedirectsChecks,
          ...r.lingvaNormalCustomRedirects,
          ...r.lingvaTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }
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

function setLingvaLocalStorage(url, tabId) {
  return new Promise(resolve => {
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
        if (r.disableYoutube || r.youtubeFrontend != 'lingva') { resolve(); return; }
        let protocolHost = utils.protocolHost(url);
        if (![
          ...r.lingvaNormalRedirectsChecks,
          ...r.lingvaTorRedirectsChecks,
          ...r.lingvaNormalCustomRedirects,
          ...r.lingvaTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }
        browser.tabs.executeScript(
          tabId,
          {
            file: "/assets/javascripts/helpers/youtube/set_lingva_preferences.js",
            runAt: "document_start"
          }
        );
        resolve(true);
      })
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
        let protocolHost = utils.protocolHost(from);
        if (![
          ...r.simplyTranslateNormalRedirectsChecks,
          ...r.simplyTranslateNormalCustomRedirects,
          ...r.simplyTranslateTorRedirectsChecks,
          ...r.simplyTranslateTorCustomRedirects,
          ...r.simplyTranslateI2pRedirectsChecks,
          ...r.simplyTranslateI2pCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }

        let checkedInstances;
        if (r.translateProtocol == 'normal') checkedInstances = [...r.simplyTranslateNormalRedirectsChecks, ...r.simplyTranslateNormalCustomRedirects]
        else if (r.translateProtocol == 'tor') checkedInstances = [...r.simplyTranslateTorRedirectsChecks, ...r.simplyTranslateTorCustomRedirects]
        else if (r.translateProtocol == 'i2p') checkedInstances = [...r.simplyTranslateI2pRedirectsChecks, ...r.simplyTranslateI2pCustomRedirects]
        for (const to of checkedInstances) {
          utils.copyCookie('simplyTranslate', from, to, 'from_lang');
          utils.copyCookie('simplyTranslate', from, to, 'to_lang');
          utils.copyCookie('simplyTranslate', from, to, 'tts_enabled');
          utils.copyCookie('simplyTranslate', from, to, 'use_text_fields');
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
        utils.getCookiesFromStorage('simplyTranslate', to, 'from_lang');
        utils.getCookiesFromStorage('simplyTranslate', to, 'to_lang');
        utils.getCookiesFromStorage('simplyTranslate', to, 'tts_enabled');
        utils.getCookiesFromStorage('simplyTranslate', to, 'use_text_fields');
      }
    }
  )
}

function redirect(url) {
  return new Promise(resolve => {
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
        if (r.translateDisable) { resolve(); return; };
        if (!targets.some(rx => rx.test(url.href))) { resolve(); return; };

        if (r.translateFrontend == 'simplyTranslate') {
          let instancesList;
          if (r.translateProtocol == 'normal') instancesList = [...r.simplyTranslateNormalRedirectsChecks, ...r.simplyTranslateNormalCustomRedirects];
          if (r.translateProtocol == 'tor') instancesList = [...r.simplyTranslateTorRedirectsChecks, ...r.simplyTranslateTorCustomRedirects];
          if (instancesList.length === 0) { resolve(); return; };

          let randomInstance = utils.getRandomInstance(instancesList)
          console.log(`${randomInstance}/${url.search}`);
          resolve(`${randomInstance}/${url.search}`);

        }
        else if (r.translateFrontend == 'lingva') {
          let params_arr = url.search.split('&');
          params_arr[0] = params_arr[0].substring(1);
          let myMap = {};
          for (let i = 0; i < params_arr.length; i++) {
            let pair = params_arr[i].split('=');
            myMap[pair[0]] = pair[1];
          }
          let instancesList;
          if (r.translateProtocol == 'normal') instancesList = [...r.lingvaNormalRedirectsChecks, ...r.lingvaNormalCustomRedirects];
          if (r.translateProtocol == 'tor') instancesList = [...r.lingvaTorRedirectsChecks, ...r.lingvaTorCustomRedirects];
          if (instancesList.length === 0) { resolve(); return; }
          let randomInstance = utils.getRandomInstance(instancesList)

          if (myMap.sl && myMap.tl && myMap.text) {
            resolve(`${randomInstance}/${myMap.sl}/${myMap.tl}/${myMap.text}`); return;
          }
          resolve(randomInstance);
        }
      }
    )
  })
}

function switchInstance(url) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
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
        let protocolHost = utils.protocolHost(url);

        let translateList = [
          ...r.translateRedirects.simplyTranslate.normal,
          ...r.translateRedirects.simplyTranslate.tor,

          ...r.simplyTranslateNormalCustomRedirects,
          ...r.simplyTranslateTorCustomRedirects,

          ...r.translateRedirects.lingva.normal,
          ...r.translateRedirects.lingva.tor,

          ...r.lingvaNormalCustomRedirects,
          ...r.lingvaTorCustomRedirects,
        ]

        if (!translateList.includes(protocolHost)) { resolve(); return; }

        let instancesList;

        if (r.translateProtocol == 'normal') {
          if (r.translateFrontend == 'simplyTranslate') instancesList = [...r.simplyTranslateNormalRedirectsChecks, ...r.simplyTranslateNormalCustomRedirects];
          else if (r.translateFrontend == 'lingva') [...r.lingvaNormalRedirectsChecks, ...r.lingvaNormalCustomRedirects];
        }
        else if (r.translateProtocol == 'tor') {
          if (r.translateFrontend == 'simplyTranslate') instancesList = [...r.simplyTranslateTorRedirectsChecks, ...r.simplyTranslateTorCustomRedirects];
          else if (r.translateFrontend == 'lingva') instancesList = [...r.lingvaTorRedirectsChecks, ...r.lingvaTorCustomRedirects];
        }

        let index = instancesList.indexOf(protocolHost);
        if (index > -1) instancesList.splice(index, 1);
        if (instancesList.length === 0) { resolve(); return; }

        let randomInstance = utils.getRandomInstance(instancesList);
        return `${randomInstance}${url.pathname}${url.search}`;
      })
  })
}

function initDefaults() {
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

export default {
  initSimplyTranslateCookies,
  setSimplyTranslateCookies,
  initLingvaLocalStorage,
  setLingvaLocalStorage,

  setRedirects,

  redirect,
  initDefaults,
  switchInstance,
};

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

let
  translateDisable,
  translateFrontend,
  translateProtocol,
  translateRedirects,
  simplyTranslateNormalRedirectsChecks,
  simplyTranslateNormalCustomRedirects,
  simplyTranslateTorRedirectsChecks,
  simplyTranslateTorCustomRedirects,
  lingvaNormalRedirectsChecks,
  lingvaNormalCustomRedirects,
  lingvaTorRedirectsChecks,
  lingvaTorCustomRedirects;

function init() {
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
        translateDisable = r.translateDisable;
        translateFrontend = r.translateFrontend;
        translateProtocol = r.translateProtocol;
        translateRedirects = r.translateRedirects;
        simplyTranslateNormalRedirectsChecks = r.simplyTranslateNormalRedirectsChecks;
        simplyTranslateNormalCustomRedirects = r.simplyTranslateNormalCustomRedirects;
        simplyTranslateTorRedirectsChecks = r.simplyTranslateTorRedirectsChecks;
        simplyTranslateTorCustomRedirects = r.simplyTranslateTorCustomRedirects;
        lingvaNormalRedirectsChecks = r.lingvaNormalRedirectsChecks;
        lingvaNormalCustomRedirects = r.lingvaNormalCustomRedirects;
        lingvaTorRedirectsChecks = r.lingvaTorRedirectsChecks;
        lingvaTorCustomRedirects = r.lingvaTorCustomRedirects;
        resolve();
      }
    )
  })
}

init();
browser.storage.onChanged.addListener(init)

function setRedirects(val) {
  browser.storage.local.get('cloudflareBlackList', r => {
    redirects = val;
    lingvaNormalRedirectsChecks = [...redirects.lingva.normal]
    for (const instance of r.cloudflareBlackList) {
      const i = lingvaNormalRedirectsChecks.indexOf(instance);
      if (i > -1) lingvaNormalRedirectsChecks.splice(i, 1);
    }
    browser.storage.local.set({
      translateRedirects: redirects,
      simplyTranslateNormalRedirectsChecks: redirects.simplyTranslate.normal,
      simplyTranslateTorRedirectsChecks: redirects.simplyTranslate.tor,
      lingvaNormalRedirectsChecks,
      lingvaTorRedirectsChecks: redirects.lingva.tor,
    })
  })
}

function copyPasteLingvaLocalStorage(test, url, tabId) {
  return new Promise(async resolve => {
    await init();
    if (translateDisable || translateFrontend != 'lingva') { resolve(); return; }
    const protocolHost = utils.protocolHost(url);
    if (![
      ...lingvaNormalRedirectsChecks,
      ...lingvaNormalCustomRedirects,
      ...lingvaTorRedirectsChecks,
      ...lingvaTorCustomRedirects,
    ].includes(protocolHost)) { resolve(); return; }

    if (!test) {
      browser.tabs.executeScript(
        tabId,
        { file: "/assets/javascripts/translate/get_lingva_preferences.js", runAt: "document_start" }
      );

      let checkedInstances;
      if (translateProtocol == 'normal') checkedInstances = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects];
      if (translateProtocol == 'tor') checkedInstances = [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects];
      const i = checkedInstances.indexOf(protocolHost);
      if (i !== -1) checkedInstances.splice(i, 1);
      if (checkedInstances.length === 0) { resolve(); return; }
      for (const to of checkedInstances)
        browser.tabs.create(
          { url: to },
          tab => browser.tabs.executeScript(tab.id, { file: "/assets/javascripts/translate/set_lingva_preferences.js", runAt: "document_start" })
        );
    }
    resolve(true);
  }
  )
}

function pasteLingvaLocalStorage() {
  return new Promise(async resolve => {
    await init();
    if (translateDisable || translateFrontend != 'lingva') { resolve(); return; }
    let checkedInstances;
    if (translateProtocol == 'normal') checkedInstances = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects];
    if (translateProtocol == 'tor') checkedInstances = [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects];
    for (const to of checkedInstances)
      browser.tabs.create({ url: to },
        tab => browser.tabs.executeScript(tab.id, { file: "/assets/javascripts/translate/set_lingva_preferences.js", runAt: "document_start" }))
    resolve();
  })
}

function copyPasteSimplyTranslateCookies(test, from) {
  return new Promise(async resolve => {
    await init();
    const protocolHost = utils.protocolHost(from);
    if (![
      ...simplyTranslateNormalRedirectsChecks,
      ...simplyTranslateNormalCustomRedirects,
      ...simplyTranslateTorRedirectsChecks,
      ...simplyTranslateTorCustomRedirects,
    ].includes(protocolHost)) { resolve(); return; }
    if (!test) {
      let checkedInstances;
      if (translateProtocol == 'normal') checkedInstances = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects]
      else if (translateProtocol == 'tor') checkedInstances = [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects]
      await utils.copyCookie('simplyTranslate', from, checkedInstances, 'from_lang');
      await utils.copyCookie('simplyTranslate', from, checkedInstances, 'to_lang');
      await utils.copyCookie('simplyTranslate', from, checkedInstances, 'tts_enabled');
      await utils.copyCookie('simplyTranslate', from, checkedInstances, 'use_text_fields');
    }
    resolve(true);
  }
  )
}

function pasteSimplyTranslateCookies() {
  return new Promise(async resolve => {
    await init();
    if (translateDisable || translateFrontend != 'simplyTranslate') { resolve(); return; }
    let checkedInstances;
    if (translateProtocol == 'normal') checkedInstances = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects]
    else if (translateProtocol == 'tor') checkedInstances = [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects]
    utils.getCookiesFromStorage('simplyTranslate', checkedInstances, 'from_lang');
    utils.getCookiesFromStorage('simplyTranslate', checkedInstances, 'to_lang');
    utils.getCookiesFromStorage('simplyTranslate', checkedInstances, 'tts_enabled');
    utils.getCookiesFromStorage('simplyTranslate', checkedInstances, 'use_text_fields');
    resolve();
  }
  )
}

function redirect(url) {
  if (translateDisable) return;
  if (!targets.some(rx => rx.test(url.href))) return;

  if (translateFrontend == 'simplyTranslate') {
    let instancesList;
    if (translateProtocol == 'normal') instancesList = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects];
    if (translateProtocol == 'tor') instancesList = [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects];
    if (instancesList.length === 0) return;

    const randomInstance = utils.getRandomInstance(instancesList)
    return `${randomInstance}/${url.search}`;
  }
  else if (translateFrontend == 'lingva') {
    let params_arr = url.search.split('&');
    params_arr[0] = params_arr[0].substring(1);
    let params = {};
    for (let i = 0; i < params_arr.length; i++) {
      let pair = params_arr[i].split('=');
      params[pair[0]] = pair[1];
    }
    let instancesList;
    if (translateProtocol == 'normal') instancesList = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects];
    if (translateProtocol == 'tor') instancesList = [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects];
    if (instancesList.length === 0) return;

    const randomInstance = utils.getRandomInstance(instancesList)
    if (params.sl && params.tl && params.text) {
      return `${randomInstance}/${params.sl}/${params.tl}/${params.text}`
    }
    return randomInstance;
  }
}

function switchInstance(url) {
  return new Promise(async resolve => {
    await init();
    if (translateDisable) { resolve(); return; }
    const protocolHost = utils.protocolHost(url);
    if (![
      ...translateRedirects.simplyTranslate.normal,
      ...translateRedirects.simplyTranslate.tor,

      ...simplyTranslateNormalCustomRedirects,
      ...simplyTranslateTorCustomRedirects,

      ...translateRedirects.lingva.normal,
      ...translateRedirects.lingva.tor,

      ...lingvaNormalCustomRedirects,
      ...lingvaTorCustomRedirects,
    ].includes(protocolHost)) { resolve(); return; }

    let instancesList;
    if (translateProtocol == 'normal') {
      if (translateFrontend == 'simplyTranslate') instancesList = [...simplyTranslateNormalRedirectsChecks, ...simplyTranslateNormalCustomRedirects];
      else if (translateFrontend == 'lingva') instancesList = [...lingvaNormalRedirectsChecks, ...lingvaNormalCustomRedirects];
    }
    else if (translateProtocol == 'tor') {
      if (translateFrontend == 'simplyTranslate') instancesList = [...simplyTranslateTorRedirectsChecks, ...simplyTranslateTorCustomRedirects];
      else if (translateFrontend == 'lingva') instancesList = [...lingvaTorRedirectsChecks, ...lingvaTorCustomRedirects];
    }

    const i = instancesList.indexOf(protocolHost);
    if (i > -1) instancesList.splice(i, 1);
    if (instancesList.length === 0) { resolve(); return; }

    const randomInstance = utils.getRandomInstance(instancesList);
    resolve(`${randomInstance}${url.pathname}${url.search}`);
  })
}

function initDefaults() {
  return new Promise(async resolve => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
      redirects.simplyTranslate = dataJson.simplyTranslate;
      redirects.lingva = dataJson.lingva;
      browser.storage.local.get('cloudflareBlackList',
        async r => {
          lingvaNormalRedirectsChecks = [...redirects.lingva.normal]
          for (const instance of r.cloudflareBlackList) {
            const i = lingvaNormalRedirectsChecks.indexOf(instance);
            if (i > -1) lingvaNormalRedirectsChecks.splice(i, 1);
          }
          await browser.storage.local.set({
            translateDisable: false,
            translateFrontend: "simplyTranslate",
            translateProtocol: 'normal',
            translateRedirects: redirects,

            simplyTranslateNormalRedirectsChecks: simplyTranslateNormalRedirectsChecks,
            simplyTranslateNormalCustomRedirects: [...redirects.simplyTranslate.normal],
            simplyTranslateTorRedirectsChecks: [...redirects.simplyTranslate.tor],
            simplyTranslateTorCustomRedirects: [],

            lingvaNormalRedirectsChecks: lingvaNormalRedirectsChecks,
            lingvaNormalCustomRedirects: [],
            lingvaTorRedirectsChecks: [...redirects.lingva.tor],
            lingvaTorCustomRedirects: [],
          })
          resolve();
        })
    })
  })
}

export default {
  copyPasteSimplyTranslateCookies,
  pasteSimplyTranslateCookies,
  copyPasteLingvaLocalStorage,
  pasteLingvaLocalStorage,
  setRedirects,
  redirect,
  initDefaults,
  switchInstance,
};

window.browser = window.browser || window.chrome;
import utils from './utils.js'


const targets = [
  // /(?:.*\.)*(?<!(link\.|cdn\-images\-\d+\.))medium\.com(\/.*)?$/,
  /^medium\.com/,
  /.*\.medium\.com/,
  // // Other domains of medium blogs, source(s): https://findingtom.com/best-medium-blogs-to-follow/#1-forge

  /^towardsdatascience\.com/,
  /^uxdesign\.cc/,
  /^uxplanet\.org/,
  /^betterprogramming\.pub/,
  /^aninjusticemag\.com/,
  /^betterhumans\.pub/,
  /^psiloveyou\.xyz/,
  /^entrepreneurshandbook\.co/,
  /^blog\.coinbase\.com/,

  /^ levelup\.gitconnected\.com /,
  /^javascript\.plainenglish\.io /,
  /^blog\.bitsrc\.io /,
  /^ itnext\.io /,
  /^codeburst\.io /,
  /^infosecwriteups\.com /,
  /^ blog\.devgenius.io /,
  /^ writingcooperative\.com /,
];

let redirects = {
  "scribe": {
    "normal": [],
    "tor": []
  }
};
function setRedirects(val) {
  browser.storage.local.get('cloudflareList', r => {
    redirects.scribe = val;
    scribeNormalRedirectsChecks = [...redirects.scribe.normal];
    for (const instance of r.cloudflareList) {
      const a = scribeNormalRedirectsChecks.indexOf(instance);
      if (a > -1) scribeNormalRedirectsChecks.splice(a, 1);
    }
    browser.storage.local.set({
      mediumRedirects: redirects,
      scribeNormalRedirectsChecks
    })
  })
}

let scribeNormalRedirectsChecks;
let scribeTorRedirectsChecks;

function redirect(url, type, initiator) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableMedium",
        "mediumRedirects",
        "scribeNormalRedirectsChecks",
        "scribeNormalCustomRedirects",
        "scribeTorRedirectsChecks",
        "scribeTorCustomRedirects",
        "mediumProtocol"
      ],
      r => {
        if (r.disableMedium) { resolve(); return; }
        if (type != "main_frame" && "sub_frame" && "xmlhttprequest" && "other") { resolve(); return; }
        if (initiator && (
          [
            ...r.mediumRedirects.scribe.normal,
            ...r.mediumRedirects.scribe.tor,
            ...r.scribeNormalCustomRedirects,
            ...r.scribeTorCustomRedirects,
          ].includes(initiator.origin))) { resolve(); return; }

        if (!targets.some(rx => rx.test(url.host))) { resolve(); return; }
        if (/^\/($|@[a-zA-Z.]{0,}(\/|)$)/.test(url.pathname)) { resolve(); return; }

        let instancesList;
        if (r.mediumProtocol == 'normal') instancesList = [...r.scribeNormalRedirectsChecks, ...r.scribeNormalCustomRedirects];
        else if (r.mediumProtocol == 'tor') instancesList = [...r.scribeTorRedirectsChecks, ...r.scribeTorCustomRedirects];
        if (instancesList.length === 0) { resolve(); return; }

        let randomInstance = utils.getRandomInstance(instancesList)
        resolve(`${randomInstance}${url.pathname}${url.search}`);
      }
    )
  })
}
function switchInstance(url) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "mediumRedirects",
        "mediumProtocol",

        "scribeNormalRedirectsChecks",
        "scribeNormalCustomRedirects",
        "scribeTorRedirectsChecks",
        "scribeTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(url);
        if (![
          ...r.mediumRedirects.scribe.tor,
          ...r.mediumRedirects.scribe.normal,

          ...r.scribeNormalCustomRedirects,
          ...r.scribeTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }

        let instancesList;
        if (r.mediumProtocol == 'normal') instancesList = [...r.scribeNormalCustomRedirects, ...r.scribeNormalRedirectsChecks];
        else if (r.mediumProtocol == 'tor') instancesList = [...r.scribeTorCustomRedirects, ...r.scribeTorRedirectsChecks];

        let index = instancesList.indexOf(protocolHost);
        if (index > -1) instancesList.splice(index, 1);
        if (instancesList.length === 0) { resolve(); return; }

        let randomInstance = utils.getRandomInstance(instancesList);
        resolve(`${randomInstance}${url.pathname}${url.search}`);
      })
  })
}

function initDefaults() {
  return new Promise(resolve => {
    fetch('/instances/data.json').then(response => response.text()).then(data => {
      let dataJson = JSON.parse(data);
      redirects.scribe = dataJson.scribe;
      browser.storage.local.get('cloudflareList',
        async r => {
          scribeNormalRedirectsChecks = [...redirects.scribe.normal];
          for (const instance of r.cloudflareList) {
            let i = scribeNormalRedirectsChecks.indexOf(instance);
            if (i > -1) scribeNormalRedirectsChecks.splice(i, 1);
          }
          await browser.storage.local.set({
            disableMedium: false,
            mediumRedirects: redirects,

            scribeNormalRedirectsChecks: scribeNormalRedirectsChecks,
            scribeNormalCustomRedirects: [],

            scribeTorRedirectsChecks: [...redirects.scribe.tor],
            scribeTorCustomRedirects: [],

            mediumProtocol: "normal",
          })
          resolve();
        })
    })
  })
}

export default {
  setRedirects,

  redirect,
  initDefaults,
  switchInstance,
};

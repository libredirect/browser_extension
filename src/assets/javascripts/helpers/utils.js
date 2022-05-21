window.browser = window.browser || window.chrome;
import twitterHelper from "./twitter.js";
import youtubeHelper from "./youtube/youtube.js";
import instagramHelper from "./instagram.js";
import mediumHelper from "./medium.js";
import redditHelper from "./reddit.js";
import searchHelper from "./search.js";
import translateHelper from "./translate/translate.js";
import wikipediaHelper from "./wikipedia.js";
import peertubeHelper from "./peertube.js";
import lbryHelper from "./lbry.js";
import sendTargetsHelper from "./sendTargets.js";
import tiktokHelper from "./tiktok.js";
import imgurHelper from "./imgur.js";
import localise from '../localise.js'

function getRandomInstance(instances) {
  return instances[~~(instances.length * Math.random())];
}

let cloudflareList = [];
async function initCloudflareList() {
  return new Promise(resolve => {
    fetch('/instances/blocklist.json').then(response => response.text()).then(data => {
      cloudflareList = JSON.parse(data);
      resolve();
    })
  });
}

function updateInstances() {
  return new Promise(async resolve => {
    let http = new XMLHttpRequest();
    http.open('GET', 'https://raw.githubusercontent.com/libredirect/libredirect/master/src/instances/data.json', false);
    http.send(null);
    if (http.status === 200) {
      await initCloudflareList();
      const instances = JSON.parse(http.responseText);

      youtubeHelper.setRedirects({ 'invidious': instances.invidious, 'piped': instances.piped, })
      twitterHelper.setRedirects(instances.nitter);
      instagramHelper.setRedirects(instances.bibliogram);
      redditHelper.setRedirects({ 'libreddit': instances.libreddit, 'teddit': instances.teddit });
      translateHelper.setRedirects({ "simplyTranslate": instances.simplyTranslate, "lingva": instances.lingva });
      searchHelper.setRedirects({ 'searx': instances.searx, 'searxng': instances.searxng, 'whoogle': instances.whoogle });
      wikipediaHelper.setRedirects(instances.wikiless);
      mediumHelper.setRedirects(instances.scribe);
      sendTargetsHelper.setRedirects(instances.send);
      tiktokHelper.setRedirects(instances.proxiTok);

      console.info("Successfully updated Instances");
      resolve(true); return;
    }
    resolve()
  })
}

function protocolHost(url) {
  if (url.username && url.password) return `${url.protocol}//${url.username}:${url.password}@${url.host}`;
  return `${url.protocol}//${url.host}`;
}

async function processDefaultCustomInstances(target, name, protocol, document) {

  function camelCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  let latencyKey = `${name}Latency`;
  let instancesLatency;
  await browser.storage.local.get(latencyKey, r => instancesLatency = r[latencyKey] ?? []);
  let nameProtocolElement = document.getElementById(name).getElementsByClassName(protocol)[0];

  let nameCustomInstances = [];
  let nameCheckListElement = nameProtocolElement.getElementsByClassName('checklist')[0];

  await initCloudflareList();


  let nameDefaultRedirects;

  let redirectsChecks = `${name}${camelCase(protocol)}RedirectsChecks`;
  let customRedirects = `${name}${camelCase(protocol)}CustomRedirects`;
  let redirectsKey = `${target}Redirects`;

  let redirects;

  async function getFromStorage() {
    return new Promise(async resolve => {
      browser.storage.local.get(
        [
          redirectsChecks,
          customRedirects,
          redirectsKey
        ],
        r => {
          nameDefaultRedirects = r[redirectsChecks];
          nameCustomInstances = r[customRedirects];
          redirects = r[redirectsKey];
          resolve();
        }
      )
    })
  }
  await getFromStorage();

  function calcNameCheckBoxes() {
    let isTrue = true;
    for (const item of redirects[name][protocol])
      if (!nameDefaultRedirects.includes(item)) {
        isTrue = false;
        break;
      }
    for (const element of nameCheckListElement.getElementsByTagName('input'))
      element.checked = nameDefaultRedirects.includes(element.className)
    if (nameDefaultRedirects.length == 0) isTrue = false;
    nameProtocolElement.getElementsByClassName('toogle-all')[0].checked = isTrue;
  }
  nameCheckListElement.innerHTML =
    [
      `<div>
        <x data-localise="__MSG_toggleAll__">Toggle All</x>
        <input type="checkbox" class="toogle-all"/>
      </div>`,
      ...redirects[name][protocol].map(
        x => {
          let cloudflare = cloudflareList.includes(x) ? ' <span style="color:red;">cloudflare</span>' : '';

          let ms = instancesLatency[x];
          let latencyColor = (ms <= 1000 ? "green" : ms <= 2000 ? "orange" : "red");
          let latencyLimit;
          if (ms == 5000) latencyLimit = '5000ms+';
          else if (ms > 5000) latencyLimit = `ERROR: ${ms - 5000}`;
          else latencyLimit = ms + 'ms';

          let latency = x in instancesLatency ? '<span style="color:' + latencyColor + ';">' + latencyLimit + '</span>' : '';

          return `<div>
                    <x><a href="${x}" target="_blank">${x}</a>${cloudflare} ${latency}</x>
                    <input type="checkbox" class="${x}"/>
                  </div>`;
        }
      ),
    ].join('\n<hr>\n');

  localise.localisePage();

  calcNameCheckBoxes();
  nameProtocolElement.getElementsByClassName('toogle-all')[0].addEventListener("change", async event => {
    if (event.target.checked)
      nameDefaultRedirects = [...redirects[name][protocol]];
    else
      nameDefaultRedirects = [];

    await browser.storage.local.set({ [redirectsChecks]: nameDefaultRedirects });
    calcNameCheckBoxes();
  });

  for (let element of nameCheckListElement.getElementsByTagName('input')) {
    if (element.className != 'toogle-all')
      nameProtocolElement.getElementsByClassName(element.className)[0].addEventListener("change", async event => {
        if (event.target.checked)
          nameDefaultRedirects.push(element.className)
        else {
          let index = nameDefaultRedirects.indexOf(element.className);
          if (index > -1) nameDefaultRedirects.splice(index, 1);
        }
        await browser.storage.local.set({ [redirectsChecks]: nameDefaultRedirects });
        calcNameCheckBoxes();
      });
  }

  function calcNameCustomInstances() {
    nameProtocolElement.getElementsByClassName('custom-checklist')[0].innerHTML =
      nameCustomInstances.map(
        x => `<div>
                ${x}
                <button class="add clear-${x}">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>
              </div>
              <hr>`
      ).join('\n');

    for (const item of nameCustomInstances) {
      nameProtocolElement.getElementsByClassName(`clear-${item}`)[0].addEventListener("click", async () => {
        let index = nameCustomInstances.indexOf(item);
        if (index > -1) nameCustomInstances.splice(index, 1);
        await browser.storage.local.set({ [customRedirects]: nameCustomInstances });
        calcNameCustomInstances();
      });
    }
  }
  calcNameCustomInstances();
  nameProtocolElement.getElementsByClassName('custom-instance-form')[0].addEventListener("submit", async event => {
    event.preventDefault();
    let nameCustomInstanceInput = nameProtocolElement.getElementsByClassName('custom-instance')[0];
    let url = new URL(nameCustomInstanceInput.value);
    let protocolHostVar = protocolHost(url);
    if (nameCustomInstanceInput.validity.valid && !redirects[name][protocol].includes(protocolHostVar)) {
      if (!nameCustomInstances.includes(protocolHostVar)) {
        nameCustomInstances.push(protocolHostVar)
        await browser.storage.local.set({ [customRedirects]: nameCustomInstances });
        nameCustomInstanceInput.value = '';
      }
      calcNameCustomInstances();
    }
  })
}

function isRtl() {
  return ["ar", "iw", "ku", "fa", "ur"].includes(browser.i18n.getUILanguage())
}

function getIp(href) {
  return new Promise(resolve => {
    let host = new URL(href).hostname;
    let http = new XMLHttpRequest();
    http.open("GET", `https://dns.google/resolve?name=${host}`, /*async*/true);
    http.onreadystatechange = () => {
      if (http.readyState == 4 && http.status == 200) {
        let r = JSON.parse(http.responseText);
        resolve(r.Answer[0].data)
      }
    };
    http.ontimeout = () => resolve()
    http.onerror = () => resolve()
    try {
      http.send(null)
    }
    catch (exception) {
      resolve()
    }
  })
}

async function ping(href) {
  return new Promise(async resolve => {
    let http = new XMLHttpRequest();
    http.open("GET", `${href}?_=${new Date().getTime()}`, /*async*/true);
    http.timeout = 5000;
    let started = new Date().getTime();
    http.onreadystatechange = () => {
      if (http.readyState == 2) {
        if (http.status == 200) {
          let ended = new Date().getTime();
          http.abort();
          resolve(ended - started);
        }
        else
          resolve(5000 + http.status)
      }
    };
    http.ontimeout = () => resolve(5000)
    http.onerror = () => resolve()
    try {
      http.send(null);
    } catch (exception) {
      resolve()
    }
  });
}

async function testLatency(element, instances) {
  return new Promise(async resolve => {
    let myList = {};
    for (const href of instances) await ping(href).then(m => {
      if (m) {
        myList[href] = m;
        let color;
        if (m <= 1000) color = "green"
        else if (m <= 2000) color = "orange"
        else color = "red";

        let text;
        if (m == 5000) text = '5000ms+'
        else if (m > 5000) text = `ERROR: ${m - 5000}`;
        else text = `${m}ms`;
        element.innerHTML = `${href}:&nbsp;<span style="color:${color};">${text}</span>`;
      }
    })
    resolve(myList);
  })
}

function copyCookie(frontend, targetUrl, url, name) {
  browser.cookies.get(
    { url: protocolHost(targetUrl), name: name },
    r => {
      if (r) {
        browser.cookies.set({ url: url, name: name, value: r.value })
        browser.storage.local.set({ [`${frontend}_${name}`]: r.value })
      }
    }
  )
}

function getCookiesFromStorage(frontend, to, name) {
  let key = `${frontend}_${name}`;
  browser.storage.local.get(
    key,
    r => {
      if (r[key] !== undefined) browser.cookies.set({ url: to, name: name, value: r[key] })
    }
  )
}

function copyRaw(test, copyRawElement) {
  return new Promise(resolve => {
    browser.tabs.query(
      { active: true, currentWindow: true }, async tabs => {
        let currTab = tabs[0];
        if (currTab) {
          let url;
          try {
            url = new URL(currTab.url);
          } catch { resolve(); return; }
          let newUrl;
          newUrl = await youtubeHelper.reverse(url);

          if (!newUrl) newUrl = await twitterHelper.reverse(url);
          if (!newUrl) newUrl = await instagramHelper.reverse(url);
          if (!newUrl) newUrl = await tiktokHelper.reverse(url);
          if (!newUrl) newUrl = await imgurHelper.reverse(url);

          if (newUrl) {
            resolve(true);
            if (test) return;
            navigator.clipboard.writeText(newUrl);
            if (copyRawElement) {
              const textElement = copyRawElement.getElementsByTagName('h4')[0]
              const oldHtml = textElement.innerHTML;
              textElement.innerHTML = 'Copied';
              setTimeout(() => textElement.innerHTML = oldHtml, 1000);
            }
          } else resolve()
        }
      }
    )
  })
}

function unify(test, unifyElement) {
  return new Promise(resolve => {
    browser.tabs.query(
      { active: true, currentWindow: true },
      async tabs => {
        let currTab = tabs[0]
        if (currTab) {
          let url;
          try { url = new URL(currTab.url); }
          catch { resolve(); return; }

          let result = await youtubeHelper.initInvidiousCookies(test, url);
          if (!result) result = await youtubeHelper.initPipedLocalStorage(test, url, currTab.id);
          if (!result) result = await youtubeHelper.initPipedMaterialLocalStorage(test, url, currTab.id);

          if (!result) result = await twitterHelper.initNitterCookies(test, url);

          if (!result) result = await redditHelper.initLibredditCookies(test, url);
          if (!result) result = await redditHelper.initTedditCookies(test, url);

          if (!result) result = await searchHelper.initSearxCookies(test, url);
          if (!result) result = await searchHelper.initSearxngCookies(test, url);

          if (!result) result = await tiktokHelper.initProxiTokCookies(test, url);

          if (!result) result = await wikipediaHelper.initWikilessCookies(test, url);

          if (!result) result = await translateHelper.initSimplyTranslateCookies(test, url);
          if (!result) result = await translateHelper.initLingvaLocalStorage(test, url);

          if (result) {
            if (!test) {
              const textElement = unifyElement.getElementsByTagName('h4')[0]
              const oldHtml = textElement.innerHTML;
              textElement.innerHTML = 'Unified';
              setTimeout(() => textElement.innerHTML = oldHtml, 1000);
            }
            resolve(true);
          } else resolve()
        }
      }
    )
  })
}

function switchInstance(test) {
  return new Promise(resolve => {
    browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
      let currTab = tabs[0];
      if (currTab) {
        let url;
        try { url = new URL(currTab.url); }
        catch { resolve(); return };
        let newUrl = await youtubeHelper.switchInstance(url);
        if (!newUrl) newUrl = await twitterHelper.switchInstance(url);
        if (!newUrl) newUrl = await instagramHelper.switchInstance(url);
        if (!newUrl) newUrl = await redditHelper.switchInstance(url);
        if (!newUrl) newUrl = await searchHelper.switchInstance(url);
        if (!newUrl) newUrl = await translateHelper.switchInstance(url);
        if (!newUrl) newUrl = await mediumHelper.switchInstance(url);
        if (!newUrl) newUrl = await sendTargetsHelper.switchInstance(url);
        if (!newUrl) newUrl = await peertubeHelper.switchInstance(url);
        if (!newUrl) newUrl = await lbryHelper.switchInstance(url);
        if (!newUrl) newUrl = await imgurHelper.switchInstance(url);
        if (!newUrl) newUrl = await wikipediaHelper.switchInstance(url);

        if (newUrl) {
          if (!test)
            browser.tabs.update({ url: newUrl });
          resolve(true)
        } else resolve()
      }
    })
  })
}

function latency(name, frontend, document, location, splitNames) {
  let latencyElement;
  let latencyLabel;
  if (splitNames == true) {
    latencyElement = document.getElementById(`latency-${frontend}`);
    latencyLabel = document.getElementById(`latency-${frontend}-label`);
  } else {
    latencyElement = document.getElementById("latency");
    latencyLabel = document.getElementById("latency-label");
  }
  latencyElement.addEventListener("click",
    async () => {
      let reloadWindow = () => location.reload();
      latencyElement.addEventListener("click", reloadWindow);
      let key = `${name}Redirects`
      browser.storage.local.get(
        key,
        r => {
          let redirects = r[key];
          const oldHtml = latencyLabel.innerHTML;
          latencyLabel.innerHTML = '...';
          testLatency(latencyLabel, redirects[frontend].normal).then(r => {
            browser.storage.local.set({ [`${frontend}Latency`]: r });
            latencyLabel.innerHTML = oldHtml;
            processDefaultCustomInstances(name, frontend, 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow)
          });
        }
      )
    }
  );
}

export default {
  getRandomInstance,
  updateInstances,
  protocolHost,
  processDefaultCustomInstances,
  isRtl,
  latency,
  copyCookie,
  getCookiesFromStorage,
  switchInstance,
  copyRaw,
  unify,
}

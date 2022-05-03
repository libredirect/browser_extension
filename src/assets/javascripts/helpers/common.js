window.browser = window.browser || window.chrome;
import twitterHelper from "./twitter.js";
import youtubeHelper from "./youtube/youtube.js";
import instagramHelper from "./instagram.js";
import mediumHelper from "./medium.js";
import redditHelper from "./reddit.js";
import searchHelper from "./search.js";
import translateHelper from "./translate/translate.js";
import wikipediaHelper from "./wikipedia.js";
import localise from '../localise.js'
import sendTargetsHelper from "./sendTargets.js";
import tikTokHelper from "./tiktok.js";

function getRandomInstance(instances) {
  return instances[~~(instances.length * Math.random())];
}

let cloudflareList = [];
async function initCloudflareList() {
  return new Promise(resolve => {
    fetch('/instances/cloudflare.json').then(response => response.text()).then(data => {
      cloudflareList = data;
      resolve();
    })
  });
}
async function wholeInit() {
  await youtubeHelper.init();
  await twitterHelper.init();
  await instagramHelper.init();
  await redditHelper.init();
  await translateHelper.init();
  await searchHelper.init();
  await wikipediaHelper.init();
  await mediumHelper.init();
  await sendTargetsHelper.init();
  await tikTokHelper.init();
  await initCloudflareList();
}

async function updateInstances() {
  const apiEndpoint = 'https://raw.githubusercontent.com/libredirect/libredirect/master/src/instances/data.json';
  let request = new XMLHttpRequest();
  request.open('GET', apiEndpoint, false);
  request.send(null);

  if (request.status === 200) {

    await wholeInit();

    const instances = JSON.parse(request.responseText);

    brwoser.storage.local.get(
      [
        'youtubeRedirects'
      ],
      r =>
        brwoser.storage.local.set({
          youtubeRedirects: {
            'invidious': instances.invidious,
            'piped': r.youtubeRedirects.piped,
            'pipedMaterial': r.youtubeRedirects.pipedMaterial
          },
        })
    )

    twitterHelper.setRedirects(instances.nitter);

    instagramHelper.setRedirects(instances.bibliogram);

    redditHelper.setTedditRedirects(instances.teddit);
    redditHelper.setLibredditRedirects(instances.libreddit);

    translateHelper.setSimplyTranslateRedirects(instances.simplyTranslate);
    translateHelper.setLingvaRedirects(instances.lingva)

    searchHelper.setSearxRedirects(instances.searx);
    searchHelper.setSearxngRedirects(instances.searxng);
    searchHelper.setWhoogleRedirects(instances.whoogle);

    wikipediaHelper.setRedirects(instances.wikiless);

    mediumHelper.setRedirects(instances.scribe);

    sendTargetsHelper.setRedirects(instances.send);

    tikTokHelper.setRedirects(instances.proxiTok);

    console.info("Successfully updated Instances");
    return true;
  }
  return false;
}

function protocolHost(url) {
  if (url.username && url.password) return `${url.protocol}//${url.username}:${url.password}@${url.host}`;
  return `${url.protocol}//${url.host}`;
}

async function processDefaultCustomInstances(
  name,
  protocol,
  nameHelper,
  document,
) {
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

  function calcNameCheckBoxes() {
    let isTrue = true;
    for (const item of nameHelper.getRedirects()[name][protocol])
      if (!nameDefaultRedirects.includes(item)) {
        isTrue = false;
        break;
      }
    for (const element of nameCheckListElement.getElementsByTagName('input'))
      element.checked = nameDefaultRedirects.includes(element.className)
    if (nameDefaultRedirects.length == 0) isTrue = false;
    nameProtocolElement.getElementsByClassName('toogle-all')[0].checked = isTrue;
  }

  let nameDefaultRedirects;

  let redirectsChecks = `${name}${camelCase(protocol)}RedirectsChecks`;
  let customRedirects = `${name}${camelCase(protocol)}CustomRedirects`;

  async function setRedirectsChecks(val) {
    await browser.storage.local.set({ [redirectsChecks]: val });
  }

  async function setCustom(val) {
    await browser.storage.local.set({ [customRedirects]: val });
  }

  async function getFromStorage() {
    return new Promise(async resolve => {
      nameHelper.init().then(() =>
        browser.storage.local.get(
          [
            redirectsChecks,
            customRedirects,
          ],
          r => {
            nameDefaultRedirects = r[redirectsChecks];
            nameCustomInstances = r[customRedirects];
            resolve();
          }
        )
      )
    })
  }
  await getFromStorage();

  nameCheckListElement.innerHTML =
    [
      `<div>
        <x data-localise="__MSG_toggleAll__">Toggle All</x>
        <input type="checkbox" class="toogle-all"/>
      </div>`,
      ...nameHelper.getRedirects()[name][protocol].map(
        x => {
          let cloudflare = cloudflareList.includes(x) ? ' <span style="color:red;">cloudflare</span>' : '';

          let latencyColor = (instancesLatency[x] <= 1000 ? "green" : instancesLatency[x] <= 2000 ? "orange" : "red");
          let latencyLimit = (instancesLatency[x] == 5000 ? '5000ms+' : instancesLatency[x] + 'ms')
          let latency = x in instancesLatency ? '<span style="color:' + latencyColor + ';">' + latencyLimit + '</span>' : '';

          return `<div><x>${x}${cloudflare} ${latency}</x><input type="checkbox" class="${x}"/></div>`;
        }
      ),
    ].join('\n<hr>\n');

  localise.localisePage();

  calcNameCheckBoxes();
  nameProtocolElement.getElementsByClassName('toogle-all')[0].addEventListener("change", async event => {
    if (event.target.checked)
      nameDefaultRedirects = [...nameHelper.getRedirects()[name][protocol]];
    else
      nameDefaultRedirects = [];

    await setRedirectsChecks(nameDefaultRedirects);
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
        await setRedirectsChecks(nameDefaultRedirects);
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
      nameProtocolElement.getElementsByClassName(`clear-${item}`)[0].addEventListener("click", () => {
        let index = nameCustomInstances.indexOf(item);
        if (index > -1) nameCustomInstances.splice(index, 1);
        setCustom(nameCustomInstances);
        calcNameCustomInstances();
      });
    }
  }
  calcNameCustomInstances();
  nameProtocolElement.getElementsByClassName('custom-instance-form')[0].addEventListener("submit", event => {
    event.preventDefault();
    let nameCustomInstanceInput = nameProtocolElement.getElementsByClassName('custom-instance')[0];
    let url = new URL(nameCustomInstanceInput.value);
    let protocolHostVar = protocolHost(url);
    if (nameCustomInstanceInput.validity.valid && !nameHelper.getRedirects()[name][protocol].includes(protocolHostVar)) {
      if (!nameCustomInstances.includes(protocolHostVar)) {
        nameCustomInstances.push(protocolHostVar)
        setCustom(nameCustomInstances);
        nameCustomInstanceInput.value = '';
      }
      calcNameCustomInstances();
    }
  })
}

function isRtl() {
  return ["ar", "iw", "ku", "fa", "ur"].includes(browser.i18n.getUILanguage())
}

async function ping(href) {
  return new Promise(resolve => {
    let http = new XMLHttpRequest();
    http.open("GET", href + '?_=' + new Date().getTime(), /*async*/true);
    http.timeout = 5000;
    let started = new Date().getTime();
    http.onreadystatechange = function () {
      if (http.readyState == 2) {
        if (http.status == 200) {
          let ended = new Date().getTime();
          let ms = ended - started;
          http.abort();
          resolve(ms);
        }
        else resolve()
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
        element.innerHTML = `${href}:&nbsp;${'<span style="color:' + (m <= 1000 ? "green" : m <= 2000 ? "orange" : "red") + ';">' + (m == 5000 ? '5000ms+' : m + 'ms') + '</span>'}`;
        console.log(`${href}: ${m}ms`)
      }
    })
    resolve(myList);
  })
}
export default {
  getRandomInstance,
  updateInstances,
  protocolHost,
  processDefaultCustomInstances,
  isRtl,
  testLatency,
}

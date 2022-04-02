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

function getRandomInstance(instances) {
  return instances[~~(instances.length * Math.random())];
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
}

async function updateInstances() {
  const apiEndpoint = 'https://raw.githubusercontent.com/libredirect/libredirect/master/src/instances/data.json';
  let request = new XMLHttpRequest();
  request.open('GET', apiEndpoint, false);
  request.send(null);

  if (request.status === 200) {

    await wholeInit();

    const instances = JSON.parse(request.responseText);

    youtubeHelper.setInvidiousRedirects(instances.invidious);

    twitterHelper.setRedirects(instances.nitter);

    instagramHelper.setRedirects(instances.bibliogram);

    redditHelper.setTedditRedirects(instances.teddit);

    translateHelper.setSimplyTranslateRedirects(instances.simplyTranslate);
    translateHelper.setLingvaRedirects(instances.lingva)

    searchHelper.setSearxRedirects(instances.searx);
    searchHelper.setWhoogleRedirects(instances.whoogle);

    wikipediaHelper.setRedirects(instances.wikiless);

    mediumHelper.setRedirects(instances.scribe);

    console.info("Successfully updated Instances");
    return true;
  }
  return false;
}

function isFirefox() {
  return typeof InstallTrigger !== "undefined";
}

function protocolHost(url) {
  if (url.username && url.password) return `${url.protocol}//${url.username}:${url.password}@${url.host}`;
  return `${url.protocol}//${url.host}`;
}

function processDefaultCustomInstances(
  name,
  protocol,
  nameHelper,
  document,
  getNameRedirectsChecks,
  setNameRedirectsChecks,
  getNameCustomRedirects,
  setNameCustomRedirects
) {

  let nameCustomInstances = [];
  let nameCheckListElement = document.getElementById(`${name}-${protocol}-checklist`);
  let nameDefaultRedirects;

  function calcNameCheckBoxes() {
    let isTrue = true;
    for (const item of nameHelper.getRedirects()[name][protocol])
      if (!nameDefaultRedirects.includes(item)) {
        isTrue = false;
        break;
      }
    for (const element of nameCheckListElement.getElementsByTagName('input'))
      element.checked = nameDefaultRedirects.includes(element.id)
    document.getElementById(`${name}-${protocol}-toogle-all`).checked = isTrue;
  }

  nameDefaultRedirects = getNameRedirectsChecks();

  nameCheckListElement.innerHTML =
    [
      `<div><x data-localise="__MSG_toggleAll__">Toggle All</x><input type="checkbox" id="${name}-${protocol}-toogle-all" /></div>`,
      ...nameHelper.getRedirects()[name][protocol].map((x) => `<div>${x}<input type="checkbox" id="${x}" /></div>`),
    ].join('\n<hr>\n');

  localise.localisePage();

  calcNameCheckBoxes();
  document.getElementById(`${name}-${protocol}-toogle-all`).addEventListener("change", event => {
    if (event.target.checked)
      nameDefaultRedirects = [...nameHelper.getRedirects()[name][protocol]];
    else
      nameDefaultRedirects = [];
    setNameRedirectsChecks(nameDefaultRedirects);
    calcNameCheckBoxes();
  });

  for (let element of nameCheckListElement.getElementsByTagName('input')) {
    if (element.id != `${name}-${protocol}-toogle-all`)
      document.getElementById(element.id).addEventListener("change", (event) => {
        if (event.target.checked)
          nameDefaultRedirects.push(element.id)
        else {
          let index = nameDefaultRedirects.indexOf(element.id);
          if (index > -1) nameDefaultRedirects.splice(index, 1);
        }
        setNameRedirectsChecks(nameDefaultRedirects);
        calcNameCheckBoxes();
      });
  }

  nameCustomInstances = getNameCustomRedirects();
  function calcNameCustomInstances() {
    document.getElementById(`${name}-${protocol}-custom-checklist`).innerHTML =
      nameCustomInstances.map(
        (x) => `<div>${x}<button class="add" id="clear-${x}">
                              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                              fill="currentColor">
                                  <path d="M0 0h24v24H0V0z" fill="none" />
                                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                              </svg>
                          </button>
                      </div>
                      <hr>`
      ).join('\n');

    for (const item of nameCustomInstances) {
      document.getElementById(`clear-${item}`).addEventListener("click", () => {
        let index = nameCustomInstances.indexOf(item);
        if (index > -1) nameCustomInstances.splice(index, 1);
        setNameCustomRedirects(nameCustomInstances);
        calcNameCustomInstances();
      });
    }
  }
  calcNameCustomInstances();
  document.getElementById(`custom-${name}-${protocol}-instance-form`).addEventListener("submit", (event) => {
    event.preventDefault();
    let nameCustomInstanceInput = document.getElementById(`${name}-${protocol}-custom-instance`);
    let url = new URL(nameCustomInstanceInput.value);
    let protocolHostVar = protocolHost(url);
    if (nameCustomInstanceInput.validity.valid && !nameHelper.getRedirects()[name][protocol].includes(protocolHostVar)) {
      if (!nameCustomInstances.includes(protocolHostVar)) {
        nameCustomInstances.push(protocolHostVar)
        setNameCustomRedirects(nameCustomInstances);
        nameCustomInstanceInput.value = '';
      }
      calcNameCustomInstances();
    }
  })
}

export default {
  getRandomInstance,
  updateInstances,
  protocolHost,
  isFirefox,
  processDefaultCustomInstances,
};

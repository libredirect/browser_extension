import twitterHelper from "./twitter.js";
import youtubeHelper from "./youtube/youtube.js";
import instagramHelper from "./instagram.js";
import mediumHelper from "./medium.js";
import redditHelper from "./reddit.js";
import searchHelper from "./search.js";
import data from '../data.js'
import translateHelper from "./translate.js";
import wikipediaHelper from "./wikipedia.js";
import mapsHelper from "./maps.js";
import medium from "./medium.js";

function getRandomInstance(instances) {
  return instances[~~(instances.length * Math.random())];
}

function updateInstances() {
  const apiEndpoint = 'https://raw.githubusercontent.com/libredirect/instances/main/data.json';
  let request = new XMLHttpRequest();
  request.open('GET', apiEndpoint, false);
  request.send(null);

  if (request.status === 200) {
    const instances = JSON.parse(request.responseText);

    youtubeHelper.setInvidiousRedirects(instances.invidious);

    twitterHelper.setRedirects(instances.nitter);

    instagramHelper.setRedirects(instances.bibliogram);

    redditHelper.setTedditRedirects(instances.teddit);

    translateHelper.setSimplyTranslateRedirects(instances.simplyTranslate);

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

function processDefaultCustomInstances(
  name,
  nameHelper,
  document,
  getNameRedirectsChecks,
  setNameRedirectsChecks,
  getNameCustomRedirects,
  setNameCustomRedirects
) {

  let nameCustomInstances = [];
  let nameCheckListElement = document.getElementById(`${name}-checklist`);
  let nameDefaultRedirects;

  function calcNameCheckBoxes() {
    let isTrue = true;
    for (const item of nameHelper.getRedirects()[name].normal)
      if (!nameDefaultRedirects.includes(item)) {
        isTrue = false;
        break;
      }
    for (const element of nameCheckListElement.getElementsByTagName('input'))
      element.checked = nameDefaultRedirects.includes(element.id)
    document.getElementById(`${name}-toogle-all`).checked = isTrue;
  }

  nameDefaultRedirects = getNameRedirectsChecks();
  nameCheckListElement.innerHTML =
    [
      `<div>Toggle All<input type="checkbox" id="${name}-toogle-all" /></div>`,
      ...nameHelper.getRedirects()[name].normal.map((x) => `<div>${x}<input type="checkbox" id="${x}" /></div>`),
    ].join('\n<hr>\n');

  calcNameCheckBoxes();
  document.getElementById(`${name}-toogle-all`).addEventListener("change", (event) => {
    if (event.target.checked)
      nameDefaultRedirects = [...nameHelper.getRedirects()[name].normal];
    else
      nameDefaultRedirects = [];
    setNameRedirectsChecks(nameDefaultRedirects);
    calcNameCheckBoxes();
  });

  for (let element of nameCheckListElement.getElementsByTagName('input')) {
    if (element.id != `${name}-toogle-all`)
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
    document.getElementById(`${name}-custom-checklist`).innerHTML =
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
  document.getElementById(`custom-${name}-instance-form`).addEventListener("submit", (event) => {
    event.preventDefault();
    let nameCustomInstanceInput = document.getElementById(`${name}-custom-instance`);
    let val = nameCustomInstanceInput.value
    if (nameCustomInstanceInput.validity.valid && !nameHelper.getRedirects()[name].normal.includes(val) && val.trim() != '') {
      if (!nameCustomInstances.includes(val)) {
        nameCustomInstances.push(val)
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
  isFirefox,
  processDefaultCustomInstances,
};

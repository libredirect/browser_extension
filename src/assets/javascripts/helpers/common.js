import twitterHelper from "./twitter.js";
import youtubeHelper from "./youtube.js";
import instagramHelper from "./instagram.js";
import mediumHelper from "./medium.js";
import redditHelper from "./reddit.js";
import searchHelper from "./search.js";
import data from '../data.js'
import translateHelper from "./translate.js";
import wikipediaHelper from "./wikipedia.js";
import mapsHelper from "./maps.js";
import medium from "./medium.js";


function addHttps(instances) {
  return instances.map((item, i) => "https://" + item)
}

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

    youtubeHelper.setRedirects(instances.invidious);

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

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    let context = this,
      args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

function filterList(oldList) {
  oldList.filter((x) => x.trim() != "");
  let newList = [];
  oldList.forEach((c) => {
    if (!newList.includes(c.trim()))
      newList.push(c.trim());
  });
  newList = newList.filter(validURL)
  return newList;
}

function updateListElement(listElement, list) {
  while (listElement.firstChild)
    listElement.removeChild(listElement.firstChild);
  list.forEach(element => {
    let entry = document.createElement('li');
    entry.appendChild(document.createTextNode(element));
    listElement.appendChild(entry);
  });
}

function isFirefox() {
  return typeof InstallTrigger !== "undefined";
}

function isException(url, initiator) {
  return (
    data.exceptions.some((regex) => regex.test(url.href)) ||
    (initiator && data.exceptions.some((regex) => regex.test(initiator.href)))
  );
}

export default {
  getRandomInstance,
  updateInstances,
  addHttps,
  debounce,
  validURL,
  filterList,
  updateListElement,
  isFirefox,
  isException,
};

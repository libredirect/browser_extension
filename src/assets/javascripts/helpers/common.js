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

export default {
  getRandomInstance,
  updateInstances,
  isFirefox,
};

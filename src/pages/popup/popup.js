"use strict";

import commonHelper from "../../assets/javascripts/helpers/common.js";
import data from "../../assets/javascripts/data.js";

let disableNitterElement = document.querySelector("#disable-nitter");
let disableInvidiousElement = document.querySelector("#disable-invidious");
let disableBibliogramElement = document.querySelector("#disable-bibliogram");
let disableOsmElement = document.querySelector("#disable-osm");
let disableRedditElement = document.querySelector("#disable-reddit");
let disableSearchElement = document.querySelector("#disable-search");
let disableSimplyTranslateElement = document.querySelector("#disable-simplyTranslate");
let disableWikipediaElement = document.querySelector("#disable-wikipedia");
let disableScribeElement = document.querySelector("#disable-scribe");

window.browser = window.browser || window.chrome;

// Complete change to the global variables in data.js

if (data.theme) document.body.classList.add(data.theme);
disableNitterElement.checked = !data.disableNitter;
disableInvidiousElement.checked = !data.disableInvidious;
disableBibliogramElement.checked = !data.disableBibliogram;
disableOsmElement.checked = !data.disableOsm;
disableRedditElement.checked = !data.disableReddit;
disableSearchElement.checked = !data.disableSearch;
disableSimplyTranslateElement.checked = !data.disableSimplyTranslate;
disableWikipediaElement.checked = !data.disableWikipedia;
disableScribeElement.checked = !data.disableScribe;


disableNitterElement.addEventListener("change", (event) => {
  data.disableNitter = !event.target.checked;
  browser.storage.sync.set({ disableNitter: data.disableNitter });
});

disableInvidiousElement.addEventListener("change", (event) => {
  data.disableInvidious = !event.target.checked;
  browser.storage.sync.set({ disableInvidious: data.disableInvidious });
});

disableBibliogramElement.addEventListener("change", (event) => {
  data.disableBibliogram = !event.target.checked;
  browser.storage.sync.set({ disableBibliogram: data.disableBibliogram });
});

disableOsmElement.addEventListener("change", (event) => {
  data.disableOsm = !event.target.checked;
  browser.storage.sync.set({ disableOsm: data.disableOsm });
});

disableRedditElement.addEventListener("change", (event) => {
  data.disableReddit = !event.target.checked;
  browser.storage.sync.set({ disableReddit: data.disableReddit });
});

disableSearchElement.addEventListener("change", (event) => {
  data.disableSearch = !event.target.checked;
  console.log("DisableSearch", data.disableSearch)
  browser.storage.sync.set({ disableSearch: data.disableSearch });
});

disableSimplyTranslateElement.addEventListener("change", (event) => {
  data.disableSimplyTranslate = !event.target.checked;
  browser.storage.sync.set({ disableSimplyTranslate: data.disableSimplyTranslate });
});

disableWikipediaElement.addEventListener("change", (event) => {
  data.disableWikipedia = !event.target.checked;
  browser.storage.sync.set({ disableWikipedia: data.disableWikipedia });
});

disableScribeElement.addEventListener("change", (event) => {
  data.disableScribe = !event.target.checked;
  browser.storage.sync.set({ disableScribe: data.disableScribe });
});


document.querySelector("#update-instances").addEventListener("click", () => {
  document.querySelector("#update-instances").innerHTML = '...';
  if (commonHelper.updateInstances())
    document.querySelector("#update-instances").innerHTML = 'Done!';
  else
    document.querySelector("#update-instances").innerHTML = 'Failed Miserabely';
});

document.querySelector("#more-options").addEventListener("click", () => {
  browser.runtime.openOptionsPage();
});

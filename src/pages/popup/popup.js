"use strict";

import commonHelper from "../../assets/javascripts/helpers/common.js";
import data from "../../assets/javascripts/data.js";
import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import youtubeHelper from "../../assets/javascripts/helpers/youtube.js";
import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import mapsHelper from "../../assets/javascripts/helpers/google-maps.js";
import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import searchHelper from "../../assets/javascripts/helpers/google-search.js";
import translateHelper from "../../assets/javascripts/helpers/google-translate.js";
import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import mediumHelper from "../../assets/javascripts/helpers/medium.js";

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


disableNitterElement.addEventListener("change",
  (event) => twitterHelper.setDisableNitter(!event.target.checked)
);

disableInvidiousElement.addEventListener("change",
  (event) => youtubeHelper.setDisableInvidious(!event.target.checked)
);

disableBibliogramElement.addEventListener("change",
  (event) => instagramHelper.setDisableBibliogram(!event.target.checked)
);

disableOsmElement.addEventListener("change",
  (event) => mapsHelper.setDisableOsm(!event.target.checked)
);

disableRedditElement.addEventListener("change",
  (event) => redditHelper.setDisableReddit(!event.target.checked)
);

disableSearchElement.addEventListener("change",
  (event) => searchHelper.setDisableSearch(!event.target.checked)
);

disableSimplyTranslateElement.addEventListener("change",
  (event) => translateHelper.setDisableSimplyTranslate(!event.target.checked)
);

disableWikipediaElement.addEventListener("change",
  (event) => wikipediaHelper.setDisableWikipedia(!event.target.checked)
);

disableScribeElement.addEventListener("change",
  (event) => mediumHelper.setDisableScribe(!event.target.checked)
);


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

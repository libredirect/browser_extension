"use strict";

import commonHelper from "../../assets/javascripts/helpers/common.js";
import data from "../../assets/javascripts/data.js";
import youtubeHelper from "../../assets/javascripts/helpers/youtube/youtube.js";
import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import mapsHelper from "../../assets/javascripts/helpers/maps.js";
import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import searchHelper from "../../assets/javascripts/helpers/search.js";
import translateHelper from "../../assets/javascripts/helpers/translate.js";
import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import mediumHelper from "../../assets/javascripts/helpers/medium.js";
import imgurHelper from "../../assets/javascripts/helpers/imgur.js";
import tiktokHelper from "../../assets/javascripts/helpers/tiktok.js";

let disableTwitterElement = document.querySelector("#disable-nitter");
let disableYoutubeElement = document.querySelector("#disable-invidious");
let disableInstagramElement = document.querySelector("#disable-bibliogram");
let disableMapsElement = document.querySelector("#disable-osm");
let disableRedditElement = document.querySelector("#disable-reddit");
let disableSearchElement = document.querySelector("#disable-search");
let disableTranslateElement = document.querySelector("#disable-simplyTranslate");
let disableWikipediaElement = document.querySelector("#disable-wikipedia");
let disableMediumElement = document.querySelector("#disable-medium");
let disableImgurElement = document.querySelector("#disable-imgur");
let disableTiktokElement = document.querySelector("#disable-tiktok");

window.browser = window.browser || window.chrome;

async function wholeInit() {
  await youtubeHelper.init();
  await twitterHelper.init();
  await instagramHelper.init();
  await mapsHelper.init();
  await redditHelper.init();
  await searchHelper.init();
  await translateHelper.init();
  await wikipediaHelper.init();
  await imgurHelper.init();
  await tiktokHelper.init();
  await mediumHelper.init();
};

wholeInit().then(() => {
  if (data.theme) document.body.classList.add(data.theme);
  disableTwitterElement.checked = !twitterHelper.getDisableTwitter();
  disableYoutubeElement.checked = !youtubeHelper.getDisableYoutube();
  disableInstagramElement.checked = !instagramHelper.getDisableInstagram();
  disableMapsElement.checked = !mapsHelper.getDisableMaps();
  disableRedditElement.checked = !redditHelper.getDisableReddit();
  disableSearchElement.checked = !searchHelper.getDisableSearch();
  disableTranslateElement.checked = !translateHelper.getDisableTranslate();
  disableWikipediaElement.checked = !wikipediaHelper.getDisableWikipedia();
  disableImgurElement.checked = !imgurHelper.getDisableImgur();
  disableTiktokElement.checked = !tiktokHelper.getDisableTiktok();
  disableMediumElement.checked = !mediumHelper.getDisableMedium();
})

disableTwitterElement.addEventListener("change",
  (event) => twitterHelper.setDisableTwitter(!event.target.checked)
);

disableYoutubeElement.addEventListener("change",
  (event) => youtubeHelper.setDisableYoutube(!event.target.checked)
);

disableInstagramElement.addEventListener("change",
  (event) => instagramHelper.setDisableInstagram(!event.target.checked)
);

disableMapsElement.addEventListener("change",
  (event) => mapsHelper.setDisableMaps(!event.target.checked)
);

disableRedditElement.addEventListener("change",
  (event) => redditHelper.setDisableReddit(!event.target.checked)
);

disableSearchElement.addEventListener("change",
  (event) => searchHelper.setDisableSearch(!event.target.checked)
);

disableTranslateElement.addEventListener("change",
  (event) => translateHelper.setDisableTranslate(!event.target.checked)
);

disableWikipediaElement.addEventListener("change",
  (event) => wikipediaHelper.setDisableWikipedia(!event.target.checked)
);

disableImgurElement.addEventListener("change",
  (event) => imgurHelper.setDisableImgur(!event.target.checked)
);

disableTiktokElement.addEventListener("change",
  (event) => tiktokHelper.setDisableTiktok(!event.target.checked)
);

disableMediumElement.addEventListener("change",
  (event) => mediumHelper.setDisableMedium(!event.target.checked)
);

document.querySelector("#more-options").addEventListener("click", () => {
  browser.runtime.openOptionsPage();
});

"use strict";
window.browser = window.browser || window.chrome;

import commonHelper from "../../assets/javascripts/helpers/common.js";
import youtubeHelper from "../../assets/javascripts/helpers/youtube/youtube.js";
import youtubeMusicHelper from "../../assets/javascripts/helpers/youtubeMusic.js";
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

let disableTwitterElement = document.getElementById("disable-nitter");
let disableYoutubeElement = document.getElementById("disable-youtube");
let disableYoutubeMusicElement = document.getElementById("disable-youtubeMusic");
let disableInstagramElement = document.getElementById("disable-bibliogram");
let disableMapsElement = document.getElementById("disable-osm");
let disableRedditElement = document.getElementById("disable-reddit");
let disableSearchElement = document.getElementById("disable-search");
let disableElement = document.getElementById("disable-simplyTranslate");
let disableWikipediaElement = document.getElementById("disable-wikipedia");
let disableMediumElement = document.getElementById("disable-medium");
let disableImgurElement = document.getElementById("disable-imgur");
let disableTiktokElement = document.getElementById("disable-tiktok");

async function wholeInit() {
  await youtubeHelper.init();
  await youtubeMusicHelper.init();
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
  disableTwitterElement.checked = !twitterHelper.getDisable();
  disableYoutubeElement.checked = !youtubeHelper.getDisable();
  disableYoutubeMusicElement.checked = !youtubeMusicHelper.getDisable();
  disableInstagramElement.checked = !instagramHelper.getDisable();
  disableMapsElement.checked = !mapsHelper.getDisable();
  disableRedditElement.checked = !redditHelper.getDisableReddit();
  disableSearchElement.checked = !searchHelper.getDisable();
  disableElement.checked = !translateHelper.getDisable();
  disableWikipediaElement.checked = !wikipediaHelper.getDisable();
  disableImgurElement.checked = !imgurHelper.getDisable();
  disableTiktokElement.checked = !tiktokHelper.getDisable();
  disableMediumElement.checked = !mediumHelper.getDisable();
})

disableTwitterElement.addEventListener("change",
  event => twitterHelper.setDisable(!event.target.checked)
);

disableYoutubeElement.addEventListener("change",
  event => youtubeHelper.setDisable(!event.target.checked)
);

disableYoutubeMusicElement.addEventListener("change",
  event => youtubeMusicHelper.setDisable(!event.target.checked)
);

disableInstagramElement.addEventListener("change",
  event => instagramHelper.setDisable(!event.target.checked)
);

disableMapsElement.addEventListener("change",
  event => mapsHelper.setDisable(!event.target.checked)
);

disableRedditElement.addEventListener("change",
  event => redditHelper.setDisableReddit(!event.target.checked)
);

disableSearchElement.addEventListener("change",
  event => searchHelper.setDisable(!event.target.checked)
);

disableElement.addEventListener("change",
  event => translateHelper.setDisable(!event.target.checked)
);

disableWikipediaElement.addEventListener("change",
  event => wikipediaHelper.setDisable(!event.target.checked)
);

disableImgurElement.addEventListener("change",
  event => imgurHelper.setDisable(!event.target.checked)
);

disableTiktokElement.addEventListener("change",
  event => tiktokHelper.setDisable(!event.target.checked)
);

disableMediumElement.addEventListener("change",
  event => mediumHelper.setDisable(!event.target.checked)
);

document.getElementById("more-options").addEventListener("click",
  () => browser.runtime.openOptionsPage()
);

document.getElementById("change-instance").addEventListener("click",
  () => browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currTab = tabs[0];
    if (currTab) {
      changeInstance(currTab.url)
    }
  })
);

function changeInstance(url) {
  var tabUrl = new URL(url);
  var protocolHost = `${tabUrl.protocol}//${tabUrl.host}`;
  var newUrl;

  newUrl = youtubeHelper.changeInstance(tabUrl);

  if (!newUrl) newUrl = twitterHelper.changeInstance(tabUrl);

  if (!newUrl) newUrl = instagramHelper.changeInstance(tabUrl);

  if (!newUrl) newUrl = redditHelper.changeInstance(tabUrl);

  if (!newUrl) newUrl = searchHelper.changeInstance(tabUrl);

  if (!newUrl) newUrl = translateHelper.changeInstance(tabUrl);

  if (!newUrl) newUrl = mediumHelper.changeInstance(tabUrl);

  if (!newUrl) newUrl = imgurHelper.changeInstance(tabUrl);

  if (!newUrl) newUrl = wikipediaHelper.changeInstance(tabUrl)

  if (newUrl) browser.tabs.update({ url: tabUrl.href.replace(protocolHost, newUrl) });
}

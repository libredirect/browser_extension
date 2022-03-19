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
import translateHelper from "../../assets/javascripts/helpers/translate/translate.js";
import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import mediumHelper from "../../assets/javascripts/helpers/medium.js";
import imgurHelper from "../../assets/javascripts/helpers/imgur.js";
import tiktokHelper from "../../assets/javascripts/helpers/tiktok.js";
import pixivHelper from "../../assets/javascripts/helpers/pixiv.js";
import spotifyHelper from "../../assets/javascripts/helpers/spotify.js";
import sendTargetsHelper from "../../assets/javascripts/helpers/sendTargets.js";
import peertubeHelper from "../../assets/javascripts/helpers/peertube.js";
import lbryHelper from "../../assets/javascripts/helpers/lbry.js";
import generalHelper from "../../assets/javascripts/helpers/general.js";

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
let disablePeertubeElement = document.getElementById("disable-peertube");
let disableLbryElement = document.getElementById("disable-lbry");
let disableSendTargetsElement = document.getElementById("disable-sendTargets");
let disableImgurElement = document.getElementById("disable-imgur");
let disableTiktokElement = document.getElementById("disable-tiktok");
let disablePixivElement = document.getElementById("disable-pixiv");
let disableSpotifyElement = document.getElementById("disable-spotify");

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
  await pixivHelper.init();
  await spotifyHelper.init();
  await sendTargetsHelper.init();
  await peertubeHelper.init();
  await lbryHelper.init();
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
  disablePixivElement.checked = !pixivHelper.getDisable();
  disableSpotifyElement.checked = !spotifyHelper.getDisable();
  disableMediumElement.checked = !mediumHelper.getDisable();
  disablePeertubeElement.checked = !peertubeHelper.getDisable();
  disableLbryElement.checked = !lbryHelper.getDisable();

  let changeInstanceElement = document.getElementById("change-instance")
  changeInstanceElement.addEventListener("click", switchInstance);
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

disablePixivElement.addEventListener("change",
  event => pixivHelper.setDisable(!event.target.checked)
);

disableSpotifyElement.addEventListener("change",
  event => spotifyHelper.setDisable(!event.target.checked)
);

disableMediumElement.addEventListener("change",
  event => mediumHelper.setDisable(!event.target.checked)
);

disablePeertubeElement.addEventListener("change",
  event => peertubeHelper.setDisable(!event.target.checked)
);

disableLbryElement.addEventListener("change",
  event => lbryHelper.setDisable(!event.target.checked)
);

disableSendTargetsElement.addEventListener("change",
  event => sendTargetsHelper.setDisable(!event.target.checked)
);

document.getElementById("more-options").addEventListener("click",
  () => browser.runtime.openOptionsPage()
);


function switchInstance() {
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currTab = tabs[0];
    if (currTab) {
      let url = currTab.url;
      let tabUrl
      try { tabUrl = new URL(url); }
      catch (_) { return false; }
      let newUrl;

      newUrl = youtubeHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = twitterHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = instagramHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = redditHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = searchHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = translateHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = mediumHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = sendTargetsHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = peertubeHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = lbryHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = imgurHelper.switchInstance(tabUrl);

      if (!newUrl) newUrl = wikipediaHelper.switchInstance(tabUrl);

      if (newUrl) {
        browser.tabs.update({ url: newUrl });
        return true;
      }
    }
  })
  return false;
}

let popupFrontends;
generalHelper.init().then(() => {
  popupFrontends = generalHelper.getPopupFrontends();

  for (const frontend of generalHelper.allPopupFrontends)
    if (!popupFrontends.includes(frontend))
      document.getElementById(frontend).classList.add("hide")
    else
      document.getElementById(frontend).classList.remove("hide")
});
"use strict";
window.browser = window.browser || window.chrome;

import utils from "../../assets/javascripts/helpers/utils.js";
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

browser.storage.local.get(
  [
    "disableTwitter",
    "disableYoutube",
    "disableYoutubeMusic",
    "disableInstagram",
    "disableMaps",
    "disableReddit",
    "disableSearch",
    "translateDisable",
    "disableWikipedia",
    "disableImgur",
    "disableTiktok",
    "disableMedium",
    "disablePeertubeTargets",
    "disableLbryTargets",
    "disableSendTarget",
  ],
  r => {
    disableTwitterElement.checked = !r.disableTwitter;
    disableYoutubeElement.checked = !r.disableYoutube;
    disableYoutubeMusicElement.checked = !r.disableYoutubeMusic;
    disableInstagramElement.checked = !r.disableInstagram;
    disableMapsElement.checked = !r.disableMaps;
    disableRedditElement.checked = !r.disableReddit;
    disableSearchElement.checked = !r.disableSearch;
    disableElement.checked = !r.translateDisable;
    disableWikipediaElement.checked = !r.disableWikipedia;
    disableImgurElement.checked = !r.disableImgur;
    disableTiktokElement.checked = !r.disableTiktok;
    disableMediumElement.checked = !r.disableMedium;
    disablePeertubeElement.checked = !r.disablePeertubeTargets;
    disableLbryElement.checked = !r.disableLbryTargets;
    disableSendTargetsElement.checked = r.disableSendTarget;
  }
)

document.addEventListener("change", () => {
  browser.storage.local.set({
    disableTwitter: !disableTwitterElement.checked,
    disableYoutube: !disableYoutubeElement.checked,
    disableYoutubeMusic: !disableYoutubeMusicElement.checked,
    disableInstagram: !disableInstagramElement.checked,
    disableMaps: !disableMapsElement.checked,
    disableReddit: !disableRedditElement.checked,
    disableSearch: !disableSearchElement.checked,
    translateDisable: !disableElement.checked,
    disableWikipedia: !disableWikipediaElement.checked,
    disableImgur: !disableImgurElement.checked,
    disableTiktok: !disableTiktokElement.checked,
    disableMedium: !disableMediumElement.checked,
    disablePeertubeTargets: !disablePeertubeElement.checked,
    disableLbryTargets: !disableLbryElement.checked,
    disableSendTarget: !disableSendTargetsElement.checked,
  });
})

utils.switchInstance(true).then(r => {
  if (!r) document.getElementById("change_instance_div").style.display = 'none';
  else document.getElementById("change_instance").addEventListener("click", () => utils.switchInstance(false));
});

utils.copyRaw(true).then(r => {
  if (!r) document.getElementById('copy_raw_div').style.display = 'none';
  else {
    const copy_raw = document.getElementById('copy_raw');
    copy_raw.addEventListener("click", () => utils.copyRaw(false, copy_raw));
  }
})

utils.unify(true).then(r => {
  if (!r) document.getElementById('unify_div').style.display = 'none';
  else {
    const unify = document.getElementById('unify');
    unify.addEventListener("click", () => utils.unify(false, unify));
  }
})

document.getElementById("more-options").addEventListener("click", () => browser.runtime.openOptionsPage());

browser.storage.local.get(
  'popupFrontends',
  r => {
    for (const frontend of generalHelper.allPopupFrontends)
      if (!r.popupFrontends.includes(frontend))
        document.getElementById(frontend).classList.add("hide")
      else
        document.getElementById(frontend).classList.remove("hide")
  });
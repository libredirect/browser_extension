import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let invidious = document.getElementById('invidious');
let alwaysProxy = invidious.getElementsByClassName("local")[0];
let playerStyle = invidious.getElementsByClassName("player_style")[0];
let quality = invidious.getElementsByClassName("quality")[0];
let videoLoop = invidious.getElementsByClassName("video_loop")[0];
let continueAutoplay = invidious.getElementsByClassName("continue_autoplay")[0];
let invidiousContinue = invidious.getElementsByClassName("continue")[0];
let youtubeListen = invidious.getElementsByClassName("listen")[0];
let speed = invidious.getElementsByClassName("speed")[0];
let qualityDash = invidious.getElementsByClassName("quality_dash")[0];
let relatedVideo = invidious.getElementsByClassName("related_videos")[0];
let annotations = invidious.getElementsByClassName("annotations")[0];
let extendDesc = invidious.getElementsByClassName("extend_desc")[0];
let vrMode = invidious.getElementsByClassName("vr_mode")[0];
let savePlayerPos = invidious.getElementsByClassName("save_player_pos")[0];
let comments0 = invidious.getElementsByClassName("comments[0]")[0];
let comments1 = invidious.getElementsByClassName("comments[1]")[0];
let captions0 = invidious.getElementsByClassName("captions[0]")[0];
let captions1 = invidious.getElementsByClassName("captions[1]")[0];
let captions2 = invidious.getElementsByClassName("captions[2]")[0];
let autoplay = invidious.getElementsByClassName("youtubeAutoplay")[0];
let volume = invidious.getElementsByClassName("volume")[0];
let volumeValue = invidious.getElementsByClassName("volume-value")[0];
let region = invidious.getElementsByClassName("region")[0];
let darkMode = invidious.getElementsByClassName("dark_mode")[0];
let thin_mode = invidious.getElementsByClassName("thin_mode")[0];
let default_home = invidious.getElementsByClassName("default_home")[0];
let feed_menu0 = invidious.getElementsByClassName("feed_menu[0]")[0];
let feed_menu1 = invidious.getElementsByClassName("feed_menu[1]")[0];

volume.addEventListener("input", () => volumeValue.textContent = `${volume.value}%`);

invidious.addEventListener("change", async _ => {
  browser.storage.local.get(
    [
      "invidiousComments",
      "invidiousCaptions",
      "invidiousFeedMenuList",
    ],
    async r => {
      let commentsList = r.invidiousComments;
      commentsList[0] = comments0.value;
      commentsList[1] = comments1.value;

      let captionsList = r.invidiousCaptions;
      captionsList[0] = captions0.value;
      captionsList[1] = captions1.value;
      captionsList[2] = captions2.value;

      let feedMenuList = r.invidiousFeedMenuList;
      feedMenuList[0] = feed_menu0.value;
      feedMenuList[1] = feed_menu1.value;

      await browser.storage.local.set({
        invidiousAlwaysProxy: alwaysProxy.checked,
        youtubeAutoplay: autoplay.checked,
        invidiousPlayerStyle: playerStyle.value,
        invidiousQuality: quality.value,
        invidiousVideoLoop: videoLoop.checked,
        invidiousContinueAutoplay: continueAutoplay.checked,
        invidiousContinue: invidiousContinue.checked,
        youtubeListen: youtubeListen.checked,
        invidiousSpeed: speed.value,
        invidiousQualityDash: qualityDash.value,
        youtubeVolume: volume.value,
        invidiousComments: commentsList,
        invidiousCaptions: captionsList,
        invidiousRelatedVideos: relatedVideo.checked,
        invidiousAnnotations: annotations.checked,
        invidiousExtendDesc: extendDesc.checked,
        invidiousVrMode: vrMode.checked,
        invidiousSavePlayerPos: savePlayerPos.checked,

        invidiousRegion: region.value,
        invidiousDarkMode: darkMode.value,
        invidiousThinMode: thin_mode.checked,
        invidiousDefaultHome: default_home.value,
        invidiousFeedMenuList: feedMenuList,
      });
      init();
    }
  )
});

function init() {
  browser.storage.local.get(
    [
      "youtubeListen",
      "youtubeVolume",
      "youtubeAutoplay",
      "invidiousQuality",
      "invidiousAlwaysProxy",
      "invidiousQuality",
      "invidiousPlayerStyle",
      "invidiousVideoLoop",
      "invidiousContinueAutoplay",
      "invidiousContinue",
      "invidiousSpeed",
      "invidiousQualityDash",
      "invidiousComments",
      "invidiousCaptions",
      "invidiousRelatedVideos",
      "invidiousAnnotations",
      "invidiousExtendDesc",
      "invidiousVrMode",
      "invidiousSavePlayerPos",
      "invidiousRegion",
      "invidiousDarkMode",
      "invidiousThinMode",
      "invidiousDefaultHome",
      "invidiousFeedMenuList",
    ],
    r => {
      videoLoop.checked = r.invidiousVideoLoop;
      autoplay.checked = r.youtubeAutoplay;
      playerStyle.value = r.invidiousPlayerStyle;

      continueAutoplay.checked = r.invidiousContinueAutoplay;
      invidiousContinue.checked = r.invidiousContinue;
      alwaysProxy.checked = r.invidiousAlwaysProxy;
      youtubeListen.checked = r.youtubeListen;

      speed.value = r.invidiousSpeed;
      quality.value = r.invidiousQuality;
      qualityDash.value = r.invidiousQualityDash;

      volume.value = r.youtubeVolume;
      volumeValue.textContent = `${r.youtubeVolume}%`;

      comments0.value = r.invidiousComments[0];
      comments1.value = r.invidiousComments[1];

      captions0.value = r.invidiousCaptions[0];
      captions1.value = r.invidiousCaptions[1];
      captions2.value = r.invidiousCaptions[2];

      relatedVideo.checked = r.invidiousRelatedVideos;
      annotations.checked = r.invidiousAnnotations;
      extendDesc.checked = r.invidiousExtendDesc;
      vrMode.checked = r.invidiousVrMode;
      savePlayerPos.checked = r.invidiousSavePlayerPos;

      region.value = r.invidiousRegion;
      darkMode.value = r.invidiousDarkMode;
      thin_mode.checked = r.invidiousThinMode;
      default_home.value = r.invidiousDefaultHome;

      feed_menu0.value = r.invidiousFeedMenuList[0];
      feed_menu1.value = r.invidiousFeedMenuList[1];

      commonHelper.processDefaultCustomInstances('invidious', 'normal', youtubeHelper, document);
      commonHelper.processDefaultCustomInstances('invidious', 'tor', youtubeHelper, document);
    }
  )
}

init();

let latencyInvidiousElement = document.getElementById("latency-invidious");
let latencyInvidiousLabel = document.getElementById("latency-invidious-label");
latencyInvidiousElement.addEventListener("click",
  async () => {
    let reloadWindow = () => location.reload();
    latencyInvidiousElement.addEventListener("click", reloadWindow);
    await youtubeHelper.init();
    let redirects = youtubeHelper.getRedirects();
    const oldHtml = latencyInvidiousLabel.innerHTML;
    latencyInvidiousLabel.innerHTML = '...';
    commonHelper.testLatency(latencyInvidiousLabel, redirects.invidious.normal).then(r => {
      browser.storage.local.set({ invidiousLatency: r });
      latencyInvidiousLabel.innerHTML = oldHtml;
      commonHelper.processDefaultCustomInstances('invidious', 'normal', youtubeHelper, document);
      latencyInvidiousElement.removeEventListener("click", reloadWindow);
    });
  }
);
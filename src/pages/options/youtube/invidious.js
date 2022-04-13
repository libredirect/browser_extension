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
    console.log('changed invidious settings');
    let commentsList = youtubeHelper.getInvidiousComments();
    commentsList[0] = comments0.value;
    commentsList[1] = comments1.value;

    let captionsList = youtubeHelper.getInvidiousCaptions();
    captionsList[0] = captions0.value;
    captionsList[1] = captions1.value;
    captionsList[2] = captions2.value;

    let feedMenuList = youtubeHelper.getInvidiousFeedMenuList();
    feedMenuList[0] = feed_menu0.value;
    feedMenuList[1] = feed_menu1.value;

    await youtubeHelper.setYoutubeSettings({
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
});

function init() {
    youtubeHelper.init().then(() => {
        videoLoop.checked = youtubeHelper.getInvidiousVideoLoop();

        autoplay.checked = youtubeHelper.getAutoplay();

        playerStyle.value = youtubeHelper.getInvidiousPlayerStyle();

        continueAutoplay.checked = youtubeHelper.getInvidiousContinueAutoplay();
        invidiousContinue.checked = youtubeHelper.getInvidiousContinue();
        alwaysProxy.checked = youtubeHelper.getInvidiousAlwaysProxy();
        youtubeListen.checked = youtubeHelper.getYoutubeListen();

        speed.value = youtubeHelper.getInvidiousSpeed();
        quality.value = youtubeHelper.getInvidiousQuality();
        qualityDash.value = youtubeHelper.getInvidiousQualityDash();

        volume.value = youtubeHelper.getVolume();
        volumeValue.textContent = `${youtubeHelper.getVolume()}%`;

        comments0.value = youtubeHelper.getInvidiousComments()[0];
        comments1.value = youtubeHelper.getInvidiousComments()[1];

        captions0.value = youtubeHelper.getInvidiousCaptions()[0];
        captions1.value = youtubeHelper.getInvidiousCaptions()[1];
        captions2.value = youtubeHelper.getInvidiousCaptions()[2];

        relatedVideo.checked = youtubeHelper.getInvidiousRelatedVideos();
        annotations.checked = youtubeHelper.getInvidiousAnnotations();
        extendDesc.checked = youtubeHelper.getInvidiousExtendDesc();
        vrMode.checked = youtubeHelper.getInvidiousVrMode();
        savePlayerPos.checked = youtubeHelper.getInvidiousSavePlayerPos();

        region.value = youtubeHelper.getInvidiousRegion();
        darkMode.value = youtubeHelper.getInvidiousDarkMode();
        thin_mode.checked = youtubeHelper.getInvidiousThinMode();
        default_home.value = youtubeHelper.getInvidiousDefaultHome();

        feed_menu0.value = youtubeHelper.getInvidiousFeedMenuList()[0];
        feed_menu1.value = youtubeHelper.getInvidiousFeedMenuList()[1];

        commonHelper.processDefaultCustomInstances(
            'invidious',
            'normal',
            youtubeHelper,
            document,
            youtubeHelper.getInvidiousNormalRedirectsChecks,
            youtubeHelper.setInvidiousNormalRedirectsChecks,
            youtubeHelper.getInvidiousNormalCustomRedirects,
            youtubeHelper.setInvidiousNormalCustomRedirects
        );

        commonHelper.processDefaultCustomInstances(
            'invidious',
            'tor',
            youtubeHelper,
            document,
            youtubeHelper.getInvidiousTorRedirectsChecks,
            youtubeHelper.setInvidiousTorRedirectsChecks,
            youtubeHelper.getInvidiousTorCustomRedirects,
            youtubeHelper.setInvidiousTorCustomRedirects
        );
    });
}

init()
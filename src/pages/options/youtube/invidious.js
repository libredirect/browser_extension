import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let invidiousElement = document.getElementById('invidious');
let invidiousAlwaysProxyElement = invidiousElement.getElementsByClassName("local")[0];
let invidiousPlayerStyleElement = invidiousElement.getElementsByClassName("player_style")[0];
let invidiousQualityElement = invidiousElement.getElementsByClassName("quality")[0];
let invidiousVideoLoopElement = invidiousElement.getElementsByClassName("video_loop")[0];
let invidiousContinueAutoplayElement = invidiousElement.getElementsByClassName("continue_autoplay")[0];
let invidiousContinueElement = invidiousElement.getElementsByClassName("continue")[0];
let youtubeListenElement = invidiousElement.getElementsByClassName("listen")[0];
let invidiousSpeedElement = invidiousElement.getElementsByClassName("speed")[0];
let invidiousQualityDashElement = invidiousElement.getElementsByClassName("quality_dash")[0];
let invidiousRelatedVideoElement = invidiousElement.getElementsByClassName("related_videos")[0];
let invidiousAnnotationsElement = invidiousElement.getElementsByClassName("annotations")[0];
let invidiousExtendDescElement = invidiousElement.getElementsByClassName("extend_desc")[0];
let invidiousVrModeElement = invidiousElement.getElementsByClassName("vr_mode")[0];
let invidiousSavePlayerPosElement = invidiousElement.getElementsByClassName("save_player_pos")[0];
let invidiousComments0Element = invidiousElement.getElementsByClassName("comments[0]")[0];
let invidiousComments1Element = invidiousElement.getElementsByClassName("comments[1]")[0];
let invidiousCaptions0Element = invidiousElement.getElementsByClassName("captions[0]")[0];
let invidiousCaptions1Element = invidiousElement.getElementsByClassName("captions[1]")[0];
let invidiousCaptions2Element = invidiousElement.getElementsByClassName("captions[2]")[0];
let autoplayElement = invidiousElement.getElementsByClassName("youtubeAutoplay")[0];
let volumeElement = invidiousElement.getElementsByClassName("volume")[0];
let volumeValueElement = invidiousElement.getElementsByClassName("volume-value")[0];

volumeElement.addEventListener("input", () => volumeValueElement.textContent = `${volumeElement.value}%`);

invidiousElement.addEventListener("change", async _ => {
    console.log('changed invidious settings');
    let commentsList = youtubeHelper.getInvidiousComments();
    commentsList[0] = invidiousComments0Element.value;
    commentsList[1] = invidiousComments1Element.value;

    let captionsList = youtubeHelper.getInvidiousCaptions();
    captionsList[0] = invidiousCaptions0Element.value;
    captionsList[1] = invidiousCaptions1Element.value;
    captionsList[2] = invidiousCaptions2Element.value;

    await youtubeHelper.setYoutubeSettings({
        invidiousAlwaysProxy: invidiousAlwaysProxyElement.checked,
        youtubeAutoplay: autoplayElement.checked,
        invidiousPlayerStyle: invidiousPlayerStyleElement.value,
        invidiousQuality: invidiousQualityElement.value,
        invidiousVideoLoop: invidiousVideoLoopElement.checked,
        invidiousContinueAutoplay: invidiousContinueAutoplayElement.checked,
        invidiousContinue: invidiousContinueElement.checked,
        youtubeListen: youtubeListenElement.checked,
        invidiousSpeed: invidiousSpeedElement.value,
        invidiousQualityDash: invidiousQualityDashElement.value,
        youtubeVolume: volumeElement.value,
        invidiousComments: commentsList,
        invidiousCaptions: captionsList,
        invidiousRelatedVideos: invidiousRelatedVideoElement.checked,
        invidiousAnnotations: invidiousAnnotationsElement.checked,
        invidiousExtendDesc: invidiousExtendDescElement.checked,
        invidiousVrMode: invidiousVrModeElement.checked,
        invidiousSavePlayerPos: invidiousSavePlayerPosElement.checked
    });
    init();
});

function init() {
    youtubeHelper.init().then(() => {
        invidiousVideoLoopElement.checked = youtubeHelper.getInvidiousVideoLoop();

        autoplayElement.checked = youtubeHelper.getAutoplay();

        invidiousPlayerStyleElement.value = youtubeHelper.getInvidiousPlayerStyle();

        invidiousContinueAutoplayElement.checked = youtubeHelper.getInvidiousContinueAutoplay();
        invidiousContinueElement.checked = youtubeHelper.getInvidiousContinue();
        invidiousAlwaysProxyElement.checked = youtubeHelper.getInvidiousAlwaysProxy();
        youtubeListenElement.checked = youtubeHelper.getYoutubeListen();

        invidiousSpeedElement.value = youtubeHelper.getInvidiousSpeed();
        invidiousQualityElement.value = youtubeHelper.getInvidiousQuality();
        invidiousQualityDashElement.value = youtubeHelper.getInvidiousQualityDash();

        volumeElement.value = youtubeHelper.getVolume();
        volumeValueElement.textContent = `${youtubeHelper.getVolume()}%`;

        invidiousComments0Element.value = youtubeHelper.getInvidiousComments()[0];
        invidiousComments1Element.value = youtubeHelper.getInvidiousComments()[1];

        invidiousCaptions0Element.value = youtubeHelper.getInvidiousCaptions()[0];
        invidiousCaptions1Element.value = youtubeHelper.getInvidiousCaptions()[1];
        invidiousCaptions2Element.value = youtubeHelper.getInvidiousCaptions()[2];

        invidiousRelatedVideoElement.checked = youtubeHelper.getInvidiousRelatedVideos();
        invidiousAnnotationsElement.checked = youtubeHelper.getInvidiousAnnotations();
        invidiousExtendDescElement.checked = youtubeHelper.getInvidiousExtendDesc();
        invidiousVrModeElement.checked = youtubeHelper.getInvidiousVrMode();
        invidiousSavePlayerPosElement.checked = youtubeHelper.getInvidiousSavePlayerPos();

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
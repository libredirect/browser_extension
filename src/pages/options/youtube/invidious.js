import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let invidiousAlwaysProxyElement = document.getElementById("invidious-local");
invidiousAlwaysProxyElement.addEventListener("change",
    event => youtubeHelper.setInvidiousAlwaysProxy(event.target.checked)
);

let invidiousPlayerStyleElement = document.getElementById("invidious-player_style");
invidiousPlayerStyleElement.addEventListener("change",
    event => youtubeHelper.setInvidiousPlayerStyle(event.target.options[invidiousPlayerStyleElement.selectedIndex].value)
);

let invidiousQualityElement = document.getElementById("invidious-quality");
invidiousQualityElement.addEventListener("change",
    event => youtubeHelper.setinvidiousQuality(event.target.options[invidiousQualityElement.selectedIndex].value)
);

let invidiousVideoLoopElement = document.getElementById("invidious-video_loop");
invidiousVideoLoopElement.addEventListener("change",
    event => youtubeHelper.setInvidiousVideoLoop(event.target.checked)
);

let invidiousContinueAutoplayElement = document.getElementById("invidious-continue_autoplay");
invidiousContinueAutoplayElement.addEventListener("change",
    event => youtubeHelper.setInvidiousContinueAutoplay(event.target.checked)
);

let invidiousContinueElement = document.getElementById("invidious-continue");
invidiousContinueElement.addEventListener("change",
    event => youtubeHelper.setInvidiousContinue(event.target.checked)
);

let youtubeListenElement = document.getElementById("invidious-listen");
youtubeListenElement.addEventListener("change",
    event => youtubeHelper.setYoutubeListen(event.target.checked)
);

let invidiousSpeedElement = document.getElementById("invidious-speed");
invidiousSpeedElement.addEventListener("change",
    event => youtubeHelper.setInvidiousSpeed(event.target.options[invidiousSpeedElement.selectedIndex].value)
);

let invidiousQualityDashElement = document.getElementById("invidious-quality_dash");
invidiousQualityDashElement.addEventListener("change",
    event => youtubeHelper.setInvidiousQualityDash(event.target.options[invidiousQualityDashElement.selectedIndex].value)
);

let invidiousComments0Element = document.getElementById("invidious-comments[0]");
invidiousComments0Element.addEventListener("change",
    event => {
        let commentsList = youtubeHelper.getInvidiousComments();
        commentsList[0] = event.target.options[invidiousComments0Element.selectedIndex].value
        youtubeHelper.setInvidiousComments(commentsList)
    }
);
let invidiousComments1Element = document.getElementById("invidious-comments[1]");
invidiousComments1Element.addEventListener("change",
    event => {
        let commentsList = youtubeHelper.getInvidiousComments();
        commentsList[1] = event.target.options[invidiousComments1Element.selectedIndex].value
        youtubeHelper.setInvidiousComments(commentsList)
    }
);

let invidiousCaptions0Element = document.getElementById("invidious-captions[0]");
invidiousCaptions0Element.addEventListener("change",
    event => {
        let captionsList = youtubeHelper.getInvidiousCaptions();
        captionsList[0] = event.target.options[invidiousCaptions0Element.selectedIndex].value
        youtubeHelper.setInvidiousCaptions(captionsList)
    }
);
let invidiousCaptions1Element = document.getElementById("invidious-captions[1]");
invidiousCaptions1Element.addEventListener("change",
    event => {
        let captionsList = youtubeHelper.getInvidiousCaptions();
        captionsList[1] = event.target.options[invidiousCaptions1Element.selectedIndex].value
        youtubeHelper.setInvidiousCaptions(captionsList)
    }
);
let invidiousCaptions2Element = document.getElementById("invidious-captions[2]");
invidiousCaptions2Element.addEventListener("change",
    event => {
        let captionsList = youtubeHelper.getInvidiousCaptions();
        captionsList[2] = event.target.options[invidiousCaptions2Element.selectedIndex].value
        youtubeHelper.setInvidiousCaptions(captionsList)
    }
);

let invidiousRelatedVideoElement = document.getElementById("invidious-related_videos");
invidiousRelatedVideoElement.addEventListener("change",
    event => youtubeHelper.setInvidiousRelatedVideos(event.target.checked)
);

let invidiousAnnotationsElement = document.getElementById("invidious-annotations");
invidiousAnnotationsElement.addEventListener("change",
    event => youtubeHelper.setInvidiousAnnotations(event.target.checked)
);


let invidiousExtendDescElement = document.getElementById("invidious-extend_desc");
invidiousExtendDescElement.addEventListener("change",
    event => youtubeHelper.setInvidiousExtendDesc(event.target.checked)
);

let invidiousVrModeElement = document.getElementById("invidious-vr_mode");
invidiousVrModeElement.addEventListener("change",
    event => youtubeHelper.setInvidiousVrMode(event.target.checked)
);

let invidiousSavePlayerPosElement = document.getElementById("invidious-save_player_pos");
invidiousSavePlayerPosElement.addEventListener("change",
    event => youtubeHelper.setInvidiousSavePlayerPos(event.target.checked)
);

youtubeHelper.init().then(() => {
    invidiousVideoLoopElement.checked = youtubeHelper.getInvidiousVideoLoop();

    invidiousPlayerStyleElement.value = youtubeHelper.getInvidiousPlayerStyle();

    invidiousContinueAutoplayElement.checked = youtubeHelper.getInvidiousContinueAutoplay();
    invidiousContinueElement.checked = youtubeHelper.getInvidiousContinue();
    invidiousAlwaysProxyElement.checked = youtubeHelper.getInvidiousAlwaysProxy();
    youtubeListenElement.checked = youtubeHelper.getYoutubeListen();

    invidiousSpeedElement.value = youtubeHelper.getInvidiousSpeed();
    invidiousQualityElement.value = youtubeHelper.getInvidiousQuality();
    invidiousQualityDashElement.value = youtubeHelper.getInvidiousQualityDash();

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
import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let pipedElement = document.getElementById('piped');

let pipedListenElement = pipedElement.getElementsByClassName("listen")[0];
let pipedQualityElement = pipedElement.getElementsByClassName("quality")[0];
let pipedBufferGoalElement = pipedElement.getElementsByClassName("bufferGoal")[0];
let pipedRegionElement = pipedElement.getElementsByClassName("region")[0];
let pipedHomepageElement = pipedElement.getElementsByClassName("homepage")[0];
let pipedCommentsElement = pipedElement.getElementsByClassName("comments")[0];
let pipedMinimizeDescriptionElement = pipedElement.getElementsByClassName("minimizeDescription")[0];
let pipedWatchHistoryElement = pipedElement.getElementsByClassName("watchHistory")[0];
let pipedDisableLBRYElement = pipedElement.getElementsByClassName("disableLBRY")[0];
let pipedProxyLBRYElement = pipedElement.getElementsByClassName("proxyLBRY")[0];

let pipedSelectedSkipSponsorElement = pipedElement.getElementsByClassName("selectedSkip-sponsor")[0];
let pipedSelectedSkipIntroElement = pipedElement.getElementsByClassName("selectedSkip-intro")[0];
let pipedSelectedSkipOutroElement = pipedElement.getElementsByClassName("selectedSkip-outro")[0];
let pipedSelectedSkipPreviewElement = pipedElement.getElementsByClassName("selectedSkip-preview")[0];
let pipedSelectedSkipInteractionElement = pipedElement.getElementsByClassName("selectedSkip-interaction")[0];
let pipedSelectedSkipSelfpromoElement = pipedElement.getElementsByClassName("selectedSkip-selfpromo")[0];
let pipedSelectedSkipMusicOfftopicElement = pipedElement.getElementsByClassName("selectedSkip-music_offtopic")[0];
let pipedSelectedSkipPoiHighlightElement = pipedElement.getElementsByClassName("selectedSkip-poi_highlight")[0];
let pipedSelectedSkipFillerElement = pipedElement.getElementsByClassName("selectedSkip-filler")[0];

let pipedSponsorblockElement = pipedElement.getElementsByClassName("sponsorblock")[0];
let pipedEnabledCodecsElement = pipedElement.getElementsByClassName("enabledCodecs")[0];
let autoplayElement = pipedElement.getElementsByClassName("youtubeAutoplay")[0];

let volumeElement = pipedElement.getElementsByClassName("volume")[0];
let volumeValueElement = pipedElement.getElementsByClassName("volume-value")[0];

volumeElement.addEventListener("input", () => volumeValueElement.textContent = `${volumeElement.value}%`);
function selectSkipModify(value, boolean) {
    if (boolean && !selectSkip.includes(value)) {
        selectSkip.push(value);
    }
    else if (!boolean) {
        let i = selectSkip.indexOf(value);
        if (i > -1) selectSkip.splice(i, 1);
    }
}
let selectSkip = [];
pipedElement.addEventListener("change", async () => {
    console.log("changed piped settings");
    let pipedEnabledCodecsResult = [];
    for (const opt of pipedEnabledCodecsElement.options)
        if (opt.selected) pipedEnabledCodecsResult.push(opt.value);

    selectSkipModify('sponsor', pipedSelectedSkipSponsorElement.checked);
    selectSkipModify('intro', pipedSelectedSkipIntroElement.checked);
    selectSkipModify('outro', pipedSelectedSkipOutroElement.checked);
    selectSkipModify('preview', pipedSelectedSkipPreviewElement.checked);
    selectSkipModify('interaction', pipedSelectedSkipInteractionElement.checked);
    selectSkipModify('selfpromo', pipedSelectedSkipSelfpromoElement.checked);
    selectSkipModify('music_offtopic', pipedSelectedSkipMusicOfftopicElement.checked);
    selectSkipModify('poi_highlight', pipedSelectedSkipPoiHighlightElement.checked);
    selectSkipModify('filler', pipedSelectedSkipFillerElement.checked);

    await youtubeHelper.setYoutubeSettings({
        pipedQuality: pipedQualityElement.value,
        pipedBufferGoal: pipedBufferGoalElement.value,
        pipedRegion: pipedRegionElement.value,
        pipedHomepage: pipedHomepageElement.value,
        pipedComments: pipedCommentsElement.checked,
        pipedMinimizeDescription: pipedMinimizeDescriptionElement.checked,
        youtubeAutoplay: autoplayElement.checked,
        pipedWatchHistory: pipedWatchHistoryElement.checked,
        pipedDisableLBRY: pipedDisableLBRYElement.checked,
        pipedProxyLBRY: pipedProxyLBRYElement.checked,
        youtubeVolume: volumeElement.value,
        pipedSponsorblock: pipedSponsorblockElement.checked,
        pipedEnabledCodecs: pipedEnabledCodecsResult,
        youtubeListen: pipedListenElement.checked,
        pipedSelectedSkip: selectSkip,
    });
    init();
});

function init() {
    youtubeHelper.init().then(() => {
        pipedSponsorblockElement.checked = youtubeHelper.getPipedSponsorblock();
        selectSkip = youtubeHelper.getPipedSelectedSkip();
        pipedSelectedSkipSponsorElement.checked = selectSkip.includes('sponsor');
        pipedSelectedSkipIntroElement.checked = selectSkip.includes('intro');
        pipedSelectedSkipOutroElement.checked = selectSkip.includes('outro');
        pipedSelectedSkipPreviewElement.checked = selectSkip.includes('preview');
        autoplayElement.checked = youtubeHelper.getAutoplay();
        pipedSelectedSkipInteractionElement.checked = selectSkip.includes('interaction');
        pipedSelectedSkipSelfpromoElement.checked = selectSkip.includes('selfpromo');
        pipedSelectedSkipMusicOfftopicElement.checked = selectSkip.includes('music_offtopic');
        pipedSelectedSkipPoiHighlightElement.checked = selectSkip.includes('poi_highlight');
        pipedSelectedSkipFillerElement.checked = selectSkip.includes('filler');
        pipedListenElement.checked = youtubeHelper.getYoutubeListen();
        pipedQualityElement.value = youtubeHelper.getPipedQuality();
        pipedBufferGoalElement.value = youtubeHelper.getPipedBufferGoal();
        pipedRegionElement.value = youtubeHelper.getPipedRegion();
        pipedHomepageElement.value = youtubeHelper.getPipedHomepage();
        pipedCommentsElement.checked = youtubeHelper.getPipedComments();
        pipedMinimizeDescriptionElement.checked = youtubeHelper.getPipedMinimizeDescription();
        pipedWatchHistoryElement.checked = youtubeHelper.getPipedWatchHistory();
        pipedEnabledCodecsElement.value = youtubeHelper.getPipedEnabledCodecs();
        pipedDisableLBRYElement.checked = youtubeHelper.getPipedDisableLBRY();
        pipedProxyLBRYElement.checked = youtubeHelper.getPipedProxyLBRY();

        volumeElement.value = youtubeHelper.getVolume();
        volumeValueElement.textContent = `${youtubeHelper.getVolume()}%`;

        commonHelper.processDefaultCustomInstances(
            'piped',
            'normal',
            youtubeHelper,
            document,
            youtubeHelper.getPipedNormalRedirectsChecks,
            youtubeHelper.setPipedNormalRedirectsChecks,
            youtubeHelper.getPipedNormalCustomRedirects,
            youtubeHelper.setPipedNormalCustomRedirects
        );
        commonHelper.processDefaultCustomInstances(
            'piped',
            'tor',
            youtubeHelper,
            document,
            youtubeHelper.getPipedTorRedirectsChecks,
            youtubeHelper.setPipedTorRedirectsChecks,
            youtubeHelper.getPipedTorCustomRedirects,
            youtubeHelper.setPipedTorCustomRedirects
        );
    });
}
init();
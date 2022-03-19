import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let pipedSponsorblockElement = document.getElementById("piped-sponsorblock");
pipedSponsorblockElement.addEventListener("change",
    event => youtubeHelper.setPipedSponsorblock(event.target.checked)
);

function selectSkipModify(value, boolean) {
    if (boolean) {
        if (!selectSkip.includes(value)) selectSkip.push(value);
    }
    else {
        let i = selectSkip.indexOf(value);
        if (i > -1) selectSkip.splice(i, 1);
    }
    youtubeHelper.setPipedSelectedSkip(selectSkip)
}

let pipedSelectedSkipSponsorElement = document.getElementById("piped-selectedSkip-sponsor");
pipedSelectedSkipSponsorElement.addEventListener("change",
    event => selectSkipModify('sponsor', event.target.checked)
);

let pipedSelectedSkipIntroElement = document.getElementById("piped-selectedSkip-intro");
pipedSelectedSkipIntroElement.addEventListener("change",
    event => selectSkipModify('intro', event.target.checked)
);

let pipedSelectedSkipOutroElement = document.getElementById("piped-selectedSkip-outro");
pipedSelectedSkipOutroElement.addEventListener("change",
    event => selectSkipModify('outro', event.target.checked)
);

let pipedSelectedSkipPreviewElement = document.getElementById("piped-selectedSkip-preview");
pipedSelectedSkipPreviewElement.addEventListener("change",
    event => selectSkipModify('preview', event.target.checked)
);

let pipedSelectedSkipInteractionElement = document.getElementById("piped-selectedSkip-interaction");
pipedSelectedSkipInteractionElement.addEventListener("change",
    event => selectSkipModify('interaction', event.target.checked)
);

let pipedSelectedSkipSelfpromoElement = document.getElementById("piped-selectedSkip-selfpromo");
pipedSelectedSkipSelfpromoElement.addEventListener("change",
    event => selectSkipModify('selfpromo', event.target.checked)
);

let pipedSelectedSkipMusicOfftopicElement = document.getElementById("piped-selectedSkip-music_offtopic");
pipedSelectedSkipMusicOfftopicElement.addEventListener("change",
    event => selectSkipModify('music_offtopic', event.target.checked)
);

let pipedSelectedSkipPoiHighlightElement = document.getElementById("piped-selectedSkip-poi_highlight");
pipedSelectedSkipPoiHighlightElement.addEventListener("change",
    event => selectSkipModify('poi_highlight', event.target.checked)
);

let pipedSelectedSkipFillerElement = document.getElementById("piped-selectedSkip-filler");
pipedSelectedSkipFillerElement.addEventListener("change",
    event => selectSkipModify('filler', event.target.checked)
);

let pipedListenElement = document.getElementById("piped-listen");
pipedListenElement.addEventListener("change",
    event => youtubeHelper.setYoutubeListen(event.target.checked)
);

let pipedQualityElement = document.getElementById("piped-quality");
pipedQualityElement.addEventListener("change",
    event => youtubeHelper.setPipedQuality(event.target.options[pipedQualityElement.selectedIndex].value)
);

let pipedBufferGoalElement = document.getElementById("piped-bufferGoal");
pipedBufferGoalElement.addEventListener("change",
    event => youtubeHelper.setPipedBufferGoal(pipedBufferGoalElement.value)
);

let pipedRegionElement = document.getElementById("piped-region");
pipedRegionElement.addEventListener("change",
    event => youtubeHelper.setPipedRegion(event.target.options[pipedRegionElement.selectedIndex].value)
);

let pipedHomepageElement = document.getElementById("piped-homepage");
pipedHomepageElement.addEventListener("change",
    event => youtubeHelper.setPipedHomepage(event.target.options[pipedHomepageElement.selectedIndex].value)
);

let pipedCommentsElement = document.getElementById("piped-comments");
pipedCommentsElement.addEventListener("change",
    event => youtubeHelper.setPipedComments(event.target.checked)
);

let pipedMinimizeDescriptionElement = document.getElementById("piped-minimizeDescription");
pipedMinimizeDescriptionElement.addEventListener("change",
    event => youtubeHelper.setPipedMinimizeDescription(event.target.checked)
);

let pipedWatchHistoryElement = document.getElementById("piped-watchHistory");
pipedWatchHistoryElement.addEventListener("change",
    event => youtubeHelper.setPipedWatchHistory(event.target.checked)
);

let pipedEnabledCodecsElement = document.getElementById("piped-enabledCodecs");
pipedEnabledCodecsElement.addEventListener("change",
    () => {
        let result = [];
        for (const opt of pipedEnabledCodecsElement.options)
            if (opt.selected) result.push(opt.value);
        youtubeHelper.setPipedEnabledCodecs(result);
    }
);

let pipedDisableLBRYElement = document.getElementById("piped-disableLBRY");
pipedDisableLBRYElement.addEventListener("change",
    event => youtubeHelper.setPipedDisableLBRY(event.target.checked)
);

let pipedProxyLBRYElement = document.getElementById("piped-proxyLBRY");
pipedProxyLBRYElement.addEventListener("change",
    event => youtubeHelper.setPipedProxyLBRY(event.target.checked)
);

let pipedMaterialListenElement = document.getElementById("pipedMaterial-listen");
pipedMaterialListenElement.addEventListener("change",
    event => youtubeHelper.setYoutubeListen(event.target.checked)
);

let pipedMaterialDisableLBRYElement = document.getElementById("pipedMaterial-disableLBRY");
pipedMaterialDisableLBRYElement.addEventListener("change",
    event => youtubeHelper.setPipedDisableLBRY(event.target.checked)
);

let pipedMaterialProxyLBRYElement = document.getElementById("pipedMaterial-proxyLBRY");
pipedMaterialProxyLBRYElement.addEventListener("change",
    event => youtubeHelper.setPipedProxyLBRY(event.target.checked)
);

let pipedMaterialSponsorblockElement = document.getElementById("pipedMaterial-sponsorblock");
pipedMaterialSponsorblockElement.addEventListener("change",
    event => youtubeHelper.setPipedSponsorblock(event.target.checked)
);

let pipedMaterialSkipToLastPointElement = document.getElementById("pipedMaterial-skipToLastPoint");
pipedMaterialSkipToLastPointElement.addEventListener("change",
    event => youtubeHelper.setPipedMaterialSkipToLastPoint(event.target.checked)
);


let pipedMaterialSelectedSkipSponsorElement = document.getElementById("pipedMaterial-selectedSkip-sponsor");
pipedMaterialSelectedSkipSponsorElement.addEventListener("change",
    event => selectSkipModify('sponsor', event.target.checked)
);

let pipedMaterialSelectedSkipIntroElement = document.getElementById("pipedMaterial-selectedSkip-intro");
pipedMaterialSelectedSkipIntroElement.addEventListener("change",
    event => selectSkipModify('intro', event.target.checked)
);

let pipedMaterialSelectedSkipOutroElement = document.getElementById("pipedMaterial-selectedSkip-outro");
pipedMaterialSelectedSkipOutroElement.addEventListener("change",
    event => selectSkipModify('outro', event.target.checked)
);

let pipedMaterialSelectedSkipPreviewElement = document.getElementById("pipedMaterial-selectedSkip-preview");
pipedMaterialSelectedSkipPreviewElement.addEventListener("change",
    event => selectSkipModify('preview', event.target.checked)
);

let pipedMaterialSelectedSkipInteractionElement = document.getElementById("pipedMaterial-selectedSkip-interaction");
pipedMaterialSelectedSkipInteractionElement.addEventListener("change",
    event => selectSkipModify('interaction', event.target.checked)
);

let pipedMaterialSelectedSkipSelfpromoElement = document.getElementById("pipedMaterial-selectedSkip-selfpromo");
pipedMaterialSelectedSkipSelfpromoElement.addEventListener("change",
    event => selectSkipModify('selfpromo', event.target.checked)
);

let pipedMaterialSelectedSkipMusicOfftopicElement = document.getElementById("pipedMaterial-selectedSkip-music_offtopic");
pipedMaterialSelectedSkipMusicOfftopicElement.addEventListener("change",
    event => selectSkipModify('music_offtopic', event.target.checked)
);

let pipedMaterialSelectedSkipPoiHighlightElement = document.getElementById("pipedMaterial-selectedSkip-poi_highlight");
pipedMaterialSelectedSkipPoiHighlightElement.addEventListener("change",
    event => selectSkipModify('poi_highlight', event.target.checked)
);

let pipedMaterialSelectedSkipFillerElement = document.getElementById("pipedMaterial-selectedSkip-filler");
pipedMaterialSelectedSkipFillerElement.addEventListener("change",
    event => selectSkipModify('filler', event.target.checked)
);

let selectSkip = [];
youtubeHelper.init().then(() => {

    pipedSponsorblockElement.checked = youtubeHelper.getPipedSponsorblock();
    selectSkip = youtubeHelper.getPipedSelectedSkip();
    pipedSelectedSkipSponsorElement.checked = selectSkip.includes('sponsor');
    pipedSelectedSkipIntroElement.checked = selectSkip.includes('intro');
    pipedSelectedSkipOutroElement.checked = selectSkip.includes('outro');
    pipedSelectedSkipPreviewElement.checked = selectSkip.includes('preview');
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

    pipedMaterialListenElement.checked = youtubeHelper.getYoutubeListen();
    pipedMaterialDisableLBRYElement.checked = youtubeHelper.getPipedDisableLBRY();
    pipedMaterialProxyLBRYElement.checked = youtubeHelper.getPipedProxyLBRY();
    pipedMaterialSponsorblockElement.checked = youtubeHelper.getPipedSponsorblock()
    pipedMaterialSkipToLastPointElement.checked = youtubeHelper.getPipedMaterialSkipToLastPoint();
    pipedMaterialSelectedSkipSponsorElement.checked = selectSkip.includes('sponsor');
    pipedMaterialSelectedSkipIntroElement.checked = selectSkip.includes('intro');
    pipedMaterialSelectedSkipOutroElement.checked = selectSkip.includes('outro');
    pipedMaterialSelectedSkipPreviewElement.checked = selectSkip.includes('preview');
    pipedMaterialSelectedSkipInteractionElement.checked = selectSkip.includes('interaction');
    pipedMaterialSelectedSkipSelfpromoElement.checked = selectSkip.includes('selfpromo');
    pipedMaterialSelectedSkipMusicOfftopicElement.checked = selectSkip.includes('music_offtopic');
    pipedMaterialSelectedSkipPoiHighlightElement.checked = selectSkip.includes('poi_highlight');
    pipedMaterialSelectedSkipFillerElement.checked = selectSkip.includes('filler');

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

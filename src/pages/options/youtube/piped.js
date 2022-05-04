import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let piped = document.getElementById('piped');

let pipedListen = piped.getElementsByClassName("listen")[0];
let pipedQuality = piped.getElementsByClassName("quality")[0];
let pipedBufferGoal = piped.getElementsByClassName("bufferGoal")[0];
let pipedRegion = piped.getElementsByClassName("region")[0];
let pipedHomepage = piped.getElementsByClassName("homepage")[0];
let pipedComments = piped.getElementsByClassName("comments")[0];
let pipedMinimizeDescription = piped.getElementsByClassName("minimizeDescription")[0];
let pipedWatchHistory = piped.getElementsByClassName("watchHistory")[0];
let pipedDisableLBRY = piped.getElementsByClassName("disableLBRY")[0];
let pipedProxyLBRY = piped.getElementsByClassName("proxyLBRY")[0];

let pipedSelectedSkipSponsor = piped.getElementsByClassName("selectedSkip-sponsor")[0];
let pipedSelectedSkipIntro = piped.getElementsByClassName("selectedSkip-intro")[0];
let pipedSelectedSkipOutro = piped.getElementsByClassName("selectedSkip-outro")[0];
let pipedSelectedSkipPreview = piped.getElementsByClassName("selectedSkip-preview")[0];
let pipedSelectedSkipInteraction = piped.getElementsByClassName("selectedSkip-interaction")[0];
let pipedSelectedSkipSelfpromo = piped.getElementsByClassName("selectedSkip-selfpromo")[0];
let pipedSelectedSkipMusicOfftopic = piped.getElementsByClassName("selectedSkip-music_offtopic")[0];
let pipedSelectedSkipPoiHighlight = piped.getElementsByClassName("selectedSkip-poi_highlight")[0];
let pipedSelectedSkipFiller = piped.getElementsByClassName("selectedSkip-filler")[0];

let pipedDdlTheme = piped.getElementsByClassName("ddlTheme")[0];
let pipedSponsorblock = piped.getElementsByClassName("sponsorblock")[0];
let pipedEnabledCodecs = piped.getElementsByClassName("enabledCodecs")[0];
let autoplay = piped.getElementsByClassName("youtubeAutoplay")[0];

let volume = piped.getElementsByClassName("volume")[0];
let volumeValue = piped.getElementsByClassName("volume-value")[0];

volume.addEventListener("input", () => volumeValue.textContent = `${volume.value}%`);
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
piped.addEventListener("change", async () => {
    let pipedEnabledCodecsResult = [];
    for (const opt of pipedEnabledCodecs.options)
        if (opt.selected) pipedEnabledCodecsResult.push(opt.value);

    selectSkipModify('sponsor', pipedSelectedSkipSponsor.checked);
    selectSkipModify('intro', pipedSelectedSkipIntro.checked);
    selectSkipModify('outro', pipedSelectedSkipOutro.checked);
    selectSkipModify('preview', pipedSelectedSkipPreview.checked);
    selectSkipModify('interaction', pipedSelectedSkipInteraction.checked);
    selectSkipModify('selfpromo', pipedSelectedSkipSelfpromo.checked);
    selectSkipModify('music_offtopic', pipedSelectedSkipMusicOfftopic.checked);
    selectSkipModify('poi_highlight', pipedSelectedSkipPoiHighlight.checked);
    selectSkipModify('filler', pipedSelectedSkipFiller.checked);

    await browser.storage.local.set({
        pipedQuality: pipedQuality.value,
        pipedBufferGoal: pipedBufferGoal.value,
        pipedRegion: pipedRegion.value,
        pipedHomepage: pipedHomepage.value,
        pipedComments: pipedComments.checked,
        pipedMinimizeDescription: pipedMinimizeDescription.checked,
        youtubeAutoplay: autoplay.checked,
        pipedWatchHistory: pipedWatchHistory.checked,
        pipedDisableLBRY: pipedDisableLBRY.checked,
        pipedProxyLBRY: pipedProxyLBRY.checked,
        youtubeVolume: volume.value,
        pipedSponsorblock: pipedSponsorblock.checked,
        pipedDdlTheme: pipedDdlTheme.value,
        pipedEnabledCodecs: pipedEnabledCodecsResult,
        youtubeListen: pipedListen.checked,
        pipedSelectedSkip: selectSkip,
    });
});

await browser.storage.local.get(
    [
        "youtubeVolume",
        "youtubeAutoplay",
        "youtubeListen",

        "pipedBufferGoal",
        "pipedComments",
        "pipedDisableLBRY",
        "pipedEnabledCodecs",
        "pipedHomepage",
        "pipedMinimizeDescription",
        "pipedProxyLBRY",
        "pipedQuality",
        "pipedRegion",
        "pipedSelectedSkip",
        "pipedSponsorblock",
        "pipedDdlTheme",
        "pipedWatchHistory",
    ],
    r => {
        pipedSponsorblock.checked = r.pipedSponsorblock;
        pipedDdlTheme.value = r.pipedDdlTheme;
        selectSkip = r.pipedSelectedSkip;
        pipedSelectedSkipSponsor.checked = selectSkip.includes('sponsor');
        pipedSelectedSkipIntro.checked = selectSkip.includes('intro');
        pipedSelectedSkipOutro.checked = selectSkip.includes('outro');
        pipedSelectedSkipPreview.checked = selectSkip.includes('preview');
        autoplay.checked = r.youtubeAutoplay;
        pipedSelectedSkipInteraction.checked = selectSkip.includes('interaction');
        pipedSelectedSkipSelfpromo.checked = selectSkip.includes('selfpromo');
        pipedSelectedSkipMusicOfftopic.checked = selectSkip.includes('music_offtopic');
        pipedSelectedSkipPoiHighlight.checked = selectSkip.includes('poi_highlight');
        pipedSelectedSkipFiller.checked = selectSkip.includes('filler');
        pipedListen.checked = r.youtubeListen;
        pipedQuality.value = r.pipedQuality;
        pipedBufferGoal.value = r.pipedBufferGoal;
        pipedRegion.value = r.pipedRegion;
        pipedHomepage.value = r.pipedHomepage;
        pipedComments.checked = r.pipedComments;
        pipedMinimizeDescription.checked = r.pipedMinimizeDescription;
        pipedWatchHistory.checked = r.pipedWatchHistory;
        pipedEnabledCodecs.value = r.pipedEnabledCodecs;
        pipedDisableLBRY.checked = r.pipedDisableLBRY;
        pipedProxyLBRY.checked = r.pipedProxyLBRY;

        volume.value = r.youtubeVolume;
        volumeValue.textContent = `${r.youtubeVolume}%`;
    }
);

commonHelper.processDefaultCustomInstances('youtube', 'piped', 'normal', document);
commonHelper.processDefaultCustomInstances('youtube', 'piped', 'tor', document);

let latencyPipedElement = document.getElementById("latency-piped");
let latencyPipedLabel = document.getElementById("latency-piped-label");
latencyPipedElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyPipedElement.addEventListener("click", reloadWindow);
        await youtubeHelper.init();
        let redirects = youtubeHelper.getRedirects();
        const oldHtml = latencyPipedLabel.innerHTML;
        latencyPipedLabel.innerHTML = '...';
        commonHelper.testLatency(latencyPipedLabel, redirects.piped.normal).then(r => {
            browser.storage.local.set({ pipedLatency: r });
            latencyPipedLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('youtube', 'piped', 'normal', document);
            latencyPipedElement.removeEventListener("click", reloadWindow);
        });
    }
);

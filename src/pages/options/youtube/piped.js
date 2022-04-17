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
    console.log("changed piped settings");
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

    await youtubeHelper.setYoutubeSettings({
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
    init();
});

function init() {
    youtubeHelper.init().then(() => {
        pipedSponsorblock.checked = youtubeHelper.getPipedSponsorblock();
        pipedDdlTheme.value = youtubeHelper.getPipedDdlTheme();
        selectSkip = youtubeHelper.getPipedSelectedSkip();
        pipedSelectedSkipSponsor.checked = selectSkip.includes('sponsor');
        pipedSelectedSkipIntro.checked = selectSkip.includes('intro');
        pipedSelectedSkipOutro.checked = selectSkip.includes('outro');
        pipedSelectedSkipPreview.checked = selectSkip.includes('preview');
        autoplay.checked = youtubeHelper.getAutoplay();
        pipedSelectedSkipInteraction.checked = selectSkip.includes('interaction');
        pipedSelectedSkipSelfpromo.checked = selectSkip.includes('selfpromo');
        pipedSelectedSkipMusicOfftopic.checked = selectSkip.includes('music_offtopic');
        pipedSelectedSkipPoiHighlight.checked = selectSkip.includes('poi_highlight');
        pipedSelectedSkipFiller.checked = selectSkip.includes('filler');
        pipedListen.checked = youtubeHelper.getYoutubeListen();
        pipedQuality.value = youtubeHelper.getPipedQuality();
        pipedBufferGoal.value = youtubeHelper.getPipedBufferGoal();
        pipedRegion.value = youtubeHelper.getPipedRegion();
        pipedHomepage.value = youtubeHelper.getPipedHomepage();
        pipedComments.checked = youtubeHelper.getPipedComments();
        pipedMinimizeDescription.checked = youtubeHelper.getPipedMinimizeDescription();
        pipedWatchHistory.checked = youtubeHelper.getPipedWatchHistory();
        pipedEnabledCodecs.value = youtubeHelper.getPipedEnabledCodecs();
        pipedDisableLBRY.checked = youtubeHelper.getPipedDisableLBRY();
        pipedProxyLBRY.checked = youtubeHelper.getPipedProxyLBRY();

        volume.value = youtubeHelper.getVolume();
        volumeValue.textContent = `${youtubeHelper.getVolume()}%`;

        browser.storage.local.get("pipedLatency").then(r => {
            commonHelper.processDefaultCustomInstances(
                'piped',
                'normal',
                youtubeHelper,
                document,
                youtubeHelper.getPipedNormalRedirectsChecks,
                youtubeHelper.setPipedNormalRedirectsChecks,
                youtubeHelper.getPipedNormalCustomRedirects,
                youtubeHelper.setPipedNormalCustomRedirects,
                r.pipedLatency,
            );
        });

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
      commonHelper.processDefaultCustomInstances(
        'piped',
        'normal',
        youtubeHelper,
        document,
        youtubeHelper.getPipedNormalRedirectsChecks,
        youtubeHelper.setPipedNormalRedirectsChecks,
        youtubeHelper.getPipedNormalCustomRedirects,
        youtubeHelper.setPipedNormalCustomRedirects,
        r,
      );
      latencyPipedElement.removeEventListener("click", reloadWindow);
    });
  }
);

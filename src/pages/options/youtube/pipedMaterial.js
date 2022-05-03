import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let pipedMaterialElement = document.getElementById('pipedMaterial');
let listenElement = pipedMaterialElement.getElementsByClassName("listen")[0];
let disableLBRYElement = pipedMaterialElement.getElementsByClassName("disableLBRY")[0];
let proxyLBRYElement = pipedMaterialElement.getElementsByClassName("proxyLBRY")[0];
let sponsorblockElement = pipedMaterialElement.getElementsByClassName("sponsorblock")[0];
let skipToLastPointElement = pipedMaterialElement.getElementsByClassName("skipToLastPoint")[0];

let selectedSkipSponsorElement = pipedMaterialElement.getElementsByClassName("selectedSkip-sponsor")[0];
let selectedSkipIntroElement = pipedMaterialElement.getElementsByClassName("selectedSkip-intro")[0];
let selectedSkipOutroElement = pipedMaterialElement.getElementsByClassName("selectedSkip-outro")[0];
let selectedSkipPreviewElement = pipedMaterialElement.getElementsByClassName("selectedSkip-preview")[0];
let selectedSkipInteractionElement = pipedMaterialElement.getElementsByClassName("selectedSkip-interaction")[0];
let selectedSkipSelfpromoElement = pipedMaterialElement.getElementsByClassName("selectedSkip-selfpromo")[0];
let selectedSkipMusicOfftopicElement = pipedMaterialElement.getElementsByClassName("selectedSkip-music_offtopic")[0];

let autoplayElement = pipedMaterialElement.getElementsByClassName("youtubeAutoplay")[0];

let volumeElement = pipedMaterialElement.getElementsByClassName("volume")[0];
let volumeValueElement = pipedMaterialElement.getElementsByClassName("volume-value")[0];

volumeElement.addEventListener("input", () => volumeValueElement.textContent = `${volumeElement.value}%`);

let selectSkip = [];
function selectSkipModify(value, boolean) {
    if (boolean && !selectSkip.includes(value)) {
        selectSkip.push(value);
    }
    else if (!boolean) {
        let i = selectSkip.indexOf(value);
        if (i > -1) selectSkip.splice(i, 1);
    }
}
pipedMaterialElement.addEventListener("change", async () => {
    console.log("changed piped settings");

    selectSkipModify('sponsors', selectedSkipSponsorElement.checked);
    selectSkipModify('intro', selectedSkipIntroElement.checked);
    selectSkipModify('outro', selectedSkipOutroElement.checked);
    selectSkipModify('preview', selectedSkipPreviewElement.checked);
    selectSkipModify('interaction', selectedSkipInteractionElement.checked);
    selectSkipModify('selfpromo', selectedSkipSelfpromoElement.checked);
    selectSkipModify('music_offtopic', selectedSkipMusicOfftopicElement.checked);

    await browser.storage.local.set({
        youtubeListen: listenElement.checked,
        pipedDisableLBRY: disableLBRYElement.checked,
        pipedProxyLBRY: proxyLBRYElement.checked,
        pipedSponsorblock: sponsorblockElement.checked,
        pipedSkipToLastPoint: skipToLastPointElement.checked,
        pipedSelectedSkipSponsor: selectedSkipSponsorElement.checked,
        pipedSelectedSkipIntro: selectedSkipIntroElement.checked,
        pipedSelectedSkipOutro: selectedSkipOutroElement.checked,
        youtubeAutoplay: autoplayElement.checked,
        youtubeVolume: volumeElement.value,
        pipedSelectedSkipPreview: selectedSkipPreviewElement.checked,
        pipedSelectedSkipInteraction: selectedSkipInteractionElement.checked,
        pipedSelectedSkipSelfpromo: selectedSkipSelfpromoElement.checked,
        pipedSelectedSkipMusicOfftopic: selectedSkipMusicOfftopicElement.checked,

        pipedSponsorblock: sponsorblockElement.checked,
        pipedMaterialSkipToLastPoint: skipToLastPointElement.checked,
        pipedSelectedSkip: selectSkip,
    });
    init();
});

function init() {
    browser.storage.local.get(
        [
            "youtubeAutoplay",
            "youtubeVolume",
            "youtubeListen",

            "pipedDisableLBRY",
            "pipedProxyLBRY",
            "pipedSelectedSkip",
            "pipedSponsorblock",

            "pipedMaterialSkipToLastPoint",
        ],
        r => {
            autoplayElement.checked = r.youtubeAutoplay;

            listenElement.checked = r.youtubeListen;
            disableLBRYElement.checked = r.pipedDisableLBRY;
            proxyLBRYElement.checked = r.pipedProxyLBRY;
            sponsorblockElement.checked = r.pipedSponsorblock;
            skipToLastPointElement.checked = r.pipedMaterialSkipToLastPoint;

            selectSkip = r.pipedSelectedSkip;
            selectedSkipSponsorElement.checked = selectSkip.includes('sponsors');
            selectedSkipIntroElement.checked = selectSkip.includes('intro');
            selectedSkipOutroElement.checked = selectSkip.includes('outro');
            selectedSkipPreviewElement.checked = selectSkip.includes('preview');
            selectedSkipInteractionElement.checked = selectSkip.includes('interaction');
            selectedSkipSelfpromoElement.checked = selectSkip.includes('selfpromo');
            selectedSkipMusicOfftopicElement.checked = selectSkip.includes('music_offtopic');

            volumeElement.value = r.youtubeVolume;
            volumeValueElement.textContent = `${r.youtubeVolume}%`;

            commonHelper.processDefaultCustomInstances('pipedMaterial', 'normal', youtubeHelper, document);
            commonHelper.processDefaultCustomInstances('pipedMaterial', 'tor', youtubeHelper, document);
        });
}
init();

let latencyPipedMaterialElement = document.getElementById("latency-pipedMaterial");
let latencyPipedMaterialLabel = document.getElementById("latency-pipedMaterial-label");
latencyPipedMaterialElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyPipedMaterialElement.addEventListener("click", reloadWindow);
        await youtubeHelper.init();
        let redirects = youtubeHelper.getRedirects();
        const oldHtml = latencyPipedMaterialLabel.innerHTML;
        latencyPipedMaterialLabel.innerHTML = '...';
        commonHelper.testLatency(latencyPipedMaterialLabel, redirects.pipedMaterial.normal).then(r => {
            browser.storage.local.set({ pipedMaterialLatency: r });
            latencyPipedMaterialLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('pipedMaterial', 'normal', youtubeHelper, document);
            latencyPipedMaterialElement.removeEventListener("click", reloadWindow);
        });
    }
);
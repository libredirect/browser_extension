import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableYoutubeElement = document.getElementById("disable-invidious");

let youtubeFrontendElement = document.getElementById("youtube-frontend");
let invidiousDivElement = document.getElementById("invidious")
let pipedDivElement = document.getElementById("piped")
let invidiousPipedDivElement = document.getElementById("invidious-piped")
function changeFrontendsSettings(frontend) {
    if (frontend == 'piped') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'block';
        invidiousDivElement.style.display = 'none';
    }
    else if (frontend == 'invidious') {
        invidiousPipedDivElement.style.display = 'block'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'block';
    }
    else if (frontend == 'freeTube') {
        invidiousPipedDivElement.style.display = 'none'
        pipedDivElement.style.display = 'none';
        invidiousDivElement.style.display = 'none';
    }
}
youtubeFrontendElement.addEventListener("change",
    (event) => {
        let frontend = event.target.options[youtubeFrontendElement.selectedIndex].value
        youtubeHelper.setFrontend(frontend);
        changeFrontendsSettings(frontend);
    }
);

disableYoutubeElement.addEventListener("change",
    (event) => youtubeHelper.setDisableYoutube(!event.target.checked)
);

let invidiousThemeElement = document.getElementById("invidious-theme");
invidiousThemeElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousTheme(event.target.options[invidiousThemeElement.selectedIndex].value)
);

let persistInvidiousPrefsElement = document.getElementById("persist-invidious-prefs");
persistInvidiousPrefsElement.addEventListener("change",
    (event) => youtubeHelper.setPersistInvidiousPrefs(event.target.checked)
);

let invidiousVolumeElement = document.getElementById("invidious-volume");
let invidiousVolumeValueElement = document.querySelector("#volume-value");
invidiousVolumeElement.addEventListener("input",
    () => {
        youtubeHelper.setInvidiousVolume(invidiousVolumeElement.value);
        invidiousVolumeValueElement.textContent = `${invidiousVolumeElement.value}%`;
    }
);
let invidiousClearVolumeElement = document.getElementById("clear-invidious-volume");
invidiousClearVolumeElement.addEventListener("click",
    (_) => {
        youtubeHelper.setInvidiousVolume('--');
        invidiousVolumeValueElement.textContent = `--%`;
        invidiousVolumeElement.value = 50;
    }
);

let invidiousPlayerStyleElement = document.getElementById("invidious-player-style");
invidiousPlayerStyleElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousPlayerStyle(event.target.options[invidiousPlayerStyleElement.selectedIndex].value)
);

let invidiousSubtitlesElement = document.getElementById("invidious-subtitles");
invidiousSubtitlesElement.addEventListener("input",
    commonHelper.debounce(() => {
        youtubeHelper.setInvidiousSubtitles(invidiousSubtitlesElement.value)
    }, 500)
);

let invidiousAutoplayElement = document.getElementById("invidious-autoplay");
invidiousAutoplayElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousAutoplay(event.target.options[invidiousAutoplayElement.selectedIndex].value)
);

let invidiousAlwaysProxyElement = document.getElementById("invidious-always-proxy");
invidiousAlwaysProxyElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousAlwaysProxy(event.target.options[invidiousAlwaysProxyElement.selectedIndex].value)
);

let invidiousOnlyEmbeddedVideoElement = document.getElementById("only-embed");
invidiousOnlyEmbeddedVideoElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousOnlyEmbeddedVideo(event.target.checked)
);

let invidiousVideoQualityElement = document.getElementById("video-quality");
invidiousVideoQualityElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousVideoQuality(event.target.options[invidiousVideoQualityElement.selectedIndex].value)
);


let invidiousCheckListElement = document.getElementById("checklist");



youtubeHelper.init().then(() => {
    disableYoutubeElement.checked = !youtubeHelper.getDisableYoutube();
    invidiousThemeElement.checked = youtubeHelper.getInvidiousTheme();
    persistInvidiousPrefsElement.checked = youtubeHelper.getPersistInvidiousPrefs();
    invidiousVolumeElement.value = youtubeHelper.getInvidiousVolume();
    invidiousVolumeValueElement.textContent = `${youtubeHelper.getInvidiousVolume()}%`;
    invidiousPlayerStyleElement.value = youtubeHelper.getInvidiousPlayerStyle();
    invidiousSubtitlesElement.value = youtubeHelper.getInvidiousSubtitles();
    invidiousOnlyEmbeddedVideoElement.checked = youtubeHelper.getInvidiousOnlyEmbeddedVideo();
    invidiousAlwaysProxyElement.checked = youtubeHelper.getInvidiousAlwaysProxy();
    invidiousVideoQualityElement.value = youtubeHelper.getInvidiousVideoQuality();
    invidiousAutoplayElement.checked = youtubeHelper.getInvidiousAutoplay();
    let frontend = youtubeHelper.getFrontend()
    youtubeFrontendElement.value = frontend;
    invidiousCheckListElement.innerHTML =
        [
            '<div>Toggle All<input type="checkbox" id="invidious-toogle-all" /></div>',
            ...youtubeHelper.getRedirects().invidious.normal.map(
                (x) => `<div>${x}<input type="checkbox" id="${x}" /></div>`),
        ].join('\n<hr>\n')
    changeFrontendsSettings(frontend);

    let myMightyList = youtubeHelper.getInvidiousRedirectsChecks();

    function checkToggleAll() {
        console.log("CheckToggleAll")
        let isTrue = true;
        for (const item of youtubeHelper.getRedirects().invidious.normal)
            if (!myMightyList.includes(item)) {
                isTrue = false;
                break;
            }
        document.getElementById('invidious-toogle-all').checked = isTrue;
    }


    let checklistList = invidiousCheckListElement.getElementsByTagName('input')
    for (let element of checklistList) {

        element.checked = myMightyList.includes(element.id);

        if (element.id == 'invidious-toogle-all')
            document.getElementById('invidious-toogle-all').addEventListener("change",
                (event) => {
                    if (event.target.checked) {
                        for (let item of checklistList) {
                            myMightyList.push(item.id)
                            item.checked = true;
                        }
                    }
                    else {
                        myMightyList = [];
                        for (let item of checklistList) item.checked = false;
                    }
                    youtubeHelper.setInvidiousRedirectsChecks(myMightyList);
                }
            );
        else
            document.getElementById(element.id).addEventListener("change",
                (event) => {
                    if (event.target.checked)
                        myMightyList.push(element.id)
                    else {
                        let index = myMightyList.indexOf(element.id);
                        if (index > -1) myMightyList.splice(index, 1);
                    }

                    youtubeHelper.setInvidiousRedirectsChecks(myMightyList);
                    checkToggleAll();
                }
            );
    }
    checkToggleAll();


    mightyInvidiousCustomInstances = youtubeHelper.getInvidiousCustomRedirects();
    calcCustom();

});


let invidiousCustomInstanceElement = document.getElementById("invidious-custom-instance")
let mightyInvidiousCustomInstances = []
let invidiousCustomCheckListElement = document.getElementById("custom-checklist");
let customFormElement = document.getElementById("custom-instance-form");

function calcCustom() {
    invidiousCustomCheckListElement.innerHTML = [
        ...mightyInvidiousCustomInstances.map(
            (x) => `<div>${x}<button class="add" id="clear-${x}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                    fill="currentColor">
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                    </svg>
                    </button>
                    </div>
                    <hr>`),
    ].join('\n');

    for (const item of mightyInvidiousCustomInstances) {
        let myButton = document.getElementById(`clear-${item}`);
        myButton.addEventListener("click", () => {
            let index = mightyInvidiousCustomInstances.indexOf(item);
            if (index > -1) mightyInvidiousCustomInstances.splice(index, 1);
            youtubeHelper.setInvidiousCustomRedirects(mightyInvidiousCustomInstances);
            calcCustom();
        });
    }
}

customFormElement.addEventListener("submit", (event) => {
    event.preventDefault();
    if (invidiousCustomInstanceElement.validity.valid) {
        let val = invidiousCustomInstanceElement.value
        if (!mightyInvidiousCustomInstances.includes(val)) {
            mightyInvidiousCustomInstances.push(val)
            youtubeHelper.setInvidiousCustomRedirects(mightyInvidiousCustomInstances);
        }
        calcCustom();
    }
})



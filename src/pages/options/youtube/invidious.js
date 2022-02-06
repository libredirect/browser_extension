import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";

let invidiousAlwaysProxyElement = document.getElementById("invidious-always-proxy");
invidiousAlwaysProxyElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousAlwaysProxy(event.target.options[invidiousAlwaysProxyElement.selectedIndex].value)
);

let invidiousPlayerStyleElement = document.getElementById("invidious-player-style");
invidiousPlayerStyleElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousPlayerStyle(event.target.options[invidiousPlayerStyleElement.selectedIndex].value)
);

let invidiousVideoQualityElement = document.getElementById("video-quality");
invidiousVideoQualityElement.addEventListener("change",
    (event) => youtubeHelper.setInvidiousVideoQuality(event.target.options[invidiousVideoQualityElement.selectedIndex].value)
);

let invidiousSubtitlesElement = document.getElementById("invidious-subtitles");
invidiousSubtitlesElement.addEventListener("change",
    () => youtubeHelper.setInvidiousSubtitles(invidiousSubtitlesElement.value)
);

let persistInvidiousPrefsElement = document.getElementById("persist-invidious-prefs");
persistInvidiousPrefsElement.addEventListener("change",
    (event) => youtubeHelper.setPersistInvidiousPrefs(event.target.checked)
);

youtubeHelper.init().then(() => {
    invidiousPlayerStyleElement.value = youtubeHelper.getInvidiousPlayerStyle();
    invidiousAlwaysProxyElement.checked = youtubeHelper.getInvidiousAlwaysProxy();
    invidiousVideoQualityElement.value = youtubeHelper.getInvidiousVideoQuality();
    invidiousSubtitlesElement.value = youtubeHelper.getInvidiousSubtitles();
    persistInvidiousPrefsElement.checked = youtubeHelper.getPersistInvidiousPrefs();


    invidiousDefaultRedirects = youtubeHelper.getInvidiousRedirectsChecks();
    invidiousCheckListElement.innerHTML =
        [
            '<div>Toggle All<input type="checkbox" id="invidious-toogle-all" /></div>',
            ...youtubeHelper.getRedirects().invidious.normal.map((x) => `<div>${x}<input type="checkbox" id="${x}" /></div>`),
        ].join('\n<hr>\n');

    calcInvidiousCheckBoxes();
    document.getElementById('invidious-toogle-all').addEventListener("change", (event) => {
        if (event.target.checked)
            invidiousDefaultRedirects = [...youtubeHelper.getRedirects().invidious.normal];
        else
            invidiousDefaultRedirects = [];
        youtubeHelper.setInvidiousRedirectsChecks(invidiousDefaultRedirects);
        calcInvidiousCheckBoxes();
    });

    for (let element of invidiousCheckListElement.getElementsByTagName('input')) {
        if (element.id != 'invidious-toogle-all')
            document.getElementById(element.id).addEventListener("change", (event) => {
                if (event.target.checked)
                    invidiousDefaultRedirects.push(element.id)
                else {
                    let index = invidiousDefaultRedirects.indexOf(element.id);
                    if (index > -1) invidiousDefaultRedirects.splice(index, 1);
                }
                youtubeHelper.setInvidiousRedirectsChecks(invidiousDefaultRedirects);
                calcInvidiousCheckBoxes();
            });
    }

    invidiousCustomInstances = youtubeHelper.getInvidiousCustomRedirects();
    calcInvidiousCustomInstances();
});


let invidiousCustomInstanceInput = document.getElementById("invidious-custom-instance");
let invidiousCustomInstances = [];

let invidiousCheckListElement = document.getElementById("invidious-checklist");


let invidiousDefaultRedirects;

function calcInvidiousCheckBoxes() {
    let isTrue = true;
    for (const item of youtubeHelper.getRedirects().invidious.normal)
        if (!invidiousDefaultRedirects.includes(item)) {
            isTrue = false;
            break;
        }
    for (const element of invidiousCheckListElement.getElementsByTagName('input'))
        element.checked = invidiousDefaultRedirects.includes(element.id)
    document.getElementById('invidious-toogle-all').checked = isTrue;
}

function calcInvidiousCustomInstances() {
    document.getElementById("invidious-custom-checklist").innerHTML =
        invidiousCustomInstances.map(
            (x) => `<div>${x}<button class="add" id="clear-${x}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                            fill="currentColor">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                            </svg>
                        </button>
                    </div>
                    <hr>`
        ).join('\n');

    for (const item of invidiousCustomInstances) {
        document.getElementById(`clear-${item}`).addEventListener("click", () => {
            let index = invidiousCustomInstances.indexOf(item);
            if (index > -1) invidiousCustomInstances.splice(index, 1);
            youtubeHelper.setInvidiousCustomRedirects(invidiousCustomInstances);
            calcInvidiousCustomInstances();
        });
    }
}

document.getElementById("custom-invidious-instance-form").addEventListener("submit", (event) => {
    event.preventDefault();
    let val = invidiousCustomInstanceInput.value
    if (invidiousCustomInstanceInput.validity.valid && !youtubeHelper.getRedirects().invidious.normal.includes(val)) {
        if (!invidiousCustomInstances.includes(val)) {
            invidiousCustomInstances.push(val)
            youtubeHelper.setInvidiousCustomRedirects(invidiousCustomInstances);
        }
        calcInvidiousCustomInstances();
    }
})
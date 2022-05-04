import redditHelper from "../../../assets/javascripts/helpers/reddit.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let libredditDivElement = document.getElementById("libreddit")
let tedditDivElement = document.getElementById("teddit")
let enableLibredditSettingsElement = document.getElementById("enable-libreddit-custom-settings");
let customSettingsDivElement = document.getElementsByClassName("custom-settings");

let disableRedditElement = document.getElementById("disable-reddit");
let redditFrontendElement = document.getElementById("reddit-frontend");
let protocolElement = document.getElementById("protocol")
let bypassWatchOnRedditElement = document.getElementById("bypass-watch-on-reddit")

let theme = document.getElementById('libreddit').getElementsByClassName('theme')[0];
let front_page = document.getElementById('libreddit').getElementsByClassName('front_page')[0];
let layout = document.getElementById('libreddit').getElementsByClassName('layout')[0];
let wide = document.getElementById('libreddit').getElementsByClassName('wide')[0];
let post_sort = document.getElementById('libreddit').getElementsByClassName('post_sort')[0];
let comment_sort = document.getElementById('libreddit').getElementsByClassName('comment_sort')[0];
let show_nsfw = document.getElementById('libreddit').getElementsByClassName('show_nsfw')[0];
let autoplay_videos = document.getElementById('libreddit').getElementsByClassName('autoplay_videos')[0];
let use_hls = document.getElementById('libreddit').getElementsByClassName('use_hls')[0];
let hide_hls_notification = document.getElementById('libreddit').getElementsByClassName('hide_hls_notification')[0];

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableReddit: !disableRedditElement.checked,
        bypassWatchOnReddit: bypassWatchOnRedditElement.checked,
        redditProtocol: protocolElement.value,
        redditFrontend: redditFrontendElement.value,

        enableLibredditCustomSettings: enableLibredditSettingsElement.checked,

        redditTheme: theme.value,
        redditFrontPage: front_page.value,
        redditLayout: layout.value,
        redditWide: wide.checked,
        redditPostSort: post_sort.value,
        redditCommentSort: comment_sort.value,
        redditShowNsfw: show_nsfw.checked,
        redditAutoplayVideos: autoplay_videos.checked,
        redditUseHls: use_hls.checked,
        redditHideHlsNotification: hide_hls_notification.checked,
    });
    init();
})

function changeProtocolSettings(protocol) {
    let normalLibredditDiv = libredditDivElement.getElementsByClassName("normal")[0];
    let torLibredditDiv = libredditDivElement.getElementsByClassName("tor")[0];

    let normalTedditDiv = tedditDivElement.getElementsByClassName("normal")[0];
    let torTedditDiv = tedditDivElement.getElementsByClassName("tor")[0];
    if (protocol == 'normal') {
        normalLibredditDiv.style.display = 'block';
        normalTedditDiv.style.display = 'block';
        torTedditDiv.style.display = 'none';
        torLibredditDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalLibredditDiv.style.display = 'none';
        normalTedditDiv.style.display = 'none';
        torTedditDiv.style.display = 'block';
        torLibredditDiv.style.display = 'block';
    }
    if (enableLibredditSettingsElement.checked)
        for (const item of customSettingsDivElement) item.style.display = 'block';
    else
        for (const item of customSettingsDivElement) item.style.display = 'none';
}
function changeFrontendsSettings(frontend) {
    let frontendElement = document.getElementById("frontend");
    if (frontend == 'libreddit') {
        frontendElement.innerHTML = 'Frontend';
        libredditDivElement.style.display = 'block';
        tedditDivElement.style.display = 'none';
    }
    else if (frontend == 'teddit') {
        frontendElement.innerHTML = 'Frontend';
        libredditDivElement.style.display = 'none';
        tedditDivElement.style.display = 'block';
    }
    else if (frontend == 'old') {
        frontendElement.innerHTML = `Frontend: <span style="color:red;">This isn't a fully private frontend</span>`;
        libredditDivElement.style.display = 'none';
        tedditDivElement.style.display = 'none';
    }
}

browser.storage.local.get(
    [
        "disableReddit",
        "bypassWatchOnReddit",
        "redditProtocol",
        "redditFrontend",

        "enableLibredditCustomSettings",

        "redditTheme",
        "redditFrontPage",
        "redditLayout",
        "redditWide",
        "redditPostSort",
        "redditCommentSort",
        "redditShowNsfw",
        "redditAutoplayVideos",
        "redditUseHls",
        "redditHideHlsNotification",
    ],
    r => {
        disableRedditElement.checked = !r.disableReddit
        bypassWatchOnRedditElement.checked = r.bypassWatchOnReddit
        protocolElement.value = r.redditProtocol
        redditFrontendElement.value = r.redditFrontend
        enableLibredditSettingsElement.checked = r.enableLibredditCustomSettings
        changeFrontendsSettings(r.redditFrontend);
        changeProtocolSettings(r.redditProtocol);

        theme.value = r.redditTheme;
        front_page.value = r.redditFrontPage;
        layout.value = r.redditLayout;
        wide.checked = r.redditWide;
        post_sort.value = r.redditPostSort;
        comment_sort.value = r.redditCommentSort;
        show_nsfw.checked = r.redditShowNsfw;
        autoplay_videos.checked = r.redditAutoplayVideos;
        use_hls.checked = r.redditUseHls;
        hide_hls_notification.checked = r.redditHideHlsNotification;
    }
)

commonHelper.processDefaultCustomInstances('libreddit', 'normal', redditHelper, document)
commonHelper.processDefaultCustomInstances('libreddit', 'tor', redditHelper, document)
commonHelper.processDefaultCustomInstances('teddit', 'normal', redditHelper, document);
commonHelper.processDefaultCustomInstances('teddit', 'tor', redditHelper, document);


let latencyLibredditElement = document.getElementById("latency-libreddit");
let latencyLibredditLabel = document.getElementById("latency-libreddit-label");
latencyLibredditElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyLibredditElement.addEventListener("click", reloadWindow);
        await redditHelper.init();
        let redirects = redditHelper.getRedirects();
        const oldHtml = latencyLibredditLabel.innerHTML;
        latencyLibredditLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLibredditLabel, redirects.libreddit.normal).then(r => {
            browser.storage.local.set({ libredditLatency: r });
            latencyLibredditLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('libreddit', 'normal', redditHelper, document);
            latencyLibredditElement.removeEventListener("click", reloadWindow);
        });
    }
);

let latencyTedditElement = document.getElementById("latency-teddit");
let latencyTedditLabel = document.getElementById("latency-teddit-label");
latencyTedditElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyTedditElement.addEventListener("click", reloadWindow);
        await redditHelper.init();
        let redirects = redditHelper.getRedirects();
        const oldHtml = latencyTedditLabel.innerHTML;
        latencyTedditLabel.innerHTML = '...';
        commonHelper.testLatency(latencyTedditLabel, redirects.teddit.normal).then(r => {
            browser.storage.local.set({ tedditLatency: r });
            latencyTedditLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('teddit', 'normal', redditHelper, document);
            latencyTedditElement.removeEventListener("click", reloadWindow);
        });
    }
);

window.onblur = () => {
    redditHelper.initLibredditCookies();
    redditHelper.initTedditCookies();
}
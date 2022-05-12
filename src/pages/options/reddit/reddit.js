import redditHelper from "../../../assets/javascripts/helpers/reddit.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let libredditDivElement = document.getElementById("libreddit")
let tedditDivElement = document.getElementById("teddit")

let disableRedditElement = document.getElementById("disable-reddit");
let redditFrontendElement = document.getElementById("reddit-frontend");
let protocolElement = document.getElementById("protocol")
let bypassWatchOnRedditElement = document.getElementById("bypass-watch-on-reddit")

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableReddit: !disableRedditElement.checked,
        bypassWatchOnReddit: bypassWatchOnRedditElement.checked,
        redditProtocol: protocolElement.value,
        redditFrontend: redditFrontendElement.value,
    });
    changeFrontendsSettings(redditFrontendElement.value);
    changeProtocolSettings(protocolElement.value);
})

const libredditForm = libredditDivElement.getElementsByTagName('form')[0];
const libredditCookies = libredditForm.getElementsByTagName('input')[0];
libredditForm.addEventListener('submit', async event => {
    event.preventDefault();
    const url = new URL(libredditCookies.value);
    redditHelper.initLibredditCookies(url);
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
    ],
    r => {
        disableRedditElement.checked = !r.disableReddit
        bypassWatchOnRedditElement.checked = r.bypassWatchOnReddit
        protocolElement.value = r.redditProtocol
        redditFrontendElement.value = r.redditFrontend
        changeFrontendsSettings(r.redditFrontend);
        changeProtocolSettings(r.redditProtocol);
    }
)

commonHelper.processDefaultCustomInstances('reddit', 'libreddit', 'normal', document);
commonHelper.processDefaultCustomInstances('reddit', 'libreddit', 'tor', document);
commonHelper.processDefaultCustomInstances('reddit', 'teddit', 'normal', document);
commonHelper.processDefaultCustomInstances('reddit', 'teddit', 'tor', document);


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
            commonHelper.processDefaultCustomInstances('reddit', 'libreddit', 'normal', document);
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
            commonHelper.processDefaultCustomInstances('reddit', 'teddit', 'normal', document);
            latencyTedditElement.removeEventListener("click", reloadWindow);
        });
    }
);
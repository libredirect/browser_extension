import redditHelper from "../../../assets/javascripts/helpers/reddit.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let libredditDivElement = document.getElementById("libreddit")
let tedditDivElement = document.getElementById("teddit")

let disableRedditElement = document.getElementById("disable-reddit");
let frontend = document.getElementById("reddit-frontend");
let protocol = document.getElementById("protocol")

document.addEventListener("change", () => {
    browser.storage.local.set({
        disableReddit: !disableRedditElement.checked,
        redditProtocol: protocol.value,
        redditFrontend: frontend.value,
    });
    changeFrontendsSettings();
    changeProtocolSettings();
})

const libredditForm = libredditDivElement.getElementsByTagName('form')[0];
const libredditCookies = libredditForm.getElementsByTagName('input')[0];
libredditForm.addEventListener('submit', async event => {
    event.preventDefault();
    const url = new URL(libredditCookies.value);
    redditHelper.initLibredditCookies(url);
});

const tedditForm = tedditDivElement.getElementsByTagName('form')[0];
const tedditCookies = tedditForm.getElementsByTagName('input')[0];
tedditForm.addEventListener('submit', async event => {
    event.preventDefault();
    const url = new URL(tedditCookies.value);
    redditHelper.initTedditCookies(url);
});

function changeProtocolSettings() {
    let normalLibredditDiv = libredditDivElement.getElementsByClassName("normal")[0];
    let torLibredditDiv = libredditDivElement.getElementsByClassName("tor")[0];

    let normalTedditDiv = tedditDivElement.getElementsByClassName("normal")[0];
    let torTedditDiv = tedditDivElement.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        normalLibredditDiv.style.display = 'block';
        normalTedditDiv.style.display = 'block';
        torTedditDiv.style.display = 'none';
        torLibredditDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalLibredditDiv.style.display = 'none';
        normalTedditDiv.style.display = 'none';
        torTedditDiv.style.display = 'block';
        torLibredditDiv.style.display = 'block';
    }
}
function changeFrontendsSettings() {
    if (frontend.value == 'libreddit') {
        libredditDivElement.style.display = 'block';
        tedditDivElement.style.display = 'none';
    }
    else if (frontend.value == 'teddit') {
        libredditDivElement.style.display = 'none';
        tedditDivElement.style.display = 'block';
    }
}

browser.storage.local.get(
    [
        "disableReddit",
        "redditProtocol",
        "redditFrontend",

        "enableLibredditCustomSettings",
    ],
    r => {
        disableRedditElement.checked = !r.disableReddit
        protocol.value = r.redditProtocol
        frontend.value = r.redditFrontend
        changeFrontendsSettings();
        changeProtocolSettings();
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
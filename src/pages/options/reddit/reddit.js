import redditHelper from "../../../assets/javascripts/helpers/reddit.js";
import utils from "../../../assets/javascripts/helpers/utils.js";

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

utils.processDefaultCustomInstances('reddit', 'libreddit', 'normal', document);
utils.processDefaultCustomInstances('reddit', 'libreddit', 'tor', document);
utils.processDefaultCustomInstances('reddit', 'teddit', 'normal', document);
utils.processDefaultCustomInstances('reddit', 'teddit', 'tor', document);

utils.latency('reddit', 'libreddit', document, location, true)
utils.latency('reddit', 'teddit', document, location, true)
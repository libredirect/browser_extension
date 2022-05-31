import utils from "../../../assets/javascripts/utils.js";

const libredditDivElement = document.getElementById("libreddit")
const tedditDivElement = document.getElementById("teddit")

const enable = document.getElementById("reddit-enable");
const frontend = document.getElementById("reddit-frontend");
const protocol = document.getElementById("reddit-protocol");
const reddit = document.getElementById('reddit_page');

function changeProtocolSettings() {
    const normalLibredditDiv = libredditDivElement.getElementsByClassName("normal")[0];
    const torLibredditDiv = libredditDivElement.getElementsByClassName("tor")[0];
    const normalTedditDiv = tedditDivElement.getElementsByClassName("normal")[0];
    const torTedditDiv = tedditDivElement.getElementsByClassName("tor")[0];
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
    ],
    r => {
        enable.checked = !r.disableReddit
        protocol.value = r.redditProtocol
        frontend.value = r.redditFrontend
        changeFrontendsSettings();
        changeProtocolSettings();
    }
)

reddit.addEventListener("change", () => {
    browser.storage.local.set({
        disableReddit: !enable.checked,
        redditProtocol: protocol.value,
        redditFrontend: frontend.value,
    });
    changeFrontendsSettings();
    changeProtocolSettings();
})

utils.processDefaultCustomInstances('reddit', 'libreddit', 'normal', document);
utils.processDefaultCustomInstances('reddit', 'libreddit', 'tor', document);
utils.processDefaultCustomInstances('reddit', 'teddit', 'normal', document);
utils.processDefaultCustomInstances('reddit', 'teddit', 'tor', document);

utils.latency('reddit', 'libreddit', document, location, true)
utils.latency('reddit', 'teddit', document, location, true)
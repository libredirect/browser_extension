import redditHelper from "../../../assets/javascripts/helpers/reddit.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableRedditElement = document.getElementById("disable-reddit");
disableRedditElement.addEventListener("change",
    (event) => redditHelper.setDisableReddit(!event.target.checked)
);
let libredditDivElement = document.getElementById("libreddit")
let tedditDivElement = document.getElementById("teddit")


function changeFrontendsSettings(frontend) {
    if (frontend == 'libreddit') {
        libredditDivElement.style.display = 'block';
        tedditDivElement.style.display = 'none';
    }
    else if (frontend == 'teddit') {
        libredditDivElement.style.display = 'none';
        tedditDivElement.style.display = 'block';
    }
}
let redditFrontendElement = document.getElementById("reddit-frontend");
redditFrontendElement.addEventListener("change",
    (event) => {
        let frontend = event.target.options[redditFrontendElement.selectedIndex].value
        redditHelper.setRedditFrontend(frontend)
        changeFrontendsSettings(frontend);
    }
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        redditHelper.setProtocol(protocol);
        changeProtocolSettings(protocol);
    }
);

function changeProtocolSettings(protocol) {
    let normalLibredditDiv = document.getElementById("libreddit-normal");
    let torLibredditDiv = document.getElementById("libreddit-tor");

    let normalTedditDiv = document.getElementById("teddit-normal");
    let torTedditDiv = document.getElementById("teddit-tor");
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

redditHelper.init().then(() => {
    disableRedditElement.checked = !redditHelper.getDisableReddit();

    let frontend = redditHelper.getRedditFrontend();
    redditFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);

    let protocol = redditHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances(
        'libreddit',
        'normal',
        redditHelper,
        document,
        redditHelper.getLibredditNormalRedirectsChecks,
        redditHelper.setLibredditNormalRedirectsChecks,
        redditHelper.getLibredditNormalCustomRedirects,
        redditHelper.setLibredditNormalCustomRedirects
    )

    commonHelper.processDefaultCustomInstances(
        'libreddit',
        'tor',
        redditHelper,
        document,
        redditHelper.getLibredditTorRedirectsChecks,
        redditHelper.setLibredditTorRedirectsChecks,
        redditHelper.getLibredditTorCustomRedirects,
        redditHelper.setLibredditTorCustomRedirects
    )

    commonHelper.processDefaultCustomInstances(
        'teddit',
        'normal',
        redditHelper,
        document,
        redditHelper.getTedditNormalRedirectsChecks,
        redditHelper.setTedditNormalRedirectsChecks,
        redditHelper.getTedditNormalCustomRedirects,
        redditHelper.setTedditNormalCustomRedirects
    );

    commonHelper.processDefaultCustomInstances(
        'teddit',
        'tor',
        redditHelper,
        document,
        redditHelper.getTedditTorRedirectsChecks,
        redditHelper.setTedditTorRedirectsChecks,
        redditHelper.getTedditTorCustomRedirects,
        redditHelper.setTedditTorCustomRedirects
    );

})
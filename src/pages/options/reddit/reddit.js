import redditHelper from "../../../assets/javascripts/helpers/reddit.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableRedditElement = document.getElementById("disable-reddit");
disableRedditElement.addEventListener("change",
    (event) => redditHelper.setDisableReddit(!event.target.checked)
);
let libredditDivElement = document.getElementById("libreddit")
let tedditDivElement = document.getElementById("teddit")

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
let redditFrontendElement = document.getElementById("reddit-frontend");
redditFrontendElement.addEventListener("change",
    (event) => {
        let frontend = event.target.options[redditFrontendElement.selectedIndex].value
        redditHelper.setFrontend(frontend)
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

let bypassWatchOnRedditElement = document.getElementById("bypass-watch-on-reddit")
bypassWatchOnRedditElement.addEventListener("change",
    event => redditHelper.setBypassWatchOnReddit(event.target.checked)
);

redditHelper.init().then(() => {
    disableRedditElement.checked = !redditHelper.getDisableReddit();
    bypassWatchOnRedditElement.checked = redditHelper.getBypassWatchOnReddit();

    let frontend = redditHelper.getFrontend();
    redditFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);

    let protocol = redditHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    browser.storage.local.get("libredditLatency").then(r => {
        commonHelper.processDefaultCustomInstances(
            'libreddit',
            'normal',
            redditHelper,
            document,
            redditHelper.getLibredditNormalRedirectsChecks,
            redditHelper.setLibredditNormalRedirectsChecks,
            redditHelper.getLibredditNormalCustomRedirects,
            redditHelper.setLibredditNormalCustomRedirects,
            r.libredditLatency,
        )
    })

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

    browser.storage.local.get("tedditLatency").then(r => {
        commonHelper.processDefaultCustomInstances(
            'teddit',
            'normal',
            redditHelper,
            document,
            redditHelper.getTedditNormalRedirectsChecks,
            redditHelper.setTedditNormalRedirectsChecks,
            redditHelper.getTedditNormalCustomRedirects,
            redditHelper.setTedditNormalCustomRedirects,
            r.tedditLatency,
        );
    })

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
            commonHelper.processDefaultCustomInstances(
                'libreddit',
                'normal',
                redditHelper,
                document,
                redditHelper.getLibredditNormalRedirectsChecks,
                redditHelper.setLibredditNormalRedirectsChecks,
                redditHelper.getLibredditNormalCustomRedirects,
                redditHelper.setLibredditNormalCustomRedirects,
                r,
            );
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
            commonHelper.processDefaultCustomInstances(
                'teddit',
                'normal',
                redditHelper,
                document,
                redditHelper.getTedditNormalRedirectsChecks,
                redditHelper.setTedditNormalRedirectsChecks,
                redditHelper.getTedditNormalCustomRedirects,
                redditHelper.setTedditNormalCustomRedirects,
                r,
            );
            latencyTedditElement.removeEventListener("click", reloadWindow);
        });
    }
);
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

redditHelper.init().then(() => {
    disableRedditElement.checked = !redditHelper.getDisableReddit();

    let frontend = redditHelper.getRedditFrontend();
    redditFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);

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
        'teddit',
        'normal',
        redditHelper,
        document,
        redditHelper.getTedditNormalRedirectsChecks,
        redditHelper.setTedditNormalRedirectsChecks,
        redditHelper.getTedditNormalCustomRedirects,
        redditHelper.setTedditNormalCustomRedirects
    );

})
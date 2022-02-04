import redditHelper from "../../../assets/javascripts/helpers/reddit.js";

let disableRedditElement = document.getElementById("disable-reddit");
disableRedditElement.addEventListener("change",
    (event) => redditHelper.setDisableReddit(!event.target.checked)
);

let redditFrontendElement = document.getElementById("reddit-frontend");
redditFrontendElement.addEventListener("change",
    (event) => redditHelper.setRedditFrontend(event.target.options[redditFrontendElement.selectedIndex].value)
);

redditHelper.init().then(() => {
    disableRedditElement.checked = !redditHelper.getDisableReddit();
    redditFrontendElement.value = redditHelper.getRedditFrontend();
})
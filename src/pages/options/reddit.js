import redditHelper from "../../assets/javascripts/helpers/reddit.js";

let disableRedditElement = document.getElementById("disable-reddit");
let redditFrontendElement = document.getElementById("reddit-frontend");

redditHelper.init().then(() => {
    disableRedditElement.checked = !redditHelper.getDisableReddit();
    redditFrontendElement.value = redditHelper.getRedditFrontend();
})

disableRedditElement.addEventListener("change",
    (event) => redditHelper.setDisableReddit(!event.target.checked)
);

redditFrontendElement.addEventListener("change",
    (event) => redditHelper.setRedditFrontend(event.target.options[redditFrontendElement.selectedIndex].value)
);
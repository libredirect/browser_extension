import reddit from "../../assets/javascripts/helpers/reddit.js";

let disableRedditElement = document.getElementById("disable-reddit");
let redditFrontendElement = document.getElementById("reddit-frontend");

disableRedditElement.checked = !reddit.getDisableReddit();
redditFrontendElement.value = reddit.getRedditFrontend();

disableRedditElement.addEventListener("change",
    (event) => reddit.setDisableReddit(!event.target.checked)
);

redditFrontendElement.addEventListener("change",
    (event) => reddit.setRedditFrontend(event.target.options[redditFrontendElement.selectedIndex].value)
);
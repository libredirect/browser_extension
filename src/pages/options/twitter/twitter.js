import twitterHelper from "../../../assets/javascripts/helpers/twitter.js";

let disableTwitterElement = document.getElementById("disable-nitter");
disableTwitterElement.addEventListener("change",
    (event) => twitterHelper.setDisableTwitter(!event.target.checked)
);

twitterHelper.init().then(() => {
    disableTwitterElement.checked = !twitterHelper.getDisableTwitter(); 
});
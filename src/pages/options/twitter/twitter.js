import twitterHelper from "../../../assets/javascripts/helpers/twitter.js";

let disableTwitterElement = document.getElementById("disable-nitter");
disableTwitterElement.addEventListener("change",
    (event) => twitterHelper.setDisableTwitter(!event.target.checked)
);

let removeTwitterSWElement = document.getElementById("remove-twitter-sw");
removeTwitterSWElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ removeTwitterSW: !event.target.checked }); // Problem
});

twitterHelper.init().then(() => {
    disableTwitterElement.checked = !twitterHelper.getDisableTwitter();
    removeTwitterSWElement.checked = !remove.getRemoveTwitterSW; // Problem
});
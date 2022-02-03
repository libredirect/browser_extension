import twitterHelper from "../../assets/javascripts/helpers/twitter.js";

let removeTwitterSWElement = document.getElementById("remove-twitter-sw");
let disableTwitterElement = document.getElementById("disable-nitter");

twitterHelper.init().then(() => {
    disableTwitterElement.checked = !twitterHelper.getDisableTwitter();
    removeTwitterSWElement.checked = !remove.getRemoveTwitterSW; // Problem
});

disableTwitterElement.addEventListener("change",
    (event) => twitterHelper.setDisableTwitter(!event.target.checked)
);

removeTwitterSWElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ removeTwitterSW: !event.target.checked }); // Problem
});

import twitterHelper from "../../assets/javascripts/helpers/twitter.js";

let removeTwitterSWElement = document.getElementById("remove-twitter-sw");
let disableNitterElement = document.getElementById("disable-nitter");

twitterHelper.init().then(() => {
    disableNitterElement.checked = !twitterHelper.getDisableNitter();
    removeTwitterSWElement.checked = !remove.getRemoveTwitterSW; // Problem
});

disableNitterElement.addEventListener("change",
    (event) => twitterHelper.setDisableNitter(!event.target.checked)
);

removeTwitterSWElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ removeTwitterSW: !event.target.checked }); // Problem
});

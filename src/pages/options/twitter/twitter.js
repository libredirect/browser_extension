import twitterHelper from "../../../assets/javascripts/helpers/twitter.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableTwitterElement = document.getElementById("disable-nitter");
disableTwitterElement.addEventListener("change",
    (event) => twitterHelper.setDisable(!event.target.checked)
);

twitterHelper.init().then(() => {
    disableTwitterElement.checked = !twitterHelper.getDisable(); 

    commonHelper.processDefaultCustomInstances(
        'nitter',
        twitterHelper,
        document,
        twitterHelper.getNitterRedirectsChecks,
        twitterHelper.setNitterRedirectsChecks,
        twitterHelper.getNitterCustomRedirects,
        twitterHelper.setNitterCustomRedirects
    )
});
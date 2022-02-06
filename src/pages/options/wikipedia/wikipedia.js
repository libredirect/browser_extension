import wikipediaHelper from "../../../assets/javascripts/helpers/wikipedia.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableWikipediaElement = document.getElementById("disable-wikipedia");
disableWikipediaElement.addEventListener("change",
    (event) => wikipediaHelper.setDisableWikipedia(!event.target.checked)
);
wikipediaHelper.init().then(() => {
    disableWikipediaElement.checked = !wikipediaHelper.getDisableWikipedia();

    commonHelper.processDefaultCustomInstances(
        'wikiless',
        wikipediaHelper,
        document,
        wikipediaHelper.getWikilessRedirectsChecks,
        wikipediaHelper.setWikilessRedirectsChecks,
        wikipediaHelper.getWikilessCustomRedirects,
        wikipediaHelper.setWikilessCustomRedirects
    )
})
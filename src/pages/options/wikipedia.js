import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";


const wikipediaInstances = wikipediaHelper.redirects;

let wikipediaInstance = document.getElementById("wikipedia-instance");

let disableWikipedia = document.getElementById("disable-wikipedia");

browser.storage.sync.get(
    [
        "wikipediaInstance",
        "disableWikipedia",
    ],
    (result) => {
        wikipediaInstance.value = result.wikipediaInstance || "";

        disableWikipedia.checked = !result.disableWikipedia;
        let id = "wikipedia-instance"
        let instances = wikipediaInstances
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

const wikipediaInstanceChange = commonHelper.debounce(() => {
    if (wikipediaInstance.checkValidity()) {
        browser.storage.sync.set({
            wikipediaInstance: shared.parseURL(wikipediaInstance.value),
        });
    }
}, 500);
wikipediaInstance.addEventListener(
    "input",
    wikipediaInstanceChange
);

disableWikipedia.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableWikipedia: !event.target.checked });
});
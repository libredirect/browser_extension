import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";


const redditInstances = redditHelper.redirects;

let redditInstanceElement = document.getElementById("reddit-instance");
let disableRedditElement = document.getElementById("disable-reddit");
let redditFrontendElement = document.getElementById("reddit-frontend");

browser.storage.sync.get(
    [
        "redditInstance",
        "disableReddit",
        "redditFrontend"
    ],
    (result) => {
        redditInstanceElement.value = result.redditInstance || "";
        disableRedditElement.checked = !result.disableReddit;
        redditFrontendElement.value = result.redditFrontend;
        let id = "reddit-instance";
        let instances = redditInstances;
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

redditInstanceElement.addEventListener("input", commonHelper.debounce(() => {
    if (redditInstanceElement.checkValidity()) {
        browser.storage.sync.set({
            redditInstance: shared.parseURL(redditInstanceElement.value),
        });
    }
}, 500));

disableRedditElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableReddit: !event.target.checked });
});

redditFrontendElement.addEventListener("change", (event) => {
    const value = event.target.options[redditFrontendElement.selectedIndex].value;
    console.info("Reddit Frontend", value)
    browser.storage.sync.set({ redditFrontend: value })
})
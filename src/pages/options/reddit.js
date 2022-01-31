import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";


const redditInstances = redditHelper.redirects;

let redditInstanceElement = document.getElementById("reddit-instance");
let disableRedditElement = document.getElementById("disable-reddit");
let redditFrontendElement = document.getElementById("reddit-frontend");

let libredditRandomPoolElement = document.getElementById("libreddit-random-pool");
let libredditRandomPoolListElement = document.getElementById("libreddit-random-pool-list");

let tedditRandomPoolElement = document.getElementById("teddit-random-pool");
let tedditRandomPoolListElement = document.getElementById("teddit-random-pool-list");

let libredditRandomPool
let tedditRandomPool

browser.storage.sync.get(
    [
        "redditInstance",
        "disableReddit",
        "redditFrontend",
        "libredditRandomPool",
        "tedditRandomPool"
    ],
    (result) => {
        redditInstanceElement.value = result.redditInstance || "";
        disableRedditElement.checked = !result.disableReddit;
        redditFrontendElement.value = result.redditFrontend;

        libredditRandomPool = result.libredditRandomPool || commonHelper.filterInstances(redditInstances.libreddit)
        libredditRandomPoolElement.value = libredditRandomPool.join("\n");
        commonHelper.updateListElement(libredditRandomPoolListElement, libredditRandomPool);

        tedditRandomPool = result.tedditRandomPool || commonHelper.filterInstances(redditInstances.teddit)
        tedditRandomPoolElement.value = tedditRandomPool.join("\n");
        commonHelper.updateListElement(tedditRandomPoolListElement, tedditRandomPool);

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
    console.info("Reddit Frontend:", value)
    browser.storage.sync.set({ redditFrontend: value })
});

libredditRandomPoolElement.addEventListener("input", commonHelper.debounce(() => {
    libredditRandomPool = commonHelper.filterList(libredditRandomPoolElement.value.split("\n"))
    commonHelper.updateListElement(libredditRandomPoolListElement, libredditRandomPool);
    browser.storage.sync.set({ libredditRandomPool: libredditRandomPool });
}, 50));

tedditRandomPoolElement.addEventListener("input", commonHelper.debounce(() => {
    tedditRandomPool = commonHelper.filterList(tedditRandomPoolElement.value.split("\n"))
    commonHelper.updateListElement(tedditRandomPoolListElement, tedditRandomPool);
    browser.storage.sync.set({ tedditRandomPool: tedditRandomPool });
}, 50));
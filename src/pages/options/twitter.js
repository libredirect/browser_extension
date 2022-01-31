import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const nitterInstances = twitterHelper.redirects;

let nitterInstanceElement = document.getElementById("nitter-instance");
let removeTwitterSWElement = document.getElementById("remove-twitter-sw");
let disableNitterElement = document.getElementById("disable-nitter");
let nitterRandomPoolElement = document.getElementById("nitter-random-pool");
let nitterRandomPoolListElement = document.getElementById('nitter-random-pool-list');

let nitterRandomPool

browser.storage.sync.get(
    [
        "nitterInstance",
        "disableNitter",
        "nitterRandomPool",
        "removeTwitterSW",
    ],
    (result) => {
        nitterInstanceElement.value = result.nitterInstance || "";
        disableNitterElement.checked = !result.disableNitter;
        removeTwitterSWElement.checked = !result.removeTwitterSW;

        nitterRandomPool = result.nitterRandomPool || commonHelper.filterInstances(nitterInstances)
        nitterRandomPoolElement.value = nitterRandomPool.join("\n");
        commonHelper.updateListElement(nitterRandomPoolListElement, nitterRandomPool);

        let id = "nitter-instance"
        let instances = nitterRandomPool
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

nitterInstanceElement.addEventListener("input", commonHelper.debounce(() => {
    if (nitterInstanceElement.checkValidity()) {
        browser.storage.sync.set({
            nitterInstance: shared.parseURL(nitterInstanceElement.value),
        });
    }
}, 500));

disableNitterElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableNitter: !event.target.checked });
});

removeTwitterSWElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ removeTwitterSW: !event.target.checked });
});

nitterRandomPoolElement.addEventListener("input", commonHelper.debounce(() => {
    nitterRandomPool = commonHelper.filterList(nitterRandomPoolElement.value.split("\n"))
    commonHelper.updateListElement(nitterRandomPoolListElement, nitterRandomPool);
    browser.storage.sync.set({ nitterRandomPool: nitterRandomPool });
}, 50));

browser.storage.onChanged.addListener((changes) => {
    if ("nitterRandomPool" in changes) {
        nitterRandomPool = changes.nitterRandomPool.newValue;
        nitterRandomPoolElement.value = nitterRandomPool.join("\n");
        commonHelper.updateListElement(nitterRandomPoolListElement, nitterRandomPool);
    }
})
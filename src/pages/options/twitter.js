import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const nitterInstances = twitterHelper.redirects;

let nitterInstanceElement = document.getElementById("nitter-instance");
let disableNitterElement = document.getElementById("disable-nitter");
let nitterRandomPoolElement = document.getElementById("nitter-random-pool");
let removeTwitterSWElement = document.getElementById("remove-twitter-sw");

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
        nitterRandomPoolElement.value = result.nitterRandomPool || commonHelper.filterInstances(nitterInstances);
        removeTwitterSWElement.checked = !result.removeTwitterSW;
        let id = "nitter-instance"
        let instances = nitterRandomPoolElement.value.split(',')
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
    browser.storage.sync.set({ nitterRandomPool: nitterRandomPoolElement.value });
}, 500));

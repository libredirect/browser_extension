import twitterHelper from "../../assets/javascripts/helpers/twitter.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const nitterInstances = twitterHelper.redirects;
let nitterInstance = document.getElementById("nitter-instance");
let disableNitter = document.getElementById("disable-nitter");
let nitterRandomPool = document.getElementById("nitter-random-pool");
let removeTwitterSW = document.getElementById("remove-twitter-sw");

browser.storage.sync.get(
    [
        "nitterInstance",
        "disableNitter",
        "nitterRandomPool",
        "removeTwitterSW",
    ],
    (result) => {
        nitterInstance.value = result.nitterInstance || "";
        disableNitter.checked = !result.disableNitter;
        nitterRandomPool.value = result.nitterRandomPool || commonHelper.filterInstances(nitterInstances);
        removeTwitterSW.checked = !result.removeTwitterSW;
        let id = "nitter-instance"
        let instances = nitterRandomPool.value.split(',')
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

const nitterInstanceChange = commonHelper.debounce(
    () => {
        if (nitterInstance.checkValidity()) {
            browser.storage.sync.set({
                nitterInstance: shared.parseURL(nitterInstance.value),
            });
        }
    },
    500)
nitterInstance.addEventListener("input", nitterInstanceChange);


disableNitter.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableNitter: !event.target.checked });
});

removeTwitterSW.addEventListener("change", (event) => {
    browser.storage.sync.set({ removeTwitterSW: !event.target.checked });
});

const nitterRandomPoolChange = commonHelper.debounce(() => {
    browser.storage.sync.set({ nitterRandomPool: nitterRandomPool.value });
}, 500);
nitterRandomPool.addEventListener("input", nitterRandomPoolChange);

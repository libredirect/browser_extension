import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";


const wikilessInstances = wikipediaHelper.redirects;

let wikipediaInstanceElement = document.getElementById("wikipedia-instance");
let disableWikipediaElement = document.getElementById("disable-wikipedia");
let wikilessRandomPoolElement = document.getElementById("wikiless-random-pool");
let wikilessRandomPoolListElement = document.getElementById('wikiless-random-pool-list');

let wikilessRandomPool

browser.storage.sync.get(
    [
        "wikipediaInstance",
        "disableWikipedia",
        "wikilessRandomPool"
    ],
    (result) => {
        wikipediaInstanceElement.value = result.wikipediaInstance || "";
        disableWikipediaElement.checked = !result.disableWikipedia;

        wikilessRandomPool = result.wikilessRandomPool || commonHelper.filterInstances(wikilessInstances)
        wikilessRandomPoolElement.value = wikilessRandomPool.join("\n")
        commonHelper.updateListElement(wikilessRandomPoolListElement, wikilessRandomPool);

        let id = "wikipedia-instance";
        let instances = wikilessInstances;
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

wikipediaInstanceElement.addEventListener("input", commonHelper.debounce(() => {
    if (wikipediaInstanceElement.checkValidity()) {
        browser.storage.sync.set({
            wikipediaInstance: shared.parseURL(wikipediaInstanceElement.value),
        });
    }
}, 500));

disableWikipediaElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableWikipedia: !event.target.checked });
});

wikilessRandomPoolElement.addEventListener("input", commonHelper.debounce(() => {
    wikilessRandomPool = commonHelper.filterList(wikilessRandomPoolElement.value.split("\n"))
    commonHelper.updateListElement(wikilessRandomPoolListElement, wikilessRandomPool);
    browser.storage.sync.set({ wikilessRandomPool: wikilessRandomPool });
}, 50));


browser.storage.onChanged.addListener((changes) => {
    if ("wikilessRandomPool" in changes) {
        console.info("Wikiless updating");
        console.info(changes.wikilessRandomPool.newValue)
        wikilessRandomPool = changes.wikilessRandomPool.newValue;
        wikilessRandomPoolElement.value = wikilessRandomPool.join("\n");
        commonHelper.updateListElement(wikilessRandomPoolListElement, wikilessRandomPool);
    }
})
import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";


const bibliogramInstances = instagramHelper.redirects;

let bibliogramInstanceElement = document.getElementById("bibliogram-instance");
let disableBibliogramElement = document.getElementById("disable-bibliogram");
let bibliogramRandomPoolElement = document.getElementById("bibliogram-random-pool");
let bibliogramRandomPoolListElement = document.getElementById("bibliogram-random-pool-list");

let bibliogramRandomPool;

browser.storage.sync.get(
    [
        "bibliogramInstance",
        "disableBibliogram",
        "bibliogramRandomPool",
    ],
    (result) => {
        bibliogramInstanceElement.value = result.bibliogramInstance || "";
        disableBibliogramElement.checked = !result.disableBibliogram;


        bibliogramRandomPool = result.bibliogramRandomPool || commonHelper.filterInstances(bibliogramInstances)
        bibliogramRandomPoolElement.value = bibliogramRandomPool.join("\n");
        commonHelper.updateListElement(bibliogramRandomPoolListElement, bibliogramRandomPool);
        let id = "bibliogram-instance";
        let instances = bibliogramRandomPoolElement.value.split(',')
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

bibliogramInstanceElement.addEventListener("input", commonHelper.debounce(() => {
    if (bibliogramInstanceElement.checkValidity())
        browser.storage.sync.set({ bibliogramInstance: shared.parseURL(bibliogramInstanceElement.value) });
}, 500));

disableBibliogramElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableBibliogram: !event.target.checked });
});

bibliogramRandomPoolElement.addEventListener("input", commonHelper.debounce(() => {
    bibliogramRandomPool = commonHelper.filterList(bibliogramRandomPoolElement.value.split("\n"))
    commonHelper.updateListElement(bibliogramRandomPoolListElement, bibliogramRandomPool);
    browser.storage.sync.set({ bibliogramRandomPool: bibliogramRandomPool });
}, 50));


browser.storage.onChanged.addListener((changes) => {
    if ("bibliogramRandomPool" in changes) {
        bibliogramRandomPool = changes.bibliogramRandomPool.newValue;
        bibliogramRandomPoolElement.value = bibliogramRandomPool.join("\n");
        commonHelper.updateListElement(bibliogramRandomPoolListElement, bibliogramRandomPool);
    }
})
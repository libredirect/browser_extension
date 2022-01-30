import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";


const bibliogramInstances = instagramHelper.redirects;

let bibliogramInstanceElement = document.getElementById("bibliogram-instance");
let disableBibliogramElement = document.getElementById("disable-bibliogram");
let bibliogramRandomPoolElement = document.getElementById("bibliogram-random-pool");

browser.storage.sync.get(
    [
        "bibliogramInstance",
        "disableBibliogram",
        "bibliogramRandomPool",
    ],
    (result) => {
        bibliogramInstanceElement.value = result.bibliogramInstance || "";
        disableBibliogramElement.checked = !result.disableBibliogram;
        bibliogramRandomPoolElement.value = result.bibliogramRandomPool || commonHelper.filterInstances(bibliogramInstances);
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
    browser.storage.sync.set({ bibliogramRandomPool: bibliogramRandomPoolElement.value });
}, 500));


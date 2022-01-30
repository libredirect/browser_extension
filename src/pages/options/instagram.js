import instagramHelper from "../../assets/javascripts/helpers/instagram.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";


const bibliogramInstances = instagramHelper.redirects;

let bibliogramInstance = document.getElementById("bibliogram-instance");
let disableBibliogram = document.getElementById("disable-bibliogram");
let bibliogramRandomPool = document.getElementById("bibliogram-random-pool");

browser.storage.sync.get(
    [
        "bibliogramInstance",
        "disableBibliogram",
        "bibliogramRandomPool",
    ],
    (result) => {
        bibliogramInstance.value = result.bibliogramInstance || "";
        disableBibliogram.checked = !result.disableBibliogram;
        bibliogramRandomPool.value = result.bibliogramRandomPool || commonHelper.filterInstances(bibliogramInstances);
        let id = "bibliogram-instance";
        let instances = bibliogramRandomPool.value.split(',')
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

const bibliogramInstanceChange = commonHelper.debounce(() => {
    if (bibliogramInstance.checkValidity()) {
        browser.storage.sync.set({
            bibliogramInstance: shared.parseURL(bibliogramInstance.value),
        });
    }
}, 500);
bibliogramInstance.addEventListener("input", bibliogramInstanceChange);

disableBibliogram.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableBibliogram: !event.target.checked });
});

const bibliogramRandomPoolChange = commonHelper.debounce(() => {
    browser.storage.sync.set({
        bibliogramRandomPool: bibliogramRandomPool.value,
    });
}, 500);
bibliogramRandomPool.addEventListener("input", bibliogramRandomPoolChange);


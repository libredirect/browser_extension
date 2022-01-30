import mediumHelper from "../../assets/javascripts/helpers/medium.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const scribeInstances = mediumHelper.redirects;

let scribeInstanceElement = document.getElementById("scribe-instance");
let disableScribeElement = document.getElementById("disable-scribe");
let scribeRandomPoolElement = document.getElementById("scribe-random-pool");

browser.storage.sync.get(
    [
        "disableScribe",
        "scribeInstance",
        "scribeRandomPool",
    ],
    (result) => {
        scribeInstanceElement.value = result.scribeInstance || "";
        disableScribeElement.checked = !result.disableScribe;
        scribeRandomPoolElement.value = (result.scribeRandomPool || commonHelper.filterInstances(scribeInstances)).join("\n");
        let id = "scribe-instance";
        let instances = scribeRandomPoolElement.value.split(',')
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

disableScribeElement.addEventListener("change", (event) => {
    console.info("isScibeEnabled:", event.target.checked)
    browser.storage.sync.set({ disableScribe: !event.target.checked });
});

scribeInstanceElement.addEventListener("input", commonHelper.debounce(() => {
    if (scribeInstanceElement.checkValidity()) {
        console.info("selectedScribeInstance", scribeInstanceElement.value);
        browser.storage.sync.set({
            scribeInstance: shared.parseURL(scribeInstanceElement.value)
        });
    }
}, 500));

scribeRandomPoolElement.addEventListener("input", commonHelper.debounce(() => {
    browser.storage.sync.set({
        scribeRandomPool: scribeRandomPoolElement.value.split('\n')
    });
}, 500));
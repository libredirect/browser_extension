import mediumHelper from "../../assets/javascripts/helpers/medium.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const scribeInstances = mediumHelper.redirects;

let scribeInstance = document.getElementById("scribe-instance");
let disableScribe = document.getElementById("disable-scribe");
let scribeRandomPool = document.getElementById("scribe-random-pool");


browser.storage.sync.get(
    [
        "disableScribe",
        "scribeInstance",
        "scribeRandomPool",
    ],
    (result) => {
        scribeInstance.value = result.scribeInstance || "";
        disableScribe.checked = !result.disableScribe;
        scribeRandomPool.value = result.scribeRandomPool || commonHelper.filterInstances(scribeInstances);
        let id = "scribe-instance";
        let instances = scribeRandomPool.value.split(',')
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

disableScribe.addEventListener(
    "change",
    (event) => {
        console.info("isScibeEnabled:", event.target.checked)
        browser.storage.sync.set({
            disableScribe: !event.target.checked
        });
    }
);

const scribeInstanceChange = commonHelper.debounce(
    () => {
        if (scribeInstance.checkValidity()) {
            console.info("selectedScribeInstance", scribeInstance.value);
            browser.storage.sync.set({
                scribeInstance: shared.parseURL(scribeInstance.value)
            });
        }
    },
    500
);

scribeInstance.addEventListener("input", scribeInstanceChange);

const scribeRandomPoolChange = commonHelper.debounce(
    () => {
        browser.storage.sync.set({
            scribeRandomPool: scribeRandomPool.value
        });
    },
    500
);
scribeRandomPool.addEventListener("input", scribeRandomPoolChange);
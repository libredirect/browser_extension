import googleTranslateHelper from "../../assets/javascripts/helpers/google-translate.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const simplyTranslateInstances = googleTranslateHelper.redirects;
let simplyTranslateInstance = document.getElementById("simplyTranslate-instance");
let disableSimplyTranslate = document.getElementById("disable-simplyTranslate");


browser.storage.sync.get(
    [
        "simplyTranslateInstance",
        "disableSimplyTranslate",
    ],
    (result) => {

        simplyTranslateInstance.value = result.simplyTranslateInstance || "";
        disableSimplyTranslate.checked = !result.disableSimplyTranslate;
        let id = "simplyTranslate-instance"
        let instances = simplyTranslateInstances;
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

const simplyTranslateInstanceChange = commonHelper.debounce(() => {
    if (simplyTranslateInstance.checkValidity()) {
        browser.storage.sync.set({
            simplyTranslateInstance: shared.parseURL(simplyTranslateInstance.value),
        });
    }
}, 500);
simplyTranslateInstance.addEventListener(
    "input",
    simplyTranslateInstanceChange
);



disableSimplyTranslate.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableSimplyTranslate: !event.target.checked });
});
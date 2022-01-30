import googleTranslateHelper from "../../assets/javascripts/helpers/google-translate.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const simplyTranslateInstances = googleTranslateHelper.redirects;

let simplyTranslateInstanceElement = document.getElementById("simplyTranslate-instance");
let disableSimplyTranslateElement = document.getElementById("disable-simplyTranslate");


browser.storage.sync.get(
    [
        "simplyTranslateInstance",
        "disableSimplyTranslate",
    ],
    (result) => {
        simplyTranslateInstanceElement.value = result.simplyTranslateInstance || "";
        disableSimplyTranslateElement.checked = !result.disableSimplyTranslate;
        let id = "simplyTranslate-instance"
        let instances = simplyTranslateInstances;
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

simplyTranslateInstanceElement.addEventListener(
    "input",
    commonHelper.debounce(() => {
        if (simplyTranslateInstanceElement.checkValidity()) {
            browser.storage.sync.set({
                simplyTranslateInstance: shared.parseURL(simplyTranslateInstanceElement.value),
            });
        }
    }, 500));

disableSimplyTranslateElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableSimplyTranslate: !event.target.checked });
});
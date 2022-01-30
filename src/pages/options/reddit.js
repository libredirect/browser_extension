import redditHelper from "../../assets/javascripts/helpers/reddit.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";


const redditInstances = redditHelper.redirects;

let redditInstance = document.getElementById("reddit-instance");
let disableReddit = document.getElementById("disable-reddit");
let redditFrontend = document.getElementById("reddit-frontend");

browser.storage.sync.get(
    [
        "redditInstance",
        "disableReddit",
        "redditFrontend"
    ],
    (result) => {
        redditInstance.value = result.redditInstance || "";
        disableReddit.checked = !result.disableReddit;
        redditFrontend.value = result.redditFrontend;
        let id = "reddit-instance";
        let instances = redditInstances;
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

const redditInstanceChange = commonHelper.debounce(
    () => {
        if (redditInstance.checkValidity()) {
            browser.storage.sync.set({
                redditInstance: shared.parseURL(redditInstance.value),
            });
        }
    },
    500
);

redditInstance.addEventListener("input", redditInstanceChange);

disableReddit.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableReddit: !event.target.checked });
});

redditFrontend.addEventListener("change", (event) => {
    const value = event.target.options[redditFrontend.selectedIndex].value;
    console.info("Reddit Frontend", value)
    browser.storage.sync.set({
        redditFrontend: value,
    })
})
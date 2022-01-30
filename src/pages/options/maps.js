import mapsHelper from "../../assets/javascripts/helpers/google-maps.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";



const osmInstances = mapsHelper.redirects;
let osmInstance = document.getElementById("osm-instance");
let disableOsm = document.getElementById("disable-osm");

browser.storage.sync.get(
    [
        "osmInstance",
        "disableOsm",
    ],
    (result) => {
        osmInstance.value = result.osmInstance || "";
        disableOsm.checked = !result.disableOsm;
        let id = "osm-instance"
        let instances = osmInstances
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

const osmInstanceChange = commonHelper.debounce(() => {
    if (osmInstance.checkValidity()) {
        browser.storage.sync.set({
            osmInstance: shared.parseURL(osmInstance.value),
        });
    }
}, 500);
osmInstance.addEventListener("input", osmInstanceChange);



disableOsm.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableOsm: !event.target.checked });
});
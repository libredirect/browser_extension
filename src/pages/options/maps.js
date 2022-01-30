import mapsHelper from "../../assets/javascripts/helpers/google-maps.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const osmInstances = mapsHelper.redirects;

let osmInstanceElement = document.getElementById("osm-instance");
let disableOsmElement = document.getElementById("disable-osm");

browser.storage.sync.get(
    [
        "osmInstance",
        "disableOsm",
    ],
    (result) => {
        osmInstanceElement.value = result.osmInstance || "";
        disableOsmElement.checked = !result.disableOsm;
        let id = "osm-instance"
        let instances = osmInstances
        shared.autocompletes.push({ id: id, instances: instances })
        shared.autocomplete(document.getElementById(id), instances);
    }
)

osmInstanceElement.addEventListener("input", commonHelper.debounce(() => {
    if (osmInstanceElement.checkValidity())
        browser.storage.sync.set({ osmInstance: shared.parseURL(osmInstanceElement.value) });
}, 500));

disableOsmElement.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableOsm: !event.target.checked });
});
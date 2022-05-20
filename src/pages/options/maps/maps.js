import mapsHelper from "../../../assets/javascripts/helpers/maps.js";
import utils from "../../../assets/javascripts/helpers/utils.js";

const disable = document.getElementById("disable-osm");
const frontend = document.getElementById("maps-frontend");

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableMaps: !disable.checked,
        mapsFrontend: frontend.value,
    })
    changeFrontendsSettings();
})

const facilDiv = document.getElementById("facil")
function changeFrontendsSettings() {
    if (frontend.value == 'facil') facilDiv.style.display = 'block';
    else if (frontend.value == 'osm') facilDiv.style.display = 'none';
}

browser.storage.local.get(
    [
        "disableMaps",
        "mapsFrontend",
    ],
    r => {
        disable.checked = !r.disableMaps;
        frontend.value = r.mapsFrontend;
        changeFrontendsSettings();
    }
)
utils.processDefaultCustomInstances('maps', 'facil', 'normal', document);
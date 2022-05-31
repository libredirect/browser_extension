import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("maps-enable");
const frontend = document.getElementById("maps-frontend");

const maps = document.getElementById('maps_page');
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
        enable.checked = !r.disableMaps;
        frontend.value = r.mapsFrontend;
        changeFrontendsSettings();
    }
)

maps.addEventListener("change", () => {
    changeFrontendsSettings();
    browser.storage.local.set({
        disableMaps: !enable.checked,
        mapsFrontend: frontend.value,
    })
})

utils.processDefaultCustomInstances('maps', 'facil', 'normal', document);
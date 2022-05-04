import mapsHelper from "../../../assets/javascripts/helpers/maps.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableMapsElement = document.getElementById("disable-osm");
let mapsFrontendElement = document.getElementById("maps-frontend");

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableMaps: !disableMapsElement.checked,
        mapsFrontend: mapsFrontendElement.value,
    })
    changeFrontendsSettings(mapsFrontendElement.value);
})

let facilDivElement = document.getElementById("facil")
function changeFrontendsSettings(frontend) {
    if (frontend == 'facil') {
        facilDivElement.style.display = 'block';
    }
    else if (frontend == 'osm') {
        facilDivElement.style.display = 'none';
    }
}
browser.storage.local.get(
    [
        "disableMaps",
        "mapsFrontend",
    ],
    r => {
        disableMapsElement.checked = !r.disableMaps;
        mapsFrontendElement.value = r.mapsFrontend;
        changeFrontendsSettings(r.mapsFrontend);
    }
)
commonHelper.processDefaultCustomInstances('maps', 'facil', 'normal', document);

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await mapsHelper.init();
        let redirects = mapsHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.facil.normal).then(r => {
            browser.storage.local.set({ facilLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('maps', 'facil', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
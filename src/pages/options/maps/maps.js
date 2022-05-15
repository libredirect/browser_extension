import mapsHelper from "../../../assets/javascripts/helpers/maps.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

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
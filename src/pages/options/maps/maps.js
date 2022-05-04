import mapsHelper from "../../../assets/javascripts/helpers/maps.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableMapsElement = document.getElementById("disable-osm");
disableMapsElement.addEventListener("change",
    (event) => mapsHelper.setDisable(!event.target.checked)
);

let mapsFrontendElement = document.getElementById("maps-frontend");
mapsFrontendElement.addEventListener("change",
    event => {
        let frontend = event.target.options[mapsFrontendElement.selectedIndex].value;
        mapsHelper.setFrontend(frontend);
        changeFrontendsSettings(frontend);
    }
);

let facilDivElement = document.getElementById("facil")
function changeFrontendsSettings(frontend) {
    if (frontend == 'facil') {
        facilDivElement.style.display = 'block';
    }
    else if (frontend == 'osm') {
        facilDivElement.style.display = 'none';
    }
}

mapsHelper.init().then(() => {
    console.log(mapsHelper.getFacilNormalRedirectsChecks())
    disableMapsElement.checked = !mapsHelper.getDisable();
    let frontend = mapsHelper.getFrontend();
    mapsFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);

    browser.storage.local.get("facilLatency").then(r => {
        commonHelper.processDefaultCustomInstances('facil', 'normal', mapsHelper, document, r.facilLatency)
    })
})

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
            commonHelper.processDefaultCustomInstances('facil', 'normal', mapsHelper, document);
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
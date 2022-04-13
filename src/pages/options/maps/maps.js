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

    commonHelper.processDefaultCustomInstances(
        'facil',
        'normal',
        mapsHelper,
        document,
        mapsHelper.getFacilNormalRedirectsChecks,
        mapsHelper.setFacilNormalRedirectsChecks,
        mapsHelper.getFacilNormalCustomRedirects,
        mapsHelper.setFacilNormalCustomRedirects
    )
})
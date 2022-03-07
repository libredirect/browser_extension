import mapsHelper from "../../../assets/javascripts/helpers/maps.js";

let disableMapsElement = document.getElementById("disable-osm");
disableMapsElement.addEventListener("change",
    (event) => mapsHelper.setDisable(!event.target.checked)
);

let mapsFrontendElement = document.getElementById("maps-frontend");
mapsFrontendElement.addEventListener("change",
    event => {
        let frontend = event.target.options[mapsFrontendElement.selectedIndex].value;
        mapsHelper.setFrontend(frontend);
    }
);

mapsHelper.init().then(() => {
    disableMapsElement.checked = !mapsHelper.getDisable();
    let frontend = mapsHelper.getFrontend();
    mapsFrontendElement.value = frontend;
})
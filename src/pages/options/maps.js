import mapsHelper from "../../assets/javascripts/helpers/maps.js";

let disableOsmElement = document.getElementById("disable-osm");

mapsHelper.init().then(() => {
    disableOsmElement.checked = !mapsHelper.getDisableOsm();
})

disableOsmElement.addEventListener("change",
    (event) => mapsHelper.setDisableOsm(!event.target.checked)
);
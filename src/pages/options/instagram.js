import instagramHelper from "../../assets/javascripts/helpers/instagram.js";

let disableBibliogramElement = document.getElementById("disable-bibliogram");

disableBibliogramElement.checked = !instagramHelper.getDisableBibliogram();

disableBibliogramElement.addEventListener("change",
    (event) => instagramHelper.setDisableBibliogram(!event.target.checked)
);
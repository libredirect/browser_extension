import mediumHelper from "../../assets/javascripts/helpers/medium.js";

let disableScribeElement = document.getElementById("disable-scribe");

mediumHelper.init().then(() => {
    disableScribeElement.checked = !mediumHelper.getDisableScribe();
})

disableScribeElement.addEventListener("change",
    (event) => mediumHelper.setDisableScribe(!event.target.checked)
);

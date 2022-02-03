import mediumHelper from "../../assets/javascripts/helpers/medium.js";

let disableMediumElement = document.getElementById("disable-scribe");

mediumHelper.init().then(() => {
    disableMediumElement.checked = !mediumHelper.getDisableMedium();
})

disableMediumElement.addEventListener("change",
    (event) => mediumHelper.setDisableMedium(!event.target.checked)
);

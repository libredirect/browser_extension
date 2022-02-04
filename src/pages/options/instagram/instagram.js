import instagramHelper from "../../../assets/javascripts/helpers/instagram.js";

let disableInstagramElement = document.getElementById("disable-bibliogram");
disableInstagramElement.addEventListener("change",
    (event) => instagramHelper.setDisableInstagram(!event.target.checked)
);

instagramHelper.init().then(() => {
    disableInstagramElement.checked = !instagramHelper.getDisableInstagram();
})
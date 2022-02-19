import imgurHelper from "../../../assets/javascripts/helpers/imgur.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableImgurElement = document.getElementById("disable-imgur");
disableImgurElement.addEventListener("change",
    (event) => imgurHelper.setDisable(!event.target.checked)
);

imgurHelper.init().then(() => {
    disableImgurElement.checked = !imgurHelper.getDisable();

    commonHelper.processDefaultCustomInstances(
        'rimgo',
        'normal',
        imgurHelper,
        document,
        imgurHelper.getRimgoRedirectsChecks,
        imgurHelper.setRimgoRedirectsChecks,
        imgurHelper.getRimgoCustomRedirects,
        imgurHelper.setRimgoCustomRedirects
    )
})
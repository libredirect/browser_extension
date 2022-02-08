import imgurHelper from "../../../assets/javascripts/helpers/imgur.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableImgurElement = document.getElementById("disable-imgur");
disableImgurElement.addEventListener("change",
    (event) => imgurHelper.setDisableImgur(!event.target.checked)
);

imgurHelper.init().then(() => {
    disableImgurElement.checked = !imgurHelper.getDisableImgur();

    commonHelper.processDefaultCustomInstances(
        'rimgo',
        imgurHelper,
        document,
        imgurHelper.getRimgoRedirectsChecks,
        imgurHelper.setRimgoRedirectsChecks,
        imgurHelper.getRimgoCustomRedirects,
        imgurHelper.setRimgoCustomRedirects
    )
})
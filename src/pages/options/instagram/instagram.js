import instagramHelper from "../../../assets/javascripts/helpers/instagram.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableInstagramElement = document.getElementById("disable-bibliogram");
disableInstagramElement.addEventListener("change",
    (event) => instagramHelper.setDisableInstagram(!event.target.checked)
);

instagramHelper.init().then(() => {
    disableInstagramElement.checked = !instagramHelper.getDisableInstagram();

    commonHelper.processDefaultCustomInstances(
        'bibliogram',
        instagramHelper,
        document,
        instagramHelper.getBibliogramRedirectsChecks,
        instagramHelper.setBibliogramRedirectsChecks,
        instagramHelper.getBibliogramCustomRedirects,
        instagramHelper.setBibliogramCustomRedirects
    )
})
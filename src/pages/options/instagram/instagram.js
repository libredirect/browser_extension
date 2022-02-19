import instagramHelper from "../../../assets/javascripts/helpers/instagram.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableInstagramElement = document.getElementById("disable-bibliogram");
disableInstagramElement.addEventListener("change",
    (event) => instagramHelper.setDisable(!event.target.checked)
);

instagramHelper.init().then(() => {
    disableInstagramElement.checked = !instagramHelper.getDisable();

    commonHelper.processDefaultCustomInstances(
        'bibliogram',
        'normal',
        instagramHelper,
        document,
        instagramHelper.getBibliogramRedirectsChecks,
        instagramHelper.setBibliogramRedirectsChecks,
        instagramHelper.getBibliogramCustomRedirects,
        instagramHelper.setBibliogramCustomRedirects
    )
})
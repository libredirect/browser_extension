import mediumHelper from "../../../assets/javascripts/helpers/medium.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableMediumElement = document.getElementById("disable-medium");
disableMediumElement.addEventListener("change",
    (event) => mediumHelper.setDisable(!event.target.checked)
);

mediumHelper.init().then(() => {
    disableMediumElement.checked = !mediumHelper.getDisable();

    commonHelper.processDefaultCustomInstances(
        'scribe',
        'normal',
        mediumHelper,
        document,
        mediumHelper.getScribeNormalRedirectsChecks,
        mediumHelper.setScribeNormalRedirectsChecks,
        mediumHelper.getScribeNormalCustomRedirects,
        mediumHelper.setScribeNormalCustomRedirects
    )
})
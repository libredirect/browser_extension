import mediumHelper from "../../../assets/javascripts/helpers/medium.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableMediumElement = document.getElementById("disable-medium");
disableMediumElement.addEventListener("change",
    (event) => mediumHelper.setDisableMedium(!event.target.checked)
);

mediumHelper.init().then(() => {
    disableMediumElement.checked = !mediumHelper.getDisableMedium();

    commonHelper.processDefaultCustomInstances(
        'scribe',
        mediumHelper,
        document,
        mediumHelper.getScribeRedirectsChecks,
        mediumHelper.setScribeRedirectsChecks,
        mediumHelper.getScribeCustomRedirects,
        mediumHelper.setScribeCustomRedirects
    )
})
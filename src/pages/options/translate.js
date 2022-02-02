import googleTranslateHelper from "../../assets/javascripts/helpers/google-translate.js";

let disableSimplyTranslateElement = document.getElementById("disable-simplyTranslate");
let translateFrontendElement = document.getElementById("translate-frontend");


googleTranslateHelper.init().then(() => {
    disableSimplyTranslateElement.checked = !googleTranslateHelper.getDisableSimplyTranslate();
    translateFrontendElement.value = googleTranslateHelper.getFrontend();
});

disableSimplyTranslateElement.addEventListener("change",
    (event) => googleTranslateHelper.setDisableSimplyTranslate(!event.target.checked)
);

translateFrontendElement.addEventListener("change",
    (event) => googleTranslateHelper.setFrontend(event.target.options[translateFrontendElement.selectedIndex].value)
);

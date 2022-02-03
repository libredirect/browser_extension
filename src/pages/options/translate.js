import googleTranslateHelper from "../../assets/javascripts/helpers/translate.js";

let disableTranslateElement = document.getElementById("disable-simplyTranslate");
let translateFrontendElement = document.getElementById("translate-frontend");


googleTranslateHelper.init().then(() => {
    disableTranslateElement.checked = !googleTranslateHelper.getDisableTranslate();
    translateFrontendElement.value = googleTranslateHelper.getFrontend();
});

disableTranslateElement.addEventListener("change",
    (event) => googleTranslateHelper.setDisableTranslate(!event.target.checked)
);

translateFrontendElement.addEventListener("change",
    (event) => googleTranslateHelper.setFrontend(event.target.options[translateFrontendElement.selectedIndex].value)
);

import translateHelper from "../../../assets/javascripts/helpers/translate.js";

let disableTranslateElement = document.getElementById("disable-simplyTranslate");
disableTranslateElement.addEventListener("change",
    (event) => translateHelper.setDisableTranslate(!event.target.checked)
);

let translateFrontendElement = document.getElementById("translate-frontend");
translateFrontendElement.addEventListener("change",
    (event) => translateHelper.setFrontend(event.target.options[translateFrontendElement.selectedIndex].value)
);

translateHelper.init().then(() => {
    disableTranslateElement.checked = !translateHelper.getDisableTranslate();
    translateFrontendElement.value = translateHelper.getFrontend();
});
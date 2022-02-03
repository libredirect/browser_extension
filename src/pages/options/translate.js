import translateHelper from "../../assets/javascripts/helpers/translate.js";

let disableTranslateElement = document.getElementById("disable-simplyTranslate");
let translateFrontendElement = document.getElementById("translate-frontend");


translateHelper.init().then(() => {
    disableTranslateElement.checked = !translateHelper.getDisableTranslate();
    translateFrontendElement.value = translateHelper.getFrontend();
});

disableTranslateElement.addEventListener("change",
    (event) => translateHelper.setDisableTranslate(!event.target.checked)
);

translateFrontendElement.addEventListener("change",
    (event) => translateHelper.setFrontend(event.target.options[translateFrontendElement.selectedIndex].value)
);

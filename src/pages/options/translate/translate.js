import translateHelper from "../../../assets/javascripts/helpers/translate.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableTranslateElement = document.getElementById("disable-simplyTranslate");
disableTranslateElement.addEventListener("change",
    (event) => translateHelper.setDisableTranslate(!event.target.checked)
);


let simplyTranslateDivElement = document.getElementById("simplyTranslate")
let lingvaDivElement = document.getElementById("lingva")


function changeFrontendsSettings(frontend) {
    if (frontend == 'simplyTranslate') {
        simplyTranslateDivElement.style.display = 'block';
        lingvaDivElement.style.display = 'none';
    }
    else if (frontend == 'lingva') {
        simplyTranslateDivElement.style.display = 'none';
        lingvaDivElement.style.display = 'block';
    }
}
let translateFrontendElement = document.getElementById("translate-frontend");
translateFrontendElement.addEventListener("change",
    (event) => {
        let frontend = event.target.options[translateFrontendElement.selectedIndex].value
        translateHelper.setFrontend(frontend)
        changeFrontendsSettings(frontend);
    }
);

translateHelper.init().then(() => {
    disableTranslateElement.checked = !translateHelper.getDisableTranslate();
    let frontend = translateHelper.getFrontend();
    translateFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);

    commonHelper.processDefaultCustomInstances(
        'simplyTranslate',
        translateHelper,
        document,
        translateHelper.getSimplyTranslateRedirectsChecks,
        translateHelper.setSimplyTranslateRedirectsChecks,
        translateHelper.getSimplyTranslateCustomRedirects,
        translateHelper.setSimplyTranslateCustomRedirects
    )

    commonHelper.processDefaultCustomInstances(
        'lingva',
        translateHelper,
        document,
        translateHelper.getLingvaRedirectsChecks,
        translateHelper.setLingvaRedirectsChecks,
        translateHelper.getLingvaCustomRedirects,
        translateHelper.setLingvaCustomRedirects
    )
});
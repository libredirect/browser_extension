import translateHelper from "../../../assets/javascripts/helpers/translate.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableElement = document.getElementById("disable-simplyTranslate");
disableElement.addEventListener("change",
    (event) => translateHelper.setDisable(!event.target.checked)
);

let simplyTranslateLingvaDivElement = document.getElementById("simplyTranslate-lingva")
let simplyTranslateDivElement = document.getElementById("simplyTranslate")
let lingvaDivElement = document.getElementById("lingva")


function changeFrontendsSettings(frontend) {
    if (frontend == 'simplyTranslate') {
        simplyTranslateLingvaDivElement.style.display = 'block';
        simplyTranslateDivElement.style.display = 'block';
        lingvaDivElement.style.display = 'none';
    }
    else if (frontend == 'lingva') {
        simplyTranslateLingvaDivElement.style.display = 'block';
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

let fromElement = document.getElementById("from");
fromElement.addEventListener("change",
    (event) => {
        let from = event.target.options[fromElement.selectedIndex].value;
        translateHelper.setFrom(from);
    }
);

let toElement = document.getElementById("to");
toElement.addEventListener("change",
    (event) => {
        let to = event.target.options[toElement.selectedIndex].value;
        translateHelper.setTo(to);
    }
);

translateHelper.init().then(() => {
    disableElement.checked = !translateHelper.getDisable();
    let frontend = translateHelper.getFrontend();
    translateFrontendElement.value = frontend;
    changeFrontendsSettings(frontend);
    fromElement.value = translateHelper.getFrom();
    toElement.value = translateHelper.getTo();

    commonHelper.processDefaultCustomInstances(
        'simplyTranslate',
        'normal',
        translateHelper,
        document,
        translateHelper.getSimplyTranslateNormalRedirectsChecks,
        translateHelper.setSimplyTranslateNormalRedirectsChecks,
        translateHelper.getSimplyTranslateNormalCustomRedirects,
        translateHelper.setSimplyTranslateNormalCustomRedirects
    )

    commonHelper.processDefaultCustomInstances(
        'lingva',
        'normal',
        translateHelper,
        document,
        translateHelper.getLingvaNormalRedirectsChecks,
        translateHelper.setLingvaNormalRedirectsChecks,
        translateHelper.getLingvaNormalCustomRedirects,
        translateHelper.setLingvaNormalCustomRedirects
    )
});
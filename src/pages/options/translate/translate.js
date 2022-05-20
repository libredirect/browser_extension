import translateHelper from "../../../assets/javascripts/helpers/translate/translate.js";
import utils from "../../../assets/javascripts/helpers/utils.js";

let disable = document.getElementById("disable-simplyTranslate");
let simplyTranslateDiv = document.getElementById("simplyTranslate");
let lingvaDiv = document.getElementById("lingva");
let frontend = document.getElementById("translate-frontend");
let protocol = document.getElementById("protocol");


function changeFrontendsSettings() {
    if (frontend.value == 'simplyTranslate') {
        simplyTranslateDiv.style.display = 'block';
        lingvaDiv.style.display = 'none';
    }
    else if (frontend.value == 'lingva') {
        simplyTranslateDiv.style.display = 'none';
        lingvaDiv.style.display = 'block';
    }
}

function changeProtocolSettings() {
    let normalSimplyTranslateDiv = document.getElementById("simplyTranslate").getElementsByClassName("normal")[0];
    let torSimplyTranslateDiv = document.getElementById("simplyTranslate").getElementsByClassName("tor")[0];

    let normalLingvaDiv = document.getElementById("lingva").getElementsByClassName("normal")[0];
    let torLingvaDiv = document.getElementById("lingva").getElementsByClassName("tor")[0];

    if (protocol.value == 'normal') {
        normalSimplyTranslateDiv.style.display = 'block';
        normalLingvaDiv.style.display = 'block';
        torLingvaDiv.style.display = 'none';
        torSimplyTranslateDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalSimplyTranslateDiv.style.display = 'none';
        normalLingvaDiv.style.display = 'none';
        torLingvaDiv.style.display = 'block';
        torSimplyTranslateDiv.style.display = 'block';
    }
}

browser.storage.local.get(
    [
        "translateDisable",
        "translateFrontend",
        "translateProtocol",
    ],
    r => {
        disable.checked = !r.translateDisable;
        frontend.value = r.translateFrontend;
        protocol.value = r.translateProtocol;
        changeFrontendsSettings();
        changeProtocolSettings();
    }
);

document.addEventListener("change", () => {
    browser.storage.local.set({
        translateDisable: !disable.checked,
        translateFrontend: frontend.value,
        translateProtocol: protocol.value,
    })
    changeProtocolSettings();
    changeFrontendsSettings();
})


utils.processDefaultCustomInstances('translate', 'simplyTranslate', 'normal', document)
utils.processDefaultCustomInstances('translate', 'simplyTranslate', 'tor', document);
utils.processDefaultCustomInstances('translate', 'lingva', 'normal', document);
utils.processDefaultCustomInstances('translate', 'lingva', 'tor', document);

utils.latency('translate', 'simplyTranslate', document, location, true)
utils.latency('translate', 'lingva', document, location, true)
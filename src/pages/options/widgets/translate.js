import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("translate-enable");
const frontend = document.getElementById("translate-frontend");
const protocol = document.getElementById("translate-protocol");
const simplyTranslateDiv = document.getElementById("simplyTranslate");
const lingvaDiv = document.getElementById("lingva");

const translate = document.getElementById('translate_page');

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
    const normalSimplyTranslateDiv = document.getElementById("simplyTranslate").getElementsByClassName("normal")[0];
    const torSimplyTranslateDiv = document.getElementById("simplyTranslate").getElementsByClassName("tor")[0];

    const normalLingvaDiv = document.getElementById("lingva").getElementsByClassName("normal")[0];
    const torLingvaDiv = document.getElementById("lingva").getElementsByClassName("tor")[0];

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
        enable.checked = !r.translateDisable;
        frontend.value = r.translateFrontend;
        protocol.value = r.translateProtocol;
        changeFrontendsSettings();
        changeProtocolSettings();
    }
);

translate.addEventListener("change", () => {
    browser.storage.local.set({
        translateDisable: !enable.checked,
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
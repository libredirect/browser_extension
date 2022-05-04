import translateHelper from "../../../assets/javascripts/helpers/translate/translate.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableElement = document.getElementById("disable-simplyTranslate");
let simplyTranslateDivElement = document.getElementById("simplyTranslate");
let lingvaDivElement = document.getElementById("lingva");
let translateFrontendElement = document.getElementById("translate-frontend");
let protocolElement = document.getElementById("protocol");

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

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        translateDisable: !disableElement.checked,
        translateFrontend: translateFrontendElement.value,
        translateProtocol: protocolElement.value,
        translateFrom: fromElement.value,
        translateTo: toElement.value,
        simplyTranslateEngine: simplyTranslateEngineElement.value,
    })
    changeProtocolSettings(protocolElement.value);
    changeFrontendsSettings(translateFrontendElement.value);
})


function changeProtocolSettings(protocol) {
    let normalSimplyTranslateDiv = document.getElementById("simplyTranslate").getElementsByClassName("normal")[0];
    let torSimplyTranslateDiv = document.getElementById("simplyTranslate").getElementsByClassName("tor")[0];

    let normalLingvaDiv = document.getElementById("lingva").getElementsByClassName("normal")[0];
    let torLingvaDiv = document.getElementById("lingva").getElementsByClassName("tor")[0];

    if (protocol == 'normal') {
        normalSimplyTranslateDiv.style.display = 'block';
        normalLingvaDiv.style.display = 'block';
        torLingvaDiv.style.display = 'none';
        torSimplyTranslateDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalSimplyTranslateDiv.style.display = 'none';
        normalLingvaDiv.style.display = 'none';
        torLingvaDiv.style.display = 'block';
        torSimplyTranslateDiv.style.display = 'block';
    }
}

let fromElement = document.getElementsByClassName("from")[0];
let toElement = document.getElementsByClassName("to")[0];
let simplyTranslateElement = document.getElementById("simplyTranslate")
let simplyTranslateEngineElement = simplyTranslateElement.getElementsByClassName("engine")[0];

browser.storage.local.get(
    [
        "translateDisable",
        "translateFrontend",
        "translateProtocol",
        "translateFrom",
        "translateTo",
        "simplyTranslateEngine",
    ],
    r => {
        disableElement.checked = !r.translateDisable;

        translateFrontendElement.value = r.translateFrontend;
        changeFrontendsSettings(r.translateFrontend);

        protocolElement.value = r.translateProtocol;
        changeProtocolSettings(r.translateProtocol);

        fromElement.value = r.translateFrom;
        toElement.value = r.translateTo;
        simplyTranslateEngineElement.value = r.simplyTranslateEngine;
    }
);

commonHelper.processDefaultCustomInstances('translate', 'simplyTranslate', 'normal', document)
commonHelper.processDefaultCustomInstances('translate', 'simplyTranslate', 'tor', document);
commonHelper.processDefaultCustomInstances('translate', 'lingva', 'normal', document);
commonHelper.processDefaultCustomInstances('translate', 'lingva', 'tor', document);

let latencySimplyTranslateElement = document.getElementById("latency-simplyTranslate");
let latencySimplyTranslateLabel = document.getElementById("latency-simplyTranslate-label");
latencySimplyTranslateElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencySimplyTranslateElement.addEventListener("click", reloadWindow);
        await translateHelper.init();
        let redirects = translateHelper.getRedirects();
        const oldHtml = latencySimplyTranslateLabel.innerHTML;
        latencySimplyTranslateLabel.innerHTML = '...';
        commonHelper.testLatency(latencySimplyTranslateLabel, redirects.simplyTranslate.normal).then(r => {
            browser.storage.local.set({ simplyTranslateLatency: r });
            latencySimplyTranslateLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('translate', 'simplyTranslate', 'normal', document)
            latencySimplyTranslateElement.removeEventListener("click", reloadWindow);
        });
    }
);

let latencyLingvaElement = document.getElementById("latency-lingva");
let latencyLingvaLabel = document.getElementById("latency-lingva-label");
latencyLingvaElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyLingvaElement.addEventListener("click", reloadWindow);
        await translateHelper.init();
        let redirects = translateHelper.getRedirects();
        const oldHtml = latencyLingvaLabel.innerHTML;
        latencyLingvaLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLingvaLabel, redirects.lingva.normal).then(r => {
            browser.storage.local.set({ lingvaLatency: r });
            latencyLingvaLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('translate', 'lingva', 'normal', document);
            latencyLingvaElement.removeEventListener("click", reloadWindow);
        });
    }
);
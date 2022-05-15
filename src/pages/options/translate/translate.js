import translateHelper from "../../../assets/javascripts/helpers/translate/translate.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

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
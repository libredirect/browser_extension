import mediumHelper from "../../../assets/javascripts/helpers/medium.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disable = document.getElementById("disable-medium");
let protocol = document.getElementById("protocol")

browser.storage.local.get(
    [
        "disableMedium",
        "mediumProtocol"
    ],
    r => {
        disable.checked = !r.disableMedium;
        protocol.value = r.mediumProtocol;
        changeProtocolSettings();
    }
)
commonHelper.processDefaultCustomInstances('medium', 'scribe', 'normal', document);
commonHelper.processDefaultCustomInstances('medium', 'scribe', 'tor', document);

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableMedium: !disable.checked,
        mediumProtocol: protocol.value,
    })
    changeProtocolSettings();
})

function changeProtocolSettings() {
    let normalDiv = document.getElementsByClassName("normal")[0];
    let torDiv = document.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await mediumHelper.init();
        let redirects = mediumHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.scribe.normal).then(r => {
            browser.storage.local.set({ scribeLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('medium', 'scribe', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
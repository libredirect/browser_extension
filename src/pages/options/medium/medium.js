import mediumHelper from "../../../assets/javascripts/helpers/medium.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableMediumElement = document.getElementById("disable-medium");
let protocolElement = document.getElementById("protocol")

browser.storage.local.get(
    [
        "disableMedium",
        "mediumProtocol"
    ],
    r => {
        disableMediumElement.checked = !r.disableMedium;

        let protocol = r.mediumProtocol;
        protocolElement.value = protocol;
        changeProtocolSettings(protocol);

        commonHelper.processDefaultCustomInstances('scribe', 'normal', mediumHelper, document)
        commonHelper.processDefaultCustomInstances('scribe', 'tor', mediumHelper, document)
    }
)

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableMedium: !disableMediumElement.checked,
        mediumProtocol: protocolElement.value,
    })
    changeProtocolSettings(protocolElement.value);
})

function changeProtocolSettings(protocol) {
    let normalDiv = document.getElementsByClassName("normal")[0];
    let torDiv = document.getElementsByClassName("tor")[0];
    if (protocol == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
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
            commonHelper.processDefaultCustomInstances('scribe', 'normal', mediumHelper, document);
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
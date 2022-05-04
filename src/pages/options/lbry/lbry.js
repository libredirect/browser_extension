import lbryHelper from "../../../assets/javascripts/helpers/lbry.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableLbryElement = document.getElementById("disable-lbry");
let protocolElement = document.getElementById("protocol")

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableLbryTargets: !lbryHelper.checked,
        lbryTargetsProtocol: protocolElement.value,
    });
    changeProtocolSettings(protocolElement.value)
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

browser.storage.local.get(
    [
        "disableLbryTargets",
        "lbryTargetsProtocol"
    ],
    r => {
    disableLbryElement.checked = !r.disableLbryTargets;

    let protocol = r.lbryTargetsProtocol;
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances('librarian', 'normal', lbryHelper, document);
    commonHelper.processDefaultCustomInstances('librarian', 'tor', lbryHelper, document)
})


let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await lbryHelper.init();
        let redirects = lbryHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.librarian.normal).then(r => {
            browser.storage.local.set({ librarianLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('librarian', 'normal', lbryHelper, document);
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
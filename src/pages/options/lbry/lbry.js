import lbryHelper from "../../../assets/javascripts/helpers/lbry.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disable = document.getElementById("disable-lbry");
let protocol = document.getElementById("protocol")

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableLbryTargets: !lbryHelper.checked,
        lbryTargetsProtocol: protocol.value,
    });
    changeProtocolSettings()
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

browser.storage.local.get(
    [
        "disableLbryTargets",
        "lbryTargetsProtocol"
    ],
    r => {
        disable.checked = !r.disableLbryTargets;
        protocol.value = r.lbryTargetsProtocol;
        changeProtocolSettings();
    }
)

commonHelper.processDefaultCustomInstances('lbryTargets', 'librarian', 'normal', document);
commonHelper.processDefaultCustomInstances('lbryTargets', 'librarian', 'tor', document);

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
            commonHelper.processDefaultCustomInstances('lbry', 'librarian', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
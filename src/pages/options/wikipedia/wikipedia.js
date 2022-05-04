import wikipediaHelper from "../../../assets/javascripts/helpers/wikipedia.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableWikipediaElement = document.getElementById("disable-wikipedia");
let protocolElement = document.getElementById("protocol");

browser.storage.local.get(
    [
        "disableWikipedia",
        "wikipediaProtocol",
    ],
    r => {
        disableWikipediaElement.checked = !r.disableWikipedia;
        protocolElement.value = r.wikipediaProtocol;
        changeProtocolSettings(r.wikipediaProtocol);
    }
)

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableWikipedia: !disableWikipediaElement.checked,
        wikipediaProtocol: protocolElement.value,
    })
    changeProtocolSettings(protocolElement.value)
})

function changeProtocolSettings(protocol) {
    let normalDiv = document.getElementsByClassName("normal")[0];
    let torDiv = document.getElementsByClassName("tor")[0];
    let i2pDiv = document.getElementsByClassName("i2p")[0];
    if (protocol == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
        i2pDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
        i2pDiv.style.display = 'none';
    }
    else if (protocol == 'i2p') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'none';
        i2pDiv.style.display = 'block';
    }
}
commonHelper.processDefaultCustomInstances('wikiless', 'normal', wikipediaHelper, document);
commonHelper.processDefaultCustomInstances('wikiless', 'tor', wikipediaHelper, document)
commonHelper.processDefaultCustomInstances('wikiless', 'i2p', wikipediaHelper, document)

window.onblur = wikipediaHelper.initWikilessCookies;

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await wikipediaHelper.init();
        let redirects = wikipediaHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.wikiless.normal).then(r => {
            browser.storage.local.set({ wikilessLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('wikiless', 'normal', wikipediaHelper, document)
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
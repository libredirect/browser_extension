import wikipediaHelper from "../../../assets/javascripts/helpers/wikipedia.js";
import utils from "../../../assets/javascripts/helpers/utils.js";

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
utils.processDefaultCustomInstances('wikipedia', 'wikiless', 'normal', document);
utils.processDefaultCustomInstances('wikipedia', 'wikiless', 'tor', document);
utils.processDefaultCustomInstances('wikipedia', 'wikiless', 'i2p', document);

window.onblur = wikipediaHelper.initWikilessCookies;

utils.latency('wikipedia', 'wikiless', document, location)
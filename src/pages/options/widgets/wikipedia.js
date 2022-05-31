import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("wikipedia-enable");
const protocolElement = document.getElementById("wikipedia-protocol");
const wikipedia = document.getElementById('wikipedia_page');

function changeProtocolSettings(protocol) {
    const normalDiv = wikipedia.getElementsByClassName("normal")[0];
    const torDiv = wikipedia.getElementsByClassName("tor")[0];
    const i2pDiv = wikipedia.getElementsByClassName("i2p")[0];
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

browser.storage.local.get(
    [
        "disableWikipedia",
        "wikipediaProtocol",
    ],
    r => {
        enable.checked = !r.disableWikipedia;
        protocolElement.value = r.wikipediaProtocol;
        changeProtocolSettings(r.wikipediaProtocol);
    }
)

wikipedia.addEventListener("change", () => {
    browser.storage.local.set({
        disableWikipedia: !enable.checked,
        wikipediaProtocol: protocolElement.value,
    })
    changeProtocolSettings(protocolElement.value)
})

utils.processDefaultCustomInstances('wikipedia', 'wikiless', 'normal', document);
utils.processDefaultCustomInstances('wikipedia', 'wikiless', 'tor', document);
utils.processDefaultCustomInstances('wikipedia', 'wikiless', 'i2p', document);

utils.latency('wikipedia', 'wikiless', document, location)
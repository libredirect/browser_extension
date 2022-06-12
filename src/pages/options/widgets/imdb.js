import utils from "../../../assets/javascripts/utils.js";

const enable = document.getElementById("imdb-enable");
const protocol = document.getElementById("imdb-protocol")
const imdb = document.getElementById('imdb_page');

function changeProtocolSettings() {
    const normalDiv = imdb.getElementsByClassName("normal")[0];
    const torDiv = imdb.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

imdb.addEventListener("change", () => {
    changeProtocolSettings();
    browser.storage.local.set({
        disableImdb: !enable.checked,
        imdbProtocol: protocol.value,
    })
})

browser.storage.local.get(
    [
        "disableImdb",
        "imdbProtocol"
    ],
    r => {
        enable.checked = !r.disableImdb;
        protocol.value = r.imdbProtocol;
        changeProtocolSettings();
    }
)

utils.processDefaultCustomInstances('imdb', 'libremdb', 'normal', document);
utils.processDefaultCustomInstances('imdb', 'libremdb', 'tor', document);
utils.latency('imdb', 'libremdb', document, location)
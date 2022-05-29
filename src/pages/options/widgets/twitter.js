import twitterHelper from "../../../assets/javascripts/twitter.js";
import utils from "../../../assets/javascripts/utils.js";

let disable = document.getElementById("disable-nitter");
let protocol = document.getElementById("protocol");

let nitterDiv = document.getElementById('nitter');

const nitterForm = nitterDiv.getElementsByTagName('form')[0];
const nitterCookies = nitterForm.getElementsByTagName('input')[0];
nitterForm.addEventListener('submit', event => {
  event.preventDefault();
  const url = new URL(nitterCookies.value);
  twitterHelper.initNitterCookies(url);
});

browser.storage.local.get(
    [
        "disableTwitter",
        "twitterProtocol",
    ],
    r => {
        disable.checked = !r.disableTwitter;
        protocol.value = r.twitterProtocol;
        changeProtocolSettings();
    }
)

document.addEventListener("change", () => {
    browser.storage.local.set({
        disableTwitter: !disable.checked,
        twitterProtocol: protocol.value,
    });
    changeProtocolSettings();
})

function changeProtocolSettings() {
    let normalDiv = nitterDiv.getElementsByClassName("normal")[0];
    let torDiv = nitterDiv.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

utils.processDefaultCustomInstances('twitter', 'nitter', 'normal', document);
utils.processDefaultCustomInstances('twitter', 'nitter', 'tor', document)

utils.latency('twitter', 'nitter', document, location)
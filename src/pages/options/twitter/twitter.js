import twitterHelper from "../../../assets/javascripts/helpers/twitter.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

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

commonHelper.processDefaultCustomInstances('twitter', 'nitter', 'normal', document);
commonHelper.processDefaultCustomInstances('twitter', 'nitter', 'tor', document)

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await twitterHelper.init();
        let redirects = twitterHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.nitter.normal).then(r => {
            browser.storage.local.set({ nitterLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('twitter', 'nitter', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
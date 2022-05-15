import searchHelper from "../../../assets/javascripts/helpers/search.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let searxDiv = document.getElementById("searx");
let searxngDiv = document.getElementById("searxng");
let whoogleDiv = document.getElementById("whoogle");

let disable = document.getElementById("disable-search");
let frontend = document.getElementById("search-frontend");
let protocol = document.getElementById("protocol")

const searxngForm = searxngDiv.getElementsByTagName('form')[0];
const searxngCookies = searxngForm.getElementsByTagName('input')[0];
searxngForm.addEventListener('submit', async event => {
  event.preventDefault();
  const url = new URL(searxngCookies.value);
  searchHelper.initSearxngCookies(url);
});

const searxForm = searxDiv.getElementsByTagName('form')[0];
const searxCookies = searxForm.getElementsByTagName('input')[0];
searxForm.addEventListener('submit', async event => {
  event.preventDefault();
  const url = new URL(searxCookies.value);
  searchHelper.initSearxCookies(url);
});

browser.storage.local.get(
  [
    "disableSearch",
    "searchFrontend",
    "searchProtocol",
  ],
  r => {
    disable.checked = !r.disableSearch;
    frontend.value = r.searchFrontend;
    protocol.value = r.searchProtocol;

    changeFrontendsSettings();
    changeProtocolSettings();
  }
);

document.addEventListener("change", async () => {
  await browser.storage.local.set({
    disableSearch: !disable.checked,
    searchFrontend: frontend.value,
    searchProtocol: protocol.value,
  });
  changeFrontendsSettings(frontend.value);
  changeProtocolSettings(protocol.value);
})

function changeFrontendsSettings() {
  let SearxWhoogleElement = document.getElementById("searx-whoogle");
  if (frontend.value == 'searx') {
    searxDiv.style.display = 'block';
    searxngDiv.style.display = 'none';
    whoogleDiv.style.display = 'none';
    SearxWhoogleElement.style.display = 'block';
  }
  else if (frontend.value == 'searxng') {
    searxDiv.style.display = 'none';
    searxngDiv.style.display = 'block';
    whoogleDiv.style.display = 'none';
    SearxWhoogleElement.style.display = 'block';
  }
  else if (frontend.value == 'whoogle') {
    searxDiv.style.display = 'none';
    searxngDiv.style.display = 'none';
    whoogleDiv.style.display = 'block';
    SearxWhoogleElement.style.display = 'block';
  }
}

function changeProtocolSettings() {
  let normalsearxDiv = searxDiv.getElementsByClassName("normal")[0];
  let torsearxDiv = searxDiv.getElementsByClassName("tor")[0];
  let i2psearxDiv = searxDiv.getElementsByClassName("i2p")[0];

  let normalsearxngDiv = searxngDiv.getElementsByClassName("normal")[0];
  let torsearxngDiv = searxngDiv.getElementsByClassName("tor")[0];
  let i2psearxngDiv = searxngDiv.getElementsByClassName("i2p")[0];

  let normalwhoogleDiv = whoogleDiv.getElementsByClassName("normal")[0];
  let torwhoogleDiv = whoogleDiv.getElementsByClassName("tor")[0];
  let i2pwhoogleDiv = whoogleDiv.getElementsByClassName("i2p")[0];

  if (protocol.value == 'normal') {
    normalsearxDiv.style.display = 'block';
    normalsearxngDiv.style.display = 'block';
    normalwhoogleDiv.style.display = 'block';

    torsearxDiv.style.display = 'none';
    torsearxngDiv.style.display = 'none';
    torwhoogleDiv.style.display = 'none';

    i2psearxDiv.style.display = 'none';
    i2psearxngDiv.style.display = 'none';
    i2pwhoogleDiv.style.display = 'none';
  }
  else if (protocol.value == 'tor') {
    normalsearxDiv.style.display = 'none';
    normalsearxngDiv.style.display = 'none';
    normalwhoogleDiv.style.display = 'none';

    torsearxDiv.style.display = 'block';
    torsearxngDiv.style.display = 'block';
    torwhoogleDiv.style.display = 'block';

    i2psearxDiv.style.display = 'none';
    i2psearxngDiv.style.display = 'none';
    i2pwhoogleDiv.style.display = 'none';
  }
  else if (protocol.value == 'i2p') {
    normalsearxDiv.style.display = 'none';
    normalsearxngDiv.style.display = 'none';
    normalwhoogleDiv.style.display = 'none';

    torsearxDiv.style.display = 'none';
    torsearxngDiv.style.display = 'none';
    torwhoogleDiv.style.display = 'none';

    i2psearxDiv.style.display = 'block';
    i2psearxngDiv.style.display = 'block';
    i2pwhoogleDiv.style.display = 'block';
  }
}

commonHelper.processDefaultCustomInstances('search', 'searx', 'normal', document);
commonHelper.processDefaultCustomInstances('search', 'searx', 'tor', document);
commonHelper.processDefaultCustomInstances('search', 'searx', 'i2p', document);
commonHelper.processDefaultCustomInstances('search', 'searxng', 'normal', document);
commonHelper.processDefaultCustomInstances('search', 'searxng', 'tor', document);
commonHelper.processDefaultCustomInstances('search', 'searxng', 'i2p', document);
commonHelper.processDefaultCustomInstances('search', 'whoogle', 'normal', document);
commonHelper.processDefaultCustomInstances('search', 'whoogle', 'tor', document);
commonHelper.processDefaultCustomInstances('search', 'whoogle', 'i2p', document);

let latencySearxElement = document.getElementById("latency-searx");
let latencySearxLabel = document.getElementById("latency-searx-label");
latencySearxElement.addEventListener("click",
  async () => {
    let reloadWindow = () => location.reload();
    latencySearxElement.addEventListener("click", reloadWindow);
    await searchHelper.init();
    let redirects = searchHelper.getRedirects();
    const oldHtml = latencySearxLabel.innerHTML;
    latencySearxLabel.innerHTML = '...';
    commonHelper.testLatency(latencySearxLabel, redirects.searx.normal).then(r => {
      browser.storage.local.set({ searxLatency: r });
      latencySearxLabel.innerHTML = oldHtml;
      commonHelper.processDefaultCustomInstances('search', 'searx', 'normal', document);
      latencySearxElement.removeEventListener("click", reloadWindow);
    });
  }
);

let latencySearxngElement = document.getElementById("latency-searxng");
let latencySearxngLabel = document.getElementById("latency-searxng-label");
latencySearxngElement.addEventListener("click",
  async () => {
    let reloadWindow = () => location.reload();
    latencySearxngElement.addEventListener("click", reloadWindow);
    await searchHelper.init();
    let redirects = searchHelper.getRedirects();
    const oldHtml = latencySearxngLabel.innerHTML;
    latencySearxngLabel.innerHTML = '...';
    commonHelper.testLatency(latencySearxngLabel, redirects.searxng.normal).then(r => {
      browser.storage.local.set({ searxngLatency: r });
      latencySearxngLabel.innerHTML = oldHtml;
      commonHelper.processDefaultCustomInstances('search', 'searxng', 'normal', document);
      latencySearxngElement.removeEventListener("click", reloadWindow);
    });
  }
);

let latencyWhoogleElement = document.getElementById("latency-whoogle");
let latencyWhoogleLabel = document.getElementById("latency-whoogle-label");
latencyWhoogleElement.addEventListener("click",
  async () => {
    let reloadWindow = () => location.reload();
    latencyWhoogleElement.addEventListener("click", reloadWindow);
    await searchHelper.init();
    let redirects = searchHelper.getRedirects();
    const oldHtml = latencyWhoogleLabel.innerHTML;
    latencyWhoogleLabel.innerHTML = '...';
    commonHelper.testLatency(latencyWhoogleLabel, redirects.whoogle.normal).then(r => {
      browser.storage.local.set({ whoogleLatency: r });
      latencyWhoogleLabel.innerHTML = oldHtml;
      commonHelper.processDefaultCustomInstances('search', 'whoogle', 'normal', document);
      latencyWhoogleElement.removeEventListener("click", reloadWindow);
    });
  }
);
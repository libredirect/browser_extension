import utils from "../../../assets/javascripts/utils.js";

const searxDiv = document.getElementById("searx");
const searxngDiv = document.getElementById("searxng");
const whoogleDiv = document.getElementById("whoogle");

const enable = document.getElementById("search-enable");
const frontend = document.getElementById("search-frontend");
const protocol = document.getElementById("search-protocol");

const search = document.getElementById('search_page');


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
  const normalsearxDiv = searxDiv.getElementsByClassName("normal")[0];
  const torsearxDiv = searxDiv.getElementsByClassName("tor")[0];
  const i2psearxDiv = searxDiv.getElementsByClassName("i2p")[0];

  const normalsearxngDiv = searxngDiv.getElementsByClassName("normal")[0];
  const torsearxngDiv = searxngDiv.getElementsByClassName("tor")[0];
  const i2psearxngDiv = searxngDiv.getElementsByClassName("i2p")[0];

  const normalwhoogleDiv = whoogleDiv.getElementsByClassName("normal")[0];
  const torwhoogleDiv = whoogleDiv.getElementsByClassName("tor")[0];
  const i2pwhoogleDiv = whoogleDiv.getElementsByClassName("i2p")[0];

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

browser.storage.local.get(
  [
    "disableSearch",
    "searchFrontend",
    "searchProtocol",
  ],
  r => {
    enable.checked = !r.disableSearch;
    frontend.value = r.searchFrontend;
    protocol.value = r.searchProtocol;

    changeFrontendsSettings();
    changeProtocolSettings();
  }
);

search.addEventListener("change", () => {
  browser.storage.local.set({
    disableSearch: !enable.checked,
    searchFrontend: frontend.value,
    searchProtocol: protocol.value,
  });
  changeFrontendsSettings(frontend.value);
  changeProtocolSettings(protocol.value);
})

utils.processDefaultCustomInstances('search', 'searx', 'normal', document);
utils.processDefaultCustomInstances('search', 'searx', 'tor', document);
utils.processDefaultCustomInstances('search', 'searx', 'i2p', document);
utils.processDefaultCustomInstances('search', 'searxng', 'normal', document);
utils.processDefaultCustomInstances('search', 'searxng', 'tor', document);
utils.processDefaultCustomInstances('search', 'searxng', 'i2p', document);
utils.processDefaultCustomInstances('search', 'whoogle', 'normal', document);
utils.processDefaultCustomInstances('search', 'whoogle', 'tor', document);
utils.processDefaultCustomInstances('search', 'whoogle', 'i2p', document);

utils.latency('search', 'searx', document, location, true)
utils.latency('search', 'searxng', document, location, true)
utils.latency('search', 'whoogle', document, location, true)

import searchHelper from "../../../assets/javascripts/helpers/search.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableSearchElement = document.getElementById("disable-search");
disableSearchElement.addEventListener("change", event => searchHelper.setDisable(!event.target.checked));


let searxDivElement = document.getElementById("searx");
let searxngDivElement = document.getElementById("searxng")
let whoogleDivElement = document.getElementById("whoogle");


function changeFrontendsSettings(frontend) {
  let SearxWhoogleElement = document.getElementById("searx-whoogle");
  let frontendElement = document.getElementById("frontend");
  if (frontend == 'searx') {
    frontendElement.innerHTML = 'Frontend';
    searxDivElement.style.display = 'block';
    searxngDivElement.style.display = 'none';
    whoogleDivElement.style.display = 'none';
    SearxWhoogleElement.style.display = 'block';
  }
  else if (frontend == 'searxng') {
    frontendElement.innerHTML = 'Frontend';
    searxDivElement.style.display = 'none';
    searxngDivElement.style.display = 'block';
    whoogleDivElement.style.display = 'none';
    SearxWhoogleElement.style.display = 'block';
  }
  else if (frontend == 'whoogle') {
    frontendElement.innerHTML = 'Frontend';
    searxDivElement.style.display = 'none';
    searxngDivElement.style.display = 'none';
    whoogleDivElement.style.display = 'block';
    SearxWhoogleElement.style.display = 'block';
  }
  else if (frontend == 'startpage') {
    frontendElement.innerHTML = `Frontend: <span style="color:red;">This is a centralized service</span>`;
    searxDivElement.style.display = 'none';
    searxngDivElement.style.display = 'none';
    whoogleDivElement.style.display = 'none';
    SearxWhoogleElement.style.display = 'none';
  }
}
let searchFrontendElement = document.getElementById("search-frontend");
searchFrontendElement.addEventListener("change",
  event => {
    let frontend = event.target.options[searchFrontendElement.selectedIndex].value
    searchHelper.setFrontend(frontend)
    changeFrontendsSettings(frontend);
  }
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
  event => {
    let protocol = event.target.options[protocolElement.selectedIndex].value
    searchHelper.setProtocol(protocol);
    changeProtocolSettings(protocol);
  }
);

function changeProtocolSettings(protocol) {
  let normalsearxDiv = searxDivElement.getElementsByClassName("normal")[0];
  let torsearxDiv = searxDivElement.getElementsByClassName("tor")[0];
  let i2psearxDiv = searxDivElement.getElementsByClassName("i2p")[0];

  let normalsearxngDiv = searxngDivElement.getElementsByClassName("normal")[0];
  let torsearxngDiv = searxngDivElement.getElementsByClassName("tor")[0];
  let i2psearxngDiv = searxngDivElement.getElementsByClassName("i2p")[0];

  let normalwhoogleDiv = whoogleDivElement.getElementsByClassName("normal")[0];
  let torwhoogleDiv = whoogleDivElement.getElementsByClassName("tor")[0];
  let i2pwhoogleDiv = whoogleDivElement.getElementsByClassName("i2p")[0];

  if (protocol == 'normal') {
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
  else if (protocol == 'tor') {
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
  else if (protocol == 'i2p') {
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

searchHelper.init().then(() => {
  disableSearchElement.checked = !searchHelper.getDisable();
  let frontend = searchHelper.getFrontend();
  searchFrontendElement.value = frontend;
  changeFrontendsSettings(frontend);

  let protocol = searchHelper.getProtocol();
  protocolElement.value = protocol;
  changeProtocolSettings(protocol);

  commonHelper.processDefaultCustomInstances(
    'searx',
    'normal',
    searchHelper,
    document,
    searchHelper.getSearxNormalRedirectsChecks,
    searchHelper.setSearxNormalRedirectsChecks,
    searchHelper.getSearxNormalCustomRedirects,
    searchHelper.setSearxNormalCustomRedirects
  );

  commonHelper.processDefaultCustomInstances(
    'searx',
    'tor',
    searchHelper,
    document,
    searchHelper.getSearxTorRedirectsChecks,
    searchHelper.setSearxTorRedirectsChecks,
    searchHelper.getSearxTorCustomRedirects,
    searchHelper.setSearxTorCustomRedirects
  );

  commonHelper.processDefaultCustomInstances(
    'searx',
    'i2p',
    searchHelper,
    document,
    searchHelper.getSearxI2PRedirectsChecks,
    searchHelper.setSearxI2PRedirectsChecks,
    searchHelper.getSearxI2PCustomRedirects,
    searchHelper.setSearxI2PCustomRedirects
  );

  commonHelper.processDefaultCustomInstances(
    'searxng',
    'normal',
    searchHelper,
    document,
    searchHelper.getSearxngNormalRedirectsChecks,
    searchHelper.setSearxngNormalRedirectsChecks,
    searchHelper.getSearxngNormalCustomRedirects,
    searchHelper.setSearxngNormalCustomRedirects
  );

  commonHelper.processDefaultCustomInstances(
    'searxng',
    'tor',
    searchHelper,
    document,
    searchHelper.getSearxngTorRedirectsChecks,
    searchHelper.setSearxngTorRedirectsChecks,
    searchHelper.getSearxngTorCustomRedirects,
    searchHelper.setSearxngTorCustomRedirects
  );

  commonHelper.processDefaultCustomInstances(
    'searxng',
    'i2p',
    searchHelper,
    document,
    searchHelper.getSearxngI2PRedirectsChecks,
    searchHelper.setSearxngI2PRedirectsChecks,
    searchHelper.getSearxngI2PCustomRedirects,
    searchHelper.setSearxngI2PCustomRedirects
  );

  commonHelper.processDefaultCustomInstances(
    'whoogle',
    'normal',
    searchHelper,
    document,
    searchHelper.getWhoogleNormalRedirectsChecks,
    searchHelper.setWhoogleNormalRedirectsChecks,
    searchHelper.getWhoogleNormalCustomRedirects,
    searchHelper.setWhoogleNormalCustomRedirects
  );

  commonHelper.processDefaultCustomInstances(
    'whoogle',
    'tor',
    searchHelper,
    document,
    searchHelper.getWhoogleTorRedirectsChecks,
    searchHelper.setWhoogleTorRedirectsChecks,
    searchHelper.getWhoogleTorCustomRedirects,
    searchHelper.setWhoogleTorCustomRedirects
  );

  commonHelper.processDefaultCustomInstances(
    'whoogle',
    'i2p',
    searchHelper,
    document,
    searchHelper.getWhoogleI2PRedirectsChecks,
    searchHelper.setWhoogleI2PRedirectsChecks,
    searchHelper.getWhoogleI2PCustomRedirects,
    searchHelper.setWhoogleI2PCustomRedirects
  );
});

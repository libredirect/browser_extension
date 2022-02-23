import searchHelper from "../../../assets/javascripts/helpers/search.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableSearchElement = document.getElementById("disable-search");
disableSearchElement.addEventListener("change",
  (event) => searchHelper.setDisable(!event.target.checked)
);


let searxDivElement = document.getElementById("searx")
let whoogleDivElement = document.getElementById("whoogle")


function changeFrontendsSettings(frontend) {
  if (frontend == 'searx') {
    searxDivElement.style.display = 'block';
    whoogleDivElement.style.display = 'none';
  }
  else if (frontend == 'whoogle') {
    searxDivElement.style.display = 'none';
    whoogleDivElement.style.display = 'block';
  }
}
let searchFrontendElement = document.getElementById("search-frontend");
searchFrontendElement.addEventListener("change",
  (event) => {
    let frontend = event.target.options[searchFrontendElement.selectedIndex].value
    searchHelper.setFrontend(frontend)
    changeFrontendsSettings(frontend);
  }
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
  (event) => {
    let protocol = event.target.options[protocolElement.selectedIndex].value
    searchHelper.setProtocol(protocol);
    changeProtocolSettings(protocol);
  }
);

function changeProtocolSettings(protocol) {
  let normalsearxDiv = document.getElementById("searx-normal");
  let torsearxDiv = document.getElementById("searx-tor");

  let normalwhoogleDiv = document.getElementById("whoogle-normal");
  let torwhoogleDiv = document.getElementById("whoogle-tor");
  if (protocol == 'normal') {
    normalsearxDiv.style.display = 'block';
    normalwhoogleDiv.style.display = 'block';
    torwhoogleDiv.style.display = 'none';
    torsearxDiv.style.display = 'none';
  }
  else if (protocol == 'tor') {
    normalsearxDiv.style.display = 'none';
    normalwhoogleDiv.style.display = 'none';
    torwhoogleDiv.style.display = 'block';
    torsearxDiv.style.display = 'block';
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
});

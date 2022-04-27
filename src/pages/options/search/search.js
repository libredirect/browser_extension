import searchHelper from "../../../assets/javascripts/helpers/search.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableSearchElement = document.getElementById("disable-search");
disableSearchElement.addEventListener("change", event => searchHelper.setDisable(!event.target.checked));


let searxDivElement = document.getElementById("searx");
let searxngDivElement = document.getElementById("searxng")
let whoogleDivElement = document.getElementById("whoogle");


function changeFrontendsSettings(frontend) {
  let SearxWhoogleElement = document.getElementById("searx-whoogle");
  if (frontend == 'searx') {
    searxDivElement.style.display = 'block';
    searxngDivElement.style.display = 'none';
    whoogleDivElement.style.display = 'none';
    SearxWhoogleElement.style.display = 'block';
  }
  else if (frontend == 'searxng') {
    searxDivElement.style.display = 'none';
    searxngDivElement.style.display = 'block';
    whoogleDivElement.style.display = 'none';
    SearxWhoogleElement.style.display = 'block';
  }
  else if (frontend == 'whoogle') {
    searxDivElement.style.display = 'none';
    searxngDivElement.style.display = 'none';
    whoogleDivElement.style.display = 'block';
    SearxWhoogleElement.style.display = 'block';
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

  browser.storage.local.get("searxLatency").then(r => {
    commonHelper.processDefaultCustomInstances(
      'searx',
      'normal',
      searchHelper,
      document,
      searchHelper.getSearxNormalRedirectsChecks,
      searchHelper.setSearxNormalRedirectsChecks,
      searchHelper.getSearxNormalCustomRedirects,
      searchHelper.setSearxNormalCustomRedirects,
      r.searxLatency
    );
  })

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
    searchHelper.getSearxI2pRedirectsChecks,
    searchHelper.setSearxI2pRedirectsChecks,
    searchHelper.getSearxI2pCustomRedirects,
    searchHelper.setSearxI2pCustomRedirects
  );

  browser.storage.local.get("searxngLatency").then(r => {
    commonHelper.processDefaultCustomInstances(
      'searxng',
      'normal',
      searchHelper,
      document,
      searchHelper.getSearxngNormalRedirectsChecks,
      searchHelper.setSearxngNormalRedirectsChecks,
      searchHelper.getSearxngNormalCustomRedirects,
      searchHelper.setSearxngNormalCustomRedirects,
      r.searxngLatency,
    );
  })

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
    searchHelper.getSearxngI2pRedirectsChecks,
    searchHelper.setSearxngI2pRedirectsChecks,
    searchHelper.getSearxngI2pCustomRedirects,
    searchHelper.setSearxngI2pCustomRedirects
  );

  browser.storage.local.get("whoogleLatency").then(r => {
    commonHelper.processDefaultCustomInstances(
      'whoogle',
      'normal',
      searchHelper,
      document,
      searchHelper.getWhoogleNormalRedirectsChecks,
      searchHelper.setWhoogleNormalRedirectsChecks,
      searchHelper.getWhoogleNormalCustomRedirects,
      searchHelper.setWhoogleNormalCustomRedirects,
      r.whoogleLatency,
    );
  })

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
    searchHelper.getWhoogleI2pRedirectsChecks,
    searchHelper.setWhoogleI2pRedirectsChecks,
    searchHelper.getWhoogleI2pCustomRedirects,
    searchHelper.setWhoogleI2pCustomRedirects
  );
});


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
      commonHelper.processDefaultCustomInstances(
        'searx',
        'normal',
        searchHelper,
        document,
        searchHelper.getSearxNormalRedirectsChecks,
        searchHelper.setSearxNormalRedirectsChecks,
        searchHelper.getSearxNormalCustomRedirects,
        searchHelper.setSearxNormalCustomRedirects,
        r,
      );
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
      commonHelper.processDefaultCustomInstances(
        'searxng',
        'normal',
        searchHelper,
        document,
        searchHelper.getSearxngNormalRedirectsChecks,
        searchHelper.setSearxngNormalRedirectsChecks,
        searchHelper.getSearxngNormalCustomRedirects,
        searchHelper.setSearxngNormalCustomRedirects,
        r,
      );
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
      commonHelper.processDefaultCustomInstances(
        'whoogle',
        'normal',
        searchHelper,
        document,
        searchHelper.getWhoogleNormalRedirectsChecks,
        searchHelper.setWhoogleNormalRedirectsChecks,
        searchHelper.getWhoogleNormalCustomRedirects,
        searchHelper.setWhoogleNormalCustomRedirects,
        r,
      );
      latencyWhoogleElement.removeEventListener("click", reloadWindow);
    });
  }
);
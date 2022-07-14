import utils from "../../../assets/javascripts/utils.js";

// GOAL: to never mention frontends/protocls outside these two arrays, so that adding a new frontend/protocol is as easy as adding it here.
// This may be expanded across the whole project, where almost everything becomes a template, and the frontend/protocol parts just become a JSON file.

// ONCE FINISHED: add librex and see if it works
const frontends = new Array("searx", "searxng", "whoogle", "librex") // Add librex once /javascripts/search.js is made agnostic
const protocols = new Array("normal", "tor", "i2p")
//let frontendProtocols = (frontends.length)

// I will leave comments of my privious attemps so that people can learn from my mistakes. :)

/*
for (let i = 0; i < frontends.length; i++) {
  this.frontends[i] = frontends[i].getElementsByClassName(protocol)
}
*/
    // There was a class here, but I deleted a bit of it
    /*
    this.searxDiv = searxDiv.getElementsByClassName(protocol)[0];
    this.searxngDiv = searxngDiv.getElementsByClassName(protocol)[0];
    this.librexDiv = librexDiv.getElementsByClassName(protocol)[0];
    */

/*
  * Here I was trying to solve the issue by making a 2D array, but I later realised I was overcomplicating things
for (var i = 0; i < frontends.length; i++) {
  frontendProtocols[i] = new Array(protocols.length)
}
*/

/*
const searxDiv = document.getElementById("searx");
const searxngDiv = document.getElementById("searxng");
const whoogleDiv = document.getElementById("whoogle");
*/

const enable = document.getElementById("search-enable");
const frontend = document.getElementById("search-frontend");
const protocol = document.getElementById("search-protocol");

const search = document.getElementById('search_page');


function changeFrontendsSettings() {
  for (let i = 0; i < frontends.length; i++) {
    const frontendDiv = document.getElementById(frontends[i])
    if (frontends[i] == frontend.value) {
      frontendDiv.style.display = 'block'
    } else {
      frontendDiv.style.display = 'none'
    }
  }


  /*
  if (frontend.value == 'searx') {
    searxDiv.style.display = 'block';
    searxngDiv.style.display = 'none';
    whoogleDiv.style.display = 'none';
    librexDiv.style.display = 'none';
  }
  else if (frontend.value == 'searxng') {
    searxDiv.style.display = 'none';
    searxngDiv.style.display = 'block';
    whoogleDiv.style.display = 'none';
    librexDiv.style.display = 'none';
  }
  else if (frontend.value == 'whoogle') {
    searxDiv.style.display = 'none';
    searxngDiv.style.display = 'none';
    whoogleDiv.style.display = 'block';
    librexDiv.style.display = 'none';
  }
  else if (frontend.value == 'librex') {
    searxDiv.style.display = 'none';
    searxDiv.style.display = 'none';
    searxngDiv.style.display = 'none';
    librexDiv.style.display = 'block';
  }
  */
}



function changeProtocolSettings() {


  for (let i = 0; i < frontends.length; i++) {
    const frontendDiv = document.getElementById(frontends[i])
    if (frontends[i] == frontend.value) {       // Here we are checking if the frontend matches the current one. This skips the protocol checking for that frontend, speeding things up.
      for (let x = 0; x < protocols.length; x++) {
        const protocolDiv = frontendDiv.getElementsByClassName(protocols[x])[0]
        if (protocols[x] == protocol.value) { //if the frontend value equals the selected one, it will show. Otherwise, it will be hidden
          protocolDiv.style.display = 'block'
        } else {
          protocolDiv.style.display = 'none'
        }
      }
    } else {
      continue
    }
  }



/*
    * "Legacy" code
  const normalsearxDiv = searxDiv.getElementsByClassName("normal")[0];
  const torsearxDiv = searxDiv.getElementsByClassName("tor")[0];
  const i2psearxDiv = searxDiv.getElementsByClassName("i2p")[0];

  const normalsearxngDiv = searxngDiv.getElementsByClassName("normal")[0];
  const torsearxngDiv = searxngDiv.getElementsByClassName("tor")[0];
  const i2psearxngDiv = searxngDiv.getElementsByClassName("i2p")[0];

  const torwhoogleDiv = whoogleDiv.getElementsByClassName("tor")[0];
  const i2pwhoogleDiv = whoogleDiv.getElementsByClassName("i2p")[0];
  const normalwhoogleDiv = whoogleDiv.getElementsByClassName("normal")[0];

  
  function protocolDisplay(proto) {
    proto.searxngDiv = 'block'
  }

  protocolDisplay(protocol.value)
  
  
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
  */
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

for (let i = 0; i < frontends.length; i++) {
  for (let x = 0; x < protocols.length; x++){
    utils.processDefaultCustomInstances('search', frontends[i], protocols[x], document)
  }
  utils.latency('search', frontends[i], document, location, true)
}

search.addEventListener("change", () => {
  browser.storage.local.set({
    disableSearch: !enable.checked,
    searchFrontend: frontend.value,
    searchProtocol: protocol.value,
  });
  changeFrontendsSettings(frontend.value);
  changeProtocolSettings(protocol.value);
})

/*
  * more "legacy" code
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
*/

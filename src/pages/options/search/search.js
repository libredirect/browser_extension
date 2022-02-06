import searchHelper from "../../../assets/javascripts/helpers/search.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableSearchElement = document.getElementById("disable-search");
disableSearchElement.addEventListener("change",
  (event) => searchHelper.setDisableSearch(!event.target.checked)
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
    searchHelper.setSearchFrontend(frontend)
    changeFrontendsSettings(frontend);
  }
);

searchHelper.init().then(() => {
  disableSearchElement.checked = !searchHelper.getDisableSearch();
  let frontend = searchHelper.getSearchFrontend();
  searchFrontendElement.value = frontend;
  changeFrontendsSettings(frontend);

  commonHelper.processDefaultCustomInstances(
    'searx',
    searchHelper,
    document,
    searchHelper.getSearxRedirectsChecks,
    searchHelper.setSearxRedirectsChecks,
    searchHelper.getSearxCustomRedirects,
    searchHelper.setSearxCustomRedirects
  )

  commonHelper.processDefaultCustomInstances(
    'whoogle',
    searchHelper,
    document,
    searchHelper.getWhoogleRedirectsChecks,
    searchHelper.setWhoogleRedirectsChecks,
    searchHelper.getWhoogleCustomRedirects,
    searchHelper.setWhoogleCustomRedirects
  )
});

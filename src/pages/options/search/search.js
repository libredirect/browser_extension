import searchHelper from "../../../assets/javascripts/helpers/search.js";

let searchFrontendElement = document.getElementById("search-frontend");
searchFrontendElement.addEventListener("change",
  (event) => searchHelper.setSearchFrontend(event.target.options[searchFrontendElement.selectedIndex].value)
);

let disableSearchElement = document.getElementById("disable-search");
disableSearchElement.addEventListener("change",
  (event) => searchHelper.setDisableSearch(!event.target.checked)
);

searchHelper.init().then(() => {
  disableSearchElement.checked = !searchHelper.getDisableSearch();
  searchFrontendElement.value = searchHelper.getSearchFrontend();
});

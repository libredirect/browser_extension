import searchHelper from "../../assets/javascripts/helpers/google-search.js";

let disableSearchElement = document.getElementById("disable-search");
let searchFrontendElement = document.getElementById("search-frontend");

searchHelper.init().then(() => {
  disableSearchElement.checked = !searchHelper.getDisableSearch();
  searchFrontendElement.value = searchHelper.getSearchFrontend();
});

searchFrontendElement.addEventListener("change",
  (event) => searchHelper.setSearchFrontend(event.target.options[searchFrontendElement.selectedIndex].value)
);

disableSearchElement.addEventListener("change",
  (event) => searchHelper.setDisableSearch(!event.target.checked)
);

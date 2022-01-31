import searchHelper from "../../assets/javascripts/helpers/google-search.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const searchInstances = searchHelper.redirects;
let searchInstanceElement = document.getElementById("search-instance");
let disableSearchElement = document.getElementById("disable-search");
let searchFrontendElement = document.getElementById("search-frontend");

let searxRandomPoolElement = document.getElementById("searx-random-pool");
let searxRandomPoolListElement = document.getElementById("searx-random-pool-list");

let whoogleRandomPoolElement = document.getElementById("whoogle-random-pool");
let whoogleRandomPoolListElement = document.getElementById("whoogle-random-pool-list");

let searxRandomPool
let whoogleRandomPool

browser.storage.sync.get(
  [
    "searchInstance",
    "disableSearch",
    "searchFrontend",
    "searxRandomPool",
    "whoogleRandomPool"
  ],
  (result) => {
    searchInstanceElement.value = (result.searchInstance && result.searchInstance.link) || "";
    disableSearchElement.checked = !result.disableSearch;
    searchFrontendElement.value = result.searchFrontend;

    searxRandomPool = result.searxRandomPool || commonHelper.filterInstances(searchInstances.searx)
    searxRandomPoolElement.value = searxRandomPool.join("\n");
    commonHelper.updateListElement(searxRandomPoolListElement, searxRandomPool);

    whoogleRandomPool = result.whoogleRandomPool || commonHelper.filterInstances(searchInstances.whoogle)
    whoogleRandomPoolElement.value = whoogleRandomPool.join("\n");
    commonHelper.updateListElement(whoogleRandomPoolListElement, whoogleRandomPool);

    // let id = "search-instance"
    // let instances = searchInstances.map((instance) => instance.link)
    // shared.autocompletes.push({ id: id, instances: instances })
    // shared.autocomplete(document.getElementById(id), instances);
  }
)

const searchInstanceChange = commonHelper.debounce(() => {
  const instance = searchInstances.find(
    (instance) => instance.link === searchInstanceElement.value
  );
  if (instance || !searchInstanceElement.value) {
    browser.storage.sync.set({
      searchInstance: instance || searchInstanceElement.value,
    });
  } else {
    searchInstanceElement.setCustomValidity("Must be an instance from the list");
  }
}, 500);
searchInstanceElement.addEventListener("input", searchInstanceChange);

searchFrontendElement.addEventListener("change", (event) => {
  const value = event.target.options[searchFrontendElement.selectedIndex].value;
  console.info("Search Frontend:", value)
  browser.storage.sync.set({ searchFrontend: value })
});

disableSearchElement.addEventListener("change", (event) => {
  browser.storage.sync.set({ disableSearch: !event.target.checked });
});

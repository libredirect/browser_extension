import searchHelper from "../../assets/javascripts/helpers/google-search.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const searchEngineInstances = searchHelper.redirects;
let searchEngineInstanceElement = document.getElementById("searchEngine-instance");
let disableSearchEngineElement = document.getElementById("disable-searchEngine");

browser.storage.sync.get(
  [
    "searchEngineInstance",
    "disableSearchEngine",
  ],
  (result) => {
    searchEngineInstanceElement.value = (result.searchEngineInstance && result.searchEngineInstance.link) || "";

    disableSearchEngineElement.checked = !result.disableSearchEngine;

    let id = "searchEngine-instance"
    let instances = searchEngineInstances.map((instance) => instance.link)
    shared.autocompletes.push({ id: id, instances: instances })
    shared.autocomplete(document.getElementById(id), instances);
  }
)

const searchEngineInstanceChange = commonHelper.debounce(() => {
  const instance = searchEngineInstances.find(
    (instance) => instance.link === searchEngineInstanceElement.value
  );
  if (instance || !searchEngineInstanceElement.value) {
    browser.storage.sync.set({
      searchEngineInstance: instance || searchEngineInstanceElement.value,
    });
  } else {
    searchEngineInstanceElement.setCustomValidity("Must be an instance from the list");
  }
}, 500);
searchEngineInstanceElement.addEventListener("input", searchEngineInstanceChange);

disableSearchEngineElement.addEventListener("change", (event) => {
  browser.storage.sync.set({ disableSearchEngine: !event.target.checked });
});

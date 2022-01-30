import searchHelper from "../../assets/javascripts/helpers/google-search.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";
import shared from "./shared.js";

const searchEngineInstances = searchHelper.redirects;
let searchEngineInstance = document.getElementById("searchEngine-instance");
let disableSearchEngine = document.getElementById("disable-searchEngine");

browser.storage.sync.get(
  [
    "searchEngineInstance",
    "disableSearchEngine",
  ],
  (result) => {
    searchEngineInstance.value = (result.searchEngineInstance && result.searchEngineInstance.link) || "";

    disableSearchEngine.checked = !result.disableSearchEngine;

    let id = "searchEngine-instance"
    let instances = searchEngineInstances.map((instance) => instance.link)
    shared.autocompletes.push({ id: id, instances: instances })
    shared.autocomplete(document.getElementById(id), instances);
  }
)

const searchEngineInstanceChange = commonHelper.debounce(() => {
  const instance = searchEngineInstances.find(
    (instance) => instance.link === searchEngineInstance.value
  );
  if (instance || !searchEngineInstance.value) {
    browser.storage.sync.set({
      searchEngineInstance: instance || searchEngineInstance.value,
    });
  } else {
    searchEngineInstance.setCustomValidity("Must be an instance from the list");
  }
}, 500);
searchEngineInstance.addEventListener("input", searchEngineInstanceChange);

disableSearchEngine.addEventListener("change", (event) => {
  browser.storage.sync.set({ disableSearchEngine: !event.target.checked });
});

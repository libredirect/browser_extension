import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";

let disableWikipediaElement = document.getElementById("disable-wikipedia");

disableWikipediaElement.checked = !wikipediaHelper.getDisableWikipedia();

disableWikipediaElement.addEventListener("change",
    (event) => wikipediaHelper.setDisableWikipedia(!event.target.checked)
);
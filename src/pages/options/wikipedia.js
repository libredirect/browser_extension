import wikipediaHelper from "../../assets/javascripts/helpers/wikipedia.js";

let disableWikipediaElement = document.getElementById("disable-wikipedia");

wikipediaHelper.init().then(() => {
    disableWikipediaElement.checked = !wikipediaHelper.getDisableWikipedia();
})

disableWikipediaElement.addEventListener("change",
    (event) => wikipediaHelper.setDisableWikipedia(!event.target.checked)
);
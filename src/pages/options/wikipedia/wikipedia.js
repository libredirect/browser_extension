import wikipediaHelper from "../../../assets/javascripts/helpers/wikipedia.js";

let disableWikipediaElement = document.getElementById("disable-wikipedia");
disableWikipediaElement.addEventListener("change",
    (event) => wikipediaHelper.setDisableWikipedia(!event.target.checked)
);

wikipediaHelper.init().then(() => {
    disableWikipediaElement.checked = !wikipediaHelper.getDisableWikipedia();
})
window.browser = window.browser || window.chrome
import localise from "../../assets/javascripts/localise.js"

if (["ar", "iw", "ku", "fa", "ur"].includes(browser.i18n.getUILanguage())) {
  document.getElementsByTagName("body")[0].classList.add("rtl")
  document.getElementsByTagName("body")[0].dir = "rtl"
}
localise.localisePage()
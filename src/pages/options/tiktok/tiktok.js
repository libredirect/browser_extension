import tiktokHelper from "../../../assets/javascripts/helpers/tiktok.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableTiktokElement = document.getElementById("disable-tiktok");
disableTiktokElement.addEventListener("change",
    (event) => tiktokHelper.setDisable(!event.target.checked)
);

tiktokHelper.init().then(() => {
    disableTiktokElement.checked = !tiktokHelper.getDisable();

    commonHelper.processDefaultCustomInstances(
        'proxiTok',
        'normal',
        tiktokHelper,
        document,
        tiktokHelper.getProxiTokNormalRedirectsChecks,
        tiktokHelper.setProxiTokNormalRedirectsChecks,
        tiktokHelper.getProxiTokNormalCustomRedirects,
        tiktokHelper.setProxiTokNormalCustomRedirects
    )
})
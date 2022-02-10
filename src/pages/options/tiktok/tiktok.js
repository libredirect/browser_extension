import tiktokHelper from "../../../assets/javascripts/helpers/tiktok.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableTiktokElement = document.getElementById("disable-tiktok");
disableTiktokElement.addEventListener("change",
    (event) => tiktokHelper.setDisableTiktok(!event.target.checked)
);

tiktokHelper.init().then(() => {
    disableTiktokElement.checked = !tiktokHelper.getDisableTiktok();

    commonHelper.processDefaultCustomInstances(
        'proxiTok',
        tiktokHelper,
        document,
        tiktokHelper.getProxiTokRedirectsChecks,
        tiktokHelper.setProxiTokRedirectsChecks,
        tiktokHelper.getProxiTokCustomRedirects,
        tiktokHelper.setProxiTokCustomRedirects
    )
})
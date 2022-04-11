import twitterHelper from "../../../assets/javascripts/helpers/twitter.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableTwitterElement = document.getElementById("disable-nitter");
let customSettingsDivElement = document.getElementsByClassName("custom-settings");
let protocolElement = document.getElementById("protocol");
let enableYoutubeCustomSettingsElement = document.getElementById("enable-twitter-custom-settings");
let bypassWatchOnTwitterElement = document.getElementById("bypass-watch-on-twitter");

let nitterElement = document.getElementById("nitter");
document.addEventListener("change", _ => {
    twitterHelper.setDisable(!disableTwitterElement.checked)
    twitterHelper.setProtocol(protocolElement.value);
    twitterHelper.setEnableCustomSettings(enableYoutubeCustomSettingsElement.checked);
    twitterHelper.setBypassWatchOnTwitter(bypassWatchOnTwitterElement.checked);
    changeProtocolSettings(protocolElement.value);
})

function changeProtocolSettings(protocol) {
    let normalDiv = nitterElement.getElementsByClassName("normal")[0];
    let torDiv = nitterElement.getElementsByClassName("tor")[0];
    if (protocol == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
    if (enableYoutubeCustomSettingsElement.checked)
        for (const item of customSettingsDivElement) item.style.display = 'block';
    else
        for (const item of customSettingsDivElement) item.style.display = 'none';
}

twitterHelper.init().then(() => {
    disableTwitterElement.checked = !twitterHelper.getDisable();
    enableYoutubeCustomSettingsElement.checked = twitterHelper.getEnableCustomSettings();
    bypassWatchOnTwitterElement.checked = twitterHelper.getBypassWatchOnTwitter();

    let protocol = twitterHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances(
        'nitter',
        'normal',
        twitterHelper,
        document,
        twitterHelper.getNitterNormalRedirectsChecks,
        twitterHelper.setNitterNormalRedirectsChecks,
        twitterHelper.getNitterNormalCustomRedirects,
        twitterHelper.setNitterNormalCustomRedirects
    )
    commonHelper.processDefaultCustomInstances(
        'nitter',
        'tor',
        twitterHelper,
        document,
        twitterHelper.getNitterTorRedirectsChecks,
        twitterHelper.setNitterTorRedirectsChecks,
        twitterHelper.getNitterTorCustomRedirects,
        twitterHelper.setNitterTorCustomRedirects
    )
});
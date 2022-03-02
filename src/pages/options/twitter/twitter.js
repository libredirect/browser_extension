import twitterHelper from "../../../assets/javascripts/helpers/twitter.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableTwitterElement = document.getElementById("disable-nitter");
disableTwitterElement.addEventListener("change",
    (event) => twitterHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        twitterHelper.setProtocol(protocol);
        changeProtocolSettings(protocol);
    }
);


function changeProtocolSettings(protocol) {
    let normalDiv = document.getElementById("normal");
    let torDiv = document.getElementById("tor");
    if (protocol == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

let bypassWatchOnTwitterElement = document.getElementById("bypass-watch-on-twitter")
bypassWatchOnTwitterElement.addEventListener("change",
    event => twitterHelper.setBypassWatchOnTwitter(event.target.checked)
);

twitterHelper.init().then(() => {
    disableTwitterElement.checked = !twitterHelper.getDisable();
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
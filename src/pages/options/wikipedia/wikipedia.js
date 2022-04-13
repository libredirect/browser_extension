import wikipediaHelper from "../../../assets/javascripts/helpers/wikipedia.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableWikipediaElement = document.getElementById("disable-wikipedia");
disableWikipediaElement.addEventListener("change",
    event => wikipediaHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol");
protocolElement.addEventListener("change",
    event => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        wikipediaHelper.setProtocol(protocol);
        changeProtocolSettings(protocol);
    }
);

function changeProtocolSettings(protocol) {
    let normalDiv = document.getElementsByClassName("normal")[0];
    let torDiv = document.getElementsByClassName("tor")[0];
    let i2pDiv = document.getElementsByClassName("i2p")[0];
    if (protocol == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
	i2pDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
	i2pDiv.style.display = 'none';
    }
    else if (protocol == 'i2p') {
	normalDiv.style.display = 'none';
	torDiv.style.display = 'none';
	i2pDiv.style.display = 'block';
    }
}

wikipediaHelper.init().then(() => {
    disableWikipediaElement.checked = !wikipediaHelper.getDisable();

    let protocol = wikipediaHelper.getProtocol();
    console.log('protocol', protocol);
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    commonHelper.processDefaultCustomInstances(
        'wikiless',
        'normal',
        wikipediaHelper,
        document,
        wikipediaHelper.getWikilessNormalRedirectsChecks,
        wikipediaHelper.setWikilessNormalRedirectsChecks,
        wikipediaHelper.getWikilessNormalCustomRedirects,
        wikipediaHelper.setWikilessNormalCustomRedirects
    )

    commonHelper.processDefaultCustomInstances(
        'wikiless',
        'tor',
        wikipediaHelper,
        document,
        wikipediaHelper.getWikilessTorRedirectsChecks,
        wikipediaHelper.setWikilessTorRedirectsChecks,
        wikipediaHelper.getWikilessTorCustomRedirects,
        wikipediaHelper.setWikilessTorCustomRedirects
    )

    commonHelper.processDefaultCustomInstances(
	'wikiless',
	'i2p',
	wikipediaHelper,
	document,
	wikipediaHelper.getWikilessI2pRedirectsChecks,
	wikipediaHelper.setWikilessI2pRedirectsChecks,
	wikipediaHelper.getWikilessI2pCustomRedirects,
	wikipediaHelper.setWikilessI2pCustomRedirects
    )
})

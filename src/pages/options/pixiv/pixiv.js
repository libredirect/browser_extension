import pixivHelper from "../../../assets/javascripts/helpers/pixiv.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disablePixivElement = document.getElementById("disable-pixiv");
disablePixivElement.addEventListener("change",
    (event) => pixivHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        pixivHelper.setProtocol(protocol);
        changeProtocolSettings(protocol);
    }
);

function changeProtocolSettings(protocol) {
    let normalDiv = document.getElementsByClassName("normal")[0];
    let torDiv = document.getElementsByClassName("tor")[0];
    if (protocol == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

pixivHelper.init().then(() => {
    disablePixivElement.checked = !pixivHelper.getDisable();

    let protocol = pixivHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);


    browser.storage.local.get("pixivMoeLatency").then(r => {
        commonHelper.processDefaultCustomInstances(
            'pixivMoe',
            'normal',
            pixivHelper,
            document,
            pixivHelper.getPixivMoeNormalRedirectsChecks,
            pixivHelper.setPixivMoeNormalRedirectsChecks,
            pixivHelper.getPixivMoeNormalCustomRedirects,
            pixivHelper.setPixivMoeNormalCustomRedirects
        );
    })

    commonHelper.processDefaultCustomInstances(
        'pixivMoe',
        'tor',
        pixivHelper,
        document,
        pixivHelper.getPixivMoeTorRedirectsChecks,
        pixivHelper.setPixivMoeTorRedirectsChecks,
        pixivHelper.getPixivMoeTorCustomRedirects,
        pixivHelper.setPixivMoeTorCustomRedirects
    )
})


let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await pixivHelper.init();
        let redirects = pixivHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.pixivMoe.normal).then(r => {
            browser.storage.local.set({ pixivMoeLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances(
                'pixivMoe',
                'normal',
                pixivHelper,
                document,
                pixivHelper.getPixivMoeNormalRedirectsChecks,
                pixivHelper.setPixivMoeNormalRedirectsChecks,
                pixivHelper.getPixivMoeNormalCustomRedirects,
                pixivHelper.setPixivMoeNormalCustomRedirects,
                r,
            );
            latencyElement.removeEventListener("click", reloadWindow);
        });

    }
);
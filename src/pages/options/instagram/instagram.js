import instagramHelper from "../../../assets/javascripts/helpers/instagram.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableInstagramElement = document.getElementById("disable-bibliogram");
disableInstagramElement.addEventListener("change",
    (event) => instagramHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    (event) => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        instagramHelper.setProtocol(protocol);
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

instagramHelper.init().then(() => {
    disableInstagramElement.checked = !instagramHelper.getDisable();

    let protocol = instagramHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);


    browser.storage.local.get("bibliogramLatency").then(r => {
        commonHelper.processDefaultCustomInstances(
            'bibliogram',
            'normal',
            instagramHelper,
            document,
            instagramHelper.getBibliogramNormalRedirectsChecks,
            instagramHelper.setBibliogramNormalRedirectsChecks,
            instagramHelper.getBibliogramNormalCustomRedirects,
            instagramHelper.setBibliogramNormalCustomRedirects,
            r.bibliogramLatency,
        )
    })

    commonHelper.processDefaultCustomInstances(
        'bibliogram',
        'tor',
        instagramHelper,
        document,
        instagramHelper.getBibliogramTorRedirectsChecks,
        instagramHelper.setBibliogramTorRedirectsChecks,
        instagramHelper.getBibliogramTorCustomRedirects,
        instagramHelper.setBibliogramTorCustomRedirects
    )
})


let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await instagramHelper.init();
        let redirects = instagramHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.bibliogram.normal).then(r => {
            browser.storage.local.set({ bibliogramLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances(
                'bibliogram',
                'normal',
                instagramHelper,
                document,
                instagramHelper.getBibliogramNormalRedirectsChecks,
                instagramHelper.setBibliogramNormalRedirectsChecks,
                instagramHelper.getBibliogramNormalCustomRedirects,
                instagramHelper.setBibliogramNormalCustomRedirects,
                r,
            );
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
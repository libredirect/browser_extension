import lbryHelper from "../../../assets/javascripts/helpers/lbry.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableLbryElement = document.getElementById("disable-lbry");
disableLbryElement.addEventListener("change",
    (event) => lbryHelper.setDisable(!event.target.checked)
);

let protocolElement = document.getElementById("protocol")
protocolElement.addEventListener("change",
    event => {
        let protocol = event.target.options[protocolElement.selectedIndex].value
        lbryHelper.setProtocol(protocol);
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

lbryHelper.init().then(() => {
    disableLbryElement.checked = !lbryHelper.getDisable();

    let protocol = lbryHelper.getProtocol();
    protocolElement.value = protocol;
    changeProtocolSettings(protocol);

    browser.storage.local.get("librarianLatency").then(r => {
        commonHelper.processDefaultCustomInstances(
            'librarian',
            'normal',
            lbryHelper,
            document,
            lbryHelper.getLibrarianNormalRedirectsChecks,
            lbryHelper.setLibrarianNormalRedirectsChecks,
            lbryHelper.getLibrarianNormalCustomRedirects,
            lbryHelper.setLibrarianNormalCustomRedirects,
            r.librarianLatency,
        );
    })

    commonHelper.processDefaultCustomInstances(
        'librarian',
        'tor',
        lbryHelper,
        document,
        lbryHelper.getLibrarianTorRedirectsChecks,
        lbryHelper.setLibrarianTorRedirectsChecks,
        lbryHelper.getLibrarianTorCustomRedirects,
        lbryHelper.setLibrarianTorCustomRedirects
    )
})


let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await lbryHelper.init();
        let redirects = lbryHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.librarian.normal).then(r => {
            browser.storage.local.set({ librarianLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances(
                'librarian',
                'normal',
                lbryHelper,
                document,
                lbryHelper.getLibrarianNormalRedirectsChecks,
                lbryHelper.setLibrarianNormalRedirectsChecks,
                lbryHelper.getLibrarianNormalCustomRedirects,
                lbryHelper.setLibrarianNormalCustomRedirects,
                r,
            );
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);
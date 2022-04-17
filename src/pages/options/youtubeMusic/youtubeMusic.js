import youtubeMusicHelper from "../../../assets/javascripts/helpers/youtubeMusic.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableYoutubeMusicElement = document.getElementById("disable-beatbump");
disableYoutubeMusicElement.addEventListener("change",
    (event) => youtubeMusicHelper.setDisable(!event.target.checked)
);

youtubeMusicHelper.init().then(() => {
    disableYoutubeMusicElement.checked = !youtubeMusicHelper.getDisable();

    browser.storage.local.get("beatbumpLatency").then(r => {
        commonHelper.processDefaultCustomInstances(
            'beatbump',
            'normal',
            youtubeMusicHelper,
            document,
            youtubeMusicHelper.getBeatbumpNormalRedirectsChecks,
            youtubeMusicHelper.setBeatbumpNormalRedirectsChecks,
            youtubeMusicHelper.getBeatbumpNormalCustomRedirects,
            youtubeMusicHelper.setBeatbumpNormalCustomRedirects,
            r.beatbumpLatency,
        );
    })
});

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await youtubeMusicHelper.init();
        let redirects = youtubeMusicHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.beatbump.normal).then(r => {
            browser.storage.local.set({ beatbumpLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances(
                'beatbump',
                'normal',
                youtubeMusicHelper,
                document,
                youtubeMusicHelper.getBeatbumpNormalRedirectsChecks,
                youtubeMusicHelper.setBeatbumpNormalRedirectsChecks,
                youtubeMusicHelper.getBeatbumpNormalCustomRedirects,
                youtubeMusicHelper.setBeatbumpNormalCustomRedirects,
                r,
            )
            latencyElement.removeEventListener("click", reloadWindow)
        });
    }
);
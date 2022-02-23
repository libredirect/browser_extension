import youtubeMusicHelper from "../../../assets/javascripts/helpers/youtubeMusic.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

let disableYoutubeMusicElement = document.getElementById("disable-beatbump");
disableYoutubeMusicElement.addEventListener("change",
    (event) => youtubeMusicHelper.setDisable(!event.target.checked)
);

youtubeMusicHelper.init().then(() => {
    disableYoutubeMusicElement.checked = !youtubeMusicHelper.getDisable();

    commonHelper.processDefaultCustomInstances(
        'beatbump',
        'normal',
        youtubeMusicHelper,
        document,
        youtubeMusicHelper.getBeatbumpNormalRedirectsChecks,
        youtubeMusicHelper.setBeatbumpNormalRedirectsChecks,
        youtubeMusicHelper.getBeatbumpNormalCustomRedirects,
        youtubeMusicHelper.setBeatbumpNormalCustomRedirects
    )
});
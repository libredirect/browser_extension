import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

youtubeHelper.init().then(() => {
    commonHelper.processDefaultCustomInstances(
        'piped',
        'normal',
        youtubeHelper,
        document,
        youtubeHelper.getPipedNormalRedirectsChecks,
        youtubeHelper.setPipedNormalRedirectsChecks,
        youtubeHelper.getPipedNormalCustomRedirects,
        youtubeHelper.setPipedNormalCustomRedirects
    );
    commonHelper.processDefaultCustomInstances(
        'piped',
        'tor',
        youtubeHelper,
        document,
        youtubeHelper.getPipedTorRedirectsChecks,
        youtubeHelper.setPipedTorRedirectsChecks,
        youtubeHelper.getPipedTorCustomRedirects,
        youtubeHelper.setPipedTorCustomRedirects
    );
});

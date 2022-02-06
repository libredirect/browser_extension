import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

youtubeHelper.init().then(() => {
    commonHelper.processDefaultCustomInstances(
        'piped',
        youtubeHelper,
        document,
        youtubeHelper.getPipedRedirectsChecks,
        youtubeHelper.setPipedRedirectsChecks,
        youtubeHelper.getPipedCustomRedirects,
        youtubeHelper.setPipedCustomRedirects
    )
});









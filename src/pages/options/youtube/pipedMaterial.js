import youtubeHelper from "../../../assets/javascripts/helpers/youtube/youtube.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

youtubeHelper.init().then(() => {
    commonHelper.processDefaultCustomInstances(
        'pipedMaterial',
        'normal',
        youtubeHelper,
        document,
        youtubeHelper.getPipedMaterialNormalRedirectsChecks,
        youtubeHelper.setPipedMaterialNormalRedirectsChecks,
        youtubeHelper.getPipedMaterialNormalCustomRedirects,
        youtubeHelper.setPipedMaterialNormalCustomRedirects
    );
    commonHelper.processDefaultCustomInstances(
        'pipedMaterial',
        'tor',
        youtubeHelper,
        document,
        youtubeHelper.getPipedMaterialTorRedirectsChecks,
        youtubeHelper.setPipedMaterialTorRedirectsChecks,
        youtubeHelper.getPipedMaterialTorCustomRedirects,
        youtubeHelper.setPipedMaterialTorCustomRedirects
    );
});

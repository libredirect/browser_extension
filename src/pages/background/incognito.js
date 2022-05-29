import youtubeHelper from "../../assets/javascripts/youtube/youtube.js";
import twitterHelper from "../../assets/javascripts/twitter.js";
import redditHelper from "../../assets/javascripts/reddit.js";
import searchHelper from "../../assets/javascripts/search.js";
import translateHelper from "../../assets/javascripts/translate/translate.js";
import wikipediaHelper from "../../assets/javascripts/wikipedia.js";
import tiktokHelper from "../../assets/javascripts/tiktok.js";

window.browser = window.browser || window.chrome;

await youtubeHelper.setInvidiousCookies();
await youtubeHelper.initPipedLocalStorage();
await youtubeHelper.initPipedMaterialLocalStorage();
await translateHelper.setSimplyTranslateCookies();
await translateHelper.initLingvaLocalStorage();
await twitterHelper.setNitterCookies();
await wikipediaHelper.setWikilessCookies();
await searchHelper.setSearxCookies();
await searchHelper.setSearxngCookies();
await redditHelper.setLibredditCookies();
await redditHelper.setTedditCookies();
await tiktokHelper.setProxiTokCookies();

window.close()
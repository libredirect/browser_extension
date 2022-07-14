import youtubeHelper from "../../assets/javascripts/youtube/youtube.js";
import twitterHelper from "../../assets/javascripts/twitter.js";
import redditHelper from "../../assets/javascripts/reddit.js";
import searchHelper from "../../assets/javascripts/search.js";
import translateHelper from "../../assets/javascripts/translate/translate.js";
import wikipediaHelper from "../../assets/javascripts/wikipedia.js";
import tiktokHelper from "../../assets/javascripts/tiktok.js";

window.browser = window.browser || window.chrome;

await youtubeHelper.pasteInvidiousCookies();
await translateHelper.pasteSimplyTranslateCookies();
await twitterHelper.pasteNitterCookies();
await wikipediaHelper.pasteWikilessCookies();
await searchHelper.pasteSearxCookies();
await searchHelper.pasteSearxngCookies();
await searchHelper.pasteLibrexCookies();
await redditHelper.pasteLibredditCookies();
await redditHelper.pasteTedditCookies();
await tiktokHelper.pasteProxiTokCookies();

window.close()

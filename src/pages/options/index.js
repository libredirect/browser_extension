import youtubeHelper from "../../assets/javascripts/youtube/youtube.js";
import twitterHelper from "../../assets/javascripts/twitter.js";
import redditHelper from "../../assets/javascripts/reddit.js";
import searchHelper from "../../assets/javascripts/search.js";
import translateHelper from "../../assets/javascripts/translate/translate.js";
import wikipediaHelper from "../../assets/javascripts/wikipedia.js";
import tiktokHelper from "../../assets/javascripts/tiktok.js";


for (const a of document.getElementById('links').getElementsByTagName('a')) {
    a.addEventListener('click', e => {
        const path = a.getAttribute('href').replace('#', '');
        loadPage(path);
        e.preventDefault();
    })
}

function loadPage(path) {
    for (const section of document.getElementById('pages').getElementsByTagName('section'))
        section.style.display = 'none';
    document.getElementById(`${path}_page`).style.display = 'block';

    for (const a of document.getElementById('links').getElementsByTagName('a'))
        if (a.getAttribute('href') == `#${path}`) a.classList.add('selected')
        else a.classList.remove('selected')

    let stateObj = { id: "100" };
    window.history.pushState(stateObj, "Page 2", `/pages/options/index.html#${path}`);
}

const r = window.location.href.match(/#(.*)/)
if (r) loadPage(r[1]);
else loadPage('general');
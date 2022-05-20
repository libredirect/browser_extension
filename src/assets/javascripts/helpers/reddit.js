window.browser = window.browser || window.chrome;

import utils from './utils.js'

const targets = [
  /^https?:\/{2}(www\.|old\.|np\.|new\.|amp\.|)reddit\.com/,
  /^https?:\/{2}(i\.|preview\.)redd\.it/,
];
let redirects = {
  "libreddit": {
    "normal": [],
    "tor": []
  },
  "teddit": {
    "normal": [],
    "tor": []
  },
};
const getRedirects = () => redirects;

function setLibredditRedirects(val) {
  redirects.libreddit = val;
  browser.storage.local.set({ redditRedirects: redirects })
  console.log("libredditRedirects:", val)
  for (const item of libredditNormalRedirectsChecks)
    if (!redirects.libreddit.normal.includes(item)) {
      var index = libredditNormalRedirectsChecks.indexOf(item);
      if (index !== -1) libredditNormalRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ libredditNormalRedirectsChecks })

  for (const item of libredditTorRedirectsChecks)
    if (!redirects.libreddit.normal.includes(item)) {
      var index = libredditTorRedirectsChecks.indexOf(item);
      if (index !== -1) libredditTorRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ libredditTorRedirectsChecks })
}

function setTedditRedirects(val) {
  redirects.teddit = val;
  browser.storage.local.set({ redditRedirects: redirects })
  console.log("tedditRedirects:", val)
  for (const item of tedditNormalRedirectsChecks)
    if (!redirects.teddit.normal.includes(item)) {
      var index = tedditNormalRedirectsChecks.indexOf(item);
      if (index !== -1) tedditNormalRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ tedditNormalRedirectsChecks })

  for (const item of tedditTorRedirectsChecks)
    if (!redirects.teddit.normal.includes(item)) {
      var index = tedditTorRedirectsChecks.indexOf(item);
      if (index !== -1) tedditTorRedirectsChecks.splice(index, 1);
    }
  browser.storage.local.set({ tedditTorRedirectsChecks })
}

let libredditNormalRedirectsChecks;
let libredditTorRedirectsChecks;
let libredditNormalCustomRedirects = [];
let libredditTorCustomRedirects = [];

let tedditNormalRedirectsChecks;
let tedditTorRedirectsChecks;
let tedditNormalCustomRedirects = [];
let tedditTorCustomRedirects = [];

function initLibredditCookies(from) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "redditProtocol",
        "libredditNormalRedirectsChecks",
        "libredditNormalCustomRedirects",
        "libredditTorRedirectsChecks",
        "libredditTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(from);
        if (![
          ...r.libredditNormalRedirectsChecks,
          ...r.libredditTorRedirectsChecks,
          ...r.libredditNormalCustomRedirects,
          ...r.libredditTorCustomRedirects,
        ].includes(protocolHost)) resolve();

        let checkedInstances;
        if (r.redditProtocol == 'normal') checkedInstances = [...r.libredditNormalRedirectsChecks, ...r.libredditNormalCustomRedirects];
        else if (r.redditProtocol == 'tor') checkedInstances = [...r.libredditTorRedirectsChecks, ...r.libredditTorCustomRedirects];
        for (const to of checkedInstances) {
          utils.copyCookie('libreddit', from, to, "theme");
          utils.copyCookie('libreddit', from, to, "front_page");
          utils.copyCookie('libreddit', from, to, "layout");
          utils.copyCookie('libreddit', from, to, "wide");
          utils.copyCookie('libreddit', from, to, "post_sort");
          utils.copyCookie('libreddit', from, to, "comment_sort");
          utils.copyCookie('libreddit', from, to, "show_nsfw");
          utils.copyCookie('libreddit', from, to, "autoplay_videos");
          utils.copyCookie('libreddit', from, to, "use_hls");
          utils.copyCookie('libreddit', from, to, "hide_hls_notification");
        }
        resolve(true);
      }
    )
  })

}

function setLibredditCookies() {
  browser.storage.local.get(
    [
      "redditProtocol",
      "disableReddit",
      "redditFrontend",
      "libredditNormalRedirectsChecks",
      "libredditNormalCustomRedirects",
      "libredditTorRedirectsChecks",
      "libredditTorCustomRedirects",
    ],
    r => {
      if (r.disableReddit || r.redditFrontend != 'libreddit' || r.redditProtocol === undefined) return;
      let checkedInstances;
      if (r.redditProtocol == 'normal') checkedInstances = [...r.libredditNormalRedirectsChecks, ...r.libredditNormalCustomRedirects]
      else if (r.redditProtocol == 'tor') checkedInstances = [...r.libredditTorRedirectsChecks, ...r.libredditTorCustomRedirects]
      for (const to of checkedInstances) {
        utils.getCookiesFromStorage('libreddit', to, "theme");
        utils.getCookiesFromStorage('libreddit', to, "front_page");
        utils.getCookiesFromStorage('libreddit', to, "layout");
        utils.getCookiesFromStorage('libreddit', to, "wide");
        utils.getCookiesFromStorage('libreddit', to, "post_sort");
        utils.getCookiesFromStorage('libreddit', to, "comment_sort");
        utils.getCookiesFromStorage('libreddit', to, "show_nsfw");
        utils.getCookiesFromStorage('libreddit', to, "autoplay_videos");
        utils.getCookiesFromStorage('libreddit', to, "use_hls");
        utils.getCookiesFromStorage('libreddit', to, "hide_hls_notification");
      }
    }
  )
}

function initTedditCookies(from) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "redditProtocol",
        "tedditNormalRedirectsChecks",
        "tedditNormalCustomRedirects",
        "tedditTorRedirectsChecks",
        "tedditTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(from);
        if (![
          ...r.tedditNormalRedirectsChecks,
          ...r.tedditTorRedirectsChecks,
          ...r.tedditNormalCustomRedirects,
          ...r.tedditTorCustomRedirects,
        ].includes(protocolHost)) resolve();

        let checkedInstances;
        if (r.redditProtocol == 'normal') checkedInstances = [...r.tedditNormalRedirectsChecks, ...r.tedditNormalCustomRedirects]
        else if (r.redditProtocol == 'tor') checkedInstances = [...r.tedditTorRedirectsChecks, ...r.tedditTorCustomRedirects]
        for (const to of checkedInstances) {
          utils.copyCookie('teddit', from, to, 'collapse_child_comments')
          utils.copyCookie('teddit', from, to, 'domain_instagram')
          utils.copyCookie('teddit', from, to, 'domain_twitter')
          utils.copyCookie('teddit', from, to, 'domain_youtube')
          utils.copyCookie('teddit', from, to, 'flairs')
          utils.copyCookie('teddit', from, to, 'highlight_controversial')
          utils.copyCookie('teddit', from, to, 'nsfw_enabled')
          utils.copyCookie('teddit', from, to, 'post_media_max_height')
          utils.copyCookie('teddit', from, to, 'show_upvoted_percentage')
          utils.copyCookie('teddit', from, to, 'show_upvotes')
          utils.copyCookie('teddit', from, to, 'theme')
          utils.copyCookie('teddit', from, to, 'videos_muted')
        }
        resolve(true);
      }
    )
  })
}

function setTedditCookies() {
  browser.storage.local.get(
    [
      "redditProtocol",
      "disableReddit",
      "redditFrontend",
      "tedditNormalRedirectsChecks",
      "tedditNormalCustomRedirects",
      "tedditTorRedirectsChecks",
      "tedditTorCustomRedirects",
    ],
    r => {
      if (r.disableReddit || r.redditFrontend != 'teddit' || r.redditProtocol === undefined) return;
      let checkedInstances;
      if (r.redditProtocol == 'normal') checkedInstances = [...r.tedditNormalRedirectsChecks, ...r.tedditNormalCustomRedirects]
      else if (r.redditProtocol == 'tor') checkedInstances = [...r.tedditTorRedirectsChecks, ...r.tedditTorCustomRedirects]
      for (const to of checkedInstances) {
        utils.getCookiesFromStorage('teddit', to, 'collapse_child_comments')
        utils.getCookiesFromStorage('teddit', to, 'domain_instagram')
        utils.getCookiesFromStorage('teddit', to, 'domain_twitter')
        utils.getCookiesFromStorage('teddit', to, 'domain_youtube')
        utils.getCookiesFromStorage('teddit', to, 'flairs')
        utils.getCookiesFromStorage('teddit', to, 'highlight_controversial')
        utils.getCookiesFromStorage('teddit', to, 'nsfw_enabled')
        utils.getCookiesFromStorage('teddit', to, 'post_media_max_height')
        utils.getCookiesFromStorage('teddit', to, 'show_upvoted_percentage')
        utils.getCookiesFromStorage('teddit', to, 'show_upvotes')
        utils.getCookiesFromStorage('teddit', to, 'theme')
        utils.getCookiesFromStorage('teddit', to, 'videos_muted')
      }
    }
  )
}

function redirect(url, type, initiator) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableReddit",
        "redditFrontend",
        "redditRedirects",
        "redditProtocol",

        "libredditNormalRedirectsChecks",
        "libredditNormalCustomRedirects",
        "libredditTorRedirectsChecks",
        "libredditTorCustomRedirects",

        "tedditNormalRedirectsChecks",
        "tedditNormalCustomRedirects",
        "tedditTorRedirectsChecks",
        "tedditTorCustomRedirects",
      ],
      r => {
        // https://libreddit.exonip.de/vid/1mq8d0ma3yk81/720.mp4
        // https://libreddit.exonip.de/img/4v3t1vgvrzk81.png

        // https://teddit.net/vids/1mq8d0ma3yk81.mp4
        // https://teddit.net/pics/w:null_4v3t1vgvrzk81.png


        // redd.it/t5379n
        // https://v.redd.it/z08avb339n801/DASH_1_2_M
        // https://i.redd.it/bfkhs659tzk81.jpg

        if (r.disableReddit) { resolve(); return; }
        if (!targets.some(rx => rx.test(url.href))) { resolve(); return; }

        if (
          initiator &&
          [
            ...r.redditRedirects.libreddit.normal,
            ...r.redditRedirects.libreddit.tor,
            ...r.redditRedirects.teddit.normal,
            ...r.redditRedirects.teddit.tor,
            ...r.libredditNormalCustomRedirects,
            ...r.libredditTorCustomRedirects,
            ...r.tedditNormalCustomRedirects,
            ...r.tedditTorCustomRedirects,
          ].includes(initiator.origin)
        ) { resolve('BYPASSTAB'); return; }

        const bypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/;
        if (type !== "main_frame" || url.pathname.match(bypassPaths)) { resolve(); return; }

        let libredditInstancesList;
        let tedditInstancesList;
        if (r.redditProtocol == 'normal') {
          libredditInstancesList = [...r.libredditNormalRedirectsChecks, ...r.libredditNormalCustomRedirects];
          tedditInstancesList = [...r.tedditNormalRedirectsChecks, ...r.tedditNormalCustomRedirects];
        } else if (r.redditProtocol == 'tor') {
          libredditInstancesList = [...r.libredditTorRedirectsChecks, ...r.libredditTorCustomRedirects];
          tedditInstancesList = [...r.tedditTorRedirectsChecks, ...r.tedditTorCustomRedirects];
        }

        if (url.host === "i.redd.it") {
          if (r.redditFrontend == 'teddit') {
            if (tedditInstancesList.length === 0) { resolve(); return; }
            let tedditRandomInstance = utils.getRandomInstance(tedditInstancesList);
            resolve(`${tedditRandomInstance}/pics/w:null_${url.pathname.substring(1)}${url.reddit}`); return;
          }
          if (r.redditFrontend == 'libreddit') {
            if (libredditInstancesList.length === 0) { resolve(); return; }
            let libredditRandomInstance = utils.getRandomInstance(libredditInstancesList);
            resolve(`${libredditRandomInstance}/img${url.pathname}${url.reddit}`); return;
          }
        }
        else if (url.host === "redd.it") {
          if (r.redditFrontend == 'libreddit' && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) {
            if (libredditInstancesList.length === 0) { resolve(); return; }
            let libredditRandomInstance = utils.getRandomInstance(libredditInstancesList);
            // https://redd.it/foo => https://libredd.it/comments/foo
            resolve(`${libredditRandomInstance}/comments${url.pathname}${url.reddit}`); return;
          }
          if (r.redditFrontend == 'teddit' && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) {
            if (tedditInstancesList.length === 0) { resolve(); return; }
            let tedditRandomInstance = utils.getRandomInstance(tedditInstancesList);
            // https://redd.it/foo => https://teddit.net/comments/foo
            resolve(`${tedditRandomInstance}/comments${url.pathname}${url.reddit}`); return;
          }
        }
        else if (url.host === 'preview.redd.it') {
          if (r.redditFrontend == 'teddit') {
            { resolve(); return; }
          }
          if (r.redditFrontend == 'libreddit') {
            if (libredditInstancesList.length === 0) { resolve(); return; }
            let libredditRandomInstance = utils.getRandomInstance(libredditInstancesList);
            resolve(`${libredditRandomInstance}/preview/pre${url.pathname}${url.reddit}`); return;
          }
        }

        let randomInstance;
        if (r.redditFrontend == 'libreddit') {
          if (libredditInstancesList.length === 0) { resolve(); return; }
          randomInstance = utils.getRandomInstance(libredditInstancesList);
        }
        if (r.redditFrontend == 'teddit') {
          if (tedditInstancesList.length === 0) { resolve(); return; }
          randomInstance = utils.getRandomInstance(tedditInstancesList);
        }
        resolve(`${randomInstance}${url.pathname}${url.search}`);
      })
  })
}

function reverse(url) {
  let protocolHost = utils.protocolHost(url);
  if (
    ![...redirects.nitter.normal,
    ...redirects.nitter.tor,
    ...nitterNormalCustomRedirects,
    ...nitterTorCustomRedirects].includes(protocolHost)
  ) return;
  if (url.pathname.includes('/pics/w:null_'))
    return `https://reddit.com${url.pathname}${url.reddit}`;
}

function switchInstance(url) {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "redditRedirects",
        "redditFrontend",
        "redditProtocol",

        "libredditNormalRedirectsChecks",
        "libredditNormalCustomRedirects",
        "libredditTorRedirectsChecks",
        "libredditTorCustomRedirects",

        "tedditNormalRedirectsChecks",
        "tedditNormalCustomRedirects",
        "tedditTorRedirectsChecks",
        "tedditTorCustomRedirects",
      ],
      r => {
        let protocolHost = utils.protocolHost(url);
        if (![
          ...r.redditRedirects.libreddit.normal,
          ...r.redditRedirects.libreddit.tor,

          ...r.libredditNormalCustomRedirects,
          ...r.libredditTorCustomRedirects,

          ...r.redditRedirects.teddit.normal,
          ...r.redditRedirects.teddit.tor,

          ...r.tedditNormalCustomRedirects,
          ...r.tedditTorCustomRedirects,
        ].includes(protocolHost)) { resolve(); return; }

        let instancesList;
        if (r.redditFrontend == 'libreddit') {
          if (r.redditProtocol == 'normal') instancesList = [...r.libredditNormalRedirectsChecks, ...r.libredditNormalCustomRedirects];
          else if (r.redditProtocol == 'tor') instancesList = [...r.libredditTorRedirectsChecks, ...r.libredditTorCustomRedirects];
          if ([
            ...r.redditRedirects.teddit.normal,
            ...r.redditRedirects.teddit.tor
          ].includes(protocolHost)) url.pathname = url.pathname.replace("/pics/w:null_", "/img/");
        }
        else if (r.redditFrontend == 'teddit') {
          if (r.redditProtocol == 'normal') instancesList = [...r.tedditNormalRedirectsChecks, ...r.tedditNormalCustomRedirects];
          else if (r.redditProtocol == 'tor') instancesList = [...r.tedditTorRedirectsChecks, ...r.tedditTorCustomRedirects];
          if ([
            ...r.redditRedirects.libreddit.normal,
            ...r.redditRedirects.libreddit.tor
          ].includes(protocolHost)
          ) url.pathname = url.pathname.replace("/img/", "/pics/w:null_");
        }

        let index = instancesList.indexOf(protocolHost);
        if (index > -1) instancesList.splice(index, 1);
        if (instancesList.length === 0) { resolve(); return; }

        let randomInstance = utils.getRandomInstance(instancesList);
        resolve(`${randomInstance}${url.pathname}${url.reddit}`)
      }
    )
  })
}

function initDefaults() {
  fetch('/instances/data.json').then(response => response.text()).then(async data => {
    let dataJson = JSON.parse(data);
    redirects.teddit = dataJson.teddit;
    redirects.libreddit = dataJson.libreddit;
    browser.storage.local.get('cloudflareList', async r => {
      libredditNormalRedirectsChecks = [...redirects.libreddit.normal];
      tedditNormalRedirectsChecks = [...redirects.teddit.normal]
      for (const instance of r.cloudflareList) {
        let i;

        i = libredditNormalRedirectsChecks.indexOf(instance);
        if (i > -1) libredditNormalRedirectsChecks.splice(i, 1);

        i = tedditNormalRedirectsChecks.indexOf(instance);
        if (i > -1) tedditNormalRedirectsChecks.splice(i, 1);
      }
      await browser.storage.local.set({
        disableReddit: false,
        redditProtocol: 'normal',
        redditFrontend: 'libreddit',
        redditRedirects: redirects,

        libredditNormalRedirectsChecks: libredditNormalRedirectsChecks,
        libredditNormalCustomRedirects: [],

        libredditTorRedirectsChecks: [...redirects.libreddit.tor],
        libredditTorCustomRedirects: [],

        tedditNormalRedirectsChecks: tedditNormalRedirectsChecks,
        tedditNormalCustomRedirects: [],

        tedditTorRedirectsChecks: [...redirects.teddit.tor],
        tedditTorCustomRedirects: [],
      });
    });
  });
}

export default {
  getRedirects,
  setTedditRedirects,
  setLibredditRedirects,

  initLibredditCookies,
  setLibredditCookies,
  initTedditCookies,
  setTedditCookies,

  redirect,
  initDefaults,
  switchInstance,
};

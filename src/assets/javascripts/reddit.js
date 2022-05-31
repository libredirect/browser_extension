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
function setRedirects(val) {
  browser.storage.local.get('cloudflareList', r => {
    redirects = val;
    libredditNormalRedirectsChecks = [...redirects.libreddit.normal];
    tedditNormalRedirectsChecks = [...redirects.teddit.normal]
    for (const instance of r.cloudflareList) {
      const a = libredditNormalRedirectsChecks.indexOf(instance);
      if (a > -1) libredditNormalRedirectsChecks.splice(a, 1);

      const b = tedditNormalRedirectsChecks.indexOf(instance);
      if (b > -1) tedditNormalRedirectsChecks.splice(b, 1);
    }
    browser.storage.local.set({
      redditRedirects: redirects,
      libredditNormalRedirectsChecks,
      tedditNormalRedirectsChecks
    })
  })
}

let
  disableReddit,
  redditFrontend,
  redditRedirects,
  redditProtocol,
  libredditNormalRedirectsChecks,
  libredditNormalCustomRedirects,
  libredditTorRedirectsChecks,
  libredditTorCustomRedirects,
  tedditNormalRedirectsChecks,
  tedditNormalCustomRedirects,
  tedditTorRedirectsChecks,
  tedditTorCustomRedirects;

function init() {
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
        disableReddit = r.disableReddit;
        redditFrontend = r.redditFrontend;
        redditRedirects = r.redditRedirects;
        redditProtocol = r.redditProtocol;
        libredditNormalRedirectsChecks = r.libredditNormalRedirectsChecks;
        libredditNormalCustomRedirects = r.libredditNormalCustomRedirects;
        libredditTorRedirectsChecks = r.libredditTorRedirectsChecks;
        libredditTorCustomRedirects = r.libredditTorCustomRedirects;
        tedditNormalRedirectsChecks = r.tedditNormalRedirectsChecks;
        tedditNormalCustomRedirects = r.tedditNormalCustomRedirects;
        tedditTorRedirectsChecks = r.tedditTorRedirectsChecks;
        tedditTorCustomRedirects = r.tedditTorCustomRedirects;
        resolve();
      }
    )
  })
}

init();
browser.storage.onChanged.addListener(init)

function initLibredditCookies(test, from) {
  return new Promise(async resolve => {
    await init();
    let protocolHost = utils.protocolHost(from);
    if (![
      ...libredditNormalRedirectsChecks,
      ...libredditTorRedirectsChecks,
      ...libredditNormalCustomRedirects,
      ...libredditTorCustomRedirects,
    ].includes(protocolHost)) { resolve(); return; }

    if (!test) {
      let checkedInstances;
      if (redditProtocol == 'normal') checkedInstances = [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects];
      else if (redditProtocol == 'tor') checkedInstances = [...libredditTorRedirectsChecks, ...libredditTorCustomRedirects];
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
    }
    resolve(true);
  })
}

function setLibredditCookies() {
  return new Promise(async resolve => {
    await init();
    if (disableReddit || redditFrontend != 'libreddit' || redditProtocol === undefined) { resolve(); return; }
    let checkedInstances;
    if (redditProtocol == 'normal') checkedInstances = [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects]
    else if (redditProtocol == 'tor') checkedInstances = [...libredditTorRedirectsChecks, ...libredditTorCustomRedirects]
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
    resolve();
  })
}

function initTedditCookies(test, from) {
  return new Promise(async resolve => {
    await init();
    let protocolHost = utils.protocolHost(from);
    if (![
      ...tedditNormalRedirectsChecks,
      ...tedditTorRedirectsChecks,
      ...tedditNormalCustomRedirects,
      ...tedditTorCustomRedirects,
    ].includes(protocolHost)) resolve();

    if (!test) {
      let checkedInstances;
      if (redditProtocol == 'normal') checkedInstances = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects]
      else if (redditProtocol == 'tor') checkedInstances = [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects]
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
    }
    resolve(true);
  })
}

function setTedditCookies() {
  return new Promise(async resolve => {
    await init();
    if (disableReddit || redditFrontend != 'teddit' || redditProtocol === undefined) { resolve(); return; }
    let checkedInstances;
    if (redditProtocol == 'normal') checkedInstances = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects]
    else if (redditProtocol == 'tor') checkedInstances = [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects]
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
    resolve();
  })
}

function all() {
  return [
    ...redditRedirects.libreddit.normal,
    ...redditRedirects.libreddit.tor,
    ...redditRedirects.teddit.normal,
    ...redditRedirects.teddit.tor,
    ...libredditNormalCustomRedirects,
    ...libredditTorCustomRedirects,
    ...tedditNormalCustomRedirects,
    ...tedditTorCustomRedirects,
  ];
}

// https://libreddit.exonip.de/vid/1mq8d0ma3yk81/720.mp4
// https://libreddit.exonip.de/img/4v3t1vgvrzk81.png

// https://teddit.net/vids/1mq8d0ma3yk81.mp4
// https://teddit.net/pics/w:null_4v3t1vgvrzk81.png


// redd.it/t5379n
// https://v.redd.it/z08avb339n801/DASH_1_2_M
// https://i.redd.it/bfkhs659tzk81.jpg
function redirect(url, type, initiator) {
  if (disableReddit) return;
  if (!targets.some(rx => rx.test(url.href))) return;
  if (initiator && all().includes(initiator.origin)) return 'BYPASSTAB';
  if (!["main_frame", "xmlhttprequest", "other", "image", "media"].includes(type)) return;
  const bypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/;
  if (url.pathname.match(bypassPaths)) return;

  let libredditInstancesList;
  let tedditInstancesList;
  if (redditProtocol == 'normal') {
    libredditInstancesList = [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects];
    tedditInstancesList = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects];
  } else if (redditProtocol == 'tor') {
    libredditInstancesList = [...libredditTorRedirectsChecks, ...libredditTorCustomRedirects];
    tedditInstancesList = [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects];
  }

  if (url.host === "i.redd.it") {
    if (redditFrontend == 'teddit') {
      if (tedditInstancesList.length === 0) return;
      let tedditRandomInstance = utils.getRandomInstance(tedditInstancesList);
      return `${tedditRandomInstance}/pics/w:null_${url.pathname.substring(1)}${url.reddit}`;
    }
    if (redditFrontend == 'libreddit') {
      if (libredditInstancesList.length === 0) return;
      let libredditRandomInstance = utils.getRandomInstance(libredditInstancesList);
      return `${libredditRandomInstance}/img${url.pathname}${url.reddit}`
    }
  }
  else if (url.host === "redd.it") {
    if (redditFrontend == 'libreddit' && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) {
      if (libredditInstancesList.length === 0) return;
      let libredditRandomInstance = utils.getRandomInstance(libredditInstancesList);
      // https://redd.it/foo => https://libredd.it/comments/foo
      return `${libredditRandomInstance}/comments${url.pathname}${url.reddit}`;
    }
    if (redditFrontend == 'teddit' && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) {
      if (tedditInstancesList.length === 0) return;
      let tedditRandomInstance = utils.getRandomInstance(tedditInstancesList);
      // https://redd.it/foo => https://teddit.net/comments/foo
      return `${tedditRandomInstance}/comments${url.pathname}${url.reddit}`
    }
  }
  else if (url.host === 'preview.redd.it') {
    if (redditFrontend == 'teddit') return;
    if (redditFrontend == 'libreddit') {
      if (libredditInstancesList.length === 0) return;
      const libredditRandomInstance = utils.getRandomInstance(libredditInstancesList);
      return `${libredditRandomInstance}/preview/pre${url.pathname}${url.reddit}`;
    }
  }

  let randomInstance;
  if (redditFrontend == 'libreddit') {
    if (libredditInstancesList.length === 0) return;
    randomInstance = utils.getRandomInstance(libredditInstancesList);
  }
  if (redditFrontend == 'teddit') {
    if (tedditInstancesList.length === 0) return;
    randomInstance = utils.getRandomInstance(tedditInstancesList);
  }
  return `${randomInstance}${url.pathname}${url.search}`;
}

function switchInstance(url) {
  return new Promise(async resolve => {
    await init();
    const protocolHost = utils.protocolHost(url);
    if (!all().includes(protocolHost)) { resolve(); return; }
    let instancesList;
    if (redditFrontend == 'libreddit') {
      if (redditProtocol == 'normal') instancesList = [...libredditNormalRedirectsChecks, ...libredditNormalCustomRedirects];
      else if (redditProtocol == 'tor') instancesList = [...libredditTorRedirectsChecks, ...libredditTorCustomRedirects];
      if ([
        ...redditRedirects.teddit.normal,
        ...redditRedirects.teddit.tor
      ].includes(protocolHost)) url.pathname = url.pathname.replace("/pics/w:null_", "/img/");
    }
    else if (redditFrontend == 'teddit') {
      if (redditProtocol == 'normal') instancesList = [...tedditNormalRedirectsChecks, ...tedditNormalCustomRedirects];
      else if (redditProtocol == 'tor') instancesList = [...tedditTorRedirectsChecks, ...tedditTorCustomRedirects];
      if ([
        ...redditRedirects.libreddit.normal,
        ...redditRedirects.libreddit.tor
      ].includes(protocolHost)
      ) url.pathname = url.pathname.replace("/img/", "/pics/w:null_");
    }

    const i = instancesList.indexOf(protocolHost);
    if (i > -1) instancesList.splice(i, 1);
    if (instancesList.length === 0) { resolve(); return; }

    const randomInstance = utils.getRandomInstance(instancesList);
    resolve(`${randomInstance}${url.pathname}${url.search}`);
  })
}

function initDefaults() {
  return new Promise(resolve => {
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
        resolve();
      });
    });
  });
}

export default {
  setRedirects,
  initLibredditCookies,
  setLibredditCookies,
  initTedditCookies,
  setTedditCookies,

  redirect,
  initDefaults,
  switchInstance,
};

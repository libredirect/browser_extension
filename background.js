'use strict';

const invidiousDefault = 'https://invidio.us';
const youtubeRegex = /((www|m)\.)?youtube|ytimg(-nocookie)?\.com/;
const nitterDefault = 'https://nitter.net';
const twitterRegex = /((www|mobile)\.)?twitter\.com/;
const bibliogramDefault = 'https://bibliogram.art';
const instagramRegex = /((www|about|help)\.)?instagram\.com/;
const instagramPathsRegex = /(\/a|\/admin|\/api|\/favicon.ico|\/static|\/imageproxy|\/p|\/u|\/developer|\/about|\/legal|\/explore|\/director)/;
const osmDefault = 'https://openstreetmap.org';
const googleMapsRegex = /https?:\/\/(((www|maps)\.)?(google).*(\/maps)|maps\.(google).*)/;
const latLngZoomRegex = /@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/;
const dataLatLngRegex = /(!3d|!4d)(-?[0-9]{1,10}.[0-9]{1,10})/g;

let nitterInstance;
let invidiousInstance;
let bibliogramInstance;
let osmInstance;
let disableNitter;
let disableInvidious;
let disableBibliogram;
let disableOsm;

window.browser = window.browser || window.chrome;

browser.storage.sync.get(
  [
    'nitterInstance',
    'invidiousInstance',
    'bibliogramInstance',
    'osmInstance',
    'disableNitter',
    'disableInvidious',
    'disableBibliogram',
    'disableOsm'
  ],
  result => {
    disableNitter = result.disableNitter;
    disableInvidious = result.disableInvidious;
    disableBibliogram = result.disableBibliogram;
    disableOsm = result.disableOsm;
    nitterInstance = result.nitterInstance || nitterDefault;
    invidiousInstance = result.invidiousInstance || invidiousDefault;
    bibliogramInstance = result.bibliogramInstance || bibliogramDefault;
    osmInstance = result.osmInstance || osmDefault;
  }
);

browser.storage.onChanged.addListener(changes => {
  if ('nitterInstance' in changes) {
    nitterInstance = changes.nitterInstance.newValue || nitterDefault;
  }
  if ('invidiousInstance' in changes) {
    invidiousInstance = changes.invidiousInstance.newValue || invidiousDefault;
  }
  if ('bibliogramInstance' in changes) {
    bibliogramInstance = changes.bibliogramInstance.newValue || bibliogramDefault;
  }
  if ('osmInstance' in changes) {
    osmInstance = changes.osmInstance.newValue || osmDefault;
  }
  if ('disableNitter' in changes) {
    disableNitter = changes.disableNitter.newValue;
  }
  if ('disableInvidious' in changes) {
    disableInvidious = changes.disableInvidious.newValue;
  }
  if ('disableBibliogram' in changes) {
    disableBibliogram = changes.disableBibliogram.newValue;
  }
  if ('disableOsm' in changes) {
    disableOsm = changes.disableOsm.newValue;
  }
});

function redirectYouTube(url) {
  if (url.host.split('.')[0] === 'studio') {
    // Avoid redirecting `studio.youtube.com`
    return null;
  } else if (url.pathname.match(/iframe_api/)) {
    // Redirect requests for YouTube Player API to local files instead
    return browser.runtime.getURL('assets/iframe_api.js');
  } else if (url.pathname.match(/www-widgetapi/)) {
    // Redirect requests for YouTube Player API to local files instead
    return browser.runtime.getURL('assets/www-widgetapi.js');
  } else {
    // Proxy video through the server
    url.searchParams.append('local', true);
    return `${invidiousInstance}${url.pathname}${url.search}`;
  }
}

function redirectTwitter(url) {
  if (url.host.split('.')[0] === 'tweetdeck') {
    // Avoid redirecting `tweetdeck.twitter.com`
    return null;
  } else {
    return `${nitterInstance}${url.pathname}${url.search}`;
  }
}

function redirectInstagram(url) {
  if (url.pathname === '/' || url.pathname.match(instagramPathsRegex)) {
    return `${bibliogramInstance}${url.pathname}${url.search}`;
  } else {
    // Redirect user profile requests to '/u/...'
    return `${bibliogramInstance}/u${url.pathname}${url.search}`;
  }
}

function redirectGoogleMaps(url) {
  // Do not redirect embedded maps
  if (url.pathname.includes('/embed')) {
    return;
  }
  let mapCentre = '';
  if (url.pathname.match(latLngZoomRegex)) {
    [, lat, lon, zoom] = url.pathname.match(latLngZoomRegex);
    mapCentre = `#map=${zoom}/${lat}/${lon}`;
  }
  if (url.pathname.includes('data=')) {
    const [mlat, mlon] = url.pathname.match(dataLatLngRegex);
    return `${osmInstance}/?mlat=${mlat.replace('!3d', '')}&mlon=${mlon.replace('!4d', '')}${mapCentre}`;
  } else if (url.search.includes('ll=')) {
    const [mlat, mlon] = url.searchParams.get('ll').split(',');
    return `${osmInstance}/?mlat=${mlat}&mlon=${mlon}${mapCentre}`;
  } else {
    const query = url.searchParams.get('q') || url.searchParams.get('query') || url.pathname.split('/')[3];
    return `${osmInstance}/search?query=${encodeURI(query)}${mapCentre}`;
  }
}

browser.webRequest.onBeforeRequest.addListener(
  details => {
    const url = new URL(details.url);
    let redirect;
    if (url.host.match(youtubeRegex)) {
      if (!disableInvidious) {
        redirect = {
          redirectUrl: redirectYouTube(url)
        };
      }
    } else if (url.host.match(twitterRegex)) {
      if (!disableNitter) {
        redirect = {
          redirectUrl: redirectTwitter(url)
        };
      }
    } else if (url.host.match(instagramRegex)) {
      if (!disableBibliogram) {
        redirect = {
          redirectUrl: redirectInstagram(url)
        };
      }
    } else if (url.href.match(googleMapsRegex)) {
      if (!disableOsm) {
        redirect = {
          redirectUrl: redirectGoogleMaps(url)
        };
      }
    }
    if (redirect && redirect.redirectUrl) {
      console.log(
        'Redirecting', `"${url.href}"`, '=>', `"${redirect.redirectUrl}"`
      );
      console.log('Details', details);
    }
    return redirect;
  },
  {
    urls: ["<all_urls>"]
  },
  ['blocking']
);

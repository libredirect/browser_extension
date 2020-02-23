'use strict';

const invidiousDefault = 'https://invidio.us';
const youtubeRegex = /((www|m)\.)?youtube|ytimg(-nocookie)?\.com/;
const nitterDefault = 'https://nitter.net';
const twitterRegex = /((www|mobile)\.)?twitter\.com/;
const bibliogramDefault = 'https://bibliogram.art';
const instagramRegex = /((www|about|help)\.)?instagram\.com/;
const instagramPathsRegex = /(\/a|\/admin|\/api|\/favicon.ico|\/static|\/imageproxy|\/p|\/u|\/developer|\/about|\/legal|\/explore|\/director)/;
const osmDefault = 'https://openstreetmap.org';
const googleMapsRegex = /(google).*(\/maps)/;
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

chrome.storage.sync.get(
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

chrome.storage.onChanged.addListener(changes => {
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

// https://github.com/tankaru/ReplaceG2O
function deg2rad(deg) {
  return deg / 360 * 2 * Math.PI;
}

function rad2deg(rad) {
  return rad / 2 / Math.PI * 360.0;
}

function getTileNumber(lat, lon, zoom) {
  xtile = Math.round((lon + 180.0) / 360.0 * 2 ** zoom);
  ytile = Math.round((1 - Math.log(Math.tan(deg2rad(lat)) + 1 / (Math.cos(deg2rad(lat)))) / Math.PI) / 2 * 2 ** zoom);
  return [xtile, ytile];
}

function getLonLat(xtile, ytile, zoom) {
  n = 2 ** zoom;
  lon = xtile / n * 360.0 - 180.0;
  lat = rad2deg(Math.atan(Math.sinh(Math.PI * (1 - 2 * ytile / n))));
  return [lon, lat];
}

function LonLat_to_bbox(lat, lon, zoom) {
  width = 600;
  height = 450;
  tile_size = 256;

  [xtile, ytile] = getTileNumber(lat, lon, zoom);

  xtile_s = (xtile * tile_size - width / 2) / tile_size;
  ytile_s = (ytile * tile_size - height / 2) / tile_size;
  xtile_e = (xtile * tile_size + width / 2) / tile_size;
  ytile_e = (ytile * tile_size + height / 2) / tile_size;

  [lon_s, lat_s] = getLonLat(xtile_s, ytile_s, zoom);
  [lon_e, lat_e] = getLonLat(xtile_e, ytile_e, zoom);

  return [lon_s, lat_s, lon_e, lat_e];
}

//make a bbox, 0.001 should be modified based on zoom value
function bbox(lat, lon, zoom) {
  return LonLat_to_bbox(lat, lon, zoom);

}

function zoom(satelliteZoom) {
  return -1.4436 * Math.log(satelliteZoom) + 28.7;
}

function redirectYouTube(url) {
  if (url.host.split('.')[0] === 'studio') {
    // Avoid redirecting `studio.youtube.com`
    return null;
  } else if (url.pathname.match(/iframe_api/)) {
    // Redirect requests for YouTube Player API to local files instead
    return chrome.runtime.getURL('assets/iframe_api.js');
  } else if (url.pathname.match(/www-widgetapi/)) {
    // Redirect requests for YouTube Player API to local files instead
    return chrome.runtime.getURL('assets/www-widgetapi.js');
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

function redirectGoogleMaps(url, type) {
  let query = '';
  let lat = '';
  let lon = '';
  let zoom = '';
  if (url.pathname.match(latLngZoomRegex)) {
    [, lat, lon, zoom] = url.pathname.match(latLngZoomRegex);
  }
  if (type === 'main_frame') {
    if (url.pathname.includes('data=')) {
      const [mlat, mlon] = url.pathname.match(dataLatLngRegex);
      return `${osmInstance}/?mlat=${mlat.replace('!3d', '')}&mlon=${mlon.replace('!4d', '')}#map=${zoom}/${lat}/${lon}`;
    } else if (url.search.includes('q=')) {
      query = encodeURI(url.searchParams.get('q'));
    } else {
      query = url.pathname.split('/')[3];
    }
    return `${osmInstance}/search?query=${query}#map=${zoom}/${lat}/${lon}`;
  } else if (type === 'sub_frame' && url.pathname.match(latLngZoomRegex)) {
    const [mapleft, mapbottom, mapright, maptop] = bbox(Number(lat), Number(lon), zoom(z));
    if (url.pathname.includes('data=')) {
      const [mlat, mlon] = url.pathname.match(dataLatLngRegex);
      return `${osmInstance}/export/embed.html?bbox=${mapleft}%2C${mapbottom}'%2C'${mapright}'%2C'${maptop}'&amp;layer=mapnik&amp;marker=${mlat}%2C${mlon}'`;
    }
    return `${osmInstance}/export/embed.html?bbox=${mapleft}%2C${mapbottom}'%2C'${mapright}'%2C'${maptop}'&amp;layer=mapnik'`;
  }
}

chrome.webRequest.onBeforeRequest.addListener(
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
          redirectUrl: redirectGoogleMaps(url, details.type)
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
    urls: ["<all_urls>"],
    types: [
      "main_frame",
      "sub_frame",
      "script"
    ]
  },
  ['blocking']
);

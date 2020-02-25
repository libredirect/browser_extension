'use strict';

const invidiousDefault = 'https://invidio.us';
const youtubeRegex = /((www|m)\.)?youtube|ytimg(-nocookie)?\.com/;
const nitterDefault = 'https://nitter.net';
const twitterRegex = /((www|mobile)\.)?twitter\.com/;
const bibliogramDefault = 'https://bibliogram.art';
const instagramRegex = /((www|about|help)\.)?instagram\.com/;
const instagramPathsRegex = /\/(a|admin|api|favicon.ico|static|imageproxy|p|u|developer|about|legal|explore|director)/;
const osmDefault = 'https://openstreetmap.org';
const googleMapsRegex = /https?:\/\/(((www|maps)\.)?(google).*(\/maps)|maps\.(google).*)/;
const latLngZoomRegex = /@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/;
const dataLatLngRegex = /(!3d|!4d)(-?[0-9]{1,10}.[0-9]{1,10})/g;
const latLngRegex = /-?[0-9]{1,10}.[0-9]{1,10}/;
const travelModes = {
  'driving': 'fossgis_osrm_car',
  'walking': 'fossgis_osrm_foot',
  'bicycling': 'fossgis_osrm_bike',
  'transit': 'fossgis_osrm_car' // not implemented on OSM, default to car.
};

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

function addressToLatLon(address, callback) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        const json = JSON.parse(xmlhttp.responseText)[0];
        if (json) {
          callback(`${json.lat}%2C${json.lon}`, json.boundingbox.join('%2C'));
        }
      }
      else {
        console.info("Error: Status is " + xmlhttp.status);
      }
    }
  };
  xmlhttp.open(
    'GET',
    `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`,
    false
  );
  xmlhttp.send();
}

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
  let mapCentre = '';
  if (url.pathname.match(latLngZoomRegex)) {
    const [, lat, lon, zoom] = url.pathname.match(latLngZoomRegex);
    mapCentre = `#map=${zoom}/${lat}/${lon}`;
  } else if (url.search.includes('center=')) {
    const [lat, lon] = url.searchParams.get('center').split(',');
    mapCentre = `#map=${url.searchParams.get('zoom')}/${lat}/${lon}`;
  }
  if (url.pathname.includes('/embed')) {
    const query = url.searchParams.get('q') || url.searchParams.get('query') || url.pathname.split('/')[3];
    let marker, bbox;
    addressToLatLon(query, (coords, boundingbox) => {
      marker = coords;
      bbox = boundingbox;
    });
    return `${osmInstance}/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
  } else if (url.pathname.includes('/dir')) {
    const travelMode = travelModes[url.searchParams.get('travelmode')] || travelModes['driving'];
    let origin;
    addressToLatLon(url.searchParams.get('origin'), coords => {
      origin = coords;
    });
    let destination;
    addressToLatLon(url.searchParams.get('destination'), coords => {
      destination = coords;
    });
    return `${osmInstance}/directions?engine=${travelMode}&route=${origin}%3B${destination}${mapCentre}`;
  } else if (url.pathname.includes('data=')) {
    const [mlat, mlon] = url.pathname.match(dataLatLngRegex);
    return `${osmInstance}/?mlat=${mlat.replace('!3d', '')}&mlon=${mlon.replace('!4d', '')}${mapCentre}`;
  } else if (url.search.includes('ll=')) {
    const [mlat, mlon] = url.searchParams.get('ll').split(',');
    return `${osmInstance}/?mlat=${mlat}&mlon=${mlon}${mapCentre}`;
  } else {
    const query = url.searchParams.get('q') || url.searchParams.get('query') || url.pathname.split('/')[3];
    return `${osmInstance}/${query ? 'search?query=' + query : ''}${mapCentre || '#'}`;
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
      console.info(
        'Redirecting', `"${url.href}"`, '=>', `"${redirect.redirectUrl}"`
      );
      console.info('Details', details);
    }
    return redirect;
  },
  {
    urls: ["<all_urls>"]
  },
  ['blocking']
);

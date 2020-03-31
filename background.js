'use strict';

const invidiousDefault = 'https://invidio.us';
const youtubeDomains = [
  'm.youtube.com',
  'youtube.com',
  'img.youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
  's.ytimg.com',
];
const nitterDefault = 'https://nitter.net';
const twitterDomains = [
  'twitter.com',
  'www.twitter.com',
  'mobile.twitter.com',
  'pbs.twimg.com',
  'video.twimg.com',
];
const bibliogramDefault = 'https://bibliogram.art';
const instagramRegex = /((www|about|help)\.)?instagram\.com/;
const instagramPathsRegex = /\/(a|admin|api|favicon.ico|static|imageproxy|p|u|developer|about|legal|explore|director)/;
const osmDefault = 'https://openstreetmap.org';
const googleMapsRegex = /https?:\/\/(((www|maps)\.)?(google).*(\/maps)|maps\.(google).*)/;
const mapCentreRegex = /@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/;
const dataLatLngRegex = /(!3d|!4d)(-?[0-9]{1,10}.[0-9]{1,10})/g;
const placeRegex = /\/place\/(.*)\//;
const travelModes = {
  'driving': 'fossgis_osrm_car',
  'walking': 'fossgis_osrm_foot',
  'bicycling': 'fossgis_osrm_bike',
  'transit': 'fossgis_osrm_car' // not implemented on OSM, default to car.
};
const layers = {
  'none': 'S',
  'transit': 'T',
  'traffic': 'S', // not implemented on OSM, default to standard.
  'bicycling': 'C'
}

let disableNitter;
let disableInvidious;
let disableBibliogram;
let disableOsm;
let nitterInstance;
let invidiousInstance;
let bibliogramInstance;
let osmInstance;
let alwaysProxy;
let onlyEmbeddedVideo;
let videoQuality;

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
    'disableOsm',
    'alwaysProxy',
    'onlyEmbeddedVideo',
    'videoQuality'
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
    alwaysProxy = result.alwaysProxy;
    onlyEmbeddedVideo = result.onlyEmbeddedVideo;
    videoQuality = result.videoQuality;
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
  if ('alwaysProxy' in changes) {
    alwaysProxy = changes.alwaysProxy.newValue;
  }
  if ('onlyEmbeddedVideo' in changes) {
    onlyEmbeddedVideo = changes.onlyEmbeddedVideo.newValue;
  }
  if ('videoQuality' in changes) {
    videoQuality = changes.videoQuality.newValue;
  }
});

function addressToLatLng(address, callback) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        const json = JSON.parse(xmlhttp.responseText)[0];
        if (json) {
          callback(
            `${json.lat}%2C${json.lon}`,
            `${json.boundingbox[2]},${json.boundingbox[1]},${json.boundingbox[3]},${json.boundingbox[0]}`
          );
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

function redirectYouTube(url, initiator, type) {
  if (disableInvidious) {
    return null;
  }
  if (initiator && (initiator.origin === invidiousInstance || youtubeDomains.includes(initiator.host))) {
    return null;
  }
  if (url.pathname.match(/iframe_api/)) {
    // Redirect requests for YouTube Player API to local files instead
    return browser.runtime.getURL('assets/iframe_api.js');
  } else if (url.pathname.match(/www-widgetapi/)) {
    // Redirect requests for YouTube Player API to local files instead
    return browser.runtime.getURL('assets/www-widgetapi.js');
  } else {
    // Proxy video through the server if enabled by user
    if (alwaysProxy) {
      url.searchParams.append('local', true);
    }
    if (videoQuality) {
      url.searchParams.append('quality', videoQuality);
    }
    if (onlyEmbeddedVideo && type !== 'sub_frame') {
      return null;
    }
    return `${invidiousInstance}${url.pathname}${url.search}`;
  }
}

function redirectTwitter(url, initiator) {
  if (disableNitter) {
    return null;
  }
  if (initiator && (initiator.origin === nitterInstance || twitterDomains.includes(initiator.host))) {
    return null;
  }
  if (url.host.split('.')[0] === 'pbs') {
    return `${nitterInstance}/pic/${encodeURIComponent(url.href)}`;
  } else if (url.host.split('.')[0] === 'video') {
    return `${nitterInstance}/gif/${encodeURIComponent(url.href)}`;
  } else {
    return `${nitterInstance}${url.pathname}${url.search}`;
  }
}

function redirectInstagram(url, initiator) {
  if (disableBibliogram) {
    return null;
  }
  if (initiator && (initiator.origin === bibliogramInstance || initiator.host.match(instagramRegex))) {
    return null;
  }
  if (url.pathname === '/' || url.pathname.match(instagramPathsRegex)) {
    return `${bibliogramInstance}${url.pathname}${url.search}`;
  } else {
    // Redirect user profile requests to '/u/...'
    return `${bibliogramInstance}/u${url.pathname}${url.search}`;
  }
}

function redirectGoogleMaps(url) {
  if (disableOsm) {
    return null;
  }
  let redirect;
  let mapCentre = '';
  let params = '';
  // Set map centre if present
  if (url.pathname.match(mapCentreRegex)) {
    const [, lat, lon, zoom] = url.pathname.match(mapCentreRegex);
    mapCentre = `#map=${zoom}/${lat}/${lon}`;
  } else if (url.search.includes('center=')) {
    const [lat, lon] = url.searchParams.get('center').split(',');
    mapCentre = `#map=${url.searchParams.get('zoom') || '17'}/${lat}/${lon}`;
    // Set default zoom if mapCentre not present
  } else {
    params = '&zoom=17';
  }
  // Set map layer
  params = `${params}&layers=${layers[url.searchParams.get('layer')] || layers['none']}`;
  // Handle Google Maps Embed API
  if (url.pathname.includes('/embed')) {
    let query = '';
    if (url.searchParams.has('q')) {
      query = url.searchParams.get('q');
    } else if (url.searchParams.has('query')) {
      query = url.searchParams.has('query');
    } else if (url.searchParams.has('pb')) {
      try {
        query = url.searchParams.get('pb').split(/!2s(.*?)!/)[1];
      } catch (error) {
        console.error(error);
        // Unable to find map marker in URL.
      }
    }
    let marker, bbox;
    addressToLatLng(query, (coords, boundingbox) => {
      marker = coords;
      bbox = boundingbox;
    });
    redirect = `${osmInstance}/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
    // Handle Google Maps Directions
  } else if (url.pathname.includes('/dir')) {
    const travelMode = travelModes[url.searchParams.get('travelmode')] || travelModes['driving'];
    let origin;
    addressToLatLng(url.searchParams.get('origin'), coords => {
      origin = coords;
    });
    let destination;
    addressToLatLng(url.searchParams.get('destination'), coords => {
      destination = coords;
    });
    redirect = `${osmInstance}/directions?engine=${travelMode}&route=${origin}%3B${destination}${mapCentre}${params}`;
    // Get marker from data attribute
  } else if (url.pathname.includes('data=') && url.pathname.match(dataLatLngRegex)) {
    const [mlat, mlon] = url.pathname.match(dataLatLngRegex);
    redirect = `${osmInstance}/?mlat=${mlat.replace('!3d', '')}&mlon=${mlon.replace('!4d', '')}${mapCentre}${params}`;
    // Get marker from ll param
  } else if (url.searchParams.has('ll')) {
    const [mlat, mlon] = url.searchParams.get('ll').split(',');
    redirect = `${osmInstance}/?mlat=${mlat}&mlon=${mlon}${mapCentre}${params}`;
    // Get marker from viewpoint param.
  } else if (url.searchParams.has('viewpoint')) {
    const [mlat, mlon] = url.searchParams.get('viewpoint').split(',');
    redirect = `${osmInstance}/?mlat=${mlat}&mlon=${mlon}${mapCentre}${params}`;
    // Use query as search if present.
  } else {
    let query;
    if (url.searchParams.has('q')) {
      query = url.searchParams.get('q');
    } else if (url.searchParams.has('query')) {
      query = url.searchParams.get('query');
    } else if (url.pathname.match(placeRegex)) {
      query = url.pathname.match(placeRegex)[1];
    }
    redirect = `${osmInstance}/${query ? 'search?query=' + query : ''}${mapCentre || '#'}${params}`;
  }

  return redirect;
}

browser.webRequest.onBeforeRequest.addListener(
  details => {
    const url = new URL(details.url);
    let initiator = details.initiator && new URL(details.initiator);
    let redirect;
    if (youtubeDomains.includes(url.host)) {
      redirect = {
        redirectUrl: redirectYouTube(url, initiator, details.type)
      };
    } else if (twitterDomains.includes(url.host)) {
      redirect = {
        redirectUrl: redirectTwitter(url, initiator)
      };
    } else if (url.host.match(instagramRegex)) {
      redirect = {
        redirectUrl: redirectInstagram(url, initiator)
      };
    } else if (url.href.match(googleMapsRegex)) {
      redirect = {
        redirectUrl: redirectGoogleMaps(url)
      };
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

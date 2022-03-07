window.browser = window.browser || window.chrome;
import commonHelper from './common.js'

const targets = /^https?:\/\/(((www|maps)\.)?(google\.).*(\/maps)|maps\.(google\.).*)/;
let redirects = {
  'osm': {
    "normal": [
      "https://openstreetmap.org"
    ]
  },
  'facil': {
    "normal": [
      "https://facilmap.org"
    ]
  }
};
const mapCentreRegex = /@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/;
const dataLatLngRegex = /(!3d|!4d)(-?[0-9]{1,10}.[0-9]{1,10})/g;
const placeRegex = /\/place\/(.*)\//;
const travelModes = {
  driving: "fossgis_osrm_car",
  walking: "fossgis_osrm_foot",
  bicycling: "fossgis_osrm_bike",
  transit: "fossgis_osrm_car", // not implemented on OSM, default to car.
};
const osmLayers = {
  none: "S",
  transit: "T",
  traffic: "S", // not implemented on OSM, default to standard.
  bicycling: "C",
};

function addressToLatLng(address, callback) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        const json = JSON.parse(xmlhttp.responseText)[0];
        if (json) callback(
          `${json.lat}%2C${json.lon}`,
          `${json.boundingbox[2]},${json.boundingbox[1]},${json.boundingbox[3]},${json.boundingbox[0]}`
        );
      } else
        console.info("Error: Status is " + xmlhttp.status);
    }
  };
  xmlhttp.open(
    "GET",
    `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`,
    false
  );
  xmlhttp.send();
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ disableMaps: disable })
  console.log("disableMaps: ", disable)
}

let frontend;
const getFrontend = () => frontend;
function setFrontend(val) {
  frontend = val;
  browser.storage.local.set({ mapsFrontend: frontend })
  console.log("mapsFrontend: ", frontend)
};

function redirect(url, initiator) {

  if (disable) return;
  if (initiator && initiator.host === "earth.google.com") return;

  if (!url.href.match(targets)) return;

  let redirect;
  let randomInstance
  if (frontend == 'osm') randomInstance = commonHelper.getRandomInstance(redirects.osm.normal);
  if (frontend == 'facil') randomInstance = commonHelper.getRandomInstance(redirects.facil.normal);
  let mapCentre;
  let params = "";
  // Set map centre if present
  if (url.pathname.match(mapCentreRegex)) {
    const [, lat, lon, zoom] = url.pathname.match(mapCentreRegex);
    if (frontend == 'osm') mapCentre = `#map=${zoom}/${lat}/${lon}`;
    if (frontend == 'facil') mapCentre = `#${zoom}/${lat}/${lon}`

    console.log("lat", lat) // vertical
    console.log("lon", lon) // horizontal
    console.log("zoom", zoom)

  } else if (url.search.includes("center=")) {
    const [lat, lon] = url.searchParams.get("center").split(",");
    const zoom = url.searchParams.get("zoom") || "17";
    if (frontend == 'osm') mapCentre = `#map=${zoom}/${lat}/${lon}`;
    if (frontend == 'facil') mapCentre = `#${zoom}/${lat}/${lon}`

    console.log("lat", lat)
    console.log("lon", lon)
    console.log("zoom", zoom)
  }

  // Set map layer
  let layer = osmLayers[url.searchParams.get("layer")] || osmLayers["none"];
  params = `${params}&layers=${layer}`;

  console.log("layer", layer);

  // Handle Google Maps Embed API
  if (url.pathname.includes("/embed")) {
    let query = "";
    if (url.searchParams.has("q")) query = url.searchParams.get("q");
    else if (url.searchParams.has("query")) query = url.searchParams.has("query");
    else if (url.searchParams.has("pb"))
      try {
        query = url.searchParams.get("pb").split(/!2s(.*?)!/)[1];
      } catch (error) {
        console.error(error); // Unable to find map marker in URL.
      }

    console.log("query", query)

    let marker, bbox;
    addressToLatLng(query, (coords, boundingbox) => {
      marker = coords;
      bbox = boundingbox;

      console.log("marker", marker)
      console.log("bbox", bbox)
    });
    if (frontend == 'osm') redirect = `${randomInstance}/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
    if (frontend == 'facil') redirect = redirect = `${randomInstance}/${mapCentre}/Mpnk`

    // Handle Google Maps Directions
  } else if (url.pathname.includes("/dir")) {
    const travelMode = travelModes[url.searchParams.get("travelmode")] || travelModes["driving"];

    let origin;
    console.log(url.searchParams.get("origin"))
    addressToLatLng(url.searchParams.get("origin"), coords => origin = coords);

    let destination;
    addressToLatLng(url.searchParams.get("destination"), coords => destination = coords);

    if (frontend == 'osm') redirect = `${randomInstance}/directions?engine=${travelMode}&route=${origin}%3B${destination}`;
    // ${mapCentre}${params}

    if (frontend == 'facil') {
      mapCentre = mapCentre ?? '#1/0/0';
      redirect = redirect = `${randomInstance}/${mapCentre}/Mpnk`
    }

    console.log("travelMode", travelMode)
    console.log("origin", origin)
    console.log("destination", destination)

    // Get marker from data attribute
  } else if (url.pathname.includes("data=") && url.pathname.match(dataLatLngRegex)) {
    const [mlat, mlon] = url.pathname.match(dataLatLngRegex);

    if (frontend == 'osm') redirect = `${randomInstance}/?mlat=${mlat.replace("!3d", "")}&mlon=${mlon.replace("!4d", "")}${mapCentre}${params}`;

    if (frontend == 'facil') redirect = redirect = `${randomInstance}/${mapCentre}/Mpnk`

    console.log("mlat", mlat)
    console.log("mlon", mlon)

    // Get marker from ll param
  } else if (url.searchParams.has("ll")) {
    const [mlat, mlon] = url.searchParams.get("ll").split(",");
    redirect = `${randomInstance}/?mlat=${mlat}&mlon=${mlon}${mapCentre}${params}`;

    console.log("mlat", mlat)
    console.log("mlon", mlon)

    // Get marker from viewpoint param.
  } else if (url.searchParams.has("viewpoint")) {
    const [mlat, mlon] = url.searchParams.get("viewpoint").split(",");
    redirect = `${randomInstance}/?mlat=${mlat}&mlon=${mlon}${mapCentre}${params}`;

    console.log("mlat", mlat)
    console.log("mlon", mlon)

    // Use query as search if present.
  } else {
    console.log("normal life")

    let query;
    if (url.searchParams.has("q")) query = url.searchParams.get("q");
    else if (url.searchParams.has("query")) query = url.searchParams.get("query");
    else if (url.pathname.match(placeRegex)) query = url.pathname.match(placeRegex)[1];

    if (frontend == 'osm') {
      query = query ? "/search?query=" + query : "";
      mapCentre = mapCentre ?? '#';
      redirect = `${randomInstance}${query}${mapCentre}${params}`;
    }
    if (frontend == 'facil') {
      query = query ? `/${query}` : "";
      mapCentre = mapCentre ?? '#1/0/0';
      redirect = `${randomInstance}/${mapCentre}/Mpnk${query}`
    }

    console.log("query", query)
  }
  return redirect;
}

async function init() {
  return new Promise(resolve => {
    browser.storage.local.get(
      [
        "disableMaps",
        "mapsFrontend"
      ],
      r => {
        disable = r.disableMaps ?? false
        frontend = r.mapsFrontend ?? 'osm'
        resolve();
      }
    );
  });
}

export default {
  getDisable,
  setDisable,

  getFrontend,
  setFrontend,

  redirect,
  init,
};

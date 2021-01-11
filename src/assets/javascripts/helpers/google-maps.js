const targets = /https?:\/\/(((www|maps)\.)?(google\.).*(\/maps)|maps\.(google\.).*)/;
const redirects = ["https://openstreetmap.org"];
const mapCentreRegex = /@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/;
const dataLatLngRegex = /(!3d|!4d)(-?[0-9]{1,10}.[0-9]{1,10})/g;
const placeRegex = /\/place\/(.*)\//;
const travelModes = {
  driving: "fossgis_osrm_car",
  walking: "fossgis_osrm_foot",
  bicycling: "fossgis_osrm_bike",
  transit: "fossgis_osrm_car", // not implemented on OSM, default to car.
};
const layers = {
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
        if (json) {
          callback(
            `${json.lat}%2C${json.lon}`,
            `${json.boundingbox[2]},${json.boundingbox[1]},${json.boundingbox[3]},${json.boundingbox[0]}`
          );
        }
      } else {
        console.info("Error: Status is " + xmlhttp.status);
      }
    }
  };
  xmlhttp.open(
    "GET",
    `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`,
    false
  );
  xmlhttp.send();
}

export default {
  targets,
  redirects,
  mapCentreRegex,
  dataLatLngRegex,
  placeRegex,
  travelModes,
  layers,
  addressToLatLng,
};

"use strict"

window.browser = window.browser || window.chrome

import utils from "./utils.js"
import { FrontEnd } from "./frontend.js"

export default await FrontEnd({
	enable: true,
	name: "maps",
	frontends: {
		osm: {
			cookies: [],
		},
		facilMap: {
			cookies: [],
		},
	},
	frontend: "osm",
	redirect: url => {
		const targets = /^https?:\/{2}(((www|maps)\.)?(google\.).*(\/maps)|maps\.(google\.).*)/
		if (!url.href.match(targets)) return

		const mapCentreRegex = /@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/
		const dataLatLngRegex = /!3d(-?[0-9]{1,}.[0-9]{1,})!4d(-?[0-9]{1,}.[0-9]{1,})/
		const placeRegex = /\/place\/(.*)\//
		const travelModes = {
			driving: "fossgis_osrm_car",
			walking: "fossgis_osrm_foot",
			bicycling: "fossgis_osrm_bike",
			transit: "fossgis_osrm_car", // not implemented on OSM, default to car.
		}
		const travelModesFacil = {
			driving: "car",
			walking: "pedestrian",
			bicycling: "bicycle",
			transit: "car", // not implemented on Facil, default to car.
		}
		const osmLayers = {
			none: "S",
			transit: "T",
			traffic: "S", // not implemented on OSM, default to standard.
			bicycling: "C",
		}
		function addressToLatLng(address) {
			const xmlhttp = new XMLHttpRequest()
			xmlhttp.open("GET", `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=1`, false)
			xmlhttp.send()
			if (xmlhttp.status === 200) {
				const json = JSON.parse(xmlhttp.responseText)[0]
				if (json) {
					console.log("json", json)
					return [`${json.lat},${json.lon}`, `${json.boundingbox[2]},${json.boundingbox[1]},${json.boundingbox[3]},${json.boundingbox[0]}`]
				}
			}
			console.info("Error: Status is " + xmlhttp.status)
		}

		let mapCentre = "#"
		let prefs = {}

		if (url.pathname.match(mapCentreRegex)) {
			// Set map centre if present
			var [, lat, lon, zoom] = url.pathname.match(mapCentreRegex)
		} else if (url.searchParams.has("center")) {
			var [lat, lon] = url.searchParams.get("center").split(",")
			var zoom = url.searchParams.get("zoom") ?? "17"
		}

		if (lat && lon && zoom) {
			if (mapsFrontend == "osm") mapCentre = `#map=${zoom}/${lat}/${lon}`
			if (mapsFrontend == "facil") mapCentre = `#${zoom}/${lat}/${lon}`
		}

		if (url.searchParams.get("layer")) prefs.layers = osmLayers[url.searchParams.get("layer")]

		const protocolHost = utils.protocolHost(url)
		if (url.pathname.includes("/embed")) {
			// Handle Google Maps Embed API
			// https://www.google.com/maps/embed/v1/place?key=AIzaSyD4iE2xVSpkLLOXoyqT-RuPwURN3ddScAI&q=Eiffel+Tower,Paris+France
			console.log("embed life")

			let query = ""
			if (url.searchParams.has("q")) query = url.searchParams.get("q")
			else if (url.searchParams.has("query")) query = url.searchParams.has("query")
			else if (url.searchParams.has("pb"))
				try {
					query = url.searchParams.get("pb").split(/!2s(.*?)!/)[1]
				} catch (error) {
					console.error(error)
				} // Unable to find map marker in URL.

			let [coords, boundingbox] = addressToLatLng(query)
			prefs.bbox = boundingbox
			prefs.marker = coords
			prefs.layer = "mapnik"
			let prefsEncoded = new URLSearchParams(prefs).toString()
			if (mapsFrontend == "osm") return `${protocolHost}/export/embed.html?${prefsEncoded}`
			if (mapsFrontend == "facil") return `${protocolHost}/#q=${query}`
		} else if (url.pathname.includes("/dir")) {
			// Handle Google Maps Directions
			// https://www.google.com/maps/dir/?api=1&origin=Space+Needle+Seattle+WA&destination=Pike+Place+Market+Seattle+WA&travelmode=bicycling

			let travMod = url.searchParams.get("travelmode")
			if (url.searchParams.has("travelmode")) prefs.engine = travelModes[travMod]

			let orgVal = url.searchParams.get("origin")
			let destVal = url.searchParams.get("destination")

			let org
			addressToLatLng(orgVal, a => (org = a))
			let dest
			addressToLatLng(destVal, a => (dest = a))
			prefs.route = `${org};${dest}`

			let prefsEncoded = new URLSearchParams(prefs).toString()
			if (mapsFrontend == "osm") return `${protocolHost}/directions?${prefsEncoded}${mapCentre}`
			if (mapsFrontend == "facil") return `${protocolHost}/#q=${orgVal}%20to%20${destVal}%20by%20${travelModesFacil[travMod]}`
		} else if (url.pathname.includes("data=") && url.pathname.match(dataLatLngRegex)) {
			// Get marker from data attribute
			// https://www.google.com/maps/place/41%C2%B001'58.2%22N+40%C2%B029'18.2%22E/@41.032833,40.4862063,17z/data=!3m1!4b1!4m6!3m5!1s0x0:0xf64286eaf72fc49d!7e2!8m2!3d41.0328329!4d40.4883948
			console.log("data life")

			let [, mlat, mlon] = url.pathname.match(dataLatLngRegex)

			if (mapsFrontend == "osm") return `${protocolHost}/search?query=${mlat}%2C${mlon}`
			if (mapsFrontend == "facil") return `${protocolHost}/#q=${mlat}%2C${mlon}`
		} else if (url.searchParams.has("ll")) {
			// Get marker from ll param
			// https://maps.google.com/?ll=38.882147,-76.99017
			console.log("ll life")

			const [mlat, mlon] = url.searchParams.get("ll").split(",")

			if (mapsFrontend == "osm") return `${protocolHost}/search?query=${mlat}%2C${mlon}`
			if (mapsFrontend == "facil") return `${protocolHost}/#q=${mlat}%2C${mlon}`
		} else if (url.searchParams.has("viewpoint")) {
			// Get marker from viewpoint param.
			// https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.857832,2.295226&heading=-45&pitch=38&fov=80
			console.log("viewpoint life")

			const [mlat, mlon] = url.searchParams.get("viewpoint").split(",")

			if (mapsFrontend == "osm") return `${protocolHost}/search?query=${mlat}%2C${mlon}`
			if (mapsFrontend == "facil") return `${protocolHost}/#q=${mlat}%2C${mlon}`
		} else {
			// Use query as search if present.
			console.log("normal life")

			let query
			if (url.searchParams.has("q")) query = url.searchParams.get("q")
			else if (url.searchParams.has("query")) query = url.searchParams.get("query")
			else if (url.pathname.match(placeRegex)) query = url.pathname.match(placeRegex)[1]

			let prefsEncoded = new URLSearchParams(prefs).toString()
			if (query) {
				if (mapsFrontend == "osm") return `${protocolHost}/search?query="${query}${mapCentre}&${prefsEncoded}`
				if (mapsFrontend == "facil") return `${protocolHost}/${mapCentre}/Mpnk/${query}`
			}
		}

		let prefsEncoded = new URLSearchParams(prefs).toString()
		console.log("mapCentre", mapCentre)
		console.log("prefs", prefs)
		console.log("prefsEncoded", prefsEncoded)
		if (mapsFrontend == "osm") return `${protocolHost}/${mapCentre}&${prefsEncoded}`
		if (mapsFrontend == "facil") return `${protocolHost}/${mapCentre}/Mpnk`
	},
})

// redirects.osm.normal = ["https://www.openstreetmap.org"]

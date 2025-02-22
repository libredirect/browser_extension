import utils from "./utils.js"

const isChrome = browser.runtime.getBrowserInfo === undefined
window.browser = window.browser || window.chrome

let config, options

async function init() {
  options = await utils.getOptions()
  config = await utils.getConfig()
}

init()
browser.storage.onChanged.addListener(init)

function all(service, frontend, options, config) {
  let instances = []
  if (!frontend) {
    for (const frontend in config.services[service].frontends) {
      if (options[frontend]) {
        instances.push(...options[frontend])
      }
    }
  } else if (options[frontend]) {
    instances = options[frontend]
  }
  return instances
}

/**
 * @param {string} service
 * @param {URL} url
 * @param {{}} config
 * @param {{}} options
 * @param {string} frontend
 */
function regexArray(service, url, config, options, frontend) {
  let targetList = config.services[service].targets
  if (frontend && "excludeTargets" in config.services[service].frontends[frontend]) {
    if (service !== "search" || !options["search"].redirectGoogle) {
      targetList = targetList.filter(
        val => !config.services[service].frontends[frontend].excludeTargets.includes(targetList.indexOf(val))
      )
    }
  }
  for (const targetString in targetList) {
    const target = new RegExp(targetList[targetString])
    if (target.test(url.href)) return true
  }
  return false
}

/**
 * @param {URL} url
 * @param {string} frontend
 * @param {string} randomInstance
 * @param {string} type
 * @returns {undefined|string}
 */
function rewrite(url, originUrl, frontend, randomInstance, type) {
  switch (frontend) {
    case "hyperpipe":
      for (const key of [...url.searchParams.keys()]) if (key !== "q") url.searchParams.delete(key)
      return `${randomInstance}${url.pathname}${url.search}`.replace(/\/search\?q=.*/, searchQuery =>
        searchQuery.replace("?q=", "/")
      )
    case "searx":
    case "searxng":
      for (const key of [...url.searchParams.keys()]) if (key !== "q") url.searchParams.delete(key)
      return `${randomInstance}/${url.search}`
    case "whoogle":
      for (const key of [...url.searchParams.keys()]) if (key !== "q") url.searchParams.delete(key)
      return `${randomInstance}/search${url.search}`
    case "4get": {
      const s = url.searchParams.get("q")
      if (s !== null) return `${randomInstance}/web?s=${encodeURIComponent(s)}`
      return randomInstance
    }
    case "librey":
      for (const key in url.searchParams.keys()) if (key != "q") url.searchParams.delete(key)
      return `${randomInstance}/search.php${url.search}`
    case "yattee":
      url.searchParams.delete("si")
      return url.href.replace(/^https?:\/{2}/, "yattee://")
    case "freetube":
      url.searchParams.delete("si")
      return "freetube://" + url.href
    case "freetubePwa":
      url.searchParams.delete("si")
      return "freetube://" + url.href
    case "poketube": {
      url.searchParams.delete("si")
      if (url.pathname.startsWith("/channel")) {
        const reg = /\/channel\/(.*)\/?$/.exec(url.pathname)
        if (reg) {
          const id = reg[1]
          return `${randomInstance}/channel?id=${id}${url.search}`
        }
      }
      if (/\/@[a-z]+\//.exec(url.pathname)) return randomInstance
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "small":
    case "libMedium":
    case "scribe": {
      const regex = url.hostname.match(/^(link|cdn-images-\d+|.*)\.medium\.com/)
      if (regex && regex.length > 1) {
        const subdomain = regex[1]
        if (subdomain != "link" || !subdomain.startsWith("cdn-images")) {
          return `${randomInstance}/@${subdomain}${url.pathname}${url.search}`
        }
      }
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "translite":
    case "simplyTranslate":
      return `${randomInstance}/${url.search}`
    case "send":
    case "mozhi":
      return randomInstance
    case "libreTranslate":
      return `${randomInstance}/${url.search.replace("sl", "source").replace("tl", "target").replace("text", "q")}`
    case "osm": {
      if (originUrl && originUrl.host === "earth.google.com") return randomInstance

      let prefs = { layers: "mapnik" }

      let mapCentre = "#"
      const mapCentreData = utils.convertMapCentre(url)
      if (mapCentreData.zoom && mapCentreData.lon && mapCentreData.lat) {
        mapCentre = `#map=${mapCentreData.zoom}/${mapCentreData.lon}/${mapCentreData.lat}`
      }

      if (url.pathname.includes("/embed")) {
        // https://www.google.com/maps/embed/v1/place?key=AIzaSyD4iE2xVSpkLLOXoyqT-RuPwURN3ddScAI&q=Eiffel+Tower,Paris+France
        const query = utils.getQuery(url)
        let { coordinate, boundingbox } = utils.addressToLatLng(query)
        prefs.bbox = boundingbox
        prefs.marker = coordinate
        return `${randomInstance}/export/embed.html?${utils.prefsEncoded(prefs)}`
      }

      if (url.pathname.includes("/dir")) {
        if (url.searchParams.has("travelmode")) {
          const travelModes = {
            driving: "fossgis_osrm_car",
            walking: "fossgis_osrm_foot",
            bicycling: "fossgis_osrm_bike",
            transit: "fossgis_osrm_car", // not implemented on OSM, default to car.
          }
          prefs.engine = travelModes[url.searchParams.get("travelmode")]
        }
        const regex1 = /\/dir\/([^@/]+)\/([^@/]+)\/@-?\d[0-9.]*,-?\d[0-9.]*,\d{1,2}[.z]/.exec(url.pathname)
        const regex2 = /\/dir\/([^@/]+)\//.exec(url.pathname)
        if (regex1) {
          // https://www.google.com/maps/dir/92+Rue+Moncey,+69003+Lyon,+France/M%C3%A9dip%C3%B4le+Lyon-Villeurbanne/@45.760254,4.8486298,13z?travelmode=bicycling
          const origin = utils.addressToLatLng(decodeURIComponent(regex1[1])).coordinate ?? ""
          const destination = utils.addressToLatLng(decodeURIComponent(regex1[2])).coordinate ?? ""
          prefs.route = `${origin};${destination}`
        } else if (regex2) {
          // https://www.google.com/maps/dir/92+Rue+Moncey,+69003+Lyon,+France/@45.760254,4.8486298,13z?travelmode=bicycling
          const origin = utils.addressToLatLng(decodeURIComponent(regex2[1])).coordinate ?? ""
          prefs.route = `${origin};`
        } else {
          // https://www.google.com/maps/dir/?api=1&origin=Space+Needle+Seattle+WA&destination=Pike+Place+Market+Seattle+WA&travelmode=bicycling
          const origin = utils.addressToLatLng(url.searchParams.get("origin")).coordinate ?? ""
          const destination = utils.addressToLatLng(url.searchParams.get("destination")).coordinate ?? ""
          prefs.route = `${origin};${destination}`
        }
        return `${randomInstance}/directions?${utils.prefsEncoded(prefs)}${mapCentre}`
      }

      const placeRegex = /\/place\/(.*?)\//
      if (url.pathname.match(placeRegex)) {
        // https://www.google.com/maps/place/H%C3%B4tel+de+Londres+Eiffel/@40.9845265,28.7081268,14z
        const query = url.pathname.match(placeRegex)[1]
        return `${randomInstance}/search?query=${query}${mapCentre}`
      }

      if (url.searchParams.has("ll")) {
        // https://maps.google.com/?ll=38.882147,-76.99017
        const [mlat, mlon] = url.searchParams.get("ll").split(",")
        return `${randomInstance}/search?query=${mlat}%2C${mlon}`
      }

      if (url.searchParams.has("viewpoint")) {
        // https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.857832,2.295226&heading=-45&pitch=38&fov=80
        const [mlat, mlon] = url.searchParams.get("viewpoint").split(",")
        return `${randomInstance}/search?query=${mlat}%2C${mlon}`
      }

      const query = utils.getQuery(url)
      if (query) return `${randomInstance}/search?query="${query}${mapCentre}&${utils.prefsEncoded(prefs)}`
      return `${randomInstance}/${mapCentre}&${utils.prefsEncoded(prefs)}`
    }
    case "breezeWiki": {
      let wiki,
        urlpath = ""
      if (url.hostname.match(/^[a-zA-Z0-9-]+\.(?:fandom|wikia)\.com/)) {
        wiki = url.hostname.match(/^[a-zA-Z0-9-]+(?=\.(?:fandom|wikia)\.com)/)
        if (wiki == "www" || !wiki) wiki = ""
        else wiki = `/${wiki}`
        urlpath = url.pathname
      } else {
        wiki = url.pathname.match(/(?<=wiki\/w:c:)[a-zA-Z0-9-]+(?=:)/)
        if (!wiki) wiki = ""
        else {
          wiki = "/" + wiki + "/wiki/"
          urlpath = url.pathname.match(/(?<=wiki\/w:c:[a-zA-Z0-9-]+:).+/)
        }
      }
      if (url.href.search(/Special:Search\?query/) > -1) {
        return `${randomInstance}${wiki}${urlpath}${url.search}`
          .replace(/Special:Search\?query/, "search?q")
          .replace(/\/wiki/, "")
      }
      return `${randomInstance}${wiki}${urlpath}${url.search}`
    }
    case "rimgo":
      if (url.href.search(/^https?:\/{2}(?:[im]\.)?stack\./) > -1)
        return `${randomInstance}/stack${url.pathname}${url.search}`
      return `${randomInstance}${url.pathname}${url.search}`
    case "redlib":
    case "libreddit": {
      const subdomain = url.hostname.match(/^(?:((?:external-)?preview|i)\.)?redd\.it/)
      if (!subdomain) return `${randomInstance}${url.pathname}${url.search}`
      switch (subdomain[1]) {
        case "preview":
          return `${randomInstance}/preview/pre${url.pathname}${url.search}`
        case "external-preview":
          return `${randomInstance}/preview/external-pre${url.pathname}${url.search}`
        case "i":
          return `${randomInstance}/img${url.pathname}`
      }
      return `${randomInstance}/comments${url.pathname}`
    }
    case "teddit":
      if (/^(?:(?:external-)?preview|i)\.redd\.it/.test(url.hostname)) {
        if (url.search == "") return `${randomInstance}${url.pathname}?teddit_proxy=${url.hostname}`
        else return `${randomInstance}${url.pathname}${url.search}&teddit_proxy=${url.hostname}`
      }
      return `${randomInstance}${url.pathname}${url.search}`
    case "troddit":
    case "eddrit":
      if (/^(?:(?:external-)?preview|i)\.redd\.it/.test(url.hostname)) return randomInstance
      return `${randomInstance}${url.pathname}${url.search}`
    case "neuters": {
      const p = url.pathname
      if (p.startsWith("/article/") || p.startsWith("/pf/") || p.startsWith("/arc/") || p.startsWith("/resizer/")) {
        return randomInstance
      }
      return `${randomInstance}${p}`
    }
    case "dumb":
      if (url.pathname.endsWith("-lyrics")) return `${randomInstance}${url.pathname}`
      return `${randomInstance}${url.pathname}${url.search}`
    case "intellectual":
      return `${randomInstance}${url.pathname}${url.search}`
    case "ruralDictionary":
      if (!url.pathname.includes("/define.php") && !url.pathname.includes("/random.php") && url.pathname != "/")
        return randomInstance
      return `${randomInstance}${url.pathname}${url.search}`
    case "anonymousOverflow": {
      if (url.hostname == "stackoverflow.com") {
        const threadID = /^\/a\/(\d+)\/?/.exec(url.pathname)
        if (threadID) return `${randomInstance}/questions/${threadID[1]}${url.search}`
        return `${randomInstance}${url.pathname}${url.search}`
      }
      if (url.pathname == "/" || url.pathname == "") {
        // https://stackexchange.com or https://superuser.com
        return `${randomInstance}${url.pathname}${url.search}`
      }
      const regex = url.href.match(/https?:\/{2}(?:([a-zA-Z0-9-]+)\.(meta\.)?)?stackexchange\.com\//)
      if (regex && regex.length > 1) {
        if (regex[2]) {
          return `${randomInstance}/exchange/${url.hostname}${url.pathname}${url.search}`
        }
        const subdomain = regex[1]
        return `${randomInstance}/exchange/${subdomain}${url.pathname}${url.search}`
      }
      const notExchangeRegex = url.hostname.match(
        /(?:[a-zA-Z]+\.)?(?:askubuntu\.com|mathoverflow\.net|serverfault\.com|stackapps\.com|superuser\.com|stackoverflow\.com)/
      )
      if (notExchangeRegex) {
        return `${randomInstance}/exchange/${notExchangeRegex[0]}${url.pathname}${url.search}`
      }
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "biblioReads":
      return `${randomInstance}${url.pathname}${url.search}`
    case "wikimore": {
      let hostSplit = url.host.split(".")
      // wikiless doesn't have mobile view support yet
      if (hostSplit[0] != "wikipedia" && hostSplit[0] != "www") {
        const lang = url.hostname.split(".")[0]
        return `${randomInstance}/wiki/${lang}${url.pathname}${url.search}${url.hash}`
      }
      return `${randomInstance}${url.pathname}${url.search}${url.hash}`
    }
    case "wikiless": {
      let hostSplit = url.host.split(".")
      // wikiless doesn't have mobile view support yet
      if (hostSplit[0] != "wikipedia" && hostSplit[0] != "www") {
        if (hostSplit[0] == "m") url.searchParams.append("mobileaction", "toggle_view_mobile")
        else url.searchParams.append("lang", hostSplit[0])
        if (hostSplit[1] == "m") url.searchParams.append("mobileaction", "toggle_view_mobile")
      }
      return `${randomInstance}${url.pathname}${url.search}${url.hash}`
    }
    case "offtiktok":
    case "proxiTok":
      if (url.pathname.startsWith("/email")) return randomInstance
      return `${randomInstance}${url.pathname}${url.search}`
    case "waybackClassic": {
      const regex = /^\/\web\/(?:[0-9]+)?\*\/(.*)/.exec(url.pathname)
      if (regex) {
        const link = regex[1]
        return `${randomInstance}/cgi-bin/history.cgi?utf8=✓&q=${encodeURIComponent(link)}`
      }
      const regex2 = /(^\/\web\/([0-9]+)\/.*)/.exec(url.pathname)
      if (regex2) {
        let link = regex2[1]
        link = link.replace(regex2[2], regex2[2] + "if_")
        return `https://web.archive.org${link}`
      }
      return
    }
    case "gothub":
      if (url.hostname == "gist.github.com") return `${randomInstance}/gist${url.pathname}${url.search}`
      if (url.hostname == "raw.githubusercontent.com") return `${randomInstance}/raw${url.pathname}${url.search}`
      return `${randomInstance}${url.pathname}${url.search}`
    case "mikuInvidious":
      if (url.hostname == "bilibili.com" || url.hostname == "www.bilibili.com" || url.hostname == "b23.tv")
        return `${randomInstance}${url.pathname}${url.search}`
      if (url.hostname == "space.bilibili.com") return `${randomInstance}/space${url.pathname}${url.search}`
    case "tent": {
      if (url.hostname == "bandcamp.com" && url.pathname == "/search") {
        const query = url.searchParams.get("q")
        return `${randomInstance}/search.php?query=${encodeURIComponent(query)}`
      }
      if (url.hostname.endsWith("bandcamp.com")) {
        const regex = /^(.*)\.bandcamp\.com/.exec(url.hostname)
        const artist = regex[1]
        if (url.pathname == "/" || url.pathname == "/music") {
          return `${randomInstance}/artist.php?name=${artist}`
        } else {
          const regex = /^\/(.*)\/(.*)/.exec(url.pathname)
          if (regex) {
            const type = regex[1]
            const name = regex[2]
            return `${randomInstance}/release.php?artist=${artist}&type=${type}&name=${name}`
          }
        }
      }
      if (url.hostname == "f4.bcbits.com") {
        const regex = /\/img\/(.*)/.exec(url.pathname)
        const image = regex[1]
        return `${randomInstance}/image.php?file=${image}`
      }
      if (url.hostname == "t4.bcbits.com") {
        const regex = /\/stream\/(.*)\/(.*)\/(.*)/.exec(url.pathname)
        if (regex) {
          const directory = regex[1]
          const format = regex[2]
          const file = regex[3]
          const token = url.searchParams.get("token")
          return `${randomInstance}/audio.php/?directory=${directory}&format=${format}&file=${file}&token=${encodeURIComponent(token)}`
        }
      }
    }
    case "binternet":
      if (url.hostname == "i.pinimg.com") return `${randomInstance}/image_proxy.php?url=${encodeURIComponent(url.href)}`
      return `${randomInstance}${url.pathname}${url.search}`
    case "painterest":
      if (url.hostname == "i.pinimg.com") return `${randomInstance}/_/proxy?url=${encodeURIComponent(url.href)}`
      return `${randomInstance}${url.pathname}${url.search}`
    case "laboratory": {
      let path = url.pathname
      if (path == "/") path = ""
      return `${randomInstance}/${url.hostname}${path}${url.search}`
    }
    case "quetre": {
      const regex = /([a-z]+)\.quora\.com/.exec(url.hostname)
      if (regex) {
        const lang = regex[1]
        url.searchParams.append("lang", lang)
        return `${randomInstance}${url.pathname}${url.search}`
      }
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "liteXiv":
    case "pixivFe": {
      const regex = /\/[a-z]{1,3}\/(.*)/.exec(url.pathname)
      if (regex) {
        const path = regex[1]
        return `${randomInstance}/${path}${url.search}`
      }
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "vixipy": {
      const regex = /\/[a-z]{1,3}\/(.*)/.exec(url.pathname)
      if (regex) {
        let path = regex[1]
        if (path.startsWith("tags/")) path = path.replace(/tags/, "tag")
        return `${randomInstance}/${path}${url.search}`
      }
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "invidious": {
      // tracker
      url.searchParams.delete("si")

      if (type == "sub_frame") url.searchParams.append("autoplay", "0")

      if (url.hostname == "youtu.be" || (url.hostname.endsWith("youtube.com") && url.pathname.startsWith("/live"))) {
        const watch = url.pathname.substring(url.pathname.lastIndexOf("/") + 1)
        return `${randomInstance}/watch?v=${watch}&${url.search.substring(1)}`
      }
      if (url.hostname.endsWith("youtube.com") && url.pathname.startsWith("/redirect?")) return url.href
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "freetubeMusic": {
      if (url.hostname == "youtu.be" || (url.hostname.endsWith("youtube.com") && url.pathname.startsWith("/live"))) {
        const watch = url.pathname.substring(url.pathname.lastIndexOf("/") + 1)
        return `freetube://youtube.com/watch?v=${watch}`
      }
      return "freetube://" + url.href
    }
    case "invidiousMusic": {
      if (url.hostname == "youtu.be" || (url.hostname.endsWith("youtube.com") && url.pathname.startsWith("/live"))) {
        const watch = url.pathname.substring(url.pathname.lastIndexOf("/") + 1)
        return `${randomInstance}/watch?v=${watch}`
      }
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "materialious": {
      url.searchParams.delete("si")
      if (url.hostname == "youtu.be" || (url.hostname.endsWith("youtube.com") && url.pathname.startsWith("/live"))) {
        const watch = url.pathname.substring(url.pathname.lastIndexOf("/") + 1)
        return `${randomInstance}/watch/${watch}${url.search.replace("?", "&")}`
      }
      if (url.hostname.endsWith("youtube.com")) {
        if (url.pathname.startsWith("/watch")) {
          if (url.searchParams.has("v")) {
            const watch = url.searchParams.get("v")
            url.searchParams.delete("v")
            return `${randomInstance}/watch/${watch}${url.search.replace("?", "&")}`
          }
          return `${randomInstance}/watch/${url.search.replace("?", "&")}`
        }
        if (url.pathname.startsWith("/results")) {
          if (url.searchParams.has("search_query")) {
            const search = url.searchParams.get("search_query")
            url.searchParams.delete("search_query")
            return `${randomInstance}/search/${search}${url.search.replace("?", "&")}`
          }
          return `${randomInstance}/search/${url.search.replace("?", "&")}`
        }
        if (url.pathname.startsWith("/redirect?")) {
          return url.href
        }
      }
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "libremdb": {
      if (url.pathname.startsWith("/Name")) {
        for (const [key, value] of url.searchParams.entries()) {
          return `${randomInstance}/title/${encodeURIComponent(key)}`
        }
      }
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "tuboYoutube":
      url.searchParams.delete("si")
      if (url.pathname.startsWith("/channel")) return `${randomInstance}/channel?url=${encodeURIComponent(url.href)}`
      if (url.pathname.startsWith("/watch")) return `${randomInstance}/stream?url=${encodeURIComponent(url.href)}`
      return randomInstance
    case "tuboSoundcloud":
      if (url.pathname == "/") return `${randomInstance}?kiosk?serviceId=1`
      if (url.pathname.match(/^\/[^\/]+(\/$|$)/)) return `${randomInstance}/channel?url=${encodeURIComponent(url.href)}`
      if (url.pathname.match(/^\/[^\/]+\/[^\/]+/)) return `${randomInstance}/stream?url=${encodeURIComponent(url.href)}`
      return randomInstance
    case "twineo":
    case "safetwitch":
      if (url.hostname.startsWith("clips.")) return `${randomInstance}/clip${url.pathname}${url.search}`
      return `${randomInstance}${url.pathname}${url.search}`

    case "tekstoLibre":
      return `${randomInstance}/?${url.pathname.slice(1)}`
    case "skyview":
      if (url.pathname == "/") return randomInstance
      return `${randomInstance}?url=${encodeURIComponent(url.href)}`
    case "nitter": {
      let search = new URLSearchParams(url.search)

      search.delete("ref_src")
      search.delete("ref_url")
      search.delete("s") // type of device that shared the link
      search.delete("t") // some sort of tracking ID

      search = search.toString()
      if (search !== "") search = `?${search}`

      if (url.host.split(".")[0] === "pbs" || url.host.split(".")[0] === "video") {
        try {
          const [, id, format, extra] = search.match(/(.*)\?format=(.*)&(.*)/)
          const query = encodeURIComponent(`${id}.${format}?${extra}`)
          return `${randomInstance}/pic${url.pathname}${query}`
        } catch {
          return `${randomInstance}/pic${url.pathname}${search}`
        }
      }
      if (url.pathname.split("/").includes("tweets"))
        return `${randomInstance}${url.pathname.replace("/tweets", "")}${search}`
      if (url.host == "t.co") return `${randomInstance}/t.co${url.pathname}`
      return `${randomInstance}${url.pathname}${search}#m`
    }
    case "priviblur": {
      if (url.hostname == "www.tumblr.com") return `${randomInstance}${url.pathname}${url.search}`
      if (url.hostname.startsWith("assets")) return `${randomInstance}/tblr/assets${url.pathname}${url.search}`
      if (url.hostname.startsWith("static")) return `${randomInstance}/tblr/static${url.pathname}${url.search}`

      const reg = /^([0-9]+)\.media\.tumblr\.com/.exec(url.hostname) // *.media.tumblr.com
      if (reg) return `${randomInstance}/tblr/media/${reg[1]}${url.pathname}${url.search}`

      const blogregex = /^(?:www\.)?([a-z\d-]+)\.tumblr\.com/.exec(url.hostname) // <blog>.tumblr.com
      if (blogregex) {
        const blog_name = blogregex[1]
        // Under the <blog>.tumblr.com domain posts are under a /post path
        if (url.pathname.startsWith("/post"))
          return `${randomInstance}/${blog_name}${url.pathname.slice(5)}${url.search}`
        else return `${randomInstance}/${blog_name}${url.pathname}${url.search}`
      }
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "ultimateTab":
    case "freetar":
      if (url.pathname.startsWith("/search.php")) {
        url.searchParams.set("search_term", url.searchParams.get("value"))
        url.searchParams.delete("value")
        url.searchParams.delete("search_type")
        return `${randomInstance}/search${url.search}`
      }
      if (url.pathname.startsWith("/artist")) return
      return `${randomInstance}${url.pathname}${url.search}`
    case "ratAintTieba":
      url.searchParams.delete("ie")
      return `${randomInstance}${url.pathname}${url.search}`
    case "shoelace": {
      const reg = /^\/(?:(?:(?:[^\/])?\/post)|t)\/([^\/])/.exec(url.pathname)
      if (reg) return `${randomInstance}/t/${reg[1]}${url.search}`
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "skunkyArt": {
      if (url.pathname.startsWith("/search")) return `${randomInstance}${url.pathname}${url.search}&type=all`

      const artReg = /^\/(.*?)\/art\/(.*)\/?/.exec(url.pathname)
      if (artReg) return `${randomInstance}/post/${artReg[1]}/${artReg[2]}${url.search}`

      const userReg = /^\/([^\/]+)$/.exec(url.pathname)
      if (userReg) return `${randomInstance}/group_user?q=${userReg[1]}&type=about`

      const galleryReg = /^\/(.*?)\/gallery(\/$|$)$/.exec(url.pathname)
      if (galleryReg) return `${randomInstance}/group_user?q=${galleryReg[1]}&type=gallery`

      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "ytify": {
      if (url.pathname.startsWith("/watch"))
        return `${randomInstance}/?s=${encodeURIComponent(url.searchParams.get("v"))}`

      const channelReg = /\/channel\/([^\/]+)/.exec(url.pathname)
      if (channelReg) return `${randomInstance}/list?channel=${channelReg[1]}`

      if (url.pathname.startsWith("/playlist"))
        return `${randomInstance}/list?playlists=${encodeURIComponent(url.searchParams.get("list"))}`
      return `${randomInstance}${url.pathname}${url.search}`
    }
    case "koub":
      if (url.pathname.startsWith("/view/") || url.pathname.startsWith("/stories/")) {
        return `${randomInstance}${url.pathname}${url.search}`
      }
      const accountReg = /^\/([^\/]+)\/?$/.exec(url.pathname)
      if (accountReg) return `${randomInstance}/account${url.pathname}${url.search}`

    case "duckDuckGoAiChat":
      return "https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=1"

    case "soundcloak":
      if (url.pathname.startsWith("/feed") || url.pathname.startsWith("/stream")) {
        // this feature requires authentication and is unsupported, so just redirect to main page
        return randomInstance
      }

      if (url.pathname.startsWith("/search")) {
        if (!url.search) {
          return randomInstance
        }

        let type = ""
        if (url.pathname.startsWith("/search/sounds")) {
          type = "tracks"
        } else if (url.pathname.startsWith("/search/people")) {
          type = "users"
        } else if (url.pathname.startsWith("/search/albums") || url.pathname.startsWith("/search/sets")) {
          type = "playlists"
        }

        if (type) {
          type = "&type=" + type
        } else {
          return randomInstance // fallback for unsupported search types (searching for anything for example)
        }

        return `${randomInstance}/search${url.search}${type}`
      }

      if (url.host == "on.soundcloud.com") {
        return `${randomInstance}/on${url.pathname}`
      }

      return `${randomInstance}${url.pathname}${url.search}`
    case "piped":
    case "pipedMaterial":
    case "cloudtube":
    case "lightTube":
    case "viewtube":
      url.searchParams.delete("si")
    default:
      return `${randomInstance}${url.pathname}${url.search}`
  }
}

/**
 * @param {URL} url
 * @param {string} type
 * @param {URL} originUrl
 * @param {URL} documentUrl
 * @param {boolean} incognito
 * @param {boolean} forceRedirection
 * @returns {string | undefined}
 */
function redirect(url, type, originUrl, documentUrl, incognito, forceRedirection) {
  if (type != "main_frame" && type != "sub_frame" && type != "image") return
  let randomInstance
  let frontend
  if (!forceRedirection && options.redirectOnlyInIncognito == true && !incognito) return
  for (const service in config.services) {
    if (!forceRedirection && !options[service].enabled) continue
    if (!forceRedirection && options[service].redirectOnlyInIncognito == true && !incognito) continue

    frontend = options[service].frontend

    if (
      config.services[service].frontends[frontend].desktopApp &&
      type != "main_frame" &&
      options[service].redirectType != "main_frame"
    )
      frontend = options[service].embedFrontend

    if (!regexArray(service, url, config, options, frontend)) {
      frontend = null
      continue
    }

    if (type != "main_frame" && documentUrl && options[service].redirectType == "sub_frame") {
      if (regexArray(service, documentUrl, config, options, frontend)) {
        return
      }
    }

    if (
      config.services[service].embeddable &&
      type != options[service].redirectType &&
      options[service].redirectType != "both"
    ) {
      if (options[service].unsupportedUrls == "block") return "CANCEL"
      return
    }

    let instanceList = options[frontend]
    if (instanceList === undefined) break // should not happen if settings are correct

    if (config.services[service].frontends[frontend].localhost && options[service].instance == "localhost") {
      randomInstance = `http://${frontend}.localhost:8080`
    } else if (instanceList.length === 0) {
      return `https://no-instance.libredirect.invalid?frontend=${encodeURIComponent(frontend)}&url=${encodeURIComponent(url.href)}`
    } else {
      randomInstance = utils.getRandomInstance(instanceList)
    }

    if (originUrl && instanceList.includes(originUrl.origin)) {
      if (type == "main_frame") return "BYPASSTAB"
      else return null
    }
    break
  }
  if (!frontend) return

  return rewrite(url, originUrl, frontend, randomInstance, type)
}

/**
 * @param {URL} url
 * @param {string} type
 * @param {URL} originUrl
 * @param {URL} documentUrl
 * @param {boolean} incognito
 * @param {boolean} forceRedirection
 * @returns {Promise<string | undefined>}
 */
async function redirectAsync(url, type, originUrl, documentUrl, incognito, forceRedirection) {
  await init()
  return redirect(url, type, originUrl, documentUrl, incognito, forceRedirection)
}

/**
 * @param {URL} url
 */
async function computeServiceFrontend(url) {
  const config = await utils.getConfig()
  const options = await utils.getOptions()
  for (const service in config.services) {
    if (regexArray(service, url, config, options)) {
      return { service, frontend: null }
    } else {
      for (const frontend in config.services[service].frontends) {
        const instances = all(service, frontend, options, config)
        const i = instances.findIndex(instance => url.href.startsWith(instance))
        if (i >= 0) {
          return { service, frontend }
        }
      }
    }
  }
}

/**
 * @param {URL} url
 * @param {string} customService
 */
function switchInstance(url, customService) {
  return new Promise(async resolve => {
    let options = await utils.getOptions()
    let config = await utils.getConfig()

    const protocolHost = utils.protocolHost(url)
    if (customService) {
      const instancesList = options[options[customService].frontend]
      if (instancesList !== undefined) {
        const newInstance = utils.getNextInstance(url.origin, instancesList)
        if (newInstance) {
          return resolve(`${newInstance}${url.pathname}${url.search}`)
        }
      }
    } else {
      for (const service in config.services) {
        let instancesList = options[options[service].frontend]
        if (instancesList === undefined) continue
        const index = instancesList.findIndex(instance => url.href.startsWith(instance))
        if (index < 0) continue
        instancesList.splice(index, 1)
        if (instancesList.length === 0) return resolve()
        const newInstance = utils.getNextInstance(url.origin, instancesList)
        if (newInstance) {
          return resolve(`${newInstance}${url.pathname}${url.search}`)
        }
      }
    }
    resolve()
  })
}

/**
 * @param {URL} url
 */
async function reverse(url) {
  let options = await utils.getOptions()
  let config = await utils.getConfig()
  for (const service in config.services) {
    let frontend = options[service].frontend
    if (options[frontend] == undefined) continue
    if (
      options[frontend].findIndex(instance => url.href.startsWith(instance)) < 0 &&
      !url.href.startsWith(`http://${frontend}.localhost:8080`)
    )
      continue
    switch (service) {
      case "youtube":
      case "imdb":
      case "imgur":
      case "tiktok":
      case "reddit":
      case "imdb":
      case "snopes":
      case "urbanDictionary":
      case "quora":
      case "twitter":
      case "medium":
        return `${config.services[service].url}${url.pathname}${url.search}`
      case "fandom": {
        let regex = url.pathname.match(/^\/([a-zA-Z0-9-]+)\/wiki\/(.*)/)
        if (regex) return `https://${regex[1]}.fandom.com/wiki/${regex[2]}`
        return
      }
      case "wikipedia": {
        const lang = url.searchParams.get("lang")
        if (lang != null) {
          return `https://${lang}.wikipedia.org${url.pathname}${url.search}${url.hash}`
        }
        return `https://wikipedia.org${url.pathname}${url.search}${url.hash}`
      }
      case "stackOverflow": {
        if (url.pathname.startsWith("/questions/")) {
          return `https://stackoverflow.com${url.pathname}${url.search}`
        }
        if (url.pathname.startsWith("/exchange/")) {
          const regex = /\/exchange\/(.*?)(\/.*)/.exec(url.pathname)
          if (regex) {
            if (regex[1].includes(".")) {
              return `https://${regex[1]}${regex[2]}`
            } else {
              return `https://${regex[1]}.stackexchange.com${regex[2]}`
            }
          }
        }
        return
      }
      case "tekstowo":
        return `${config.services[service].url}/${url.search.slice(1)}`
      case "goodreads":
        return `https://goodreads.com${url.pathname}${url.search}`
      case "soundcloud":
        if (frontend == "soundcloak") {
          if (url.pathname.includes("/_/")) {
            // soundcloak-specific pages
            return `${config.services[service].url}${url.pathname.split("/_/")[0]}`
          }

          if (url.pathname == "/search") {
            let type = url.searchParams.get("type")
            switch (type) {
              case "playlists":
                type = "sets"
                break
              case "tracks":
                type = "sounds"
                break
              case "users":
                type = "people"
                break
              default:
                type = ""
            }

            url.searchParams.delete("type")
            if (!type) {
              return `${config.services[service].url}/search?${url.searchParams.toString()}`
            } else {
              return `${config.services[service].url}/search/${type}?${url.searchParams.toString()}`
            }
          }

          return `${config.services[service].url}${url.pathname}`
        }
      default:
        return
    }
  }
  return
}

const defaultInstances = {
  materialious: ["https://app.materialio.us"],
  viewtube: ["https://viewtube.io"],
  piped: ["https://pipedapi-libre.kavin.rocks"],
  pipedMaterial: ["https://piped-material.xn--17b.net"],
  cloudtube: ["https://tube.cadence.moe"],
  lightTube: ["https://tube.kuylar.dev"],
  poketube: ["https://poketube.fun"],
  proxiTok: ["https://proxitok.pabloferreiro.es"],
  offtiktok: ["https://www.offtiktok.com"],
  redlib: ["https://safereddit.com"],
  eddrit: ["https://eddrit.com"],
  troddit: ["https://www.troddit.com"],
  scribe: ["https://scribe.rip"],
  libMedium: ["https://md.vern.cc"],
  small: ["https://small.bloat.cat"],
  quetre: ["https://quetre.iket.me"],
  libremdb: ["https://libremdb.iket.me"],
  simplyTranslate: ["https://simplytranslate.org"],
  translite: ["https://tl.bloat.cat"],
  mozhi: ["https://mozhi.aryak.me"],
  searxng: ["https://nyc1.sx.ggtyler.dev"],
  "4get": ["https://4get.ca"],
  rimgo: ["https://rimgo.vern.cc"],
  hyperpipe: ["https://hyperpipe.surge.sh"],
  osm: ["https://www.openstreetmap.org"],
  breezeWiki: ["https://breezewiki.com"],
  neuters: ["https://neuters.de"],
  dumb: ["https://dm.vern.cc"],
  intellectual: ["https://intellectual.insprill.net"],
  ruralDictionary: ["https://rd.vern.cc"],
  anonymousOverflow: ["https://code.whatever.social"],
  suds: ["https://sd.vern.cc"],
  unfunny: ["https://uf.vern.cc"],
  soprano: ["https://sp.vern.cc"],
  meme: ["https://mm.vern.cc"],
  waybackClassic: ["https://wayback-classic.net"],
  tent: ["https://tent.sny.sh"],
  wolfreeAlpha: ["https://gqq.gitlab.io", "https://uqq.gitlab.io"],
  laboratory: ["https://lab.vern.cc"],
  binternet: ["https://bn.bloat.cat"],
  painterest: ["https://pt.bloat.cat"],
  pixivFe: ["https://pixivfe.exozy.me"],
  liteXiv: ["https://litexiv.exozy.me"],
  vixipy: ["https://vx.maid.zone"],
  indestructables: ["https://indestructables.private.coffee"],
  destructables: ["https://ds.vern.cc"],
  structables: ["https://structables.private.coffee"],
  safetwitch: ["https://safetwitch.drgns.space"],
  twineo: ["https://twineo.exozy.me"],
  proxigram: ["https://ig.opnxng.com"],
  tuboYoutube: ["https://tubo.media"],
  tuboSoundcloud: ["https://tubo.media"],
  tekstoLibre: ["https://davilarek.github.io/TekstoLibre"],
  skyview: ["https://skyview.social"],
  priviblur: ["https://pb.bloat.cat"],
  nitter: ["https://nitter.privacydev.net"],
  pasted: ["https://pasted.drakeerv.com"],
  pasty: ["https://pasty.lus.pm"],
  freetar: ["https://freetar.de"],
  ultimateTab: ["https://ultimate-tab.com"],
  ratAintTieba: ["https://rat.fis.land"],
  shoelace: ["https://shoelace.mint.lgbt"],
  skunkyArt: ["https://skunky.bloat.cat"],
  ytify: ["https://ytify.pp.ua"],
  nerdsForNerds: ["https://nn.vern.cc"],
  ducksForDucks: ["https://ducksforducks.private.coffee"],
  koub: ["https://koub.clovius.club"],
  soundcloak: ["https://soundcloak.fly.dev"],
  gocook: ["https://cook.adminforge.de"],
  wikimore: ["https://wikimore.private.coffee"],
}

async function getDefaults() {
  let config = await utils.getConfig()
  let options = {}
  for (const service in config.services) {
    options[service] = {}
    for (const defaultOption in config.services[service].options) {
      options[service][defaultOption] = config.services[service].options[defaultOption]
    }
    for (const frontend in config.services[service].frontends) {
      if (config.services[service].frontends[frontend].instanceList) {
        options[frontend] = []
      }
    }
  }
  options.exceptions = {
    url: [],
    regex: [],
  }
  options.theme = "detect"
  options.popupServices = ["youtube", "tiktok", "imgur", "reddit", "quora", "translate", "maps"]
  options.fetchInstances = "github"
  options.redirectOnlyInIncognito = false
  options = { ...options, ...defaultInstances }
  return options
}

function initDefaults() {
  return new Promise(resolve => {
    browser.storage.local.clear(async () => {
      options = await getDefaults()
      browser.storage.local.set({ options }, () => resolve())
    })
  })
}

function processUpdate(_options) {
  return new Promise(async resolve => {
    const config = await utils.getConfig()
    let options = _options ?? (await utils.getOptions())

    const defaults = await getDefaults()

    // Remove any unknown option or subOption
    for (const optionName in options) {
      if (!(optionName in defaults)) delete options[optionName]
      else if (typeof optionName === "object" && optionName !== null) {
        for (const subOptionName in options[optionName]) {
          if (!(subOptionName in defaults[optionName])) delete options[optionName][subOptionName]
        }
      }
    }

    // Remove any unknwon popupService
    options.popupServices = options.popupServices.filter(service => service in config.services)

    // Add missing options
    for (const [defaultName, defaultValue] of Object.entries(defaults)) {
      if (!(defaultName in options)) {
        options[defaultName] = defaultValue
      }
    }

    for (const [serviceName, serviceValue] of Object.entries(config.services)) {
      // Reset service options if selected frontend is deprecated
      if (!(options[serviceName].frontend in serviceValue.frontends)) {
        options[serviceName] = serviceValue.options
      }

      // Add a default service option if it's not present
      for (const optionName in serviceValue.options) {
        if (!(optionName in options[serviceName])) {
          options[serviceName][optionName] = serviceValue.options[optionName]
        }
      }
    }

    browser.storage.local.clear(() => {
      browser.storage.local.set({ options }, () => {
        resolve(options)
      })
    })
  })
}

/**
 * @param {URL} url
 */
async function copyRaw(url) {
  const newUrl = await reverse(url)
  if (newUrl) {
    if (!isChrome) {
      navigator.clipboard.writeText(newUrl)
    } else {
      var copyFrom = document.createElement("textarea")
      copyFrom.textContent = newUrl
      document.body.appendChild(copyFrom)
      copyFrom.select()
      document.execCommand("copy")
      copyFrom.blur()
      document.body.removeChild(copyFrom)
    }
  }
}

/**
 * @param {URL} url
 */
function isException(url) {
  if (!options) return false
  if (!options.exceptions) return false
  let exceptions = options.exceptions
  if (exceptions && url) {
    if (exceptions.url) {
      for (let item of exceptions.url) {
        item = new URL(item)
        item = item.href.replace(/^http:\/\//, "https://")
        if (item == url.href) {
          return true
        }
      }
    }
    if (exceptions.regex) {
      for (const item of exceptions.regex) {
        if (new RegExp(item).test(url.href)) {
          return true
        }
      }
    }
  }
  return false
}

export default {
  redirect,
  redirectAsync,
  computeServiceFrontend,
  reverse,
  initDefaults,
  processUpdate,
  copyRaw,
  switchInstance,
  isException,
}

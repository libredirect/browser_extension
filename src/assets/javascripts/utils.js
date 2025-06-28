window.browser = window.browser || window.chrome

/**
 * @param {Array.<T>} instances
 * @returns {T}
 */
function getRandomInstance(instances) {
  return instances[~~(instances.length * Math.random())]
}

/**
 * @param {string} currentInstanceUrl
 * @param {Array.<T>} instances
 * @returns {T}
 */
function getNextInstance(currentInstanceUrl, instances) {
  const currentInstanceIndex = instances.indexOf(currentInstanceUrl)
  if (currentInstanceIndex === -1) return getRandomInstance(instances)
  const nextInstanceIndex = (currentInstanceIndex + 1) % instances.length
  return instances[nextInstanceIndex]
}

/**
 * @param {URL} url
 */
function protocolHost(url) {
  const pathname = url.pathname.replace(/\/$/, "")

  // workaround
  if (pathname == "/TekstoLibre" && url.host.endsWith("github.io"))
    return `${url.protocol}//${url.host}${pathname.slice(0, -1)}`

  if (url.username && url.password) return `${url.protocol}//${url.username}:${url.password}@${url.host}${pathname}`

  return `${url.protocol}//${url.host}${pathname}`
}

/**
 * @typedef FrontendInfo
 * @prop {boolean} instanceList
 * @prop {string} name
 * @prop {string} url
 */

/**
 * @typedef {Object} Service
 * @prop {Object.<string, FrontendInfo>} frontends
 * @prop {Object} options
 */

/**
 * @typedef {Object} Config
 * @prop {Object.<string, Service>} services
 */

/**
 * @returns {Promise<Config>}
 */
function getConfig() {
  return new Promise(resolve => {
    fetch("/config.json")
      .then(response => response.text())
      .then(json => {
        resolve(JSON.parse(json))
        return
      })
  })
}

/**
 * @typedef {Object} Option
 * @prop {string} frontend
 */

/**
 * @returns {Promise<Object.<string, Option | string[]>>}
 */
function getOptions() {
  return new Promise(resolve => browser.storage.local.get("options", r => resolve(r.options)))
}

function getPingCache() {
  return new Promise(resolve => browser.storage.local.get("pingCache", r => resolve(r.pingCache ?? {})))
}

function getBlacklist(options) {
  return new Promise(resolve => {
    let url
    if (options.fetchInstances == "github")
      url = "https://raw.githubusercontent.com/libredirect/instances/main/blacklist.json"
    else if (options.fetchInstances == "codeberg")
      url = "https://codeberg.org/LibRedirect/instances/raw/branch/main/blacklist.json"
    else return resolve("disabled")
    const http = new XMLHttpRequest()
    http.open("GET", url, true)
    http.onreadystatechange = () => {
      if (http.status === 200 && http.readyState == XMLHttpRequest.DONE) resolve(JSON.parse(http.responseText))
    }
    http.onerror = () => resolve()
    http.ontimeout = () => resolve()
    http.send(null)
  })
}

function getList(options) {
  return new Promise(resolve => {
    let url
    if (options.fetchInstances == "github")
      url = "https://raw.githubusercontent.com/libredirect/instances/main/data.json"
    else if (options.fetchInstances == "codeberg")
      url = "https://codeberg.org/LibRedirect/instances/raw/branch/main/data.json"
    else return resolve("disabled")
    const http = new XMLHttpRequest()
    http.open("GET", url, true)
    http.onreadystatechange = () => {
      if (http.status === 200 && http.readyState == XMLHttpRequest.DONE) return resolve(JSON.parse(http.responseText))
    }
    http.onerror = () => resolve()
    http.ontimeout = () => resolve()
    http.send(null)
  })
}

/**
 * @param {string} href
 */
function pingOnce(href) {
  return new Promise(async resolve => {
    let started
    let http = new XMLHttpRequest()
    http.timeout = 5000
    http.ontimeout = () => resolve(5000)
    http.onerror = () => resolve()
    http.onreadystatechange = () => {
      if (http.readyState == 2) {
        if (http.status == 200) {
          let ended = new Date().getTime()
          http.abort()
          resolve(ended - started)
        } else {
          resolve(5000 + http.status)
        }
      }
    }
    http.open("GET", `${href}?_=${new Date().getTime()}`, true)
    started = new Date().getTime()
    http.send(null)
  })
}

/**
 * @param {string} href
 */
function ping(href) {
  return new Promise(async resolve => {
    let average = 0
    let time
    for (let i = 0; i < 3; i++) {
      time = await pingOnce(href)
      if (i == 0) continue
      if (time >= 5000) {
        resolve(time)
        return
      }
      average += time
    }
    average = parseInt(average / 3)
    resolve(average)
  })
}

function addressToLatLng(address) {
  const http = new XMLHttpRequest()
  http.open(
    "GET",
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
    false
  )
  http.send()
  if (http.status == 200) {
    const json = JSON.parse(http.responseText)[0]
    if (json) {
      return {
        coordinate: `${json.lat},${json.lon}`,
        boundingbox: `${json.boundingbox[2]},${json.boundingbox[1]},${json.boundingbox[3]},${json.boundingbox[0]}`,
      }
    }
    return {}
  }
}

function getQuery(url) {
  let query = ""
  if (url.searchParams.has("q")) query = url.searchParams.get("q")
  else if (url.searchParams.has("query")) query = url.searchParams.has("query")
  return query
}
function prefsEncoded(prefs) {
  return new URLSearchParams(prefs).toString()
}

function convertMapCentre(url) {
  let [lat, lon, zoom] = [null, null, null]
  const reg = url.pathname.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/)
  if (reg) {
    ;[, lon, lat, zoom] = reg
  } else if (url.searchParams.has("center")) {
    // Set map centre if present
    ;[lat, lon] = url.searchParams.get("center").split(",")
    zoom = url.searchParams.get("zoom") ?? "17"
  }
  return { zoom, lon, lat }
}

export function randomInstances(clearnet, n) {
  let instances = []
  if (n > clearnet.length) n = clearnet.length
  for (let i = 0; i < n; i++) {
    const randomNumber = Math.floor(Math.random() * clearnet.length)
    const randomInstance = clearnet[randomNumber]
    instances.push(randomInstance)
  }
  return instances
}

async function autoPickInstance(clearnet, url) {
  if (url) {
    const i = clearnet.findIndex(instance => url.href.startsWith(instance))
    if (i >= 0) clearnet.splice(i, 1)
  }
  const random = randomInstances(clearnet, 5)
  const pings = await Promise.all([
    ...random.map(async instance => {
      return [instance, await ping(instance)]
    }),
  ])
  pings.sort((a, b) => a[1] - b[1])
  return pings[0][0]
}

export function style(options, window) {
  const vars = cssVariables(options, window)
  return `--text: ${vars.text};
  --bg-main: ${vars.bgMain};
  --bg-secondary: ${vars.bgSecondary};
  --active: ${vars.active};
  --danger: ${vars.danger};
  --light-grey: ${vars.lightGrey};`
}

function cssVariables(options, window) {
  const dark = {
    text: "#fff",
    bgMain: "#121212",
    bgSecondary: "#202020",
    active: "#fbc117",
    danger: "#f04141",
    lightGrey: "#c3c3c3",
  }

  const light = {
    text: "black",
    bgMain: "white",
    bgSecondary: "#e4e4e4",
    active: "#fb9817",
    danger: "#f04141",
    lightGrey: "#c3c3c3",
  }
  if (options.theme == "dark") {
    return dark
  } else if (options.theme == "light") {
    return light
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return dark
  } else {
    return light
  }
}

export default {
  getRandomInstance,
  getNextInstance,
  protocolHost,
  getList,
  getBlacklist,
  getConfig,
  getOptions,
  getPingCache,
  ping,
  addressToLatLng,
  getQuery,
  prefsEncoded,
  convertMapCentre,
  randomInstances,
  style,
  autoPickInstance,
}

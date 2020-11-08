"use strict";

const nitterInstances = [
  "https://nitter.net",
  "https://nitter.snopyta.org",
  "https://nitter.42l.fr",
  "https://nitter.nixnet.services",
  "https://nitter.13ad.de",
  "https://nitter.pussthecat.org",
  "https://nitter.mastodont.cat",
  "https://nitter.dark.fail",
  "https://nitter.tedomum.net",
  "https://nitter.cattube.org",
  "https://nitter.fdn.fr",
  "https://nitter.1d4.us",
  "https://nitter.kavin.rocks",
  "https://tweet.lambda.dance",
  "https://nitter.cc",
  "https://nitter.weaponizedhumiliation.com",
  "https://nitter.vxempire.xyz",
  "http://3nzoldnxplag42gqjs23xvghtzf6t6yzssrtytnntc6ppc7xxuoneoad.onion",
  "http://nitter.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd.onion",
  "http://nitterlgj3n5fgwesu3vxc5h67ruku33nqaoeoocae2mvlzhsu6k7fqd.onion",
  "http://npf37k3mtzwxreiw52ccs5ay4e6qt2fkcs2ndieurdyn2cuzzsfyfvid.onion",
];
const invidiousInstances = [
  "https://invidious.snopyta.org",
  "https://invidious.xyz",
  "https://invidious.kavin.rocks",
  "https://tube.connect.cafe",
  "https://invidious.zapashcanon.fr",
  "https://invidiou.site",
  "https://vid.mint.lgbt",
  "https://invidious.site",
  "http://fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad.onion",
  "http://qklhadlycap4cnod.onion",
  "http://c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid.onion",
  "http://w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd.onion",
];
const bibliogramInstances = [
  "https://bibliogram.art",
  "https://bibliogram.snopyta.org",
  "https://bibliogram.pussthecat.org",
  "https://bibliogram.nixnet.services",
  "https://bg.endl.site",
  "https://bibliogram.13ad.de",
  "https://bibliogram.pixelfed.uno",
  "https://bibliogram.ethibox.fr",
  "https://bibliogram.hamster.dance",
  "https://bibliogram.kavin.rocks",
  "https://bibliogram.ggc-project.de",
];
const osmInstances = ["https://openstreetmap.org"];
const oldRedditViews = ["https://old.reddit.com", "https://i.reddit.com"];
const autocompletes = [
  { id: "nitter-instance", instances: nitterInstances },
  { id: "invidious-instance", instances: invidiousInstances },
  { id: "bibliogram-instance", instances: bibliogramInstances },
  { id: "osm-instance", instances: osmInstances },
  { id: "old-reddit-view", instances: oldRedditViews },
];

let nitterInstance = document.getElementById("nitter-instance");
let invidiousInstance = document.getElementById("invidious-instance");
let bibliogramInstance = document.getElementById("bibliogram-instance");
let osmInstance = document.getElementById("osm-instance");
let oldRedditView = document.getElementById("old-reddit-view");
let disableNitter = document.getElementById("disable-nitter");
let disableInvidious = document.getElementById("disable-invidious");
let disableBibliogram = document.getElementById("disable-bibliogram");
let disableOsm = document.getElementById("disable-osm");
let disableOldReddit = document.getElementById("disable-old-reddit");
let alwaysProxy = document.getElementById("always-proxy");
let onlyEmbeddedVideo = document.getElementById("only-embed");
let videoQuality = document.getElementById("video-quality");
let removeTwitterSW = document.getElementById("remove-twitter-sw");
let invidiousDarkMode = document.getElementById("invidious-dark-mode");
let persistInvidiousPrefs = document.getElementById("persist-invidious-prefs");
let invidiousVolume = document.getElementById("invidious-volume");
let invidiousPlayerStyle = document.getElementById("invidious-player-style");
let invidiousSubtitles = document.getElementById("invidious-subtitles");
let invidiousAutoplay = document.getElementById("invidious-autoplay");
let theme = document.getElementById("theme");
let useFreeTube = document.getElementById("use-freetube");
let nitterRandomPool = document.getElementById("nitter-random-pool");
let invidiousRandomPool = document.getElementById("invidious-random-pool");
let bibliogramRandomPool = document.getElementById("bibliogram-random-pool");
let exceptions;

window.browser = window.browser || window.chrome;

function prependExceptionsItem(item, index) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item.toString()));
  const button = document.createElement("button");
  li.appendChild(button);
  document.getElementById("exceptions-items").prepend(li);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 512 512'>
      <line x1='368' y1='368' x2='144' y2='144'
        style='fill:none;stroke:#FFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px' />
      <line x1='368' y1='144' x2='144' y2='368'
        style='fill:none;stroke:#FFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px' />
    </svg>`;
  button.innerHTML = svg;
  button.addEventListener("click", () => {
    exceptions.splice(index, 1);
    browser.storage.sync.set({
      exceptions: exceptions,
    });
    li.remove();
  });
}

function filterInstances(instances) {
  return instances.filter((instance) => !instance.includes(".onion")).join();
}

browser.storage.sync.get(
  [
    "nitterInstance",
    "invidiousInstance",
    "bibliogramInstance",
    "osmInstance",
    "oldRedditView",
    "disableNitter",
    "disableInvidious",
    "disableBibliogram",
    "disableOsm",
    "disableOldReddit",
    "alwaysProxy",
    "onlyEmbeddedVideo",
    "videoQuality",
    "removeTwitterSW",
    "invidiousDarkMode",
    "persistInvidiousPrefs",
    "invidiousVolume",
    "invidiousPlayerStyle",
    "invidiousSubtitles",
    "invidiousAutoplay",
    "exceptions",
    "theme",
    "useFreeTube",
    "nitterRandomPool",
    "invidiousRandomPool",
    "bibliogramRandomPool",
  ],
  (result) => {
    theme.value = result.theme || "";
    if (result.theme) document.body.classList.add(result.theme);
    nitterInstance.value = result.nitterInstance || "";
    invidiousInstance.value = result.invidiousInstance || "";
    bibliogramInstance.value = result.bibliogramInstance || "";
    osmInstance.value = result.osmInstance || "";
    oldRedditView.value = result.oldRedditView || "";
    disableNitter.checked = !result.disableNitter;
    disableInvidious.checked = !result.disableInvidious;
    disableBibliogram.checked = !result.disableBibliogram;
    disableOsm.checked = !result.disableOsm;
    disableOldReddit.checked = !result.disableOldReddit;
    alwaysProxy.checked = result.alwaysProxy;
    onlyEmbeddedVideo.checked = result.onlyEmbeddedVideo;
    videoQuality.value = result.videoQuality || "";
    removeTwitterSW.checked = !result.removeTwitterSW;
    invidiousDarkMode.checked = result.invidiousDarkMode;
    persistInvidiousPrefs.checked = result.persistInvidiousPrefs;
    exceptions = result.exceptions || [];
    exceptions.forEach(prependExceptionsItem);
    invidiousVolume.value = result.invidiousVolume;
    document.querySelector("#volume-value").textContent = result.invidiousVolume
      ? `${result.invidiousVolume}%`
      : " - ";
    invidiousPlayerStyle.value = result.invidiousPlayerStyle || "";
    invidiousSubtitles.value = result.invidiousSubtitles || "";
    invidiousAutoplay.checked = result.invidiousAutoplay;
    useFreeTube.checked = result.useFreeTube;
    nitterRandomPool.value =
      result.nitterRandomPool || filterInstances(nitterInstances);
    invidiousRandomPool.value =
      result.invidiousRandomPool || filterInstances(invidiousInstances);
    bibliogramRandomPool.value =
      result.bibliogramRandomPool || filterInstances(bibliogramInstances);
  }
);

function openTab(tab, event) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tab).style.display = "block";
  event.currentTarget.className += " active";
}

document
  .getElementById("general-tab")
  .addEventListener("click", openTab.bind(null, "general"));
document
  .getElementById("advanced-tab")
  .addEventListener("click", openTab.bind(null, "advanced"));
document
  .getElementById("exceptions-tab")
  .addEventListener("click", openTab.bind(null, "exceptions"));

document.getElementById("general-tab").click();

function addToExceptions() {
  const input = document.getElementById("new-exceptions-item");
  const type = document.querySelector('input[name="type"]:checked').value;
  if (input.value) {
    try {
      let value = input.value;
      new RegExp(input.value);
      if (type === "URL") {
        value = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      exceptions.push(value);
      browser.storage.sync.set({
        exceptions: exceptions,
      });
      prependExceptionsItem(value, exceptions.indexOf(value));
      input.value = "";
    } catch (error) {
      input.setCustomValidity("Invalid RegExp");
    }
  } else {
    input.setCustomValidity("Invalid RegExp");
  }
}

document
  .getElementById("add-to-exceptions")
  .addEventListener("click", addToExceptions);

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    let context = this,
      args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function parseURL(urlString) {
  if (urlString) {
    try {
      const url = new URL(urlString);
      if (url.username && url.password) {
        return `${url.protocol}//${url.username}:${url.password}@${url.host}`;
      } else {
        return url.origin;
      }
    } catch (error) {
      console.log(error);
      return "";
    }
  } else {
    return "";
  }
}

let nitterInstanceChange = debounce(() => {
  if (nitterInstance.checkValidity()) {
    browser.storage.sync.set({
      nitterInstance: parseURL(nitterInstance.value),
    });
  }
}, 500);
nitterInstance.addEventListener("input", nitterInstanceChange);

let invidiousInstanceChange = debounce(() => {
  if (invidiousInstance.checkValidity()) {
    browser.storage.sync.set({
      invidiousInstance: parseURL(invidiousInstance.value),
    });
  }
}, 500);
invidiousInstance.addEventListener("input", invidiousInstanceChange);

let bibliogramInstanceChange = debounce(() => {
  if (bibliogramInstance.checkValidity()) {
    browser.storage.sync.set({
      bibliogramInstance: parseURL(bibliogramInstance.value),
    });
  }
}, 500);
bibliogramInstance.addEventListener("input", bibliogramInstanceChange);

let osmInstanceChange = debounce(() => {
  if (osmInstance.checkValidity()) {
    browser.storage.sync.set({
      osmInstance: parseURL(osmInstance.value),
    });
  }
}, 500);
osmInstance.addEventListener("input", osmInstanceChange);

let oldRedditViewChange = debounce(() => {
  if (oldRedditView.checkValidity()) {
    browser.storage.sync.set({
      oldRedditView: parseURL(oldRedditView.value),
    });
  }
}, 500);
oldRedditView.addEventListener("input", oldRedditViewChange);

disableNitter.addEventListener("change", (event) => {
  browser.storage.sync.set({ disableNitter: !event.target.checked });
});

disableInvidious.addEventListener("change", (event) => {
  browser.storage.sync.set({ disableInvidious: !event.target.checked });
});

disableBibliogram.addEventListener("change", (event) => {
  browser.storage.sync.set({ disableBibliogram: !event.target.checked });
});

disableOsm.addEventListener("change", (event) => {
  browser.storage.sync.set({ disableOsm: !event.target.checked });
});

disableOldReddit.addEventListener("change", (event) => {
  browser.storage.sync.set({ disableOldReddit: !event.target.checked });
});

alwaysProxy.addEventListener("change", (event) => {
  browser.storage.sync.set({ alwaysProxy: event.target.checked });
});

onlyEmbeddedVideo.addEventListener("change", (event) => {
  browser.storage.sync.set({ onlyEmbeddedVideo: event.target.checked });
});

videoQuality.addEventListener("change", (event) => {
  browser.storage.sync.set({
    videoQuality: event.target.options[videoQuality.selectedIndex].value,
  });
});

removeTwitterSW.addEventListener("change", (event) => {
  browser.storage.sync.set({ removeTwitterSW: !event.target.checked });
});

invidiousDarkMode.addEventListener("change", (event) => {
  browser.storage.sync.set({ invidiousDarkMode: event.target.checked });
});

persistInvidiousPrefs.addEventListener("change", (event) => {
  browser.storage.sync.set({ persistInvidiousPrefs: event.target.checked });
});

useFreeTube.addEventListener("change", (event) => {
  browser.storage.sync.set({ useFreeTube: event.target.checked });
});

let invidiousVolumeChange = debounce(() => {
  document.querySelector(
    "#volume-value"
  ).textContent = `${invidiousVolume.value}%`;
  browser.storage.sync.set({
    invidiousVolume: invidiousVolume.value,
  });
}, 500);
invidiousVolume.addEventListener("input", invidiousVolumeChange);

invidiousPlayerStyle.addEventListener("change", (event) => {
  browser.storage.sync.set({
    invidiousPlayerStyle:
      event.target.options[invidiousPlayerStyle.selectedIndex].value,
  });
});

let invidiousSubtitlesChange = debounce(() => {
  browser.storage.sync.set({ invidiousSubtitles: invidiousSubtitles.value });
}, 500);
invidiousSubtitles.addEventListener("input", invidiousSubtitlesChange);

invidiousAutoplay.addEventListener("change", (event) => {
  browser.storage.sync.set({ invidiousAutoplay: event.target.checked });
});

let nitterRandomPoolChange = debounce(() => {
  browser.storage.sync.set({ nitterRandomPool: nitterRandomPool.value });
}, 500);
nitterRandomPool.addEventListener("input", nitterRandomPoolChange);

let invidiousRandomPoolChange = debounce(() => {
  browser.storage.sync.set({ invidiousRandomPool: invidiousRandomPool.value });
}, 500);
invidiousRandomPool.addEventListener("input", invidiousRandomPoolChange);

let bibliogramRandomPoolChange = debounce(() => {
  browser.storage.sync.set({
    bibliogramRandomPool: bibliogramRandomPool.value,
  });
}, 500);
bibliogramRandomPool.addEventListener("input", bibliogramRandomPoolChange);

theme.addEventListener("change", (event) => {
  const value = event.target.options[theme.selectedIndex].value;
  switch (value) {
    case "dark-theme":
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
      break;
    case "light-theme":
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
      break;
    default:
      document.body.classList.remove("light-theme");
      document.body.classList.remove("dark-theme");
  }
  browser.storage.sync.set({
    theme: value,
  });
});

function autocomplete(input, list) {
  let currentFocus;
  input.addEventListener("focus", (e) => {
    showOptions(e, true);
  });
  input.addEventListener("input", (e) => {
    const val = e.target.value;
    if (!val) {
      return false;
    }
    currentFocus = -1;
    showOptions(e);
  });
  input.addEventListener("keydown", function (e) {
    let x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function showOptions(event, showAll = false) {
    let div,
      i,
      val = event.target.value;
    closeAllLists();
    div = document.createElement("div");
    div.setAttribute("id", event.target.id + "autocomplete-list");
    div.setAttribute("class", "autocomplete-items");
    event.target.parentNode.appendChild(div);
    for (i = 0; i < list.length; i++) {
      if (list[i].toLowerCase().indexOf(val.toLowerCase()) > -1) {
        div.appendChild(getItem(list[i], val));
      } else if (showAll) {
        div.appendChild(getItem(list[i], val));
      }
    }
  }
  function getItem(item, val) {
    let div = document.createElement("div");
    div.innerHTML = "<strong>" + item.substr(0, val.length) + "</strong>";
    div.innerHTML += item.substr(val.length);
    div.innerHTML += "<input type='hidden' value='" + item + "'>";
    div.addEventListener("click", function (e) {
      input.value = e.target.getElementsByTagName("input")[0].value;
      input.dispatchEvent(new Event("input"));
      closeAllLists();
    });
    return div;
  }
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != input) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", (e) => {
    if (!autocompletes.find((element) => element.id === e.target.id)) {
      closeAllLists(e.target);
    }
  });
}

autocompletes.forEach((value) => {
  autocomplete(document.getElementById(value.id), value.instances);
});

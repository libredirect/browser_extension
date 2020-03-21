'use strict';

let nitterInstance = document.querySelector('#nitter-instance');
let invidiousInstance = document.querySelector('#invidious-instance');
let bibliogramInstance = document.querySelector('#bibliogram-instance');
let osmInstance = document.querySelector('#osm-instance');
let disableNitter = document.querySelector('#disable-nitter');
let disableInvidious = document.querySelector('#disable-invidious');
let disableBibliogram = document.querySelector('#disable-bibliogram');
let disableOsm = document.querySelector('#disable-osm');
let alwaysProxy = document.querySelector('#always-proxy');
let onlyEmbeddedVideo = document.querySelector('#only-embed');
let videoQuality = document.querySelector('#video-quality');

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
    nitterInstance.value = result.nitterInstance || '';
    invidiousInstance.value = result.invidiousInstance || '';
    bibliogramInstance.value = result.bibliogramInstance || '';
    osmInstance.value = result.osmInstance || '';
    disableNitter.checked = !result.disableNitter;
    disableInvidious.checked = !result.disableInvidious;
    disableBibliogram.checked = !result.disableBibliogram;
    disableOsm.checked = !result.disableOsm;
    alwaysProxy.checked = result.alwaysProxy;
    onlyEmbeddedVideo.checked = result.onlyEmbeddedVideo;
    videoQuality.value = result.videoQuality || '';
  }
);

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    let context = this, args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

let nitterInstanceChange = debounce(() => {
  if (nitterInstance.checkValidity()) {
    browser.storage.sync.set({
      nitterInstance: nitterInstance.value ? new URL(nitterInstance.value).origin : ''
    });
  }
}, 500);
nitterInstance.addEventListener('input', nitterInstanceChange);

let invidiousInstanceChange = debounce(() => {
  if (invidiousInstance.checkValidity()) {
    browser.storage.sync.set({
      invidiousInstance: invidiousInstance.value ? new URL(invidiousInstance.value).origin : ''
    });
  }
}, 500);
invidiousInstance.addEventListener('input', invidiousInstanceChange);

let bibliogramInstanceChange = debounce(() => {
  if (bibliogramInstance.checkValidity()) {
    browser.storage.sync.set({
      bibliogramInstance: bibliogramInstance.value ? new URL(bibliogramInstance.value).origin : ''
    });
  }
}, 500);
bibliogramInstance.addEventListener('input', bibliogramInstanceChange);

let osmInstanceChange = debounce(() => {
  if (osmInstance.checkValidity()) {
    browser.storage.sync.set({
      osmInstance: osmInstance.value ? new URL(osmInstance.value).origin : ''
    });
  }
}, 500);
osmInstance.addEventListener('input', osmInstanceChange);

disableNitter.addEventListener('change', event => {
  browser.storage.sync.set({ disableNitter: !event.target.checked });
});

disableInvidious.addEventListener('change', event => {
  browser.storage.sync.set({ disableInvidious: !event.target.checked });
});

disableBibliogram.addEventListener('change', event => {
  browser.storage.sync.set({ disableBibliogram: !event.target.checked });
});

disableOsm.addEventListener('change', event => {
  browser.storage.sync.set({ disableOsm: !event.target.checked });
});

alwaysProxy.addEventListener('change', event => {
  browser.storage.sync.set({ alwaysProxy: event.target.checked });
});

onlyEmbeddedVideo.addEventListener('change', event => {
  browser.storage.sync.set({ onlyEmbeddedVideo: event.target.checked });
});

videoQuality.addEventListener('change', event => {
  browser.storage.sync.set({
    videoQuality: event.target.options[videoQuality.selectedIndex].value
  });
});

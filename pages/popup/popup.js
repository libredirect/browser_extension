'use strict';

let nitterInstance = document.querySelector('#nitterInstance');
let invidiousInstance = document.querySelector('#invidiousInstance');
let bibliogramInstance = document.querySelector('#bibliogramInstance');
let disableNitter = document.querySelector('#disableNitter');
let disableInvidious = document.querySelector('#disableInvidious');
let disableBibliogram = document.querySelector('#disableBibliogram');
let version = document.querySelector('#version');

chrome.storage.sync.get(
  [
    'nitterInstance',
    'invidiousInstance',
    'bibliogramInstance',
    'disableNitter',
    'disableInvidious',
    'disableBibliogram'
  ],
  result => {
    nitterInstance.value = result.nitterInstance || '';
    invidiousInstance.value = result.invidiousInstance || '';
    bibliogramInstance.value = result.bibliogramInstance || '';
    disableNitter.checked = !result.disableNitter;
    disableInvidious.checked = !result.disableInvidious;
    disableBibliogram.checked = !result.disableBibliogram;
  }
);

version.textContent = chrome.runtime.getManifest().version;

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
    chrome.storage.sync.set({
      nitterInstance: nitterInstance.value ? new URL(nitterInstance.value).origin : ''
    });
  }
}, 500);
nitterInstance.addEventListener('input', nitterInstanceChange);

let invidiousInstanceChange = debounce(() => {
  if (invidiousInstance.checkValidity()) {
    chrome.storage.sync.set({
      invidiousInstance: invidiousInstance.value ? new URL(invidiousInstance.value).origin : ''
    });
  }
}, 500);
invidiousInstance.addEventListener('input', invidiousInstanceChange);

let bibliogramInstanceChange = debounce(() => {
  if (bibliogramInstance.checkValidity()) {
    chrome.storage.sync.set({
      bibliogramInstance: bibliogramInstance.value ? new URL(bibliogramInstance.value).origin : ''
    });
  }
}, 500);
bibliogramInstance.addEventListener('input', bibliogramInstanceChange);

disableNitter.addEventListener('change', event => {
  chrome.storage.sync.set({ disableNitter: !event.target.checked });
});

disableInvidious.addEventListener('change', event => {
  chrome.storage.sync.set({ disableInvidious: !event.target.checked });
});

disableBibliogram.addEventListener('change', event => {
  chrome.storage.sync.set({ disableBibliogram: !event.target.checked });
});

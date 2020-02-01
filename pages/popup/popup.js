'use strict';

let nitterInstance = document.querySelector('#nitterInstance');
let invidiousInstance = document.querySelector('#invidiousInstance');
let bibliogramInstance = document.querySelector('#bibliogramInstance');
let disableNitter = document.querySelector('#disableNitter');
let disableInvidious = document.querySelector('#disableInvidious');
let disableBibliogram = document.querySelector('#disableBibliogram');

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
  chrome.storage.sync.set({ nitterInstance: nitterInstance.value });
}, 500);

nitterInstance.addEventListener('input', nitterInstanceChange);

let invidiousInstanceChange = debounce(() => {
  chrome.storage.sync.set({ invidiousInstance: invidiousInstance.value });
}, 500);

invidiousInstance.addEventListener('input', invidiousInstanceChange);

let bibliogramInstanceChange = debounce(() => {
  chrome.storage.sync.set({ bibliogramInstance: bibliogramInstance.value });
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

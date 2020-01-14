'use strict';

let disableNitter = document.querySelector('#disableNitter');
let disableInvidious = document.querySelector('#disableInvidious');
let nitterInstance = document.querySelector('#nitterInstance');
let invidiousInstance = document.querySelector('#invidiousInstance');

chrome.storage.sync.get(
  ['disableNitter', 'disableInvidious', 'nitterInstance', 'invidiousInstance'],
  result => {
    disableNitter.checked = !result.disableNitter;
    disableInvidious.checked = !result.disableInvidious;
    nitterInstance.value = result.nitterInstance || '';
    invidiousInstance.value = result.invidiousInstance || '';
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

disableNitter.addEventListener('change', event => {
  chrome.storage.sync.set({ disableNitter: !event.target.checked });
});

disableInvidious.addEventListener('change', event => {
  chrome.storage.sync.set({ disableInvidious: !event.target.checked });
});

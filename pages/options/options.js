'use strict';

let disableNitter = document.querySelector('#disableNitter');
let disableInvidious = document.querySelector('#disableInvidious');
let nitterInstance = document.querySelector('#nitterInstance');
let invidiousInstance = document.querySelector('#invidiousInstance');

chrome.storage.sync.get(
  ['disableNitter', 'disableInvidious', 'nitterInstance', 'invidiousInstance'],
  (result) => {
    disableNitter.checked = !result.disableNitter;
    disableInvidious.checked = !result.disableInvidious;
    nitterInstance.value = result.nitterInstance || '';
    invidiousInstance.value = result.invidiousInstance || '';
  }
);

document.querySelector('#save').addEventListener('click', () => {
  chrome.storage.sync.set({
    disableNitter: !disableNitter.checked,
    disableInvidious: !disableInvidious.checked,
    nitterInstance: nitterInstance.value,
    invidiousInstance: invidiousInstance.value
  });
  window.close();
});
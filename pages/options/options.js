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

document.querySelector('#save').addEventListener('click', () => {
  chrome.storage.sync.set({
    nitterInstance: nitterInstance.value,
    invidiousInstance: invidiousInstance.value,
    bibliogramInstance: bibliogramInstance.value,
    disableNitter: !disableNitter.checked,
    disableInvidious: !disableInvidious.checked,
    disableBibliogram: !disableBibliogram.checked
  });
  window.close();
});
'use strict';

let nitterInstance = document.querySelector('#nitter-instance');
let invidiousInstance = document.querySelector('#invidious-instance');
let bibliogramInstance = document.querySelector('#bibliogram-instance');
let disableNitter = document.querySelector('#disable-nitter');
let disableInvidious = document.querySelector('#disable-invidious');
let disableBibliogram = document.querySelector('#disable-bibliogram');

chrome.storage.sync.get(
  [
    'nitterInstance',
    'invidiousInstance',
    'bibliogramInstance',
    'disableNitter',
    'disableInvidious',
    'disableBibliogram',
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
    nitterInstance: nitterInstance.value && nitterInstance.checkValidity() ? new URL(nitterInstance.value).origin : '',
    invidiousInstance: invidiousInstance.value && invidiousInstance.checkValidity() ? new URL(invidiousInstance.value).origin : '',
    bibliogramInstance: bibliogramInstance.value && bibliogramInstance.checkValidity() ? new URL(bibliogramInstance.value).origin : '',
    disableNitter: !disableNitter.checked,
    disableInvidious: !disableInvidious.checked,
    disableBibliogram: !disableBibliogram.checked
  });
  window.close();
});
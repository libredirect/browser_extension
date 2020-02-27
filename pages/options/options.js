'use strict';

let nitterInstance = document.querySelector('#nitter-instance');
let invidiousInstance = document.querySelector('#invidious-instance');
let bibliogramInstance = document.querySelector('#bibliogram-instance');
let osmInstance = document.querySelector('#osm-instance');
let disableNitter = document.querySelector('#disable-nitter');
let disableInvidious = document.querySelector('#disable-invidious');
let disableBibliogram = document.querySelector('#disable-bibliogram');
let disableOsm = document.querySelector('#disable-osm');

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
    'disableOsm'
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
  }
);

document.querySelector('#save').addEventListener('click', () => {
  browser.storage.sync.set({
    nitterInstance: nitterInstance.value && nitterInstance.checkValidity() ? new URL(nitterInstance.value).origin : '',
    invidiousInstance: invidiousInstance.value && invidiousInstance.checkValidity() ? new URL(invidiousInstance.value).origin : '',
    bibliogramInstance: bibliogramInstance.value && bibliogramInstance.checkValidity() ? new URL(bibliogramInstance.value).origin : '',
    osmInstance: osmInstance.value && osmInstance.checkValidity() ? new URL(osmInstance.value).origin : '',
    disableNitter: !disableNitter.checked,
    disableInvidious: !disableInvidious.checked,
    disableBibliogram: !disableBibliogram.checked,
    disableOsm: !disableOsm.checked
  });
  window.close();
});
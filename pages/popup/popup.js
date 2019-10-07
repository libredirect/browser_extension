'use strict';

let disableNitter = document.querySelector('#disableNitter');
let disableInvidious = document.querySelector('#disableInvidious');

chrome.storage.sync.get(
  ['disableNitter', 'disableInvidious'],
  (result) => {
    disableNitter.checked = !result.disableNitter;
    disableInvidious.checked = !result.disableInvidious;
  }
);

disableNitter.addEventListener('change', (event) => {
  chrome.storage.sync.set({ disableNitter: !event.target.checked });
});

disableInvidious.addEventListener('change', (event) => {
  chrome.storage.sync.set({ disableInvidious: !event.target.checked });
});

document.querySelector('#options').addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('../options/options.html'));
  }
});
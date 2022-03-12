"use strict";
window.browser = window.browser || window.chrome;

import commonHelper from "../../../assets/javascripts/helpers/common.js";
import generalHelper from "../../../assets/javascripts/helpers/general.js";



let updateInstancesElement = document.getElementById("update-instances");
updateInstancesElement.addEventListener("click", () => {
  let oldHtml = updateInstancesElement.innerHTML
  updateInstancesElement.innerHTML = '...';
  if (commonHelper.updateInstances()) {
    updateInstancesElement.innerHTML = 'Done!';
    new Promise(resolve => setTimeout(resolve, 1500)).then( // sleep 1500ms
      () => updateInstancesElement.innerHTML = oldHtml
    )
  }
  else
    updateInstancesElement.innerHTML = 'Failed Miserabely';
});

let exportSettingsElement = document.getElementById("export-settings");

function exportSettings() {
  browser.storage.local.get(
    null,
    result => {
      let resultString = JSON.stringify(result, null, '  ');
      exportSettingsElement.href = 'data:application/json;base64,' + btoa(resultString);
      exportSettingsElement.download = 'libredirect-settings.json';
    }
  );
}
exportSettings();

browser.storage.onChanged.addListener(exportSettings);

let importSettingsElement = document.getElementById("import-settings");
importSettingsElement.addEventListener("change",
  () => {
    let file = importSettingsElement.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => browser.storage.local.set({ ...JSON.parse(reader.result) })
    reader.onerror = error => reject(error);
    location.reload();
  }
);

let resetSettingsElement = document.getElementById("reset-settings");
resetSettingsElement.addEventListener("click",
  () => {
    console.log("reset");
    browser.storage.local.clear();
    location.reload();
  }
);

let alwaysUsePreferredElement = document.getElementById("always-use-preferred")
alwaysUsePreferredElement.addEventListener("change",
  event => generalHelper.setAlwaysUsePreferred(event.target.checked)
);

let autoRedirectElement = document.getElementById("auto-redirect")
autoRedirectElement.addEventListener("change",
  event => generalHelper.setAutoRedirect(event.target.checked)
);

let applyThemeToSitesElement = document.getElementById("apply-theme-to-sites")
applyThemeToSitesElement.addEventListener("change",
  event => generalHelper.setApplyThemeToSites(event.target.checked)
);
let themeElement = document.getElementById("theme");
themeElement.addEventListener("change", event => {
  const value = event.target.options[theme.selectedIndex].value;
  generalHelper.setTheme(value);
})

let nameCustomInstanceInput = document.getElementById("exceptions-custom-instance");
let instanceTypeElement = document.getElementById("exceptions-custom-instance-type");
let instanceType = "url"

let popupFrontends;
for (const frontend of generalHelper.allPopupFrontends)
  document.getElementById(frontend).addEventListener("change",
    event => {
      if (event.target.checked && !popupFrontends.includes(frontend))
        popupFrontends.push(frontend)
      else if (popupFrontends.includes(frontend)) {
        var index = popupFrontends.indexOf(frontend);
        if (index !== -1) popupFrontends.splice(index, 1);
      }
      generalHelper.setPopupFrontends(popupFrontends);
    }
  )

generalHelper.init().then(() => {
  alwaysUsePreferredElement.checked = generalHelper.getAlwaysUsePreferred();
  autoRedirectElement.checked = generalHelper.getAutoRedirect();
  themeElement.value = generalHelper.getTheme();
  applyThemeToSitesElement.checked = generalHelper.getApplyThemeToSites();
  instanceTypeElement.addEventListener("change",
    event => {
      instanceType = event.target.options[instanceTypeElement.selectedIndex].value
      if (instanceType == 'url') {
        nameCustomInstanceInput.setAttribute("type", "url");
        nameCustomInstanceInput.setAttribute("placeholder", "https://www.google.com");
      }
      else if (instanceType == 'regex') {
        nameCustomInstanceInput.setAttribute("type", "text");
        nameCustomInstanceInput.setAttribute("placeholder", "https?:\/\/(www\.|music|)youtube\.com\/watch\?v\=..*");
      }
    }
  )
  let exceptionsCustomInstances = generalHelper.getExceptions();
  function calcExceptionsCustomInstances() {
    document.getElementById("exceptions-custom-checklist").innerHTML =
      [...exceptionsCustomInstances.url, ...exceptionsCustomInstances.regex].map(
        (x) => `<div>${x}<button class="add" id="clear-${x}">
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                      fill="currentColor">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                      </svg>
                    </button>
                </div>
                <hr>`
      ).join('\n');

    for (const x of [...exceptionsCustomInstances.url, ...exceptionsCustomInstances.regex]) {
      document.getElementById(`clear-${x}`).addEventListener("click",
        () => {
          console.log(x);
          let index;
          index = exceptionsCustomInstances.url.indexOf(x);
          if (index > -1)
            exceptionsCustomInstances.url.splice(index, 1);
          else {
            index = exceptionsCustomInstances.regex.indexOf(x);
            if (index > -1)
              exceptionsCustomInstances.regex.splice(index, 1);
          }
          generalHelper.setExceptions(exceptionsCustomInstances);
          calcExceptionsCustomInstances();
        });
    }
  }
  calcExceptionsCustomInstances();
  document.getElementById("custom-exceptions-instance-form").addEventListener("submit", (event) => {
    event.preventDefault();

    let val
    if (instanceType == 'url') {
      if (nameCustomInstanceInput.validity.valid) {
        let url = new URL(nameCustomInstanceInput.value);
        val = `${url.protocol}//${url.host}`
        if (!exceptionsCustomInstances.url.includes(val)) exceptionsCustomInstances.url.push(val)
      }
    } else if (instanceType == 'regex') {
      val = nameCustomInstanceInput.value
      if (val.trim() != '' && !exceptionsCustomInstances.regex.includes(val)) exceptionsCustomInstances.regex.push(val)
    }
    if (val) {
      generalHelper.setExceptions(exceptionsCustomInstances);
      console.log("exceptionsCustomInstances", exceptionsCustomInstances)
      nameCustomInstanceInput.value = '';
    }
    calcExceptionsCustomInstances();
  })

  popupFrontends = generalHelper.getPopupFrontends();
  for (const frontend of generalHelper.allPopupFrontends)
    document.getElementById(frontend).checked = popupFrontends.includes(frontend);
})
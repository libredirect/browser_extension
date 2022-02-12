"use strict";

import commonHelper from "../../../assets/javascripts/helpers/common.js";
import exceptionsHelper from "../../../assets/javascripts/helpers/exceptions.js";

let themeElement = document.getElementById("theme");

window.browser = window.browser || window.chrome;

browser.storage.sync.get(
  ["theme"],
  (result) => {
    themeElement.value = result.theme || "";

  }
);

themeElement.addEventListener("change", (event) => {
  const value = event.target.options[theme.selectedIndex].value;
  browser.storage.sync.set({ theme: value });
});

document.querySelector("#update-instances").addEventListener("click", () => {
  document.querySelector("#update-instances").innerHTML = '...';
  if (commonHelper.updateInstances()) {
    document.querySelector("#update-instances").innerHTML = 'Done!';
    new Promise(resolve => setTimeout(resolve, 1500)).then( // sleep 1500ms
      () => document.querySelector("#update-instances").innerHTML = 'Update Instances'
    )
  }
  else
    document.querySelector("#update-instances").innerHTML = 'Failed Miserabely';
});
let nameCustomInstanceInput = document.getElementById("exceptions-custom-instance");
let instanceTypeElement = document.getElementById("exceptions-custom-instance-type");
let instanceType = "url"

exceptionsHelper.init().then(() => {
  instanceTypeElement.addEventListener("change",
    (event) => {
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
  let exceptionsCustomInstances = exceptionsHelper.getExceptions();
  function calcExceptionsCustomInstances() {
    console.log("exceptionsCustomInstances", exceptionsCustomInstances)
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
          exceptionsHelper.setExceptions(exceptionsCustomInstances);
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
      exceptionsHelper.setExceptions(exceptionsCustomInstances);
      console.log("exceptionsCustomInstances", exceptionsCustomInstances)
      nameCustomInstanceInput.value = '';
    }
    calcExceptionsCustomInstances();
  })
})
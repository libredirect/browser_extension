"use strict";

import data from "../../assets/javascripts/data.js";
import commonHelper from "../../assets/javascripts/helpers/common.js";

import shared from "./shared.js";

const domparser = new DOMParser();

let themeElement = document.getElementById("theme");

window.browser = window.browser || window.chrome;

function prependExceptionsItem(item, index) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item.toString()));
  const button = document.createElement("button");
  li.appendChild(button);
  document.getElementById("exceptions-items").prepend(li);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 512 512'>
      <line x1='368' y1='368' x2='144' y2='144'
        style='fill:none;stroke:#FFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px' />
      <line x1='368' y1='144' x2='144' y2='368'
        style='fill:none;stroke:#FFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px' />
    </svg>`;
  button.appendChild(domparser.parseFromString(svg, "image/svg+xml").documentElement);
  button.addEventListener("click", () => {
    exceptions.splice(index, 1);
    browser.storage.sync.set({ exceptions: exceptions });
    li.remove();
  });
}

browser.storage.sync.get(
  [
    "exceptions",
    "theme",
  ],
  (result) => {
    data.theme = result.theme || "";
    themeElement.value = result.theme || "";
    if (result.theme) document.body.classList.add(result.theme);
    data.exceptions = result.exceptions || [];
    data.exceptions.forEach(prependExceptionsItem);
    shared.autocompletes.forEach((value) => {
    });
  }
);

function addToExceptions() {
  const input = document.getElementById("new-exceptions-item");
  const type = document.querySelector('input[name="type"]:checked').value;
  if (input.value) {
    try {
      let value = input.value;
      new RegExp(input.value);
      if (type === "URL") {
        value = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      exceptions.push(value);
      browser.storage.sync.set({
        exceptions: exceptions,
      });
      prependExceptionsItem(value, exceptions.indexOf(value));
      input.value = "";
    } catch (error) {
      input.setCustomValidity("Invalid RegExp");
    }
  } else {
    input.setCustomValidity("Invalid RegExp");
  }
}
document.getElementById("add-to-exceptions").addEventListener("click", addToExceptions);

themeElement.addEventListener("change", (event) => {
  const value = event.target.options[theme.selectedIndex].value;
  switch (value) {
    case "dark-theme":
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
      break;
    case "light-theme":
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
      break;
    default:
      document.body.classList.remove("light-theme");
      document.body.classList.remove("dark-theme");
  }
  browser.storage.sync.set({ theme: value });
});

document.querySelector("#update-instances").addEventListener("click", () => {
  document.querySelector("#update-instances").innerHTML = '...';
  if (commonHelper.updateInstances())
    document.querySelector("#update-instances").innerHTML = 'Done!';
  else
    document.querySelector("#update-instances").innerHTML = 'Failed Miserabely';
});

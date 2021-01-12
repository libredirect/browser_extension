window.browser = window.browser || window.chrome;

function getMessage(tag) {
  return tag.replace(/__MSG_(\w+)__/g, function (_match, v1) {
    return v1 ? browser.i18n.getMessage(v1) : null;
  });
}

function localisePage() {
  let elements = document.querySelectorAll("[data-localise]");

  for (let i in elements)
    if (elements.hasOwnProperty(i)) {
      let obj = elements[i];
      let tag = obj.getAttribute("data-localise").toString();

      let msg = getMessage(tag);

      if (msg && msg !== tag) obj.textContent = msg;
    }

  let placeholders = document.querySelectorAll("[data-localise-placeholder]");

  for (let i in placeholders)
    if (placeholders.hasOwnProperty(i)) {
      let obj = placeholders[i];
      let tag = obj.getAttribute("data-localise-placeholder").toString();

      let msg = getMessage(tag);

      if (msg && msg !== tag) obj.placeholder = msg;
    }
}

localisePage();

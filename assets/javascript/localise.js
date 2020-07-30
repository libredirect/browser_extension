window.browser = window.browser || window.chrome;

function localisePage() {
  var data = document.querySelectorAll("[data-localise]");

  for (var i in data)
    if (data.hasOwnProperty(i)) {
      var obj = data[i];
      var tag = obj.getAttribute("data-localise").toString();

      var msg = tag.replace(/__MSG_(\w+)__/g, function (_match, v1) {
        return v1 ? browser.i18n.getMessage(v1) : null;
      });

      if (msg && msg !== tag) obj.textContent = msg;
    }
}

localisePage();

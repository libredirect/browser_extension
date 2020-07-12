window.browser = window.browser || window.chrome;

function localizeHtmlPage() {
  // Localize using __MSG_***__ data tags
  var data = document.querySelectorAll('[data-localize]');

  for (var i in data) if (data.hasOwnProperty(i)) {
    var obj = data[i];
    var tag = obj.getAttribute('data-localize').toString();

    var msg = tag.replace(/__MSG_(\w+)__/g, function (_match, v1) {
      return v1 ? browser.i18n.getMessage(v1) : null;
    });

    if (msg && msg !== tag) obj.innerHTML = msg;
  }
}

localizeHtmlPage();
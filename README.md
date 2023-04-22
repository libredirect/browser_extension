<img src="./img/libredirect_full.svg" height="50"/>

A web extension that redirects YouTube, Twitter, TikTok... requests to alternative privacy friendly frontends and backends.

[![Firefox Add-on](./img/badge-amo.png)](https://addons.mozilla.org/firefox/addon/libredirect/)&nbsp;
<a href="https://libredirect.github.io/download_chromium.html">
<img src ="./img/badge-chromium.png" height=60 >
</a>

## Translate

[![Weblate](./img/weblate.svg)](https://hosted.weblate.org/projects/libredirect/extension)

## Development

### Install Dependencies

[Node.js](https://nodejs.org/) latest LTS is recommended

```
npm update
npm install
```

Generate the HTML pages (you should install [pug-cli](https://www.npmjs.com/package/pug-cli) first globally):

```
npm run pug
```

### Build the extension zip archive:

```
npm run build
```

### Test in Firefox

```
npm run start
```

### Install temporarily

1. Type in the address bar: `about:debugging#/runtime/this-firefox`
3. Press `Load Temporary Add-on...`

### Install in Firefox ESR, Developer Edition, Nightly

1. Type in the address bar: `about:config`
2. Set `xpinstall.signatures.required` to `false`
3. Type in the address bar: `about:addons`
4. Click on the gear shaped `settings` button and select `Install Add-on From File...`
5. Select `libredirect-VERSION.zip` from `web-ext-artifacts` folder

### Install in Chromium browsers

1. Open `chrome://extensions`
2. Enable `dev mode`
3. Select `load unpacked extension`
4. Select `src` folder

---

Forked from [Privacy Redirect](https://github.com/SimonBrazell/privacy-redirect)

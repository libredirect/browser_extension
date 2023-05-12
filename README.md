<img src="./img/libredirect_full.svg" height="50"/>

A web extension that redirects YouTube, Twitter, TikTok... requests to alternative privacy friendly frontends and backends.

[![Firefox Add-on](./img/badge-amo.png)](https://addons.mozilla.org/firefox/addon/libredirect/)&nbsp;
<a href="https://libredirect.github.io/download_chromium.html">
<img src ="./img/badge-chromium.png" height=60 >
</a>

## Translate

[![Weblate](./img/weblate.svg)](https://hosted.weblate.org/projects/libredirect/extension)

## Development
Requirements: [Node.js LTS](https://nodejs.org/)
```bash
git clone https://github.com/libredirect/browser_extension
cd browser_extension
npm install
npm run html # Generates html files using Pug
npm run start # Runs in debug mode in firefox using Web-ext
```
### Run on Chromium manually
1. Open `chrome://extensions`
2. Enable `dev mode`
3. Select `load unpacked extension`
4. Select `src` folder

### Build zip package (Firefox)
```bash
npm run build
```
### Install zip package on Firefox (temporarily)
3. Type in the address bar: `about:debugging#/runtime/this-firefox`
4. Press `Load Temporary Add-on...`
5. Select `libredirect-VERSION.zip` from `web-ext-artifacts` folder

### Install zip package on Firefox ESR, Developer Edition, Nightly
3. Type in the address bar: `about:config`
4. Set `xpinstall.signatures.required` to `false`
5. Type in the address bar: `about:addons`
6. Click on the gear shaped `settings` button and select `Install Add-on From File...`
7. Select `libredirect-VERSION.zip` from `web-ext-artifacts` folder


---

Forked from [Privacy Redirect](https://github.com/SimonBrazell/privacy-redirect)

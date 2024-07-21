<img src="./img/libredirect_full.svg" height="50"/>

A browser extension that redirects YouTube, Twitter, TikTok... requests to alternative privacy friendly frontends and backends.

<a href="https://addons.mozilla.org/firefox/addon/libredirect/">
    <img src ="./img/badge-amo.png" height=60 >
</a>
&nbsp;
<a href="https://libredirect.github.io/download_chromium.html">
    <img src ="./img/badge-chromium.png" height=60 >
</a>

## Translate

<a href="https://hosted.weblate.org/projects/libredirect/extension">
    <img src ="./img/weblate.svg">
</a>

## Development

Install [Node.js](https://nodejs.org/)

```bash
git clone https://github.com/libredirect/browser_extension
cd browser_extension
npm install
npm run html # Generates html using Pug
```

#### Run on Firefox

```bash
npm run start
```

#### Build a zip package for Firefox

```bash
npm run build
```

#### Install the zip package on Firefox (temporarily)

1. Type in the address bar: `about:debugging#/runtime/this-firefox`
2. Press `Load Temporary Add-on...`
3. Select `libredirect-VERSION.zip` from `web-ext-artifacts` folder

#### Install the zip package on Firefox ESR, Developer Edition, Nightly

1. Type in the address bar: `about:config`
2. Set `xpinstall.signatures.required` to `false`
3. Type in the address bar: `about:addons`
4. Click on the gear shaped `settings` button and select `Install Add-on From File...`
5. Select `libredirect-VERSION.zip` from `web-ext-artifacts` folder

#### Run on Chromium

1. Open `chrome://extensions`
2. Enable `dev mode`
3. Select `load unpacked extension`
4. Select `src` folder

---

Test conditions to check new functions and changes after building - [please refer here](./test-conditions.md)

---

Forked from [Privacy Redirect](https://github.com/SimonBrazell/privacy-redirect)

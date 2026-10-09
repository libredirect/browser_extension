<div align="center">

[![LibRedirect](./assets/libredirect-banner.svg)](https://libredirect.manerakai.com)

A browser extension that redirects YouTube, Twitter, TikTok, and other requests
to alternative privacy-friendly frontends.

[![Mozilla Add-on](./assets/badge-firefox.svg)](https://addons.mozilla.org/firefox/addon/libredirect)
[![Chromium](./assets/badge-chromium.svg)](https://libredirect.manerakai.com/download_chromium.html)
[![Weblate](./assets/badge-weblate.svg)](https://hosted.weblate.org/projects/libredirect/extension)
[![Support LibRedirect](./assets/badge-support.svg)](https://libredirect.manerakai.com/donate.html)

</div>

## Development

Install [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io).

> [!NOTE]
>
> Do not test in your work environment. Create a new profile for testing or
> download a separate browser.

```bash
git clone https://github.com/libredirect/browser_extension && cd browser_extension
pnpm install
# Generates HTML using Pug
pnpm run html
```

### Firefox

```bash
# Run Firefox with the extension
pnpm run start

# Build a zip package for Firefox
pnpm run build
```

#### Install the zip package on Firefox (temporarily)

1. Type `about:debugging#/runtime/this-firefox` in the address bar.
2. Click **Load Temporary Add-on...**.
3. Select `libredirect-VERSION.zip` from the `web-ext-artifacts/` folder.

#### Install the zip package on Firefox ESR, Developer Edition, Nightly

1. Type `about:config` in the address bar.
2. Set `xpinstall.signatures.required` to `false`.
3. Type `about:addons` in the address bar.
4. Click the gear-shaped settings button and select **Install Add-on From
   File...**.
5. Select `libredirect-VERSION.zip` from the `web-ext-artifacts/` folder.

### Chromium

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `src/` folder.

### Test

See [TEST.md](./TEST.md).

## Privacy Policy

- Nothing is collected.
- All URL redirections work locally, except for OpenStreetMap reverse geocoding,
  which is done via the
  [OSM Nominatim API](https://nominatim.org/release-docs/develop/api/Overview).
- By default, the list of instances is fetched from GitHub. Alternatively, it
  may be fetched from Codeberg or not at all.

## Notes

Forked from
[Privacy Redirect](https://github.com/SimonBrazell/privacy-redirect).

<img src="./img/libredirect_full.svg" height="50"/>

A web extension that redirects YouTube, Twitter, Instagram... requests to alternative privacy friendly frontends and backends.

[![Matrix Badge](https://img.shields.io/matrix/libredirect:matrix.org?label=matrix%20chat)](https://matrix.to/#/#libredirect:matrix.org)
[![Firefox users Badge](https://img.shields.io/amo/users/libredirect?label=Firefox%20users)](https://addons.mozilla.org/firefox/addon/libredirect/)
[![LibrePay Badge](https://img.shields.io/liberapay/gives/libredirect?label=Liberapay)](https://liberapay.com/LibRedirect)

[![OpenCollective Badge](https://opencollective.com/libredirect/tiers/badge.svg)](https://opencollective.com/libredirect#category-CONTRIBUTE)

[![Firefox Add-on](./img/badge-amo.png)](https://addons.mozilla.org/firefox/addon/libredirect/)&nbsp;
<a href="./chromium.md">
<img src ="./img/badge-chromium.png" height=60 >
</a>

<img src ="./img/1.png" width=350>&nbsp;
<img src ="./img/2.png" width=350>&nbsp;
<img src ="./img/3.png" width=350>&nbsp;
<img src ="./img/4.png" width=350>&nbsp;

- Youtube => [Invidious](https://github.com/iv-org/invidious), [Piped](https://github.com/TeamPiped/Piped), [Piped-Material](https://github.com/mmjee/Piped-Material), [CloudTube](https://sr.ht/~cadence/tube/), [FreeTube](https://github.com/FreeTubeApp/FreeTube), [Yattee](https://github.com/yattee/yattee)
- Youtube Music => [Beatbump](https://github.com/snuffyDev/Beatbump), [Hyperpipe](https://codeberg.org/Hyperpipe/Hyperpipe)
- Twitter => [Nitter](https://github.com/zedeus/nitter)
- Instagram => [Bibliogram](https://sr.ht/~cadence/bibliogram/)
- TikTok => [ProxiTok](https://github.com/pablouser1/ProxiTok)
- Reddit => [Libreddit](https://github.com/spikecodes/libreddit#instances), [Teddit](https://codeberg.org/teddit/teddit#instances)
- Imgur => [Rimgo](https://codeberg.org/video-prize-ranch/rimgo)
- Wikipedia => [Wikiless](https://codeberg.org/orenom/wikiless)
- Medium => [Scribe](https://sr.ht/~edwardloveall/Scribe/)
- Quora => [Quetre](https://github.com/zyachel/quetre)
- IMDb => [libremdb](https://github.com/zyachel/libremdb)
- PeerTube => [SimpleerTube](https://git.sr.ht/~metalune/simpleweb_peertube)
- LBRY/Odysee => [Librarian](https://codeberg.org/librarian/librarian), [LBRY Desktop](https://lbry.com/get)
- Search => [SearXNG](https://github.com/searxng/searxng), [SearX](https://searx.github.io/searx/), [Whoogle](https://benbusby.com/projects/whoogle-search/), [LibreX](https://github.com/hnhx/librex/)
- Translate => [SimplyTranslate](https://git.sr.ht/~metalune/simplytranslate_web), [LingvaTranslate](https://github.com/TheDavidDelta/lingva-translate), [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate)
- Google Maps => [OpenStreetMap](https://www.openstreetmap.org/), [FacilMap](https://github.com/FacilMap/facilmap)
- Send Files => [Send](https://gitlab.com/timvisee/send)

**Note**: The Extension will be using random instances by default. You can modify this and add custom instances too.

# Please read the [FAQ](https://libredirect.github.io/faq.html) if you have any questions!

## Donate

[![Liberapay](./img/liberapay.svg)](https://liberapay.com/LibRedirect)&nbsp;
[![Patreon](./img/patreon.svg)](https://patreon.com/LibRedirect)&nbsp;
[![Buy me a coffee](./img/bmc.svg)](https://www.buymeacoffee.com/libredirect)&nbsp;
<a href="https://opencollective.com/libredirect"><img src = ./img/Open-Collective.png width=19% height=19%></a>

- XMR: `4AM5CVfaGsnEXQQjZSzJvaWufe7pT86ubcZPr83fCjb2Hn3iwcForTWFy2Z3ugXcufUwHaGcucfPMFgPXBFSYGFvNrmV5XR`

Note : We have removed our addresses for BTC and ETH. If you want to donate via Crypto use OpenCollective. We still have XMR as OpenCollective doesn't support it.
## Mirror Repos

[![Codeberg](https://raw.githubusercontent.com/ManeraKai/manerakai/main/icons/codeberg.svg)](https://codeberg.org/LibRedirect/libredirect)&nbsp;&nbsp;
[![GitHub](https://raw.githubusercontent.com/ManeraKai/manerakai/main/icons/github.svg)](https://github.com/libredirect/libredirect/)&nbsp;&nbsp;

## Translate

[![Weblate](./img/weblate.svg)](https://hosted.weblate.org/projects/libredirect/extension)

## Development

### Install Dependencies

[Node.js](https://nodejs.org/) latest LTS is recommended

```
npm update
npm install
```

To generate HTML that uses `config.json` (needed to develop/build the extension), run:

```
npm run ejs
```

Afterwards, you will need to run it if you modify `config.json` or any files ending with .ejs.

### Build the extension zip archive:

```
npm run build
```

### Run automated tests

```
npm run test
```

### Test in Firefox

```
npm run start
```

### Install temporarily

1. open `about:addons`
2. type in the address bar `about:debugging`
3. press `load temporarily addon`

### Install in Firefox ESR, Developer Edition, Nightly

1. open `about:config`
2. set `xpinstall.signatures.required` to `false`
3. open `about:addons`
4. click on the gear shaped `settings` button and select `Install Add-on From File...`
5. select `libredirect-VERSION.zip` from `web-ext-artifacts` folder

### Install in Chromium browsers

1. open `chrome://extensions`
2. enable `dev mode`
3. select `load unpacked extension`
4. select `src` folder

---

[Privacy Policy](Privacy-Policy.md)\
Forked from [Privacy Redirect](https://github.com/SimonBrazell/privacy-redirect)


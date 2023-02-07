<img src="./img/libredirect_full.svg" height="50"/>

A web extension that redirects YouTube, Twitter, TikTok... requests to alternative privacy friendly frontends and backends.

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

- Youtube <span>&#8594;</span> [Invidious](https://github.com/iv-org/invidious), [Piped](https://github.com/TeamPiped/Piped), [Piped-Material](https://github.com/mmjee/Piped-Material), [CloudTube](https://sr.ht/~cadence/tube/), [PokeTube](https://codeberg.org/Ashley/poketube/), [FreeTube](https://github.com/FreeTubeApp/FreeTube), [Yattee](https://github.com/yattee/yattee)
- Youtube Music <span>&#8594;</span> [Beatbump](https://github.com/snuffyDev/Beatbump), [Hyperpipe](https://codeberg.org/Hyperpipe/Hyperpipe)
- Twitter <span>&#8594;</span> [Nitter](https://github.com/zedeus/nitter)
- TikTok <span>&#8594;</span> [ProxiTok](https://github.com/pablouser1/ProxiTok)
- Reddit <span>&#8594;</span> [Libreddit](https://github.com/spikecodes/libreddit), [Teddit](https://codeberg.org/teddit/teddit)
- Imgur <span>&#8594;</span> [Rimgo](https://codeberg.org/video-prize-ranch/rimgo)
- Reuters <span>&#8594;</span> [Neuters](https://github.com/HookedBehemoth/neuters)
- Medium <span>&#8594;</span> [Scribe](https://sr.ht/~edwardloveall/Scribe/), [LibMedium](https://github.com/realaravinth/libmedium)
- Quora <span>&#8594;</span> [Quetre](https://github.com/zyachel/quetre)
- IMDb <span>&#8594;</span> [libremdb](https://github.com/zyachel/libremdb)
- LBRY/Odysee <span>&#8594;</span> [Librarian](https://codeberg.org/librarian/librarian), [LBRY Desktop](https://lbry.com/get)
- Search <span>&#8594;</span> [SearXNG](https://github.com/searxng/searxng), [SearX](https://searx.github.io/searx/), [Whoogle](https://benbusby.com/projects/whoogle-search/), [LibreX](https://github.com/hnhx/librex/)
- Translate <span>&#8594;</span> [SimplyTranslate](https://git.sr.ht/~metalune/simplytranslate_web), [LingvaTranslate](https://github.com/TheDavidDelta/lingva-translate), [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate)
- Google Maps <span>&#8594;</span> [OpenStreetMap](https://www.openstreetmap.org/), [FacilMap](https://github.com/FacilMap/facilmap)
- Send Files <span>&#8594;</span> [Send](https://gitlab.com/timvisee/send)
- Genius <span>&#8594;</span> [Dumb](https://github.com/rramiachraf/dumb)
- StackOverflow <span>&#8594;</span> [AnonymousOverflow](https://github.com/httpjamesm/AnonymousOverflow)
- Goodreads <span>&#8594;</span> [BiblioReads](https://github.com/nesaku/BiblioReads)
- Wikipedia <span>&#8594;</span> [Wikiless](https://wikiless.org)
- Snopes <span>&#8594;</span> [Suds](https://git.vern.cc/cobra/Suds)

**Please read the [FAQ](https://libredirect.github.io/faq.html) if you have any questions!**

We're now on <a rel="me" href="https://fosstodon.org/@libredirect">Mastodon</a> 

<img src="https://joinmastodon.org/logos/logo-purple.svg" alt="Mastodon" height="30">

## Donate

[![Liberapay](./img/liberapay.svg)](https://liberapay.com/LibRedirect)&nbsp;
[![Patreon](./img/patreon.svg)](https://patreon.com/LibRedirect)&nbsp;
[![Buy me a coffee](./img/bmc.svg)](https://www.buymeacoffee.com/libredirect)&nbsp;
<a href="https://opencollective.com/libredirect"><img src = ./img/Open-Collective.png width=19% height=19%></a>

- XMR: `4AM5CVfaGsnEXQQjZSzJvaWufe7pT86ubcZPr83fCjb2Hn3iwcForTWFy2Z3ugXcufUwHaGcucfPMFgPXBFSYGFvNrmV5XR`

Note : We have removed our addresses for BTC and ETH. If you want to donate via Crypto, please use OpenCollective. We still have XMR as OpenCollective doesn't support it.
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

[Privacy Policy](Privacy-Policy.md)\
Forked from [Privacy Redirect](https://github.com/SimonBrazell/privacy-redirect)


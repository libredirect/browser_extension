# ![privacy-redirect](src/assets/images/logo-small.png)

[![Awesome Humane Tech](https://raw.githubusercontent.com/humanetech-community/awesome-humane-tech/main/humane-tech-badge.svg?sanitize=true)](https://github.com/humanetech-community/awesome-humane-tech)

## Get

[![Firefox Add-on](src/assets/images/badge-amo.png)](https://addons.mozilla.org/en-US/firefox/addon/privacy-redirect/)
[![Chrome Extension](src/assets/images/badge-chrome.png)](https://chrome.google.com/webstore/detail/privacy-redirect/pmcmeagblkinmogikoikkdjiligflglb)
[![Edge Extension](src/assets/images/badge-ms.png)](https://microsoftedge.microsoft.com/addons/detail/privacy-redirect/elnabkhcgpajchapppkhiaifkgikgihj)

## Donate

[![Donate](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/SimonBrazell/donate) [![Buy me a coffee](src/assets/images/buy-me-a-coffee.png)](https://www.buymeacoffee.com/SimonBrazell)

- **BTC:** `3JZWooswwmmqQKw5iW6AYFfK5gcWTrvueE`
- **ETH:** `0x90049dc59365dF683451319Aa4632aC61193dFA7`

<img src="https://img.shields.io/liberapay/receives/SimonBrazell.svg?logo=liberapay">

## About

A web extension that redirects _Twitter, YouTube, Instagram, Google Maps, Reddit, Google Search, & Google Translate_ requests to privacy friendly alternatives - [Nitter](https://github.com/zedeus/nitter), [Invidious](https://github.com/iv-org/invidious), [FreeTube](https://github.com/FreeTubeApp/FreeTube), [Bibliogram](https://sr.ht/~cadence/bibliogram/), [OpenStreetMap](https://www.openstreetmap.org/), [SimplyTranslate](https://git.sr.ht/~metalune/simplytranslate_web) & Private Search Engines like [DuckDuckGo](https://duckduckgo.com) and [Startpage](https://startpage.com).

It's possible to toggle all redirects on and off. The extension will default to using random instances if none are selected. If these instances are not working, you can try and set a custom instance from the list below.

### Custom instances

Privacy Redirect allows setting custom instances, instances can be found here:

- [Nitter instances](https://github.com/zedeus/nitter/wiki/Instances)
- [Invidious instances](https://github.com/iv-org/invidious/wiki/Invidious-Instances)
- [Bibliogram instances](https://git.sr.ht/~cadence/bibliogram-docs/tree/master/docs/Instances.md)
- [SimplyTranslate instances](https://git.sr.ht/~metalune/simplytranslate_web#list-of-instances)
- [OpenStreetMap tile servers](https://wiki.openstreetmap.org/wiki/Tile_servers)
- Reddit alternatives:
  - [Libreddit](https://github.com/spikecodes/libreddit#instances)
  - [Teddit](https://codeberg.org/teddit/teddit#instances)
  - [Snew](https://github.com/snew/snew)
  - [Old Reddit](https://old.reddit.com) & [Mobile Reddit](https://i.reddit.com), purported to be more privacy respecting than the new UI.
- Google Search alternatives:
  - [SearX](https://searx.github.io/searx/)
  - [DuckDuckGo](https://duckduckgo.com)
  - [Startpage](https://startpage.com)
  - [Ecosia](https://www.ecosia.org)
  - [Qwant](https://www.qwant.com)
  - [Mojeek](https://www.mojeek.com)
  - [Presearch](https://www.presearch.org)
  - [Whoogle](https://benbusby.com/projects/whoogle-search/)

## Development

### Install Dependencies

- [Node.js](https://nodejs.org/) >=10.0.0 installed
- `npm install`

### Build

- `npm run build`
- `open web-ext-artifacts/`

## Test

- `npm run test`

## License

[GPLv3](LICENSE).

## Permissions

Please note, access to all website navigation events ( all URLs), not just the target domains, is required to allow embedded video redirects to occur. At this time I know of no other way to achieve iframe redirects, happy to hear some suggestions on this though 🙂

## Privacy Policy

See the [Project Wiki](https://github.com/SimonBrazell/privacy-redirect/wiki/Privacy-Policy).

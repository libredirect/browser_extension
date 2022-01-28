<img src="src/assets/images/libredirect.svg" width="150" align="right"/>

  
# LibRedirect
A web extension that redirects Twitter, YouTube, Instagram, Google Maps, Reddit, Medium, Google & Google Translate requests to privacy friendly alternative frontends for those sites.

  <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">
    <img alt="License: GPLv3" src="https://badges.alefvanoon.xyz/badge/License-GPL%20v3-darkred.svg">
  </a>
    <a href="https://github.com/humanetech-community/awesome-humane-tech">
    <img alt="Awesome Humane Tech" src="https://raw.githubusercontent.com/humanetech-community/awesome-humane-tech/main/humane-tech-badge.svg?sanitize=true">
  </a>
    <a href="https://matrix.to/#/#libredirect:tokhmi.xyz">
    <img alt="Matrix" src="https://badges.alefvanoon.xyz/matrix/libredirect:matrix.org?label=Matrix&color=darkgreen">
  </a>
  
## Get
[![Firefox Add-on](src/assets/images/badge-amo.png)](https://addons.mozilla.org/firefox/addon/libredirect/)

## Donate

- **BTC:** `bc1qrhue0frps6p2vkg978u9ayethnwprtmfug827q`


## About

A web extension that redirects Twitter, YouTube, Instagram, Google Maps, Reddit, Medium, Google Search, & Google Translate_ requests to privacy friendly alternatives - [Nitter](https://github.com/zedeus/nitter), [Invidious](https://github.com/iv-org/invidious), [FreeTube](https://github.com/FreeTubeApp/FreeTube), [Bibliogram](https://sr.ht/~cadence/bibliogram/), [OpenStreetMap](https://www.openstreetmap.org/), [Scribe](https://sr.ht/~edwardloveall/scribe/), [SimplyTranslate](https://git.sr.ht/~metalune/simplytranslate_web) & Private Search Engines like [DuckDuckGo](https://duckduckgo.com) and [Startpage](https://startpage.com).

It's possible to toggle all redirects on and off. The extension will default to using random instances if none are selected. If these instances are not working, you can try and set a custom instance from the list below.

### Custom instances

LibRedirect allows setting custom instances, instances can be found here:

- [Nitter instances](https://github.com/zedeus/nitter/wiki/Instances)
- [Invidious instances](https://docs.invidious.io/Invidious-Instances.md)
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
- [Scribe](https://sr.ht/~edwardloveall/scribe/) instances:, an alternative frontend for Medium:
  - [scribe.rip](https://scribe.rip/)
  - [NixNet scribe](scribe.nixnet.services/)

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

## Credits
- [privacy-redirect](https://github.com/SimonBrazell/privacy-redirect)

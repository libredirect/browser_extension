# ![privacy-redirect](assets/images/logo-small.png)

[![Awesome Humane Tech](https://raw.githubusercontent.com/humanetech-community/awesome-humane-tech/main/humane-tech-badge.svg?sanitize=true)](https://github.com/humanetech-community/awesome-humane-tech)

[![Donate](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/SimonBrazell/donate) [![Buy me a coffee](assets/images/buy-me-a-coffee.png)](https://www.buymeacoffee.com/SimonBrazell)

## Get
[![Firefox Add-on](assets/images/badge-amo.png)](https://addons.mozilla.org/en-US/firefox/addon/privacy-redirect/) 
[![Chrome Extension](assets/images/badge-chrome.png)](https://chrome.google.com/webstore/detail/privacy-redirect/pmcmeagblkinmogikoikkdjiligflglb) 
[![Edge Extension](assets/images/badge-ms.png)](https://microsoftedge.microsoft.com/addons/detail/privacy-redirect/elnabkhcgpajchapppkhiaifkgikgihj)

## About
A web extension that redirects *Twitter, YouTube, Instagram, Google Maps & Non-Private Searches* requests to privacy friendly alternatives - [Nitter](https://github.com/zedeus/nitter), [Invidious](https://github.com/iv-org/invidious), [FreeTube](https://github.com/FreeTubeApp/FreeTube), [Bibliogram](https://sr.ht/~cadence/bibliogram/), [OpenStreetMap](https://www.openstreetmap.org/) & Private Search Engines like [DuckDuckGo](https://duckduckgo.com) and [Startpage](https://startpage.com).

It's possible to toggle all redirects on and off. The extension will default to using random instances if none are selected. If these instances are not working, you can try and set a custom instance from the list below. \*Instance for Search Engine redirect cannot be chosen at the moment.

### Custom instances
Privacy Redirect allows setting custom instances, instances can be found here:
- [Nitter instances](https://github.com/zedeus/nitter/wiki/Instances)
- [Invidious instances](https://github.com/iv-org/invidious/wiki/Invidious-Instances)
- [Bibliogram instances](https://git.sr.ht/~cadence/bibliogram-docs/tree/master/docs/Instances.md)
- [OpenStreetMap tile servers](https://wiki.openstreetmap.org/wiki/Tile_servers)
- Private Search Engine list
    - [DuckDuckGo](https://duckduckgo.com)
    - [Startpage](https://startpage.com)
    - [Qwant](https://www.qwant.com)
    - [Mojeek](https://www.mojeek.com)

## Build

1.  `npm install --global web-ext`
2.  `web-ext build --overwrite-dest`
3.  See `web-ext-artifacts/` for outputs.

## License

Code released under the free and open-source [MIT license](LICENSE.txt).

## Permissions

Please note, access to all website navigation events ( all URLs), not just the target domains, is required to allow embedded video redirects to occur. At this time I know of no other way to achieve iframe redirects, happy to hear some suggestions on this though 🙂

## Privacy Policy

See the [Project Wiki](https://github.com/SimonBrazell/privacy-redirect/wiki/Privacy-Policy).

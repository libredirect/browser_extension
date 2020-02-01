# Privacy Redirect

-  [Chrome Extension](https://chrome.google.com/webstore/detail/privacy-redirect/pmcmeagblkinmogikoikkdjiligflglb)
-  [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/privacy-redirect/)

A simple browser extension that redirects Twitter, Youtube & Instagram requests to privacy friendly alternatives - [Nitter](https://github.com/zedeus/nitter), [Invidious](https://github.com/omarroth/invidious) & [Bibliogram](https://github.com/cloudrac3r/bibliogram).

Listens for and redirects requests made to the following: 
  - **Twitter -** `twitter.com`, `www.twitter.com`, `mobile.twitter.com` 
  - **Youtube -** `youtube.com`, `www.youtube.com`, `youtube-nocookie.com`, `www.youtube-nocookie.com`, `m.youtube.com`
  - **Instagram -** `instagram.com`, `www.instagram.com`, `help.instagram.com`, `about.instagram.com`.

Allows for setting custom [Nitter](https://github.com/zedeus/nitter/wiki/Instances), [Invidious](https://github.com/omarroth/invidious/wiki/Invidious-Instances) & [Bibliogram](https://github.com/cloudrac3r/bibliogram/wiki/Instances) instances and toggling redirects on & off.

## Build

1.  `npm install --global web-ext`
2.  `web-ext build`
3.  See `web-ext-artifacts/` for outputs.

## License

Code released under [the MIT license](LICENSE.txt).

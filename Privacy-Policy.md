## Data collected
* LibRedirect does not collect any Personal Information of any kind.
* LibRedirect doesn't embed any kind of analytics in its code.
* All aspects of the extension work locally in your browser, with the exception of 
OpenStreetMap (OSM) reverse geocoding, done via the [OSM Nomantim API](https://nominatim.org/release-docs/develop/api/Overview/), 
used as part of OSM redirects, which can be disabled by toggling the OSM redirects.
* It also connects to [this url](https://raw.githubusercontent.com/libredirect/libredirect/master/src/instances/data.json) to update the Instances List. Though this only gets triggered when the user presses the `Update Instances` button.

## Permissions
* `webRequest`, `webRequestBlocking`: To block http requests or redirect them. e.g redirect to YouTube => Invidious before it can reach YouTube's servers.
 * `storage`: To save LibRedirect's settings permanently.
 * `cookies`: To apply settings on multiple instances. Note that we use localStorage too. Those options are disabled by default though.
 * `contextMenus`: For adding some buttons to the right click:\
![contextMenu](https://user-images.githubusercontent.com/40805353/160441937-dc0c71a9-bed1-4078-81a1-189f8ff21c0e.png)
 * `<all_urls>`: LibRedirect is dynamic and customizable. The targets e.g `https://youtube.com`, `https://twitter.com` are written in [Regex](https://en.wikipedia.org/wiki/Regular_expression) and are much more complicated than to be hard-coded in the manifest. Ex: [search Regex](https://github.com/libredirect/libredirect/blob/master/src/assets/javascripts/helpers/search.js#L6=). Further more, we need to access the instances sites too to inject some localStorage variables. There's also an option to `Always Use Preferred instances` that is to even redirect of any other invidious instance to your selected instances. This has to be dynamic and you may even add a custom instance which can't at all be hard-coded.

## Future Changes
If we decide to change our privacy policy, we will post those changes on this page.

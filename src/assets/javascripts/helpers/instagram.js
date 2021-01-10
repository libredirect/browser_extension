export default class {
  static targets = [
    "instagram.com",
    "www.instagram.com",
    "help.instagram.com",
    "about.instagram.com",
  ];
  static redirects = [
    "https://bibliogram.art",
    "https://bibliogram.snopyta.org",
    "https://bibliogram.pussthecat.org",
    "https://bibliogram.nixnet.services",
    "https://bg.endl.site",
    "https://bibliogram.13ad.de",
    "https://bibliogram.pixelfed.uno",
    "https://bibliogram.ethibox.fr",
    "https://bibliogram.hamster.dance",
    "https://bibliogram.kavin.rocks",
    "https://bibliogram.ggc-project.de",
  ];
  static reservedPaths = [
    "about",
    "explore",
    "support",
    "press",
    "api",
    "privacy",
    "safety",
    "admin",
    "graphql",
    "accounts",
    "help",
    "terms",
    "contact",
    "blog",
    "igtv",
    "u",
    "p",
    "fragment",
    "imageproxy",
    "videoproxy",
    ".well-known",
    "tv",
    "reel",
  ];
  static bypassPaths = /\/(accounts\/|embeds?.js)/;
}

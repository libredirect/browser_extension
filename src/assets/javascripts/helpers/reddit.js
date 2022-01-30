const targets = [
  "www.reddit.com",
  "np.reddit.com",
  "new.reddit.com",
  "amp.reddit.com",
  "i.redd.it",
  "redd.it",
];
const redirects = {
  // modern UI
  "libreddit": [
    "https://libredd.it",
    "https://libreddit.spike.codes",
    "https://libreddit.kavin.rocks",
    "https://libreddit.insanity.wtf",
    "https://libreddit.dothq.co",
    "https://libreddit.silkky.cloud",
    "https://libreddit.himiko.cloud",
    "https://reddit.artemislena.eu",
    "https://reddit.git-bruh.duckdns.org",
  ],
  // old UI
  "teddit": [
    "https://teddit.net",
    "https://teddit.ggc-project.de",
    "https://teddit.kavin.rocks",
    "https://teddit.zaggy.nl",
    "https://teddit.namazso.eu",
    "https://teddit.nautolan.racing",
    "https://teddit.tinfoil-hat.net",
    "https://teddit.domain.glass",
    "https://snoo.ioens.is",
    "https://teddit.httpjames.space",
    "https://teddit.alefvanoon.xyz",
    "https://incogsnoo.com",
    "https://teddit.pussthecat.org",
    "https://reddit.lol",
    "https://teddit.sethforprivacy.com",
    "https://teddit.totaldarkness.net",
    "https://teddit.adminforge.de",
    "https://teddit.bus-hit.me"
  ],
  "desktop": "https://old.reddit.com", // desktop
  "mobile": "https://i.reddit.com", // mobile
};
const bypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/;

export default {
  targets,
  redirects,
  bypassPaths,
};

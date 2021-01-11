const targets = [
  "www.reddit.com",
  "np.reddit.com",
  "new.reddit.com",
  "amp.reddit.com",
];
const redirects = [
  "https://old.reddit.com", // desktop
  "https://i.reddit.com", // mobile
  // teddit: privacy w/ old UI
  "https://teddit.net",
  "https://teddit.ggc-project.de",
  "https://teddit.kavin.rocks",
  "https://snew.notabug.io", // anti-censorship
  // libreddit: privacy w/ modern UI
  "https://libredd.it",
  "https://libreddit.spike.codes",
  "https://libreddit.kavin.rocks",
  "https://libreddit.insanity.wtf",
  "https://libreddit.dothq.co",
];
const bypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/;

export default {
  targets,
  redirects,
  bypassPaths,
};

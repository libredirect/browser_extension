const targets = [
  // /(.*\.medium\.com)?(?(1)|^medium\.com)/,
  /^medium.com/,
  /.*\.medium.com/,
  // Other domains of medium blogs, source(s): https://findingtom.com/best-medium-blogs-to-follow/#1-forge
  /towardsdatascience.com/,
  /uxdesign.cc/,
  /uxplanet.org/,
  /betterprogramming.pub/,
  /aninjusticemag.com/,
  /betterhumans.pub/,
  /psiloveyou.xyz/,
  /entrepreneurshandbook.co/,
  /blog.coinbase.com/
];

const redirects = [
  "https://scribe.rip",
  "https://scribe.nixnet.services"
];

export default {
  targets,
  redirects,
};

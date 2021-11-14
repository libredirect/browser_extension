const targets = /https?:\/\/(((www|maps)\.)?(google\.).*(\/search)|search\.(google\.).*)/;
const redirects = [
  { link: "https://duckduckgo.com", q: "/" },
  { link: "https://startpage.com", q: "/do/search" },
  { link: "https://www.ecosia.org", q: "/search" },
  { link: "https://www.qwant.com", q: "/" },
  { link: "https://www.mojeek.com", q: "/search" },
  { link: "https://search.snopyta.org", q: "/" },
  { link: "https://searx.be", q: "/" },
  { link: "https://search.disroot.org", q: "/" },
  { link: "https://searx.tuxcloud.net", q: "/" },
  { link: "https://searx.ninja", q: "/" },
  { link: "https://engine.presearch.org", q: "/search" },
  { link: "https://searx.silkky.cloud", q: "/" },
  { link: "https://search.trom.tf", q: "/" },
  { link: "https://whooglesearch.net", q: "/search" },
  { link: "https://whoogle.sdf.org", q: "/search" },
];

export default {
  targets,
  redirects,
};

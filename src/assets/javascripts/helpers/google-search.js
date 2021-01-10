export default class {
  static targets = /https?:\/\/(((www|maps)\.)?(google\.).*(\/search)|search\.(google\.).*)/;
  static redirects = [
    { link: "https://duckduckgo.com", q: "/" },
    { link: "https://startpage.com", q: "/search/" },
    { link: "https://www.qwant.com", q: "/" },
    { link: "https://www.mojeek.com", q: "/search" },
  ];
}

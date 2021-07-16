const targets = [
  "m.youtube.com",
  "youtube.com",
  "img.youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "s.ytimg.com",
  "music.youtube.com",
];
/*
    Please remember to also update the manifest.json file
    (content_scripts > matches, 'persist-invidious-prefs.js')
    when updating this list:
  */
const redirects = [
  "https://invidious.snopyta.org",
  "https://invidious.xyz",
  "https://invidious.kavin.rocks",
  "https://tube.connect.cafe",
  "https://invidious.zapashcanon.fr",
  "https://invidiou.site",
  "https://vid.mint.lgbt",
  "https://invidious.site",
  "https://yewtu.be",
  "https://invidious.tube",
  "https://invidious.silkky.cloud",
  "https://invidious.himiko.cloud",
  "https://inv.skyn3t.in",
  "https://tube.incognet.io",
  "https://invidious.tinfoil-hat.net",
  "https://invidious.namazso.eu",
  "https://vid.puffyan.us",
  "https://dev.viewtube.io",
  "https://invidious.048596.xyz",
  "http://fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad.onion",
  "http://qklhadlycap4cnod.onion",
  "http://c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid.onion",
  "http://w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd.onion",
];

export default {
  targets,
  redirects,
};

class FrontEnd {
	constructor({ name, redirect, frontends, protocols, enable }) {
		this.name = name
		this.redirect = redirect
		this.enable = enable
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(async data => {
				const json = JSON.parse(data)
				this.frontends = {}
				for (const frontend of frontends) {
					this.frontends[frontend] = json[frontend]
					for (const protocol of json[frontend]) {
						browser.storage.local.set({
							[`${name}_${protocol}_checks`]: json[frontend][protocol],
						})
					}
				}
			})

		browser.storage.local.get(["cloudflareBlackList", "offlineBlackList"], r => {})
		this.protocols = protocols
	}
	switchInstance(url) {}
}

let Reddit = new FrontEnd({
	name: "youtube",
	redirect: function () {},
	targets: [/^https?:\/{2}(www\.|old\.|np\.|new\.|amp\.|)reddit\.com/, /^https?:\/{2}(i\.|preview\.)redd\.it/],
	frontends: ["libreddit", "teddit"],
	enable: true,
})

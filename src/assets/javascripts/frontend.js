class FrontEnd {
	constructor({ enable, frontends, frontend, redirect }) {
		this.redirects = {}
		this.enable = enable
		this.frontend = frontend
		this.protocol = "normal"
		this.protocolFallback = true
		fetch("/instances/data.json")
			.then(response => response.text())
			.then(async data => {
				data = JSON.parse(data)
				fetch("/instances/blacklist.json")
					.then(response => response.text())
					.then(async blackList => {
						blackList = JSON.parse(blackList)
						for (const frontend in frontends) {
							this.redirects[frontend] = {}

							this.redirects[frontend].cookies = [...frontends[frontend].cookies]

							for (const protocol in data[frontend]) {
								this.redirects[frontend][protocol] = {}

								this.redirects[frontend][protocol].all = [...data[frontend][protocol]]

								this.redirects[frontend][protocol].custom = []

								this.redirects[frontend][protocol].checked = [...data[frontend][protocol]]
								for (const instance of blackList.cloudflare) {
									const a = this.redirects[frontend][protocol].checked.indexOf(instance)
									if (a > -1) this.redirects[frontend][protocol].checked.splice(a, 1)
								}
								for (const instance of blackList.offline) {
									const a = this.redirects[frontend][protocol].checked.indexOf(instance)
									if (a > -1) this.redirects[frontend][protocol].checked.splice(a, 1)
								}
							}
						}
					})
			})
		this.unifyCookies = from =>
			new Promise(async resolve => {
				await init()
				const protocolHost = utils.protocolHost(from)
				const list = [...this.redirects[this.frontend][this.protocol]]
				if (![...list.checked, ...list.custom].includes(protocolHost)) {
					resolve()
					return
				}
				for (const cookie of this.redirects[this.frontend].cookies) {
					await utils.copyCookie(frontend, protocolHost, [...list.checked, list.custom], cookie)
				}
				resolve(true)
			})

		this.switchInstance = (url, disableOverride) => {
			if (!this.enable && !disableOverride) return

			const protocolHost = utils.protocolHost(url)

			const list = [...this.redirects[this.frontend][this.protocol]]
			if (!list.all.includes(protocolHost)) return

			let userList = [...list.checked, ...list.custom]
			if (userList.length === 0 && this.protocolFallback) userList = [...list.normal.all]

			const i = userList.indexOf(protocolHost)
			if (i > -1) userList.splice(i, 1)
			if (userList.length === 0) return

			const randomInstance = utils.getRandomInstance(userList)
			return `${randomInstance}${url.pathname}${url.search}`
		}

		this.redirect = (url, type, initiator, disableOverride) => {
			const result = redirect(url, type, initiator, disableOverride)
			if (result == "BYPASSTAB") return "BYPASSTAB"
			if (result) {
				const list = [...this.redirects[this.frontend][this.protocol]]
				let userList = [...list.checked, ...list.custom]
				const randomInstance = utils.getRandomInstance(userList)
				return `${randomInstance}${result.pathname}${result.search}`
			}
		}

		let init = () => new Promise(async resolve => {})
	}
}

let Reddit = new FrontEnd({
	enable: true,
	frontends: {
		libreddit: { cookies: ["theme", "front_page", "layout", "wide", "post_sort", "comment_sort", "show_nsfw", "autoplay_videos", "use_hls", "hide_hls_notification", "subscriptions", "filters"] },
		teddit: {
			cookies: [
				"collapse_child_comments",
				"domain_instagram",
				"domain_twitter",
				"domain_youtube",
				"flairs",
				"highlight_controversial",
				"nsfw_enabled",
				"post_media_max_height",
				"show_upvoted_percentage",
				"show_upvotes",
				"theme",
				"videos_muted",
			],
		},
	},
	frontend: "libreddit",
	redirect: (url, type, initiator, disableOverride) => {
		if (this.enable && !disableOverride) return

		const targets = [/^https?:\/{2}(www\.|old\.|np\.|new\.|amp\.|)reddit\.com/, /^https?:\/{2}(i\.|preview\.)redd\.it/]
		if (!targets.some(rx => rx.test(url.href))) return

		if (initiator && all().includes(initiator.origin)) return "BYPASSTAB"
		if (!["main_frame", "xmlhttprequest", "other", "image", "media"].includes(type)) return

		const bypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/
		if (url.pathname.match(bypassPaths)) return

		const protocolHost = utils.protocolHost(url)

		if (url.host === "i.redd.it") {
			if (this.frontend == "libreddit") return `${protocolHost}/img${url.pathname}${url.search}`
			if (this.frontend == "teddit") return `${protocolHost}/pics/w:null_${url.pathname.substring(1)}${url.search}`
		} else if (url.host === "redd.it") {
			// https://redd.it/foo => https://libredd.it/comments/foo
			if (this.frontend == "libreddit" && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) return `${protocolHost}/comments${url.pathname}${url.search}`
			// https://redd.it/foo => https://teddit.net/comments/foo
			if (this.frontend == "teddit" && !url.pathname.match(/^\/+[^\/]+\/+[^\/]/)) return `${protocolHost}/comments${url.pathname}${url.search}`
		} else if (url.host === "preview.redd.it") {
			if (this.frontend == "libreddit") return `${protocolHost}/preview/pre${url.pathname}${url.search}`
			if (this.frontend == "teddit") return
		} else {
			return `${url.href}`
		}
	},
})

export default {}

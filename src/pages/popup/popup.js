"use strict"
window.browser = window.browser || window.chrome

import utils from "../../assets/javascripts/utils.js"
import generalHelper from "../../assets/javascripts/general.js"

import youtubeHelper from "../../assets/javascripts/youtube/youtube.js"
import youtubeMusicHelper from "../../assets/javascripts/youtubeMusic.js"
import twitterHelper from "../../assets/javascripts/twitter.js"
import instagramHelper from "../../assets/javascripts/instagram.js"
import Reddit from "../../assets/javascripts/reddit.js"
import searchHelper from "../../assets/javascripts/search.js"
import translateHelper from "../../assets/javascripts/translate/translate.js"
import mapsHelper from "../../assets/javascripts/maps.js"
import wikipediaHelper from "../../assets/javascripts/wikipedia.js"
import mediumHelper from "../../assets/javascripts/medium.js"
import quoraHelper from "../../assets/javascripts/quora.js"
import libremdbHelper from "../../assets/javascripts/imdb.js"
import reutersHelper from "../../assets/javascripts/reuters.js"
import imgurHelper from "../../assets/javascripts/imgur.js"
import tiktokHelper from "../../assets/javascripts/tiktok.js"
import sendTargetsHelper from "../../assets/javascripts/sendTargets.js"
import peertubeHelper from "../../assets/javascripts/peertube.js"
import lbryHelper from "../../assets/javascripts/lbry.js"


utils.unify(true).then(r => {
	if (!r) document.getElementById("unify_div").style.display = "none"
	else {
		const unify = document.getElementById("unify")
		const textElement = document.getElementById("unify").getElementsByTagName("h4")[0]
		unify.addEventListener("click", () => {
			const oldHtml = textElement.innerHTML
			textElement.innerHTML = "..."
			browser.runtime.sendMessage({ function: "unify" }, response => {
				if (response && response.response) textElement.innerHTML = oldHtml
			})
		})
	}
})

utils.switchInstance(true).then(r => {
	if (!r) document.getElementById("change_instance_div").style.display = "none"
	else document.getElementById("change_instance").addEventListener("click", () => utils.switchInstance(false))
})

utils.copyRaw(true).then(r => {
	if (!r) document.getElementById("copy_raw_div").style.display = "none"
	else {
		const copy_raw = document.getElementById("copy_raw")
		copy_raw.addEventListener("click", () => utils.copyRaw(false, copy_raw))
	}
})
document.getElementById("more-options").addEventListener("click", () => browser.runtime.openOptionsPage())

const allSites = document.getElementsByClassName("all_sites")[0]
const currSite = document.getElementsByClassName("current_site")[0]

const disableTwitterCurrentSite = currSite.getElementsByClassName("disable-nitter")[0]
const disableTwitterAllSites = allSites.getElementsByClassName("disable-nitter")[0]

const disableYoutubeCurrentSite = currSite.getElementsByClassName("disable-youtube")[0]
const disableYoutubeAllSites = allSites.getElementsByClassName("disable-youtube")[0]

const disableYoutubeMusicCurrentSite = currSite.getElementsByClassName("disable-youtubeMusic")[0]
const disableYoutubeMusicAllSites = allSites.getElementsByClassName("disable-youtubeMusic")[0]

const disableInstagramCurrentSite = currSite.getElementsByClassName("disable-bibliogram")[0]
const disableInstagramAllSites = allSites.getElementsByClassName("disable-bibliogram")[0]

const disableMapsCurrentSite = currSite.getElementsByClassName("disable-osm")[0]
const disableMapsAllSites = allSites.getElementsByClassName("disable-osm")[0]

const disableRedditCurrentSite = currSite.getElementsByClassName("disable-reddit")[0]
const disableRedditAllSites = allSites.getElementsByClassName("disable-reddit")[0]

const disableSearchCurrentSite = currSite.getElementsByClassName("disable-search")[0]
const disableSearchAllSites = allSites.getElementsByClassName("disable-search")[0]

const disableTranslateCurrentSite = currSite.getElementsByClassName("disable-translate")[0]
const disableTranslateAllSites = allSites.getElementsByClassName("disable-translate")[0]

const disableWikipediaCurrentSite = currSite.getElementsByClassName("disable-wikipedia")[0]
const disableWikipediaAllSites = allSites.getElementsByClassName("disable-wikipedia")[0]

const disableMediumCurrentSite = currSite.getElementsByClassName("disable-medium")[0]
const disableMediumAllSites = allSites.getElementsByClassName("disable-medium")[0]

const disableQuoraCurrentSite = currSite.getElementsByClassName("disable-quora")[0]
const disableQuoraAllSites = allSites.getElementsByClassName("disable-quora")[0]

const disableImdbCurrentSite = currSite.getElementsByClassName("disable-imdb")[0]
const disableImdbAllSites = allSites.getElementsByClassName("disable-imdb")[0]

const disableReutersCurrentSite = currSite.getElementsByClassName("disable-reuters")[0]
const disableReutersAllSites = allSites.getElementsByClassName("disable-reuters")[0]

const disablePeertubeTargetsCurrentSite = currSite.getElementsByClassName("disable-peertube")[0]
const disablePeertubeTargetsAllSites = allSites.getElementsByClassName("disable-peertube")[0]

const disableLbryTargetsCurrentSite = currSite.getElementsByClassName("disable-lbry")[0]
const disableLbryTargetsAllSites = allSites.getElementsByClassName("disable-lbry")[0]

const disableSendTargetsCurrentSite = currSite.getElementsByClassName("disable-sendTargets")[0]
const disableSendTargetsAllSites = allSites.getElementsByClassName("disable-sendTargets")[0]

const disableImgurCurrentSite = currSite.getElementsByClassName("disable-imgur")[0]
const disableImgurAllSites = allSites.getElementsByClassName("disable-imgur")[0]

const disableTiktokCurrentSite = currSite.getElementsByClassName("disable-tiktok")[0]
const disableTiktokAllSites = allSites.getElementsByClassName("disable-tiktok")[0]

const currentSiteIsFrontend = document.getElementById("current_site_divider")

browser.storage.local.get(
	[
		"disableTwitter",
		"disableYoutube",
		"disableYoutubeMusic",
		"disableInstagram",
		"disableMaps",
		"disableSearch",
		"translateDisable",
		"disableWikipedia",
		"disableImgur",
		"disableTiktok",
		"disableMedium",
		"disableQuora",
		"disableImdb",
		"disableReuters",
		"disablePeertubeTargets",
		"disableLbryTargets",
		"disableSendTarget",
		"popupFrontends",
		"reddit"
	],
	r => {
		disableTwitterCurrentSite.checked = !r.disableTwitter
		disableTwitterAllSites.checked = !r.disableTwitter
		disableYoutubeCurrentSite.checked = !r.disableYoutube
		disableYoutubeAllSites.checked = !r.disableYoutube
		disableYoutubeMusicCurrentSite.checked = !r.disableYoutubeMusic
		disableYoutubeMusicAllSites.checked = !r.disableYoutubeMusic
		disableInstagramCurrentSite.checked = !r.disableInstagram
		disableInstagramAllSites.checked = !r.disableInstagram
		disableMapsCurrentSite.checked = !r.disableMaps
		disableMapsAllSites.checked = !r.disableMaps
		disableRedditCurrentSite.checked = r.reddit.enable
		disableRedditAllSites.checked = r.reddit.enable
		disableSearchCurrentSite.checked = !r.disableSearch
		disableSearchAllSites.checked = !r.disableSearch
		disableTranslateCurrentSite.checked = !r.translateDisable
		disableTranslateAllSites.checked = !r.translateDisable
		disableWikipediaCurrentSite.checked = !r.disableWikipedia
		disableWikipediaAllSites.checked = !r.disableWikipedia
		disableImgurCurrentSite.checked = !r.disableImgur
		disableImgurAllSites.checked = !r.disableImgur
		disableTiktokCurrentSite.checked = !r.disableTiktok
		disableTiktokAllSites.checked = !r.disableTiktok
		disableMediumCurrentSite.checked = !r.disableMedium
		disableMediumAllSites.checked = !r.disableMedium
		disableQuoraCurrentSite.checked = !r.disableQuora
		disableQuoraAllSites.checked = !r.disableQuora
		disableImdbCurrentSite.checked = !r.disableImdb
		disableImdbAllSites.checked = !r.disableImdb
		disableReutersCurrentSite.checked = !r.disableReuters
		disableReutersAllSites.checked = !r.disableReuters
		disablePeertubeTargetsCurrentSite.checked = !r.disablePeertubeTargets
		disablePeertubeTargetsAllSites.checked = !r.disablePeertubeTargets
		disableLbryTargetsCurrentSite.checked = !r.disableLbryTargets
		disableLbryTargetsAllSites.checked = !r.disableLbryTargets
		disableSendTargetsCurrentSite.checked = !r.disableSendTarget
		disableSendTargetsAllSites.checked = !r.disableSendTarget

		browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
			for (const frontend of generalHelper.allPopupFrontends) {
				if (!r.popupFrontends.includes(frontend)) allSites.getElementsByClassName(frontend)[0].classList.add("hide")
				else allSites.getElementsByClassName(frontend)[0].classList.remove("hide")
				currSite.getElementsByClassName(frontend)[0].classList.add("hide")
			}

			let url
			try {
				url = new URL(tabs[0].url)
			} catch {
				currentSiteIsFrontend.classList.add("hide")
				return
			}

			if (youtubeMusicHelper.redirect(url, "main_frame", false, true) || (await youtubeMusicHelper.switchInstance(url, true))) {
				currSite.getElementsByClassName("youtubeMusic")[0].classList.remove("hide")
				allSites.getElementsByClassName("youtubeMusic")[0].classList.add("hide")
			} else if (twitterHelper.redirect(url, "main_frame", false, true) || (await twitterHelper.switchInstance(url, "main_frame", false, true))) {
				currSite.getElementsByClassName("twitter")[0].classList.remove("hide")
				allSites.getElementsByClassName("twitter")[0].classList.add("hide")
			} else if (instagramHelper.redirect(url, "main_frame", false, true) || (await instagramHelper.switchInstance(url, "main_frame", false, true))) {
				currSite.getElementsByClassName("instagram")[0].classList.remove("hide")
				allSites.getElementsByClassName("instagram")[0].classList.add("hide")
			} else if (mapsHelper.redirect(url, false)) {
				currSite.getElementsByClassName("maps")[0].classList.remove("hide")
				allSites.getElementsByClassName("maps")[0].classList.add("hide")
			} else if (Reddit.redirect(url, "main_frame", false, true) || Reddit.switch(url, "main_frame", false, true)) {
				currSite.getElementsByClassName("reddit")[0].classList.remove("hide")
				allSites.getElementsByClassName("reddit")[0].classList.add("hide")
			} else if (mediumHelper.redirect(url, "main_frame", false, true) || (await mediumHelper.switchInstance(url, "main_frame", false, true))) {
				currSite.getElementsByClassName("medium")[0].classList.remove("hide")
				allSites.getElementsByClassName("medium")[0].classList.add("hide")
			} else if (quoraHelper.redirect(url, "main_frame", false, true) || (await quoraHelper.switchInstance(url, "main_frame", false, true))) {
				currSite.getElementsByClassName("quora")[0].classList.remove("hide")
				allSites.getElementsByClassName("quora")[0].classList.add("hide")
			} else if (libremdbHelper.redirect(url, "main_frame", false, true) || (await libremdbHelper.switchInstance(url, "main_frame", false, true))) {
				currSite.getElementsByClassName("imdb")[0].classList.remove("hide")
				allSites.getElementsByClassName("imdb")[0].classList.add("hide")
			} else if (reutersHelper.redirect(url, "main_frame", false, true)) {
				currSite.getElementsByClassName("reuters")[0].classList.remove("hide")
				allSites.getElementsByClassName("reuters")[0].classList.add("hide")
			} else if (imgurHelper.redirect(url, "main_frame", false, true) || (await imgurHelper.switchInstance(url, "main_frame", false, true))) {
				currSite.getElementsByClassName("imgur")[0].classList.remove("hide")
				allSites.getElementsByClassName("imgur")[0].classList.add("hide")
			} else if (tiktokHelper.redirect(url, "main_frame", false, true) || (await tiktokHelper.switchInstance(url, "main_frame", false, true))) {
				currSite.getElementsByClassName("tiktok")[0].classList.remove("hide")
				allSites.getElementsByClassName("tiktok")[0].classList.add("hide")
			} else if (sendTargetsHelper.redirect(url, "main_frame", false, true) || (await sendTargetsHelper.switchInstance(url, "main_frame", false, true))) {
				currSite.getElementsByClassName("sendTargets")[0].classList.remove("hide")
				allSites.getElementsByClassName("sendTargets")[0].classList.add("hide")
			} else if (peertubeHelper.redirect(url, "main_frame", false, true) || (await peertubeHelper.switchInstance(url, true))) {
				currSite.getElementsByClassName("peertube")[0].classList.remove("hide")
				allSites.getElementsByClassName("peertube")[0].classList.add("hide")
			} else if (lbryHelper.redirect(url, "main_frame", false, true) || (await lbryHelper.switchInstance(url, "main_frame", false, true))) {
				currSite.getElementsByClassName("lbry")[0].classList.remove("hide")
				allSites.getElementsByClassName("lbry")[0].classList.add("hide")
			} else if (translateHelper.redirect(url, true) || (await translateHelper.switchInstance(url, true))) {
				currSite.getElementsByClassName("translate")[0].classList.remove("hide")
				allSites.getElementsByClassName("translate")[0].classList.add("hide")
			} else if (searchHelper.redirect(url, true) || (await searchHelper.switchInstance(url, true))) {
				currSite.getElementsByClassName("search")[0].classList.remove("hide")
				allSites.getElementsByClassName("search")[0].classList.add("hide")
			} else if (wikipediaHelper.redirect(url, true) || (await wikipediaHelper.switchInstance(url, true))) {
				currSite.getElementsByClassName("wikipedia")[0].classList.remove("hide")
				allSites.getElementsByClassName("wikipedia")[0].classList.add("hide")
			} else if (youtubeHelper.redirect(url, "main_frame", false, true) || (await youtubeHelper.switchInstance(url, "main_frame", false, true))) {
				currSite.getElementsByClassName("youtube")[0].classList.remove("hide")
				allSites.getElementsByClassName("youtube")[0].classList.add("hide")
			} else {
				currentSiteIsFrontend.classList.add("hide")
			}
		})
	}
)

document.addEventListener("change", () => {
	browser.storage.local.get(
		[
			"disableTwitter",
			"disableYoutube",
			"disableYoutubeMusic",
			"disableInstagram",
			"disableMaps",
			"disableReddit",
			"disableSearch",
			"translateDisable",
			"disableWikipedia",
			"disableImgur",
			"disableTiktok",
			"disableMedium",
			"disableQuora",
			"disableImdb",
			"disableReuters",
			"disablePeertubeTargets",
			"disableLbryTargets",
			"disableSendTarget",
		],
		r => {
			if (!r.disableTwitter != disableTwitterCurrentSite.checked)
				browser.storage.local.set({
					disableTwitter: !disableTwitterCurrentSite.checked,
				})
			else if (!r.disableTwitter != disableTwitterAllSites.checked)
				browser.storage.local.set({
					disableTwitter: !disableTwitterAllSites.checked,
				})

			if (!r.disableYoutube != disableYoutubeCurrentSite.checked)
				browser.storage.local.set({
					disableYoutube: !disableYoutubeCurrentSite.checked,
				})
			else if (!r.disableYoutube != disableYoutubeAllSites.checked)
				browser.storage.local.set({
					disableYoutube: !disableYoutubeAllSites.checked,
				})

			if (!r.disableYoutubeMusic != disableYoutubeMusicCurrentSite.checked)
				browser.storage.local.set({
					disableYoutubeMusic: !disableYoutubeMusicCurrentSite.checked,
				})
			else if (!r.disableYoutubeMusic != disableYoutubeMusicAllSites.checked)
				browser.storage.local.set({
					disableYoutubeMusic: !disableYoutubeMusicAllSites.checked,
				})

			if (!r.disableInstagram != disableInstagramCurrentSite.checked)
				browser.storage.local.set({
					disableInstagram: !disableInstagramCurrentSite.checked,
				})
			else if (!r.disableInstagram != disableInstagramAllSites.checked)
				browser.storage.local.set({
					disableInstagram: !disableInstagramAllSites.checked,
				})

			if (!r.disableMaps != disableMapsCurrentSite.checked)
				browser.storage.local.set({
					disableMaps: !disableMapsCurrentSite.checked,
				})
			else if (!r.disableMaps != disableMapsAllSites.checked)
				browser.storage.local.set({
					disableMaps: !disableMapsAllSites.checked,
				})

			if (r.reddit.enable != disableRedditCurrentSite.checked)
				browser.storage.local.set({
					[reddit[enable]]: disableRedditCurrentSite.checked,
				})
			else if (r.reddit.enable != disableRedditAllSites.checked)
				browser.storage.local.set({
					[reddit[enable]]: !disableRedditAllSites.checked,
				})

			if (!r.disableSearch != disableSearchCurrentSite.checked)
				browser.storage.local.set({
					disableSearch: !disableSearchCurrentSite.checked,
				})
			else if (!r.disableSearch != disableSearchAllSites.checked)
				browser.storage.local.set({
					disableSearch: !disableSearchAllSites.checked,
				})

			if (!r.translateDisable != disableTranslateCurrentSite.checked)
				browser.storage.local.set({
					translateDisable: !disableTranslateCurrentSite.checked,
				})
			else if (!r.translateDisable != disableTranslateAllSites.checked)
				browser.storage.local.set({
					translateDisable: !disableTranslateAllSites.checked,
				})

			if (!r.disableWikipedia != disableWikipediaCurrentSite.checked)
				browser.storage.local.set({
					disableWikipedia: !disableWikipediaCurrentSite.checked,
				})
			else if (!r.disableWikipedia != disableWikipediaAllSites.checked)
				browser.storage.local.set({
					disableWikipedia: !disableWikipediaAllSites.checked,
				})

			if (!r.disableImgur != disableImgurCurrentSite.checked)
				browser.storage.local.set({
					disableImgur: !disableImgurCurrentSite.checked,
				})
			else if (!r.disableImgur != disableImgurAllSites.checked)
				browser.storage.local.set({
					disableImgur: !disableImgurAllSites.checked,
				})

			if (!r.disableTiktok != disableTiktokCurrentSite.checked)
				browser.storage.local.set({
					disableTiktok: !disableTiktokCurrentSite.checked,
				})
			else if (!r.disableTiktok != disableTiktokAllSites.checked)
				browser.storage.local.set({
					disableTiktok: !disableTiktokAllSites.checked,
				})

			if (!r.disableMedium != disableMediumCurrentSite.checked)
				browser.storage.local.set({
					disableMedium: !disableMediumCurrentSite.checked,
				})
			else if (!r.disableMedium != disableMediumAllSites.checked)
				browser.storage.local.set({
					disableMedium: !disableMediumAllSites.checked,
				})

			if (!r.disableQuora != disableQuoraCurrentSite.checked)
				browser.storage.local.set({
					disableQuora: !disableQuoraCurrentSite.checked,
				})
			else if (!r.disableQuora != disableQuoraAllSites.checked)
				browser.storage.local.set({
					disableQuora: !disableQuoraAllSites.checked,
				})

			if (!r.disableImdb != disableImdbCurrentSite.checked)
				browser.storage.local.set({
					disableImdb: !disableImdbCurrentSite.checked,
				})
			else if (!r.disableImdb != disableImdbAllSites.checked)
				browser.storage.local.set({
					disableImdb: !disableImdbAllSites.checked,
				})

			if (!r.disableReuters != disableReutersCurrentSite.checked)
				browser.storage.local.set({
					disableReuters: !disableReutersCurrentSite.checked,
				})
			else if (!r.disableReuters != disableReutersAllSites.checked)
				browser.storage.local.set({
					disableReuters: !disableReutersAllSites.checked,
				})

			if (!r.disablePeertubeTargets != disablePeertubeTargetsCurrentSite.checked)
				browser.storage.local.set({
					disablePeertubeTargets: !disablePeertubeTargetsCurrentSite.checked,
				})
			else if (!r.disablePeertubeTargets != disablePeertubeTargetsAllSites.checked)
				browser.storage.local.set({
					disablePeertubeTargets: !disablePeertubeTargetsAllSites.checked,
				})

			if (!r.disableLbryTargets != disableLbryTargetsCurrentSite.checked)
				browser.storage.local.set({
					disableLbryTargets: !disableLbryTargetsCurrentSite.checked,
				})
			else if (!r.disableLbryTargets != disableLbryTargetsAllSites.checked)
				browser.storage.local.set({
					disableLbryTargets: !disableLbryTargetsAllSites.checked,
				})

			if (!r.disableSendTarget != disableSendTargetsCurrentSite.checked)
				browser.storage.local.set({
					disableSendTarget: !disableSendTargetsCurrentSite.checked,
				})
			else if (!r.disableSendTarget != disableSendTargetsAllSites.checked)
				browser.storage.local.set({
					disableSendTarget: !disableSendTargetsAllSites.checked,
				})
		}
	)
})

for (const a of document.getElementsByTagName("a")) {
	a.addEventListener("click", e => {
		if (!a.classList.contains("prevent")) {
			browser.tabs.create({ url: a.getAttribute("href") })
			e.preventDefault()
		}
	})
}

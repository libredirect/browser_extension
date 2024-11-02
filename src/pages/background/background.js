"use strict"

import utils from "../../assets/javascripts/utils.js"
import servicesHelper from "../../assets/javascripts/services.js"

const isChrome = browser.runtime.getBrowserInfo === undefined
window.browser = window.browser || window.chrome

browser.runtime.onInstalled.addListener(async details => {
  if (details.previousVersion != browser.runtime.getManifest().version) {
    // ^Used to prevent this running when debugging with auto-reload
    if (details.reason == "install") {
      if (!(await utils.getOptions())) {
        await servicesHelper.initDefaults()
      }
    } else if (details.reason == "update") {
      await servicesHelper.processUpdate()
    }
  }
})

// true to redirect, false to bypass
let tabIdRedirects = {}

// true == Always redirect, false == Never redirect, null/undefined == follow options for services
browser.webRequest.onBeforeRequest.addListener(
  details => {
    const old_href = details.url
    const url = new URL(details.url)
    if (new RegExp(/^chrome-extension:\/{2}.*\/instances\/.*.json$/).test(url.href) && details.type == "xmlhttprequest")
      return null

    // if url is previously bypassed
    if (tabIdRedirects[details.tabId] == false) return null

    // Bypass embeds from excepted urls
    if (
      details.frameAncestors &&
      details.frameAncestors.length >= 1 &&
      servicesHelper.isException(new URL(details.frameAncestors[0].url))
    )
      return null

    if (servicesHelper.isException(url)) {
      if (details.type == "main_frame") {
        console.log(`Bypassing ${details.tabId} ${url}`)
        tabIdRedirects[details.tabId] = false
      }
      return null
    }

    let originUrl
    let documentUrl
    try {
      if (details.originUrl) originUrl = new URL(details.originUrl)
      else if (details.initiator) originUrl = new URL(details.initiator)
      if (details.documentUrl) documentUrl = new URL(details.documentUrl)
    } catch {
      return null
    }

    let newUrl = servicesHelper.redirect(
      url,
      details.type,
      originUrl,
      documentUrl,
      details.incognito,
      tabIdRedirects[details.tabId]
    )

    if (
      (newUrl && newUrl.startsWith("https://no-instance.libredirect.invalid")) ||
      (!newUrl && url.href.startsWith("https://no-instance.libredirect.invalid"))
    ) {
      if (details.type != "main_frame") return null
      newUrl = newUrl ? new URL(newUrl) : url
      const frontend = newUrl.searchParams.get("frontend")
      const oldUrl = new URL(newUrl.searchParams.get("url"))
      const params = new URLSearchParams({
        message: "no_instance",
        url: oldUrl,
        frontend: frontend,
      })
      browser.tabs.update({
        url: browser.runtime.getURL(`/pages/messages/index.html?${params.toString()}`),
      })
      return { cancel: true }
    }

    if (!newUrl && url.href.match(/^https?:\/{2}(.*\.)?libredirect\.invalid.*/)) {
      if (details.type != "main_frame") return null
      const params = new URLSearchParams({
        message: "disabled",
        url: url.href,
      })
      browser.tabs.update({
        url: browser.runtime.getURL(`/pages/messages/index.html?${params.toString()}`),
      })
      return { cancel: true }
    }

    if (newUrl === "CANCEL") {
      console.log(`Cancelling ${url}`)
      return { cancel: true }
    }
    if (newUrl === "BYPASSTAB") {
      console.log(`Bypassing ${details.tabId} ${url}`)
      tabIdRedirects[details.tabId] = false
      return null
    }
    if (newUrl) {
      console.log("Redirecting", old_href, "=>", newUrl)
      return { redirectUrl: newUrl }
    }
    return null
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
)

browser.tabs.onRemoved.addListener(tabId => {
  if (tabIdRedirects[tabId] != undefined) {
    delete tabIdRedirects[tabId]
    console.log(`Removed tab ${tabId} from tabIdRedirects`)
  }
})

browser.runtime.getPlatformInfo(r => {
  if (r.os != "fuchsia" && r.os != "ios" && r.os != "android") {
    browser.commands.onCommand.addListener(async command => {
      browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
        const url = new URL(tabs[0].url)
        switch (command) {
          case "switchInstance": {
            const newUrl = await servicesHelper.switchInstance(url)
            if (newUrl) browser.tabs.update({ url: newUrl })
            break
          }
          case "copyRaw":
            servicesHelper.copyRaw(url)
            break
          case "redirect":
            browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
              if (tabs[0].url) {
                const url = new URL(tabs[0].url)
                const newUrl = servicesHelper.redirect(url, "main_frame", null, null, false, true)
                if (newUrl) {
                  browser.tabs.update(tabs[0].id, { url: newUrl }, () => {
                    tabIdRedirects[tabs[0].id] = true
                  })
                }
              }
            })
            break
          case "reverse":
            browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
              if (tabs[0].url) {
                const url = new URL(tabs[0].url)
                const newUrl = await servicesHelper.reverse(url)
                if (newUrl) {
                  browser.tabs.update(tabs[0].id, { url: newUrl }, () => {
                    tabIdRedirects[tabs[0].id] = false
                  })
                }
              }
            })
            break
        }
      })
    })

    browser.contextMenus.create({
      id: "settingsTab",
      title: browser.i18n.getMessage("settings"),
      contexts: ["browser_action"],
    })
    browser.contextMenus.create({
      id: "switchInstanceTab",
      title: browser.i18n.getMessage("switchInstance"),
      contexts: ["browser_action"],
    })
    browser.contextMenus.create({ id: "copyReverseTab", title: "Copy Original", contexts: ["browser_action"] })
    browser.contextMenus.create({ id: "redirectTab", title: "Redirect", contexts: ["browser_action"] })
    browser.contextMenus.create({ id: "reverseTab", title: "Redirect To Original", contexts: ["browser_action"] })

    browser.contextMenus.create({ id: "redirectLink", title: "Redirect", contexts: ["link"] })
    browser.contextMenus.create({ id: "redirectLinkInNewTab", title: "Redirect In New Tab", contexts: ["link"] })
    browser.contextMenus.create({ id: "reverseLink", title: "Redirect To Original", contexts: ["link"] })
    browser.contextMenus.create({
      id: "reverseLinkInNewTab",
      title: "Redirect To Original In New Tab",
      contexts: ["link"],
    })
    browser.contextMenus.create({ id: "copyReverseLink", title: "Copy Original", contexts: ["link"] })
    browser.contextMenus.create({ id: "bypassLink", title: "Bypass", contexts: ["link"] })
    browser.contextMenus.create({ id: "bypassLinkInNewTab", title: "Bypass In New Tab", contexts: ["link"] })

    if (!isChrome) {
      browser.contextMenus.create({ id: "redirectBookmark", title: "Redirect", contexts: ["bookmark"] })
      browser.contextMenus.create({
        id: "redirectBookmarkInNewTab",
        title: "Redirect In New Tab",
        contexts: ["bookmark"],
      })
      browser.contextMenus.create({ id: "reverseBookmark", title: "Redirect To Original", contexts: ["bookmark"] })
      browser.contextMenus.create({
        id: "reverseBookmarkInNewTab",
        title: "Redirect To Original In New Tab",
        contexts: ["bookmark"],
      })
      browser.contextMenus.create({ id: "copyReverseBookmark", title: "Copy Original", contexts: ["bookmark"] })
      browser.contextMenus.create({ id: "bypassBookmark", title: "Bypass", contexts: ["bookmark"] })
      browser.contextMenus.create({ id: "bypassBookmarkInNewTab", title: "Bypass In New Tab", contexts: ["bookmark"] })
    }

    browser.contextMenus.onClicked.addListener(async info => {
      switch (info.menuItemId) {
        case "switchInstanceTab": {
          const url = new URL(info.pageUrl)
          const newUrl = await servicesHelper.switchInstance(url)
          if (newUrl) browser.tabs.update({ url: newUrl })
          return
        }
        case "settingsTab":
          browser.runtime.openOptionsPage()
          return
        case "copyReverseTab":
          browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
            if (tabs[0].url) {
              const url = new URL(tabs[0].url)
              servicesHelper.copyRaw(url)
            }
          })
          return
        case "reverseTab":
          browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
            if (tabs[0].url) {
              const url = new URL(tabs[0].url)
              const newUrl = await servicesHelper.reverse(url)
              if (newUrl) {
                browser.tabs.update(tabs[0].id, { url: newUrl }, () => {
                  tabIdRedirects[tabs[0].id] = false
                })
              }
            }
          })
          return
        case "redirectTab":
          browser.tabs.query({ active: true, currentWindow: true }, async tabs => {
            if (tabs[0].url) {
              const url = new URL(tabs[0].url)
              const newUrl = servicesHelper.redirect(url, "main_frame", null, null, false, true)
              if (newUrl) {
                browser.tabs.update(tabs[0].id, { url: newUrl }, () => {
                  tabIdRedirects[tabs[0].id] = true
                })
              }
            }
          })
          return
        case "copyReverseLink": {
          const url = new URL(info.linkUrl)
          await servicesHelper.copyRaw(url)
          return
        }
        case "redirectLink":
        case "redirectLinkInNewTab": {
          const url = new URL(info.linkUrl)
          const newUrl = servicesHelper.redirect(url, "main_frame", null, null, false, true)
          if (newUrl) {
            if (info.menuItemId == "redirectLink") browser.tabs.update({ url: newUrl })
            else browser.tabs.create({ url: newUrl })
          }
          return
        }
        case "reverseLink":
        case "reverseLinkInNewTab": {
          const url = new URL(info.linkUrl)
          const newUrl = await servicesHelper.reverse(url)
          if (newUrl) {
            if (info.menuItemId == "reverseLink") {
              browser.tabs.update({ url: newUrl }, tab => {
                tabIdRedirects[tab.id] = false
              })
            } else {
              browser.tabs.create({ url: newUrl }, tab => {
                tabIdRedirects[tab.id] = false
              })
            }
          }
          return
        }
        case "bypassLink":
        case "bypassLinkInNewTab": {
          const url = new URL(info.linkUrl)
          if (info.menuItemId == "bypassLink") {
            browser.tabs.update({ url: url.href }, tab => {
              tabIdRedirects[tab.id] = false
            })
          } else {
            browser.tabs.create({ url: url.href }, tab => {
              tabIdRedirects[tab.id] = false
            })
          }
          return
        }
        case "copyReverseBookmark":
          browser.bookmarks.get(info.bookmarkId, bookmarks => {
            const url = new URL(bookmarks[0].url)
            servicesHelper.copyRaw(url)
          })
          return
        case "redirectBookmark":
        case "redirectBookmarkInNewTab":
          browser.bookmarks.get(info.bookmarkId, bookmarks => {
            const url = new URL(bookmarks[0].url)
            const newUrl = servicesHelper.redirect(url, "main_frame", null, null, false, true)
            if (newUrl) {
              if (info.menuItemId == "redirectBookmark") browser.tabs.update({ url: newUrl })
              else browser.tabs.create({ url: newUrl })
            }
          })
          return
        case "reverseBookmark":
        case "reverseBookmarkInNewTab":
          browser.bookmarks.get(info.bookmarkId, async bookmarks => {
            const url = new URL(bookmarks[0].url)
            const newUrl = await servicesHelper.reverse(url)
            if (newUrl) {
              if (info.menuItemId == "reverseBookmark") {
                browser.tabs.update({ url: newUrl }, tab => {
                  tabIdRedirects[tab.id] = false
                })
              } else {
                browser.tabs.create({ url: newUrl }, tab => {
                  tabIdRedirects[tab.id] = false
                })
              }
            }
          })
          return
        case "bypassBookmark":
        case "bypassBookmarkInNewTab":
          browser.bookmarks.get(info.bookmarkId, async bookmarks => {
            const url = new URL(bookmarks[0].url)
            if (info.menuItemId == "bypassBookmark") {
              browser.tabs.update({ url: url.href }, tab => (tabIdRedirects[tab.id] = false))
            } else {
              browser.tabs.create({ url: url.href }, tab => (tabIdRedirects[tab.id] = false))
            }
            return
          })
      }
    })
  }
})

browser.runtime.onMessage.addListener(r => {
  if (r.message == "reverse") tabIdRedirects[r.tabId] = false
  else if (r.message == "redirect") tabIdRedirects[r.tabId] = true
})

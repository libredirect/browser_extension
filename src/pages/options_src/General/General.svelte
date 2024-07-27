<script>
  const browser = window.browser || window.chrome

  import Exceptions from "./Exceptions.svelte"
  import SettingsButtons from "./SettingsButtons.svelte"
  import { options } from "../stores"
  import { onDestroy } from "svelte"
  import Row from "../../components/Row.svelte"
  import Label from "../../components/Label.svelte"
  import Select from "../../components/Select.svelte"
  import Checkbox from "../../components/Checkbox.svelte"

  let _options
  const unsubscribe = options.subscribe(val => (_options = val))
  onDestroy(unsubscribe)

  let bookmarksPermission
  browser.permissions.contains({ permissions: ["bookmarks"] }, r => (bookmarksPermission = r))
  $: if (bookmarksPermission) {
    browser.permissions.request({ permissions: ["bookmarks"] }, r => (bookmarksPermission = r))
  } else {
    browser.permissions.remove({ permissions: ["bookmarks"] })
    bookmarksPermission = false
  }
</script>

<div>
  <Row>
    <Label>{browser.i18n.getMessage("theme") || "Theme"}</Label>
    <Select
      values={[
        { value: "detect", name: browser.i18n.getMessage("auto") || "Auto" },
        { value: "light", name: browser.i18n.getMessage("light") || "Light" },
        { value: "dark", name: browser.i18n.getMessage("dark") || "Dark" },
      ]}
      value={_options.theme}
      onChange={e => {
        _options.theme = e.target.options[e.target.options.selectedIndex].value
        options.set(_options)
      }}
    />
  </Row>

  <Row>
    <Label>{browser.i18n.getMessage("fetchPublicInstances") || "Fetch public instances"}</Label>
    <Select
      value={_options.fetchInstances}
      values={[
        { value: "github", name: "GitHub" },
        { value: "codeberg", name: "Codeberg" },
        { value: "disable", name: browser.i18n.getMessage("disable") || "Disable" },
      ]}
      onChange={e => {
        _options.fetchInstances = e.target.options[e.target.options.selectedIndex].value
        options.set(_options)
      }}
    />
  </Row>

  <Row>
    <Label>{browser.i18n.getMessage("redirectOnlyInIncognito") || "Redirect Only in Incognito"}</Label>
    <Checkbox
      checked={_options.redirectOnlyInIncognito}
      onChange={e => {
        _options.redirectOnlyInIncognito = e.target.checked
        options.set(_options)
      }}
    />
  </Row>

  <Row>
    <Label>{browser.i18n.getMessage("bookmarksMenu") || "Bookmarks menu"}</Label>
    <Checkbox bind:checked={bookmarksPermission} />
  </Row>

  <Exceptions />

  <SettingsButtons />
</div>

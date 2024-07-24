<script>
  let browser = window.browser || window.chrome

  import Exceptions from "./Exceptions.svelte"
  import SettingsButtons from "./SettingsButtons.svelte"
  import RowSelect from "../components/RowSelect.svelte"
  import Checkbox from "../components/RowCheckbox.svelte"
  import { options } from "../stores"
  import { onDestroy } from "svelte"

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
  <RowSelect
    label="Theme"
    values={[
      { value: "detect", name: "Auto" },
      { value: "light", name: "Light" },
      { value: "dark", name: "Dark" },
    ]}
    value={_options.theme}
    onChange={e => {
      _options["theme"] = e.target.options[e.target.options.selectedIndex].value
      options.set(_options)
    }}
    ariaLabel="select theme"
  />

  <RowSelect
    label="Fetch public instances"
    value={_options.fetchInstances}
    onChange={e => {
      _options["fetchInstances"] = e.target.options[e.target.options.selectedIndex].value
      options.set(_options)
    }}
    ariaLabel="Select fetch public instances"
    values={[
      { value: "github", name: "GitHub" },
      { value: "codeberg", name: "Codeberg" },
      { value: "disable", name: "Disable" },
    ]}
  />

  <Checkbox
    label="Redirect Only in Incognito"
    checked={_options.redirectOnlyInIncognito}
    onChange={e => {
      _options["redirectOnlyInIncognito"] = e.target.checked
      options.set(_options)
    }}
  />

  <Checkbox label="Bookmarks menu" bind:checked={bookmarksPermission} />

  <Exceptions opts={_options} />

  <SettingsButtons opts={_options} />
</div>

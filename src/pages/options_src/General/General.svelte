<script>
  let browser = window.browser || window.chrome

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
    <Label>Theme</Label>
    <Select
      values={[
        { value: "detect", name: "Auto" },
        { value: "light", name: "Light" },
        { value: "dark", name: "Dark" },
      ]}
      value={_options.theme}
      onChange={e => {
        _options.theme = e.target.options[e.target.options.selectedIndex].value
        options.set(_options)
      }}
      ariaLabel="select theme"
    />
  </Row>

  <Row>
    <Label>Fetch public instances</Label>
    <Select
      value={_options.fetchInstances}
      values={[
        { value: "github", name: "GitHub" },
        { value: "codeberg", name: "Codeberg" },
        { value: "disable", name: "Disable" },
      ]}
      onChange={e => {
        _options.fetchInstances = e.target.options[e.target.options.selectedIndex].value
        options.set(_options)
      }}
      ariaLabel={"Select fetch public instances"}
    />
  </Row>

  <Row>
    <Label>Redirect Only in Incognito</Label>
    <Checkbox
      checked={_options.redirectOnlyInIncognito}
      onChange={e => {
        _options.redirectOnlyInIncognito = e.target.checked
        options.set(_options)
      }}
    />
  </Row>

  <Row>
    <Label>Bookmarks menu</Label>
    <Checkbox bind:checked={bookmarksPermission} />
  </Row>

  <Exceptions opts={_options} />

  <SettingsButtons opts={_options} />
</div>

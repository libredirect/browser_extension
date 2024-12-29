<script>
  const browser = window.browser || window.chrome

  import { onDestroy } from "svelte"
  import Button from "../../components/Button.svelte"
  import ExportIcon from "../../icons/ExportIcon.svelte"
  import ImportIcon from "../../icons/ImportIcon.svelte"
  import ResetIcon from "../../icons/ResetIcon.svelte"
  import { options } from "../stores"
  import servicesHelper from "../../../assets/javascripts/services.js"
  import utils from "../../../assets/javascripts/utils.js"

  let _options
  const unsubscribe = options.subscribe(val => (_options = val))
  onDestroy(unsubscribe)

  let importSettingsInput
  let importSettingsFiles
  $: if (importSettingsFiles) {
    const reader = new FileReader()
    reader.readAsText(importSettingsFiles[0])
    reader.onload = async () => {
      let data = JSON.parse(reader.result)
      if (data.version != browser.runtime.getManifest().version) {
        alert("Importing from a previous version. Be careful")
      }
      data = await servicesHelper.processUpdate(data)
      options.set(data)
    }
    reader.onerror = error => {
      console.log("error", error)
      alert("Error!")
    }
  }

  async function exportSettings() {
    _options.version = browser.runtime.getManifest().version
    const resultString = JSON.stringify(_options, null, "  ")
    const anchor = document.createElement("a")
    anchor.href = "data:application/json;base64," + btoa(resultString)
    anchor.download = `libredirect-settings-v${_options.version}-${(new Date().toISOString().replace(':','-').slice(0,-5))}.json`
    anchor.click()
  }

  async function exportSettingsSync() {
    _options.version = browser.runtime.getManifest().version
    browser.storage.sync.set({ options: _options })
  }

  async function importSettingsSync() {
    browser.storage.sync.get({ options }, async r => {
      let data = r.options
      if (data.version != browser.runtime.getManifest().version) {
        alert("Importing from a previous version. Be careful")
      }
      data = await servicesHelper.processUpdate(data)
      options.set(data)
    })
  }

  async function resetSettings() {
    browser.storage.local.clear(async () => {
      const data = await servicesHelper.initDefaults()
      options.set(data)
    })
  }
</script>

<div class="buttons">
  <Button on:click={() => importSettingsInput.click()}>
    <ImportIcon class="margin margin_{document.body.dir}" />
    {browser.i18n.getMessage("importSettings") || "Import Settings"}
  </Button>
  <input
    type="file"
    accept=".json"
    style="display: none"
    bind:this={importSettingsInput}
    bind:files={importSettingsFiles}
  />

  <Button on:click={exportSettings}>
    <ExportIcon class="margin margin_{document.body.dir}" />
    {browser.i18n.getMessage("exportSettings") || "Export Settings"}
  </Button>

  <Button on:click={exportSettingsSync}>
    <ExportIcon class="margin margin_{document.body.dir}" />
    {browser.i18n.getMessage("exportSettingsToSync") || "Export Settings to Sync"}
  </Button>

  <Button on:click={importSettingsSync}>
    <ImportIcon class="margin margin_{document.body.dir}" />
    {browser.i18n.getMessage("importSettingsFromSync") || "Import Settings from Sync"}
  </Button>

  <Button on:click={resetSettings}>
    <ResetIcon class="margin margin_{document.body.dir}" />
    {browser.i18n.getMessage("resetSettings") || "Reset Settings"}
  </Button>
</div>

<style>
  :global(.margin) {
    margin-right: 10px;
    margin-left: 0;
  }
  :global(.margin_rtl) {
    margin-right: 0;
    margin-left: 10px;
  }
</style>

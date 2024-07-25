<script>
  let browser = window.browser || window.chrome

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

  let disableButtons = false

  let importSettingsInput
  let importSettingsFiles
  $: if (importSettingsFiles) {
    disableButtons = true
    const reader = new FileReader()
    reader.readAsText(importSettingsFiles[0])
    reader.onload = async () => {
      const data = JSON.parse(reader.result)
      if ("theme" in data && data.version == browser.runtime.getManifest().version) {
        browser.storage.local.clear(async () => {
          console.log("clearing")
          options.set(data)
          disableButtons = false
        })
      } else {
        console.log("incompatible settings")
        alert("Incompatible settings")
      }
    }
    reader.onerror = error => {
      console.log("error", error)
      alert("Error!")
    }
  }

  async function exportSettings() {
    disableButtons = true
    _options.version = browser.runtime.getManifest().version
    const resultString = JSON.stringify(_options, null, "  ")
    const anchor = document.createElement("a")
    anchor.href = "data:application/json;base64," + btoa(resultString)
    anchor.download = `libredirect-settings-v${_options.version}.json`
    anchor.click()
    disableButtons = false
  }

  async function exportSettingsSync() {
    disableButtons = true
    _options.version = browser.runtime.getManifest().version
    await servicesHelper.initDefaults()
    browser.storage.sync.set({ options: _options })
    disableButtons = false
  }

  async function importSettingsSync() {
    disableButtons = true
    browser.storage.sync.get({ options }, r => {
      const optionsSync = r.options
      if (optionsSync.version == browser.runtime.getManifest().version) {
        options.set(optionsSync)
      } else {
        alert("Error")
      }
      disableButtons = false
    })
  }

  async function resetSettings() {
    disableButtons = true
    browser.storage.local.clear(async () => {
      await servicesHelper.initDefaults()
      options.set(await utils.getOptions())
      disableButtons = false
    })
  }
</script>

<div class="buttons">
  <Button on:click={() => importSettingsInput.click()} disabled={disableButtons}>
    <ImportIcon />
    <x data-localise="__MSG_importSettings__">Import Settings</x>
  </Button>
  <input
    type="file"
    accept=".json"
    style="display: none"
    bind:this={importSettingsInput}
    bind:files={importSettingsFiles}
  />

  <Button on:click={exportSettings} disabled={disableButtons}>
    <ExportIcon />
    <x data-localise="__MSG_exportSettings__">Export Settings</x>
  </Button>

  <Button on:click={exportSettingsSync} disabled={disableButtons}>
    <ExportIcon />
    <x>Export Settings to Sync</x>
  </Button>

  <Button on:click={importSettingsSync} disabled={disableButtons}>
    <ImportIcon />
    <x>Import Settings from Sync</x>
  </Button>

  <Button on:click={resetSettings} disabled={disableButtons}>
    <ResetIcon />
    <x>Reset Settings</x>
  </Button>
</div>

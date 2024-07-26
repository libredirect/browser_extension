<script>
  const browser = window.browser || window.chrome

  import Row from "../../components/Row.svelte"
  import Select from "../../components/Select.svelte"
  import AddIcon from "../../icons/AddIcon.svelte"
  import CloseIcon from "../../icons/CloseIcon.svelte"
  import Input from "../../components/Input.svelte"
  import Label from "../../components/Label.svelte"
  import { options, config } from "../stores"
  import { onDestroy } from "svelte"

  let _options
  let _config

  const unsubscribeOptions = options.subscribe(val => (_options = val))
  const unsubscribeConfig = config.subscribe(val => (_config = val))
  onDestroy(() => {
    unsubscribeOptions()
    unsubscribeConfig()
  })
  let inputType = "url"
  let inputValue = ""

  $: inputPlaceholder = inputType == "url" ? "https://www.google.com" : "https?://(www.|)youtube.com/"

  function removeException(exception) {
    let index
    index = _options.exceptions.url.indexOf(exception)
    if (index > -1) {
      _options.exceptions.url.splice(index, 1)
    } else {
      index = _options.exceptions.regex.indexOf(exception)
      if (index > -1) _options.exceptions.regex.splice(index, 1)
    }
    options.set(_options)
  }

  function addException() {
    let valid = false
    if (inputType == "url" && /^(ftp|http|https):\/\/[^ "]+$/.test(inputValue)) {
      valid = true
      if (!_options.exceptions.url.includes(inputValue)) {
        _options.exceptions.url.push(inputValue)
      }
    } else if (inputType == "regex") {
      valid = true
      if (!_options.exceptions.regex.includes(inputValue)) {
        _options.exceptions.regex.push(inputValue)
      }
    }
    if (valid) {
      options.set(_options)
      inputValue = ""
    }
  }
</script>

<Row>
  <Label>{browser.i18n.getMessage("excludeFromRedirecting") || "Excluded from redirecting"}</Label>
</Row>
<div dir="ltr">
  <Row>
    <div>
      <Input
        placeholder={inputPlaceholder}
        aria-label="Add url exception input"
        bind:value={inputValue}
        on:keydown={e => {
          if (e.key === "Enter") addException()
        }}
      />
      <Select
        bind:value={inputType}
        values={[
          { value: "url", name: "URL" },
          { value: "regex", name: "Regex" },
        ]}
      />
    </div>
    <button class="add" on:click={addException} aria-label="Add the url exception">
      <AddIcon />
    </button>
  </Row>
  <hr />
  <div class="checklist">
    {#each [..._options.exceptions.url, ..._options.exceptions.regex] as exception}
      <Row>
        {exception}
        <button class="add" on:click={() => removeException(exception)}>
          <CloseIcon />
        </button>
      </Row>
      <hr />
    {/each}
  </div>
</div>

<style>
  .add {
    background-color: transparent;
    border: none;
    color: var(--text);
    padding: 0;
    margin: 0;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
  }
</style>

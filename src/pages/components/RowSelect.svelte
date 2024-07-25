<script>
  import Row from "./Row.svelte"
  import Select from "./Select.svelte"
  import Label from "./Label.svelte"

  export let label
  export let values
  export let value
  export let onChange
  export let ariaLabel
</script>

<Row>
  <Label>{label}</Label>
  <Select {value} {values} {onChange} {ariaLabel} />
</Row>

<style>
</style>

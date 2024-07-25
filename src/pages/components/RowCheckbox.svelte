<script>
  import Row from "./Row.svelte"
  import Checkbox from "./Checkbox.svelte"
  import Label from "./Label.svelte"

  export let label
  export let checked
  export let onChange
</script>

<Row>
  <Label>{label}</Label>
  <Checkbox bind:checked {onChange} />
</Row>

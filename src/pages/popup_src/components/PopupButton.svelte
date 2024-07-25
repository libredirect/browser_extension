<script>
  import Row from "../components/Row.svelte"
  import Label from "../components/Label.svelte"
  import CopyIcon from "../icons/CopyIcon.svelte"
  export let label
</script>

<Row on:click>
  <Label>{label}</Label>
  <CopyIcon />
</Row>

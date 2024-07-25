<script>
  export let checked
  export let onChange
</script>

<input {...$$restProps} bind:checked on:change={onChange} type="checkbox" />

<style>
  input[type="checkbox"] {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    width: 46px;
    height: 24px;
    background-color: var(--light-grey);
    border-radius: 50px;
    transition: 0.4s;
    cursor: pointer;
  }

  input[type="checkbox"]:checked {
    background-color: var(--active);
  }

  input[type="checkbox"]::before {
    content: "";
    display: inline-block;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    position: relative;
    top: 3px;
    left: 3.5px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
  }

  input[type="checkbox"]:checked::before {
    left: 24px;
  }

  /* body.rtl div.block input[type="checkbox"]::before {
      left: auto;
      right: 4px;
    } */

  /* body.rtl div.block input[type="checkbox"]:checked::before {
      left: auto;
      right: 24px;
    } */
</style>

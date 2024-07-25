import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import resolve from "@rollup/plugin-node-resolve"
import css from "rollup-plugin-css-only"

const production = !process.env.ROLLUP_WATCH
let input
let output
if (process.argv.includes("--config-options")) {
  input = "src/pages/options_src/main.js"
  output = "src/pages/options/build/bundle.js"
} else if (process.argv.includes("--config-popup")) {
  input = "src/pages/popup_src/main.js"
  output = "src/pages/popup/build/bundle.js"
}

export default {
  input,
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: output,
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: !production,
      },
    }),
    css({ output: "bundle.css" }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
      exportConditions: ["svelte"],
    }),
    commonjs(),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}

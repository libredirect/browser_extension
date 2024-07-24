import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import resolve from "@rollup/plugin-node-resolve"
import css from "rollup-plugin-css-only"

const production = !process.env.ROLLUP_WATCH

export default {
  input: "src/pages/src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "src/pages/options/build/bundle.js",
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
    // production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}

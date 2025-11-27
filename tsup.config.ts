import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true, // generate .d.ts types
  sourcemap: true, // helpful for debugging
  clean: true, // removes dist before build
  minify: true, // keep output small
  bundle: true, // do NOT include deps (peer deps must stay external)
  treeshake: true,
  splitting: false, // library not app; simpler output
  skipNodeModulesBundle: true,
  target: "es2019",
  //   jsx: "react-jsx",        // support React 18 JSX transform
  external: ["react", "react-dom", "@tanstack/react-table", "axios"],
});

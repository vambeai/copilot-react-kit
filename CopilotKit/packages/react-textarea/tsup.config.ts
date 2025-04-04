import path from "path";
import fs from "fs";
import { defineConfig, Options } from "tsup";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssPrefixSelector from "postcss-prefix-selector";
import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";

export default defineConfig((options: Options) => {
  return {
    entry: {
      index: "src/index.tsx",
      styles: "src/styles.css",
    },
    format: ["esm", "cjs"],
    dts: true,
    minify: false,
    external: ["react"],
    splitting: false,
    clean: true,
    sourcemap: true,
    treeshake: true,
    esbuildOptions(options) {
      // Don't bundle CSS with esbuild, we'll handle it with postcss
      options.loader = {
        ...options.loader,
        ".css": "empty", // This ensures CSS imports are treated as empty
      };
    },
    exclude: [
      "**/*.test.ts", // Exclude TypeScript test files
      "**/*.test.tsx", // Exclude TypeScript React test files
      "**/__tests__/*", // Exclude any files inside a __tests__ directory
    ],
    onSuccess: async () => {
      // Process CSS separately using postcss
      const cssInputFile = path.resolve(process.cwd(), "src/styles.css");

      if (fs.existsSync(cssInputFile)) {
        const outputPath = path.resolve(process.cwd(), "dist/index.css");
        const rawCSS = fs.readFileSync(cssInputFile, "utf8");

        const resultCSS = await postcss([
          postcssImport(),
          postcssNested(),
          postcssPrefixSelector({
            prefix: ".copilot-kit-textarea-css-scope",
          }),
          autoprefixer,
          cssnano({ preset: "default" }),
        ]).process(rawCSS, { from: cssInputFile, to: outputPath });

        if (resultCSS.css !== undefined) {
          fs.writeFileSync(outputPath, resultCSS.css);
          // Remove the styles.js and styles.mjs files since we don't want them
          const stylesToRemove = [
            path.resolve(process.cwd(), "dist/styles.js"),
            path.resolve(process.cwd(), "dist/styles.mjs"),
          ];

          stylesToRemove.forEach((file) => {
            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          });
        }
      }
    },
    ...options,
  };
});

import { defineConfig, Options } from "tsup";
import fs from "fs";
import path from "path";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import cssnano from "cssnano";
import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";

export default defineConfig((options: Options) => {
  return {
    entry: ["src/**/*.ts", "src/**/*.tsx"],
    format: ["esm", "cjs"],
    dts: true,
    minify: false,
    external: ["react"],
    splitting: false,
    clean: true,
    sourcemap: true,
    exclude: [
      "**/*.test.ts", // Exclude TypeScript test files
      "**/*.test.tsx", // Exclude TypeScript React test files
      "**/__tests__/*", // Exclude any files inside a __tests__ directory
    ],
    onSuccess: async () => {
      // Process CSS but don't inject it, just write to file for external import
      const cssInputFile = path.resolve(process.cwd(), 'src/styles.css');
      
      if (fs.existsSync(cssInputFile)) {
        const outputPath = path.resolve(process.cwd(), "dist/index.css");
        const rawCSS = fs.readFileSync(cssInputFile, "utf8");

        const resultCSS = await postcss([
          postcssImport(),
          postcssNested(),
          tailwindcss,
          autoprefixer,
          cssnano({ preset: "default" }),
        ]).process(rawCSS, { from: cssInputFile, to: outputPath });

        if (resultCSS.css !== undefined) {
          fs.writeFileSync(outputPath, resultCSS.css);
        }
      } else {
        fs.writeFileSync(
          path.resolve(process.cwd(), "dist/index.css"),
          `/* This is here for backwards compatibility */`,
        );
      }
    },
    ...options,
  };
});

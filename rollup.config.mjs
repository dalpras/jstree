import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import alias from "@rollup/plugin-alias";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";

const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

const banner = [
  "/**",
  ` * ${pkg.name} - ${pkg.description}`,
  ` * @version v${pkg.version}`,
  ` * @link ${pkg.homepage || pkg.repository?.url || ""}`,
  ` * @license ${pkg.license}`,
  " */",
  ""
].join("\n");

const renderFiles = fg.sync("src/render/**/*.js").sort();
const pluginFiles = fg
  .sync("src/jstree.*.js")
  .filter((f) => path.basename(f) !== "jstree.js")
  .sort();

const orderedInputs = [
  ...renderFiles,
  "src/model/TreeNode.js",
  "src/model/Tree.js",
  "src/jstree.js",
  ...pluginFiles
];

function orderedEntryPlugin(files) {
  const VIRTUAL_ID = "\0jstree-entry";

  return {
    name: "ordered-entry",
    resolveId(source) {
      if (source === "virtual:jstree-entry") return VIRTUAL_ID;
      return null;
    },
    load(id) {
      if (id !== VIRTUAL_ID) return null;

      return files
        .map((file) => {
          const abs = path.resolve(file);
          if (file === "src/jstree.js") {
            return `export { default } from ${JSON.stringify(abs)};`;
          }
          return `import ${JSON.stringify(abs)};`;
        })
        .join("\n");
    }
  };
}

const basePlugins = [
  alias({
    entries: [
      { find: "render", replacement: path.resolve("src/render") },
      { find: "model", replacement: path.resolve("src/model") },
      { find: "plugin", replacement: path.resolve("src/plugin") },
      { find: "TreeNode", replacement: path.resolve("src/model/TreeNode.js") },
      { find: "Tree", replacement: path.resolve("src/model/Tree.js") }
    ]
  }),
  nodeResolve({
    extensions: [".js"]
  })
];

export default [
  {
    input: "virtual:jstree-entry",
    plugins: [
      orderedEntryPlugin(orderedInputs),
      ...basePlugins
    ],
    output: {
      file: "dist/jstree.js",
      format: "iife",
      name: "jsTree",
      banner
    }
  },
  {
    input: "virtual:jstree-entry",
    plugins: [
      orderedEntryPlugin(orderedInputs),
      ...basePlugins,
      terser({
        format: { comments: false }
      })
    ],
    output: {
      file: "dist/jstree.min.js",
      format: "iife",
      name: "jsTree",
      banner
    }
  },
  {
    input: "src/jstree.css",
    plugins: [
      postcss({
        extract: "jstree.css",
        minimize: false
      })
    ],
    output: {
      file: "dist/_css_build.js",
      format: "es"
    }
  },
  {
    input: "src/jstree.css",
    plugins: [
      postcss({
        extract: "jstree.min.css",
        minimize: true
      }),
      {
        name: "remove-css-stub",
        writeBundle() {
          const f = "dist/_css_build.min.js";
          if (fs.existsSync(f)) fs.unlinkSync(f);
        }
      }
    ],
    output: {
      file: "dist/_css_build.min.js",
      format: "es"
    }
  },
  {
    input: "src/jstree.css",
    plugins: [
      postcss({
        extract: "jstree.css",
        minimize: false
      }),
      {
        name: "remove-css-stub",
        writeBundle() {
          const f = "dist/_css_build.js";
          if (fs.existsSync(f)) fs.unlinkSync(f);
        }
      }
    ],
    output: {
      file: "dist/_css_build.js",
      format: "es"
    }
  }
];
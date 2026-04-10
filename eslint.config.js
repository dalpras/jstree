// eslint.config.js
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest"
    },
    rules: {
      indent: ["error", 4],
      "linebreak-style": ["error", "unix"],
      semi: ["error", "always"]
    }
  }
];
// eslint.config.js
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",
      globals: {
        browser: true
      }
    },
    rules: {
      "no-var": "off",
      "no-const": "error",
      "no-let": "error",
      "no-arrow-functions": "error",
      "no-class": "error",
      "no-template-literals": "error",
      "no-rest-parameters": "error",
      "no-spread": "error",
      "no-destructuring": "error"
    }
  }
];

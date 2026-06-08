import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "**/*.d.ts",
      "**/*.tsbuildinfo",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["backend/src/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["frontend/src/**/*.{ts,tsx}", "frontend/vite.config.ts"],
    languageOptions: {
      globals: globals.browser,
    },
  },
);

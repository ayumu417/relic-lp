import eslintPluginAstro from 'eslint-plugin-astro';
import typescriptParser from '@typescript-eslint/parser';

export default [
  // Astroの推奨設定
  ...eslintPluginAstro.configs.recommended,

  // Astroファイルに対するTypeScriptパーサーの追加
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: [".astro"],
      },
    },
  },

  {
    rules: {
      "no-console": "warn"
    }
  }
];
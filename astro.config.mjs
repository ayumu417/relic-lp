// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  // 公開URLの設定
  site: 'https://www.relic.jp',
  base: '/lp',
  trailingSlash: 'always',
  //テスト用
  site: 'https://test-server.ayumu.website',
  base: '/relic-lp',

  // 出力形式の調整（URLから .html 削除）
  build: {
    format: 'directory',
  },

  // ローカル開発サーバー設定
  server: {
    port: 4321,
    host: true,
    open: true,
  },

  vite: {
    // 8KB以下の画像やアセットはBase64化
    build: {
      assetsInlineLimit: 8192,
    },
    // 本番ビルド時に console.log や console.info を削除
    esbuild: {
      drop: ['console', 'debugger'],
    },

    // SCSSのグローバル設定
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "/src/assets/scss/foundation/import" as *;`,
        },
      },
    },
  },

  // フォントの読み込み最適化
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Noto Sans JP',
      cssVariable: '--font-sans',
      weights: ['400 700'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Noto Serif JP',
      cssVariable: '--font-serif',
      weights: [700],
    }
  ],
});

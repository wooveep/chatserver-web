/*
 * @Author: cloudyi.li
 * @Date: 2023-05-14 10:14:15
 * @LastEditTime: 2023-05-27 21:34:41
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/vite.config.ts
 */
import path from 'path'
import type { PluginOption } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
// import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
function setupPlugins(env: ImportMetaEnv): PluginOption[] {
  return [
    vue(),
    env.VITE_GLOB_APP_PWA === 'true' && VitePWA({
      injectRegister: 'auto',
      manifest: {
        name: '易知釜',
        short_name: 'ChatServer',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
    chunkSplitPlugin({
      strategy: 'default',
      customSplitting: {
        // `react` and `react-dom` 会被打包到一个名为`render-vendor`的 chunk 里面(包括它们的一些依赖，如 object-assign)
        vue: ['vue'],
        // 源码中 utils 目录的代码都会打包进 `utils` 这个 chunk 中
        mark: ['markdown-it'],
        katex: ['katex', 'html2canvas'],
        hilight: ['highlight.js'],
        // plugin: [/src\/plugins/],
        // utils: [/src\/utils/],
      },
    }),
    viteCompression(),
  ]
}

export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv

  return {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: setupPlugins(viteEnv),
    server: {
      host: '0.0.0.0',
      port: 1002,
      open: false,
      // proxy: {
      //   '/api': {
      //     target: viteEnv.VITE_APP_API_BASE_URL,
      //     changeOrigin: true, // 允许跨域
      //     rewrite: path => path.replace('/api/', '/'),
      //   },
      // },
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      // rollupOptions: {
      //   output: {
      //     manualChunks(id) {
      //       if (id.includes('node_modules'))
      //         return id.toString().split('node_modules/')[1].split('/')[0].toString()
      //     },
      //   },
      // },
      // minify: 'esbuild',
      commonjsOptions: {
        ignoreTryCatch: false,
      },

    },
  }
})

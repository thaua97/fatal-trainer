// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { buildI18nLocales } from './i18n/locale-files'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  alias: {
    '@': `${rootDir}/app`,
    '@tests': `${rootDir}/tests`,
  },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/test-utils/module', '@nuxtjs/i18n'],

  ui: {
    colorMode: false,
  },

  i18n: {
    langDir: '..',
    locales: buildI18nLocales(),
    defaultLocale: 'pt-BR',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ft_locale',
      fallbackLocale: 'pt-BR',
      redirectOn: 'root',
    },
    experimental: {
      localeDetector: './locale-detector.ts',
    },
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        class: 'light',
      },
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'preconnect',
          href: 'https://images.pexels.com',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap',
        },
      ],
    },
  },

  components: [
    { path: '~/components/ui', pathPrefix: false },
    { path: '~/components/composite', pathPrefix: false },
  ],

  imports: {
    dirs: ['composables/**'],
  },

  typescript: {
    strict: true,
  },

  compatibilityDate: '2025-06-04',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '',
      assetsBaseUrl: process.env.NUXT_PUBLIC_ASSETS_BASE_URL || '',
      useMockApi: process.env.NUXT_PUBLIC_USE_MOCK_API === 'true',
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        '@internationalized/date',
        '@vueuse/core',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
  },
})

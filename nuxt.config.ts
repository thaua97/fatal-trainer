// https://nuxt.com/docs/api/configuration/nuxt-config
import { buildI18nLocales } from './i18n/locale-files'

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/test-utils/module', '@nuxtjs/i18n'],

  i18n: {
    langDir: '..',
    locales: buildI18nLocales(),
    defaultLocale: 'pt-BR',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ft_locale',
      fallbackLocale: 'pt-BR',
    },
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
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
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
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
})

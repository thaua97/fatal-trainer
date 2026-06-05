import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
      },
    },
    server: {
      deps: {
        inline: ['entities', '@vue/compiler-core', '@vue/compiler-dom', '@vue/compiler-sfc'],
      },
    },
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/unit/**/*.spec.ts',
      'app/components/**/*.spec.ts',
    ],
  },
})

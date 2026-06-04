import type { StorybookConfig } from '@storybook/vue3-vite'
import ui from '@nuxt/ui/vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../app/components/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [ui()],
      resolve: {
        alias: {
          '~': new URL('../app', import.meta.url).pathname,
          '~~': new URL('..', import.meta.url).pathname,
        },
      },
    })
  },
}

export default config

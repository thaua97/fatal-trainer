import type { StorybookConfig } from '@storybook/vue3-vite'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const storybookDir = dirname(fileURLToPath(import.meta.url))
const appDir = join(storybookDir, '../app')
const mockDir = join(storybookDir, 'mocks')

function composableMock(name: string) {
  return join(mockDir, `${name}.ts`)
}

const catalogComposableMocks = {
  'useTrainerFilters': composableMock('useTrainerFilters'),
  'useFTFilterPanel': composableMock('useFTFilterPanel'),
  'useFTSortSelect': composableMock('useFTSortSelect'),
  'useFTSpecialtyFilter': composableMock('useFTSpecialtyFilter'),
  'useFTModalityFilter': composableMock('useFTModalityFilter'),
  'useFTPromotionFilter': composableMock('useFTPromotionFilter'),
  'useFTPriceViewFilter': composableMock('useFTPriceViewFilter'),
  'useFTCitySelector': composableMock('useFTCitySelector'),
} as const

const composableAliases = Object.fromEntries(
  Object.entries(catalogComposableMocks).flatMap(([name, mockPath]) => [
    [join(appDir, 'composables/catalog', `${name}.ts`), mockPath],
    [join(appDir, 'composables/components', `${name}.ts`), mockPath],
  ]),
)

const config: StorybookConfig = {
  stories: ['../app/components/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  async viteFinal(config) {
    const [{ default: ui }, { mergeConfig }] = await Promise.all([
      import('@nuxt/ui/vite'),
      import('vite'),
    ])

    return mergeConfig(config, {
      plugins: [ui()],
      resolve: {
        alias: {
          '@': join(appDir),
          '~': join(appDir),
          '~~': join(storybookDir, '..'),
          '#shared': join(storybookDir, '../shared'),
          '@tests': join(storybookDir, '../tests'),
          ...composableAliases,
        },
      },
    })
  },
}

export default config

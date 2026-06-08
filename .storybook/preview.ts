import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { createI18n } from 'vue-i18n'
import '../app/assets/css/main.css'
import { testI18nMessages } from '@tests/helpers/i18n-test-messages'

const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: testI18nMessages as Record<string, Record<string, unknown>>,
})

setup((app) => {
  app.use(i18n)
})

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
  decorators: [
    (story, context) => {
      const title = context.title ?? ''
      const isComposite = title.startsWith('Composite/')
      return {
        template: isComposite
          ? '<div class="light min-h-screen bg-white"><story /></div>'
          : `
          <div class="light min-h-screen bg-white p-6">
            <div class="max-w-lg mx-auto">
              <story />
            </div>
          </div>
        `,
      }
    },
  ],
}

export default preview
